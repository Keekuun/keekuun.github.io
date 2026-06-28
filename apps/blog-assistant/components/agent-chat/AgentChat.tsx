"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Citation } from "@/lib/citations";
import {
  createLocalSession,
  loadLocalSessions,
  removeLocalSession,
  updateLocalSessionTitle,
} from "@/lib/sessions-local";
import { MessageList, type ChatMessage } from "./MessageList";
import { SessionSidebar, type SessionItem } from "./SessionSidebar";
import type { RagHistoryMessage } from "@/lib/rag/types";
import {
  deleteAgentMessages,
  loadAgentMessages,
  saveAgentMessages,
} from "@/lib/agent/messages-local";
import {
  deleteRagMessages,
  loadPreferredMode,
  loadRagMessages,
  savePreferredMode,
  saveRagMessages,
} from "@/lib/rag/sessions-local";

type SiteConfig = {
  passwordGate: boolean;
  anonymousDailyLimit: number;
  database?: boolean;
  persistenceAvailable?: boolean;
  defaultPersistence?: boolean;
  checkpointer?: string;
  langsmith?: boolean;
  demo?: boolean;
  productionReady?: boolean;
  routerMode?: "rules" | "auto" | "llm";
  ragRerank?: boolean;
  ragMaxHistoryTurns?: number;
  ragHyde?: "off" | "auto" | "on";
};

type Mode = "agent" | "rag";

type Props = {
  embed?: boolean;
};

const THREAD_KEY = "blog-assistant-thread-id";
const PASSWORD_KEY = "blog-assistant-access-password";
const PERSISTENCE_KEY = "blog-assistant-persistence-enabled";
const EXAMPLES = [
  "11 篇 RAG 进阶讲什么？",
  "LangGraph checkpoint 怎么用？",
  "Runnable 和 StateGraph 什么关系？",
  "博客 AI 助手怎么部署？",
];

function readStoredPassword(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(PASSWORD_KEY) ?? "";
}

