import { searchBlog as searchBlogHits } from "@/lib/vector";
import { expandQueryWithHyde } from "@/lib/rag/hyde";
import {
  buildRetrievalQuery,
  trimRagHistory,
  type RagHistoryMessage,
} from "@/lib/rag/types";
import { isRerankEnabled, rerankHits } from "@/lib/rag/rerank";

export type RetrieveOptions = {
  topK?: number;
  rerank?: boolean;
  history?: RagHistoryMessage[];
  hyde?: boolean;
};

export type RetrieveResult = {
  hits: Awaited<ReturnType<typeof searchBlogHits>>;
  retrievalQuery: string;
  embeddingQuery: string;
  reranked: boolean;
  usedHyde: boolean;
  expanded: boolean;
};

/** Agent Tool 与 RAG 链共用的博客检索（多轮扩展 + HyDE + 重排序） */
export async function retrieveBlogChunks(
  query: string,
  options?: RetrieveOptions
): Promise<RetrieveResult> {
  const topK = options?.topK ?? 6;
  const history = trimRagHistory(options?.history);
  const retrievalQuery = buildRetrievalQuery(query, history);
  const expanded = retrievalQuery !== query;
  const useRerank = options?.rerank ?? isRerankEnabled();
  const useHyde = options?.hyde !== false;
  const fetchK = useRerank ? Math.min(topK * 2, 12) : topK;

  let embeddingQuery = retrievalQuery;
  let usedHyde = false;

  if (useHyde) {
    const hyde = await expandQueryWithHyde(query, retrievalQuery, history.length);
    embeddingQuery = hyde.embeddingQuery;
    usedHyde = hyde.usedHyde;
  }

  let hits = await searchBlogHits(retrievalQuery, fetchK, embeddingQuery);
  if (useRerank && hits.length > 1) {
    hits = rerankHits(query, hits, topK);
  }

  return {
    hits,
    retrievalQuery,
    embeddingQuery,
    reranked: useRerank,
    usedHyde,
    expanded,
  };
}

/** 兼容旧调用 */
export async function searchBlog(query: string, topK = 5) {
  const { hits } = await retrieveBlogChunks(query, { topK, rerank: true });
  return hits;
}
