"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MarkdownContent } from "./components/MarkdownContent";

type SiteConfig = {
  passwordGate: boolean;
  anonymousDailySearchLimit: number;
  chatRequiresPassword: boolean;
};

type Hit = {
  id: string;
  score: number;
  title: string;
  heading: string;
  url: string;
  path: string;
  category: string;
  preview: string;
};

const EXAMPLES = [
  "React Fiber 更新流程",
  "NestJS 装饰器",
  "JavaScript 事件循环",
  "Prompt Engineering 技巧",
  "Vue3 响应式原理",
];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [password, setPassword] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [mode, setMode] = useState<"search" | "chat">("search");
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [answer, setAnswer] = useState("");
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [anonRemaining, setAnonRemaining] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((data: SiteConfig) => setSiteConfig(data))
      .catch(() => {});
  }, []);

  const chatLocked =
    Boolean(siteConfig?.chatRequiresPassword) && !password.trim();

  const blogUrl =
    process.env.NEXT_PUBLIC_BLOG_BASE_URL || "https://blog.zkkysqs.top";

  const headers = useCallback((): HeadersInit => {
    const h: HeadersInit = { "Content-Type": "application/json" };
    if (password) h["x-kb-password"] = password;
    return h;
  }, [password]);

  async function runSearch(searchQuery?: string) {
    const q = (searchQuery ?? query).trim();
    if (!q) return;
    if (searchQuery) setQuery(searchQuery);

    setLoading(true);
    setError("");
    setHits([]);
    setAnswer("");
    setSearched(true);

    try {
      if (mode === "chat" && chatLocked) {
        setError("AI 总结需要访问密码，请在下方「高级」中填写");
        setShowAdvanced(true);
        return;
      }

      if (mode === "search") {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}`,
          { headers: headers() }
        );
        const remaining = res.headers.get("X-RateLimit-Remaining");
        if (remaining !== null && remaining !== "") {
          setAnonRemaining(Number(remaining));
        } else if (password.trim()) {
          setAnonRemaining(null);
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "检索失败");
        setHits(data.hits ?? []);
      } else {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: headers(),
          body: JSON.stringify({ query: q }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "问答失败");
        setHits(data.hits ?? []);
        setAnswer(data.answer ?? "");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "请求失败");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const hasResults = hits.length > 0 || !!answer;
  const showEmpty = searched && !loading && !error && !hasResults;

  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className="brand-title">博客知识库</h1>
          <p className="brand-desc">用自然语言搜索你写过的技术文章</p>
        </div>
        <a className="blog-link" href={blogUrl} target="_blank" rel="noreferrer">
          前往博客 →
        </a>
      </header>

      <section className="search-card" aria-label="搜索">
        <div className="search-input-wrap">
          <input
            ref={inputRef}
            className="search-input"
            type="search"
            placeholder="输入问题或关键词，按 Enter 搜索"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runSearch()}
            autoComplete="off"
          />
          <button
            type="button"
            className="btn-primary"
            onClick={() => runSearch()}
            disabled={loading || !query.trim()}
          >
            {loading ? "搜索中" : "搜索"}
          </button>
        </div>

        <div className="mode-tabs" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "search"}
            className={`mode-tab ${mode === "search" ? "active" : ""}`}
            onClick={() => setMode("search")}
          >
            相关片段
            <span className="mode-tab-desc">快速、不消耗 AI</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "chat"}
            className={`mode-tab ${mode === "chat" ? "active" : ""} ${chatLocked ? "mode-tab-locked" : ""}`}
            onClick={() => {
              if (chatLocked) {
                setError("AI 总结需要访问密码");
                setShowAdvanced(true);
                return;
              }
              setMode("chat");
              setError("");
            }}
            title={chatLocked ? "需要访问密码" : undefined}
          >
            AI 总结
            <span className="mode-tab-desc">
              {chatLocked ? "需密码" : "DeepSeek 归纳回答"}
            </span>
          </button>
        </div>

        <div className="examples">
          <p className="examples-label">试试这些：</p>
          <div className="example-chips">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                className="chip"
                disabled={loading}
                onClick={() => runSearch(ex)}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="advanced-toggle"
          onClick={() => setShowAdvanced((v) => !v)}
          aria-expanded={showAdvanced}
        >
          {showAdvanced ? "收起" : "高级"}：访问密码
        </button>
        {showAdvanced && (
          <div className="advanced-panel">
            <input
              type="password"
              placeholder="若部署时设置了 KB_SEARCH_PASSWORD，在此填写"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <p className="advanced-hint">
              密码仅发往本站 API。填写后可无限检索并使用 AI 总结。
            </p>
          </div>
        )}

        {siteConfig?.passwordGate &&
          siteConfig.anonymousDailySearchLimit > 0 &&
          !password.trim() && (
            <p className="quota-hint" role="status">
              访客每日可免费语义检索 {siteConfig.anonymousDailySearchLimit} 次
              {anonRemaining !== null && anonRemaining >= 0
                ? `，今日剩余 ${anonRemaining} 次`
                : ""}
              ；AI 总结需密码。
            </p>
          )}
      </section>

      {error && (
        <div className="alert-error" role="alert">
          <span aria-hidden>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="loading-bar" aria-live="polite">
          <span className="spinner" aria-hidden />
          {mode === "chat" ? "正在检索并生成回答…" : "正在检索相关文章…"}
        </div>
      )}

      {showEmpty && (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden>
            🔍
          </div>
          <strong>没有找到相关内容</strong>
          <p>换个说法试试，或确认博客已建立向量索引</p>
        </div>
      )}

      {answer && !loading && (
        <section className="answer-card" aria-label="AI 回答">
          <div className="section-head">
            <h2 className="section-title">AI 回答</h2>
            <span className="section-badge">DeepSeek</span>
          </div>
          <MarkdownContent content={answer} />
        </section>
      )}

      {hits.length > 0 && !loading && (
        <section aria-label="检索结果">
          <div className="section-head" style={{ marginBottom: "0.75rem" }}>
            <h2 className="section-title">相关文章</h2>
            <span className="section-badge">{hits.length} 条</span>
          </div>
          <div className="results-list">
            {hits.map((hit, i) => {
              const pct = Math.min(100, Math.max(0, hit.score * 100));
              return (
                <article className="hit-card" key={hit.id}>
                  <div className="hit-top">
                    <span className="hit-index" aria-hidden>
                      {i + 1}
                    </span>
                    <div className="hit-main">
                      <a
                        className="hit-title"
                        href={hit.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {hit.title}
                        {hit.heading && (
                          <span className="hit-heading"> · {hit.heading}</span>
                        )}
                      </a>
                      <div className="hit-meta">
                        <span className="tag">{hit.category}</span>
                        <span className="score-wrap">
                          <span className="score-bar" aria-hidden>
                            <span
                              className="score-fill"
                              style={{ width: `${pct}%` }}
                            />
                          </span>
                          匹配 {pct.toFixed(0)}%
                        </span>
                      </div>
                      <div className="hit-preview">
                        <MarkdownContent content={hit.preview} variant="compact" />
                      </div>
                      <div className="hit-path">{hit.path}</div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {!searched && !loading && (
        <div className="empty-state">
          <div className="empty-state-icon" aria-hidden>
            📚
          </div>
          <strong>搜索你的博客知识库</strong>
          <p>支持语义检索，输入概念即可找到曾写过的文章段落</p>
        </div>
      )}

      <footer className="page-footer">
        索引覆盖 <code>docs/</code> 下的 Markdown ·{" "}
        <a href={blogUrl}>{blogUrl.replace(/^https?:\/\//, "")}</a>
      </footer>
    </div>
  );
}
