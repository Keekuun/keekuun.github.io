import { searchBlog as searchBlogHits } from "@/lib/vector";

/** Agent Tool 与 RAG 链共用的博客检索入口 */
export async function searchBlog(query: string, topK = 5) {
  return searchBlogHits(query, topK);
}