function readPersistencePref(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(PERSISTENCE_KEY) === "1";
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function buildAuthHeaders(authPassword: string): HeadersInit {
  const h: HeadersInit = { "Content-Type": "application/json" };
  if (authPassword.trim()) {
    h["x-blog-assistant-password"] = authPassword;
    h["x-kb-password"] = authPassword;
  }
  return h;
}

function buildApiHeaders(
  authPassword: string,
  options?: { persistence?: boolean }
): HeadersInit {
  const headers = buildAuthHeaders(authPassword);
  if (options?.persistence) {
    (headers as Record<string, string>)["x-blog-assistant-persistence"] = "1";
  }
  return headers;
}

function toRagHistory(messages: ChatMessage[]): RagHistoryMessage[] {
  return messages.map((m) => ({ role: m.role, content: m.content }));
}

function mapApiMessages(
  raw: Array<{ id?: string; role: "user" | "assistant"; content: string }> = []
): ChatMessage[] {
  return raw.map((m) => ({
    id: m.id || createId(),
    role: m.role,
    content: m.content,
  }));
}

/** checkpoint 为空时（MemorySaver 重启）回退本地缓存 */
function resolveAgentHistory(threadId: string, remote: ChatMessage[]): ChatMessage[] {
  const local = loadAgentMessages(threadId);
  if (remote.length === 0) return local;
  if (local.length > remote.length) return local;
  saveAgentMessages(threadId, remote);
  return remote;
}

export function AgentChat({ embed = false }: Props) {
  const [mode, setMode] = useState<Mode>("agent");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [passwordInput, setPasswordInput] = useState(readStoredPassword);
  const [authPassword, setAuthPassword] = useState(readStoredPassword);
  const [neonPersistenceEnabled, setNeonPersistenceEnabled] =
    useState(readPersistencePref);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [streamingText, setStreamingText] = useState("");
  const [streamingCitations, setStreamingCitations] = useState<Citation[]>([]);
  const [activeTools, setActiveTools] = useState<string[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(!embed);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [anonRemaining, setAnonRemaining] = useState<number | null>(null);
  const [routeLabel, setRouteLabel] = useState("");
  const [followUps, setFollowUps] = useState<string[]>([]);
  const [copyHint, setCopyHint] = useState("");
  const [retrieveHint, setRetrieveHint] = useState("");
  const [threadSwitching, setThreadSwitching] = useState(false);
  const [threadNotice, setThreadNotice] = useState("");
  const noticeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const toolStepsRef = useRef<string[]>([]);
  const citationsRef = useRef<Citation[]>([]);
  const agentSyncKeyRef = useRef("");

  const blogUrl =
    process.env.NEXT_PUBLIC_BLOG_BASE_URL || "https://blog.zkkysqs.top";

  const headers = useCallback((): HeadersInit => {
    const effective = authPassword.trim() || passwordInput.trim();
    return buildApiHeaders(effective, { persistence: neonPersistenceEnabled });
  }, [authPassword, passwordInput, neonPersistenceEnabled]);

  const applyAuthPassword = useCallback(() => {
    const next = passwordInput.trim();
    setAuthPassword((prev) => (prev === next ? prev : next));
  }, [passwordInput]);

  const refreshSessions = useCallback(async () => {
    const local = loadLocalSessions();
    try {
      const res = await fetch("/api/agent/threads", {
        headers: buildApiHeaders(authPassword, {
          persistence: neonPersistenceEnabled,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const remote: SessionItem[] = data.threads ?? [];
        if (remote.length > 0) {
          const remoteIds = new Set(remote.map((s) => s.threadId));
          const localPending = local.filter((s) => !remoteIds.has(s.threadId));
          setSessions([...localPending, ...remote]);
          return;
        }
      }
    } catch {
      /* 使用本地列表 */
    }
    setSessions(local);
  }, [authPassword, neonPersistenceEnabled]);

  const handlePersistenceToggle = useCallback(
    (enabled: boolean) => {
      setNeonPersistenceEnabled(enabled);
      localStorage.setItem(PERSISTENCE_KEY, enabled ? "1" : "0");
      agentSyncKeyRef.current = "";
    },
    []
  );

  useEffect(() => {
    const stored = localStorage.getItem(THREAD_KEY);
    const preferred = loadPreferredMode();
    if (preferred) setMode(preferred);
    if (stored) {
      setThreadId(stored);
      const activeMode = preferred ?? "agent";
      setMessages(
        activeMode === "rag"
          ? loadRagMessages(stored)
          : loadAgentMessages(stored)
      );
    }
    fetch("/api/config")
      .then((r) => r.json())
      .then((data: SiteConfig) => setSiteConfig(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    void refreshSessions();
  }, [refreshSessions]);

  useEffect(() => {
    if (!neonPersistenceEnabled) return;
    if (mode !== "agent" || !threadId || !authPassword.trim()) return;

    const syncKey = `${threadId}:${authPassword}:persist`;
    if (agentSyncKeyRef.current === syncKey) return;
    agentSyncKeyRef.current = syncKey;

    let cancelled = false;

    void (async () => {
      try {
        const res = await fetch(
          `/api/agent/chat?threadId=${encodeURIComponent(threadId)}`,
          {
            headers: buildApiHeaders(authPassword, { persistence: true }),
          }
        );
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const resolved = resolveAgentHistory(
          threadId,
          mapApiMessages(data.messages)
        );
        if (cancelled || resolved.length === 0) return;
        setMessages((prev) => (resolved.length > prev.length ? resolved : prev));
      } catch {
        /* 保留本地缓存 */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mode, neonPersistenceEnabled, authPassword]);

  useEffect(() => {
    if (authPassword.trim()) {
      sessionStorage.setItem(PASSWORD_KEY, authPassword);
    } else {
      sessionStorage.removeItem(PASSWORD_KEY);
    }
  }, [authPassword]);

  useEffect(() => {
    if (mode !== "rag" || !threadId || messages.length === 0) return;
    saveRagMessages(threadId, messages);
  }, [mode, threadId, messages]);

  useEffect(() => {
    if (mode !== "agent" || !threadId || messages.length === 0) return;
    saveAgentMessages(threadId, messages);
  }, [mode, threadId, messages]);

  async function loadThreadHistory(id: string) {
    if (id === threadId && messages.length > 0 && mode === "agent") return;

    agentSyncKeyRef.current = "";
    stopStreaming();
    setFollowUps([]);
    setRouteLabel("");
    setRetrieveHint("");
    setError("");
    setThreadId(id);
    localStorage.setItem(THREAD_KEY, id);

    const cached =
      mode === "rag" ? loadRagMessages(id) : loadAgentMessages(id);
    setMessages(cached);

    const needsRemote =
      mode === "agent" && neonPersistenceEnabled && authPassword.trim();

    if (!needsRemote) {
      setThreadSwitching(false);
      inputRef.current?.focus();
      return;
    }

    setThreadSwitching(true);
    try {
      const res = await fetch(
        `/api/agent/chat?threadId=${encodeURIComponent(id)}`,
        {
          headers: buildApiHeaders(authPassword, { persistence: true }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "加载会话失败");
      const resolved = resolveAgentHistory(
        id,
        mapApiMessages(data.messages)
      );
      setMessages(resolved);
      agentSyncKeyRef.current = `${id}:${authPassword}:persist`;
    } catch (e) {
      setError(e instanceof Error ? e.message : "加载失败");
    } finally {
      setThreadSwitching(false);
      inputRef.current?.focus();
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

  async function runStream(
    endpoint: string,
    payload: Record<string, unknown>,
    options?: { skipUserBubble?: boolean; userText?: string }
  ) {
    setError("");
    setLoading(true);
    setStreamingText("");
    setStreamingCitations([]);
    setActiveTools([]);
    setRouteLabel("");
    setFollowUps([]);
    setRetrieveHint("");
    toolStepsRef.current = [];
    citationsRef.current = [];
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const userText = options?.userText?.trim();
    if (userText && !options?.skipUserBubble) {
      setMessages((prev) => [
        ...prev,
        { id: createId(), role: "user", content: userText },
      ]);
    }

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
      } else if (authPassword.trim()) {
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

      if (
        mode === "rag" &&
        res.headers.get("content-type")?.includes("json")
      ) {
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
          if (userText && !options?.skipUserBubble) {
            setSessions(updateLocalSessionTitle(evt.threadId, userText));
          }
        }
        if (evt.type === "route" && typeof evt.label === "string") {
          setRouteLabel(evt.label);
        }
        if (evt.type === "retrieve") {
          const hitCount = Number(evt.hitCount ?? 0);
          const parts: string[] = [`检索 ${hitCount} 条`];
          if (evt.reranked) parts.push("重排序");
          if (evt.expanded) parts.push("多轮扩展");
          if (evt.multiTurn) parts.push("含上下文");
          if (evt.usedHyde) parts.push("HyDE");
          setRetrieveHint(parts.join(" · "));
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
        if (evt.type === "suggestions" && Array.isArray(evt.items)) {
          setFollowUps(
            (evt.items as string[]).filter((item) => typeof item === "string")
          );
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
      if (mode === "rag" && threadId && userText && !options?.skipUserBubble) {
        setSessions(updateLocalSessionTitle(threadId, userText));
      }
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

  async function sendMessage(text?: string) {
    const message = (text ?? input).trim();
    if (!message || loading) return;
    if (text) setInput(text);

    const activeThread = threadId ?? crypto.randomUUID();
    if (!threadId) {
      setThreadId(activeThread);
      localStorage.setItem(THREAD_KEY, activeThread);
    }

    setInput("");

    const endpoint =
      mode === "agent" ? "/api/agent/chat" : "/api/rag/chat";
    const payload =
      mode === "agent"
        ? { message, threadId: activeThread }
        : { query: message, history: toRagHistory(messages) };

    await runStream(endpoint, payload, { userText: message });
  }

  async function regenerateLast() {
    if (loading) return;
    const last = messages.at(-1);
    if (!last || last.role !== "assistant") return;

    const prior = messages.slice(0, -1);
    const lastUser = prior.at(-1);
    if (!lastUser || lastUser.role !== "user") return;

    setMessages(prior);

    if (mode === "agent") {
      if (!threadId) return;
      await runStream(
        "/api/agent/chat",
        { threadId, regenerate: true },
        { skipUserBubble: true }
      );
      return;
    }

    await runStream(
      "/api/rag/chat",
      {
        query: lastUser.content,
        regenerate: true,
        history: toRagHistory(prior.slice(0, -1)),
      },
      { skipUserBubble: true }
    );
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopyHint("已复制");
      setTimeout(() => setCopyHint(""), 1500);
    } catch {
      setCopyHint("复制失败");
      setTimeout(() => setCopyHint(""), 1500);
    }
  }

  function exportConversation() {
    if (messages.length === 0) return;
    const md = messages
      .map(
        (m) =>
          `### ${m.role === "user" ? "你" : "助手"}\n\n${m.content}`
      )
      .join("\n\n---\n\n");
    const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const date = new Date().toISOString().slice(0, 10);
    const id = threadId?.slice(0, 8) ?? "chat";
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `blog-assistant-${id}-${date}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
    setCopyHint("已导出");
    setTimeout(() => setCopyHint(""), 1500);
  }

  function switchMode(next: Mode) {
    if (loading || next === mode) return;
    savePreferredMode(next);
    setMode(next);
    setRouteLabel("");
    setRetrieveHint("");
    setFollowUps([]);
    if (!threadId) {
      setMessages([]);
      return;
    }
    if (next === "rag") {
      setMessages(loadRagMessages(threadId));
      return;
    }
    void loadThreadHistory(threadId);
  }

  function showThreadNotice(text: string) {
    if (noticeTimerRef.current) clearTimeout(noticeTimerRef.current);
    setThreadNotice(text);
    noticeTimerRef.current = setTimeout(() => {
      setThreadNotice("");
      noticeTimerRef.current = null;
    }, 2200);
  }

  function newThread() {
    stopStreaming();
    agentSyncKeyRef.current = "";
    setThreadSwitching(true);
    setMessages([]);
    setFollowUps([]);
    setRouteLabel("");
    setRetrieveHint("");
    setError("");
    const id = crypto.randomUUID();
    setThreadId(id);
    localStorage.setItem(THREAD_KEY, id);
    setSessions(createLocalSession(id));
    showThreadNotice("新会话已创建");
    requestAnimationFrame(() => {
      setThreadSwitching(false);
      inputRef.current?.focus();
    });
  }

  async function deleteSession(id: string) {
    setSessions(removeLocalSession(id));
    deleteRagMessages(id);
    deleteAgentMessages(id);
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
          persistence={
            neonPersistenceEnabled && siteConfig?.persistenceAvailable
              ? "postgres"
              : "local"
          }
          onSelect={loadThreadHistory}
          onNew={newThread}
          onDelete={deleteSession}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
          creating={threadSwitching && messages.length === 0}
          loadingThreadId={
            threadSwitching && messages.length === 0 ? threadId : null
          }
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
              {siteConfig?.routerMode && siteConfig.routerMode !== "rules"
                ? ` · 路由 ${siteConfig.routerMode}`
                : ""}
              {siteConfig?.ragHyde && siteConfig.ragHyde !== "off"
                ? ` · HyDE ${siteConfig.ragHyde}`
                : ""}
            </p>
          </div>
          <div className="chat-header-actions">
            {embed && (
              <a className="blog-link" href="/" target="_blank" rel="noreferrer">
                完整版
              </a>
            )}
            {messages.length > 0 && !loading && (
              <>
                <button type="button" className="btn-ghost btn-sm" onClick={exportConversation}>
                  导出
                </button>
                {messages.at(-1)?.role === "assistant" && (
                    <button
                      type="button"
                      className="btn-ghost btn-sm"
                      onClick={regenerateLast}
                    >
                      重新生成
                    </button>
                  )}
              </>
            )}
            {copyHint && <span className="copy-hint">{copyHint}</span>}
            {threadNotice && (
              <span className="thread-notice" role="status">
                {threadNotice}
              </span>
            )}
            <button
              type="button"
              className="btn-ghost"
              onClick={newThread}
              disabled={threadSwitching || loading}
            >
              {threadSwitching && messages.length === 0 ? "创建中…" : "新会话"}
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
            onClick={() => switchMode("agent")}
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
            onClick={() => switchMode("rag")}
            disabled={loading}
          >
            RAG
            <span className="mode-tab-desc">多轮 + 重排序</span>
          </button>
        </div>

        {(mode === "agent" && (threadId || routeLabel)) ||
        (mode === "rag" && (threadId || routeLabel || retrieveHint)) ? (
          <p className="thread-hint">
            {threadId && (
              <>
                会话 <code>{threadId.slice(0, 8)}…</code>
                {mode === "agent" &&
                  (neonPersistenceEnabled && siteConfig?.persistenceAvailable
                    ? " · Neon checkpoint"
                    : " · MemorySaver · 本地缓存")}
                {mode === "rag" && " · 本地持久化"}
              </>
            )}
            {routeLabel && (
              <>
                {mode === "agent" && threadId ? " · " : ""}
                <span
                  className={`route-badge${loading ? " route-badge--live" : ""}`}
                >
                  {routeLabel}
                </span>
              </>
            )}
            {retrieveHint && (
              <>
                {routeLabel || (mode === "agent" && threadId) ? " · " : ""}
                <span className="retrieve-hint">{retrieveHint}</span>
              </>
            )}
          </p>
        ) : null}

        <section className="chat-panel" aria-label="对话区">
          {messages.length === 0 && !loading && !threadSwitching && (
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
            onCopy={(text) => void copyText(text)}
            switching={threadSwitching && messages.length === 0}
            syncing={threadSwitching && messages.length > 0}
          />

          {followUps.length > 0 && !loading && (
            <div className="follow-up-bar">
              <span className="follow-up-label">继续问：</span>
              <div className="example-chips">
                {followUps.map((q) => (
                  <button
                    key={q}
                    type="button"
                    className="chip chip--follow"
                    onClick={() => sendMessage(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
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
              {showAdvanced ? "收起" : "高级"}：密码与持久化
            </button>
            {showAdvanced && (
              <div className="advanced-panel">
                <input
                  type="password"
                  placeholder="BLOG_ASSISTANT_PASSWORD"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onBlur={applyAuthPassword}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      applyAuthPassword();
                    }
                  }}
                />
                <p className="advanced-hint">输入完成后按回车或点击页面其他区域生效</p>
                {siteConfig?.persistenceAvailable && (
                  <label className="advanced-option">
                    <input
                      type="checkbox"
                      checked={neonPersistenceEnabled}
                      onChange={(e) => handlePersistenceToggle(e.target.checked)}
                    />
                    <span>开启 Neon 持久化（checkpoint + 服务端会话同步）</span>
                  </label>
                )}
              </div>
            )}
            {siteConfig?.passwordGate &&
              siteConfig.anonymousDailyLimit > 0 &&
              !authPassword.trim() && (
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
