"use client";

import { useCallback, useState } from "react";

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

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"search" | "chat">("search");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [answer, setAnswer] = useState("");

  const blogUrl =
    process.env.NEXT_PUBLIC_BLOG_BASE_URL || "https://blog.zkkysqs.top";

  const headers = useCallback((): HeadersInit => {
    const h: HeadersInit = { "Content-Type": "application/json" };
    if (password) h["x-kb-password"] = password;
    return h;
  }, [password]);

  async function runSearch() {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    setError("");
    setHits([]);
    setAnswer("");

    try {
      if (mode === "search") {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q)}`,
          { headers: headers() }
        );
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
    }
  }

  return (
    <main>
      <h1>博客知识库检索</h1>
      <p className="subtitle">
        语义搜索你写在 VuePress 里的文章 · 向量库 Upstash Vector
      </p>

      <div className="search-row">
        <input
          type="text"
          placeholder="例如：React Fiber 更新流程、Nest 装饰器用法…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runSearch()}
        />
        <button type="button" onClick={runSearch} disabled={loading || !query.trim()}>
          {loading ? "检索中…" : "查询"}
        </button>
      </div>

      <div className="search-row">
        <input
          type="password"
          placeholder="访问密码（若在 Vercel 设置了 KB_SEARCH_PASSWORD）"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <div className="mode-row">
        <label>
          <input
            type="radio"
            name="mode"
            checked={mode === "search"}
            onChange={() => setMode("search")}
          />{" "}
          仅检索片段
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            checked={mode === "chat"}
            onChange={() => setMode("chat")}
          />{" "}
          AI 总结（DeepSeek）
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      {answer && (
        <section className="panel">
          <h2>回答</h2>
          <div className="answer">{answer}</div>
        </section>
      )}

      {hits.length > 0 && (
        <section className="panel">
          <h2>相关文章 ({hits.length})</h2>
          {hits.map((hit, i) => (
            <article className="hit" key={hit.id}>
              <a href={hit.url} target="_blank" rel="noreferrer">
                {hit.title}
                {hit.heading ? ` — ${hit.heading}` : ""}
              </a>
              <div className="hit-meta">
                [{i + 1}] {hit.category} · 相关度 {(hit.score * 100).toFixed(1)}% ·{" "}
                {hit.path}
              </div>
              <p>{hit.preview}</p>
            </article>
          ))}
        </section>
      )}

      <footer>
        正文站点：<a href={blogUrl}>{blogUrl}</a>
        <br />
        新文章发布后由 GitHub Actions 更新向量索引。
      </footer>
    </main>
  );
}
