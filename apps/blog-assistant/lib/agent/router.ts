export type QueryIntent = "blog" | "wiki" | "chat";

const BLOG_HINTS =
  /langchain|langgraph|博客|本站|系列|rag|agent|mastra|vercel|checkpoint|runnable|toolnode|eval|golden|部署|专系列|收官|langsmith|usechat|sse|neon|upstash/i;

const WIKI_HINTS = /维基|wikipedia|是谁|谁发明|历史由来|什么意思/i;

function isChitchat(text: string): boolean {
  const q = text.trim();
  if (/^(你好|嗨|hi|hello|hey)[\s!！。]?$/i.test(q)) return true;
  if (/^(谢谢|感谢|多谢)/.test(q)) return true;
  if (/你是谁|你能做什么|你会什么|怎么用你/.test(q)) return true;
  return q.length <= 4 && !/[?？]/.test(q);
}

/** 规则路由：blog / wiki / chat（对齐 LC16 RunnableBranch 轻量版） */
export function classifyIntent(text: string): QueryIntent {
  const q = text.trim();
  if (!q || isChitchat(q)) return "chat";
  if (BLOG_HINTS.test(q)) return "blog";
  if (WIKI_HINTS.test(q) && !BLOG_HINTS.test(q)) return "wiki";
  if (/[?？]/.test(q) || q.length > 6) return "blog";
  return "chat";
}

export const INTENT_LABELS: Record<QueryIntent, string> = {
  blog: "检索博客",
  wiki: "维基补充",
  chat: "直接回答",
};
