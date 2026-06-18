"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Citation } from "@/lib/citations";
import {
  loadLocalSessions,
  removeLocalSession,
  trimTitle,
  upsertLocalSession,
} from "@/lib/sessions-local";
import { MessageList, type ChatMessage } from "./MessageList";
import { SessionSidebar, type SessionItem } from "./SessionSidebar";

type SiteConfig = {
  passwordGate: boolean;
  anonymousDailyLimit: number;
  database?: boolean;
  checkpointer?: string;
  langsmith?: boolean;
  demo?: boolean;
  productionReady?: boolean;
};

type Mode = "agent" | "rag";

type Props = {
  embed?: boolean;
};

const THREAD_KEY = "blog-assistant-thread-id";
const EXAMPLES = [
  "11 篇 RAG 进阶讲什么？",
  "LangGraph checkpoint 怎么用？",
  "Runnable 和 StateGraph 什么关系？",
  "博客 AI 助手怎么部署？",
];

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function AgentChat({ embed = false }: Props) {
  const [mode, setMode] = useState<Mode>("agent");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [password, setPassword] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [streamingCitations, setStreamingCitations] = useState<Citation[]>([]);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [persistence, setPersistence] = useState<"postgres" | "local">("local");
  const [sidebarOpen, setSidebarOpen] = useState(!embed);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [anonRemaining, setAnonRemaining] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toolStepsRef = useRef<string[]>([]);
  const citationsRef = useRef<Citation[]>([]);

  const blogUrl =
    process.env.NEXT_PUBLIC_BLOG_BASE_URL || "https://blog.zkkysqs.top";

  const headers = useCallback((): HeadersInit => {
    const h: HeadersInit = { "Content-Type": "application/json" };
    if (password) {
      h["x-blog-assistant-password"] = password;
      h["x-kb-password"] = password;
    }
    return h;
  }, [password]);

  const refreshSessions = useCallback(async () => {
    const local = loadLocalSessions();
    try {
      const res = await fetch("/api/agent/threads", { headers: headers() });
      if (res.ok) {
        const data = await res.json();
        const remote: SessionItem[] = data.threads ?? [];
        setPersistence(data.persistence === "postgres" ? "postgres" : "local");
        if (remote.length > 0) {
          setSessions(remote);
          return;
        }
      }
    } catch {
      /* 使用本地列表 */
    }
    setSessions(local);
    setPersistence("local");
  }, [headers]);

  useEffect(() => {
    const stored = localStorage.getItem(THREAD_KEY);
    if (stored) setThreadId(stored);
    fetch("/api/config")
      .then((r) => r.json())
      .then((data: SiteConfig) => setSiteConfig(data))
      .catch(() => {});
    refreshSessions();
  }, [refreshSessions]);

  async function loadThreadHistory(id: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/agent/chat?threadId=${encodeURIComponent(id)}`,
        { headers: headers() }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "加载会话失败");
      setThreadId(id);
      localStorage.setItem(THREAD_KEY, id);
      setMessages(
        (data.messages ?? []).map((m: { id: string; role: "user" | "assistant"; content: string }) => ({
          id: m.id || createId(),
          role: m.role,
          content: m.content,
        }))
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }

  function stopStreaming() {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
    setActiveTools([]);
    if (streamingText.trim() || citationsRef.current.length > 0) {
      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: streamingText,
          toolSteps: toolStepsRef.current.length
            ? [...toolStepsRef.current]
            : undefined,
          citations: citationsRef.current.length
            ? [...citationsRef.current]
            : undefined,
        },
      ]);
      setStreamingText("");
      setStreamingCitations([]);
      toolStepsRef.current = [];
      citationsRef.current = [];
    }
  }

  async function consumeSse(
    res: Response,
    onEvent: (evt: Record<string, unknown>) => void
  ) {
    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let buf = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        try {
          onEvent(JSON.parse(line.slice(6)) as Record<string, unknown>);
        } catch {
          /* ignore */
        }
      }
    }
  }

  async function sendMessage(text?: string) {
    const message = (text ?? input).trim();
    if (!message || loading) return;
    if (text) setInput(text);

    setError("");
    setLoading(true);
    setStreamingText("");
    setStreamingCitations([]);
    setActiveTools([]);
    toolStepsRef.current = [];
    citationsRef.current = [];
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const activeThread = threadId ?? crypto.randomUUID();
    if (!threadId) {
      setThreadId(activeThread);
      localStorage.setItem(THREAD_KEY, activeThread);
    }

    setMessages((prev) => [
      ...prev,
      { id: createId(), role: "user", content: message },
    ]);
    setInput("");

    const endpoint =
      mode === "agent" ? "/api/agent/chat" : "/api/rag/chat";
    const payload =
      mode === "agent"
        ? { message, threadId: activeThread }
        : { query: message };

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: headers(),
        body: JSON.stringify(payload),
        signal: abortRef.current.signal,
      });

      const remaining = res.headers.get("X-RateLimit-Remaining");
      if (remaining !== null && remaining !== "") {
        setAnonRemaining(Number(remaining));
      } else if (password.trim()) {
        setAnonRemaining(null);
      }

      if (!res.ok) {
        let errMsg = "请求失败";
        try {
          const data = await res.json();
          errMsg = String(data.error ?? errMsg);
        } catch {
          errMsg = await res.text();
        }
        throw new Error(errMsg || `HTTP ${res.status}`);
      }

      if (mode === "rag" && res.headers.get("content-type")?.includes("json")) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            id: createId(),
            role: "assistant",
            content: String(data.answer ?? "无回答"),
          },
        ]);
        return;
      }

      let finalText = "";
      let finalCitations: Citation[] = [];

      await consumeSse(res, (evt) => {
        if (evt.type === "meta" && typeof evt.threadId === "string") {
          setThreadId(evt.threadId);
          localStorage.setItem(THREAD_KEY, evt.threadId);
          const title = trimTitle(message);
          setSessions(upsertLocalSession(evt.threadId, title));
        }
        if (evt.type === "citations" && Array.isArray(evt.items)) {
          finalCitations = evt.items as Citation[];
          citationsRef.current = finalCitations;
          setStreamingCitations(finalCitations);
        }
        if (evt.type === "token" && typeof evt.content === "string") {
          finalText += evt.content;
          setStreamingText((s) => s + evt.content);
        }
        if (evt.type === "tool_start" && typeof evt.name === "string") {
          const toolName = evt.name;
          setActiveTools((tools) => [...tools, toolName]);
          toolStepsRef.current.push(`调用 ${toolName}`);
        }
        if (evt.type === "tool_end" && typeof evt.name === "string") {
          const toolName = evt.name;
          setActiveTools((tools) => tools.filter((t) => t !== toolName));
          toolStepsRef.current.push(`完成 ${toolName}`);
        }
        if (evt.type === "error") {
          throw new Error(String(evt.message ?? "流式错误"));
        }
      });

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: finalText || "（无输出）",
          toolSteps: toolStepsRef.current.length
            ? [...toolStepsRef.current]
            : undefined,
          citations: finalCitations.length ? finalCitations : undefined,
        },
      ]);
      setStreamingText("");
      setStreamingCitations([]);
      toolStepsRef.current = [];
      citationsRef.current = [];
      setActiveTools([]);
      await refreshSessions();
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") {
        return;
      }
      setError(e instanceof Error ? e.message : "请求失败");
    } finally {
      setLoading(false);
      abortRef.current = null;
      inputRef.current?.focus();
    }
  }

  function newThread() {
    stopStreaming();
    setMessages([]);
    const id = crypto.randomUUID();
    setThreadId(id);
    localStorage.setItem(THREAD_KEY, id);
    setError("");
  }

  async function deleteSession(id: string) {
    setSessions(removeLocalSession(id));
    try {
      await fetch("/api/agent/threads", {
        method: "DELETE",
        headers: headers(),
        body: JSON.stringify({ threadId: id }),
      });
    } catch {
      /* ignore */
    }
    if (threadId === id) {
      newThread();
    }
    await refreshSessions();
  }

  return (
    <div className={`chat-layout ${embed ? "chat-layout--embed" : ""}`}>
      {!embed && (
        <SessionSidebar
          sessions={sessions}
          activeThreadId={threadId}
          persistence={persistence}
          onSelect={loadThreadHistory}
          onNew={newThread}
          onDelete={deleteSession}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
        />
      )}

      <div className="chat-shell">
        <header className="chat-header">
          <div>
            <h1 className="chat-title">
              {embed ? "博客助手" : "博客 AI 助手"}
            </h1>
            <p className="chat-desc">
              LangGraph Agent · RAG · 流式
              {siteConfig?.langsmith ? " · LangSmith" : ""}
            </p>
          </div>
          <div className="chat-header-actions">
            {embed && (
              <a className="blog-link" href="/" target="_blank" rel="noreferrer">
                完整版
              </a>
            )}
            <button type="button" className="btn-ghost" onClick={newThread}>
              新会话
            </button>
            {!embed && (
              <a className="blog-link" href={blogUrl} target="_blank" rel="noreferrer">
                博客 →
              </a>
            )}
          </div>
        </header>

        {siteConfig?.demo && (
          <div className="demo-banner" role="status">
            演示模式：未配置 API Key，对话为模拟流式效果。复制{" "}
            <code>.env.example</code> → <code>.env.local</code> 后可接入真实 Agent。
          </div>
        )}

        <div className="mode-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "agent"}
            className={`mode-tab ${mode === "agent" ? "active" : ""}`}
            onClick={() => setMode("agent")}
            disabled={loading}
          >
            Agent
            <span className="mode-tab-desc">ReAct + Tool</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "rag"}
            className={`mode-tab ${mode === "rag" ? "active" : ""}`}
            onClick={() => setMode("rag")}
            disabled={loading}
          >
            RAG
            <span className="mode-tab-desc">固定检索链</span>
          </button>
        </div>

        {threadId && mode === "agent" && (
          <p className="thread-hint">
            会话 <code>{threadId.slice(0, 8)}…</code>
            {siteConfig?.checkpointer === "postgres" ? " · Neon checkpoint" : " · MemorySaver"}
          </p>
        )}

        <section className="chat-panel" aria-label="对话区">
          {messages.length === 0 && !loading && (
            <div className="empty-chat">
              <p>问本站 AI 系列、LangChain / LangGraph，或通用技术概念。</p>
              <div className="example-chips">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    className="chip"
                    onClick={() => sendMessage(ex)}
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          <MessageList
            messages={messages}
            streamingText={loading ? streamingText : ""}
            activeTools={loading ? activeTools : []}
            streamingCitations={loading ? streamingCitations : []}
          />
        </section>

        {error && <div className="alert-error" role="alert">{error}</div>}

        <form
          className="chat-input-bar"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <textarea
            ref={inputRef}
            className="chat-input"
            rows={2}
            placeholder="输入问题，Enter 发送"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            disabled={loading}
          />
          <div className="chat-input-actions">
            {loading ? (
              <button type="button" className="btn-secondary" onClick={stopStreaming}>
                停止
              </button>
            ) : (
              <button type="submit" className="btn-primary" disabled={!input.trim()}>
                发送
              </button>
            )}
          </div>
        </form>

        {!embed && (
          <>
            <button
              type="button"
              className="advanced-toggle"
              onClick={() => setShowAdvanced((v) => !v)}
            >
              {showAdvanced ? "收起" : "高级"}：访问密码
            </button>
            {showAdvanced && (
              <div className="advanced-panel">
                <input
                  type="password"
                  placeholder="BLOG_ASSISTANT_PASSWORD"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            )}
            {siteConfig?.passwordGate &&
              siteConfig.anonymousDailyLimit > 0 &&
              !password.trim() && (
                <p className="quota-hint">
                  每日 {siteConfig.anonymousDailyLimit} 次
                  {anonRemaining !== null && anonRemaining >= 0
                    ? `，剩余 ${anonRemaining}`
                    : ""}
                </p>
              )}
          </>
        )}

        {!embed && (
          <footer className="page-footer">
            收官 <code>apps/blog-assistant</code> · 嵌入 <code>/widget</code>
          </footer>
        )}
      </div>
    </div>
  );
}
