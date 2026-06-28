import type { QueryIntent } from "@/lib/agent/router";

const FOLLOW_UPS: Record<QueryIntent, string[]> = {
  blog: [
    "Runnable 和 StateGraph 什么关系？",
    "LangGraph checkpoint 怎么用？",
    "Agent 评估 golden 怎么建？",
  ],
  wiki: [
    "ReAct 和 Chain-of-Thought 区别？",
    "向量检索和关键词搜索区别？",
  ],
  chat: [
    "11 篇 RAG 进阶讲什么？",
    "博客 AI 助手怎么部署？",
    "LangSmith trace 里能看到什么？",
  ],
};

export function suggestFollowUps(
  intent: QueryIntent,
  userMessage: string,
  limit = 3
): string[] {
  const pool = FOLLOW_UPS[intent].filter((q) => q !== userMessage.trim());
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, limit);
}
