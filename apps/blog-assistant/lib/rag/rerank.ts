import type { SearchHit } from "@/lib/vector";

function tokenize(text: string): string[] {
  const raw = text.toLowerCase().match(/[\u4e00-\u9fa5a-z0-9]+/g) ?? [];
  return raw.filter((token) => token.length > 1);
}

function keywordOverlapScore(query: string, hit: SearchHit): number {
  const queryTokens = new Set(tokenize(query));
  if (queryTokens.size === 0) return 0;

  const docText = `${hit.title} ${hit.heading} ${hit.preview} ${hit.path}`;
  const docTokens = new Set(tokenize(docText));
  let matched = 0;
  for (const token of queryTokens) {
    if (docTokens.has(token)) matched += 1;
  }
  return matched / queryTokens.size;
}

/** 向量分 + 关键词重叠混合重排（对齐 11 RAG 进阶 · 重排序） */
export function rerankHits(
  query: string,
  hits: SearchHit[],
  topK?: number
): SearchHit[] {
  if (hits.length <= 1) return hits;

  const vectorWeight = Number(process.env.RAG_RERANK_VECTOR_WEIGHT || 0.65);
  const keywordWeight = Number(process.env.RAG_RERANK_KEYWORD_WEIGHT || 0.35);

  const ranked = hits
    .map((hit) => {
      const keywordScore = keywordOverlapScore(query, hit);
      const blended = hit.score * vectorWeight + keywordScore * keywordWeight;
      return { ...hit, score: blended };
    })
    .sort((a, b) => b.score - a.score);

  return topK ? ranked.slice(0, topK) : ranked;
}

export function isRerankEnabled(): boolean {
  const flag = (process.env.RAG_RERANK ?? "1").trim().toLowerCase();
  return flag !== "0" && flag !== "false";
}
