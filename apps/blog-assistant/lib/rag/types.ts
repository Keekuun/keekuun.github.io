export type RagHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export const RAG_MAX_HISTORY_TURNS = 6;

export function trimRagHistory(
  history: RagHistoryMessage[] | undefined,
  maxTurns = RAG_MAX_HISTORY_TURNS
): RagHistoryMessage[] {
  if (!history?.length) return [];
  const cleaned = history
    .filter((m) => m.content?.trim())
    .map((m) => ({
      role: m.role,
      content: m.content.trim().slice(0, 1200),
    }));
  return cleaned.slice(-maxTurns * 2);
}

/** 短问/指代时把最近对话拼进检索 query */
export function buildRetrievalQuery(
  query: string,
  history: RagHistoryMessage[]
): string {
  if (history.length === 0) return query;
  if (!needsContextualization(query, history)) return query;

  const recent = history.slice(-4);
  const context = recent
    .map((m) => `${m.role === "user" ? "问" : "答"}: ${m.content.slice(0, 240)}`)
    .join("\n");
  return `${context}\n\n当前问题: ${query}`;
}

function needsContextualization(
  query: string,
  history: RagHistoryMessage[]
): boolean {
  if (history.length === 0) return false;
  const q = query.trim();
  if (q.length <= 14) return true;
  return /它|这个|那个|上面|刚才|上一|继续|还有|呢[?？]?$|什么意思/.test(q);
}
