/** 本地无 Key 时走演示流，不调用 LLM / Vector */
export function isDemoMode(): boolean {
  if (process.env.BLOG_ASSISTANT_DEMO === "0") return false;
  if (process.env.BLOG_ASSISTANT_DEMO === "1") return true;
  if (process.env.NODE_ENV === "production") return false;

  const hasLlm = Boolean(
    (process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY)?.trim()
  );
  return !hasLlm;
}

export function isProductionReady(): boolean {
  const hasLlm = Boolean(
    (process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY)?.trim()
  );
  const hasVector = Boolean(
    process.env.UPSTASH_VECTOR_REST_URL?.trim() &&
      process.env.UPSTASH_VECTOR_REST_TOKEN?.trim()
  );
  const hasEmbedding = Boolean(
    (process.env.SILICONFLOW_API_KEY || process.env.EMBEDDING_API_KEY)?.trim()
  );
  return hasLlm && hasVector && hasEmbedding;
}
