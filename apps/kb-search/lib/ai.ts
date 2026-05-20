import OpenAI from "openai";

export function createChatClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("未配置 DEEPSEEK_API_KEY");
  }
  return new OpenAI({
    apiKey,
    baseURL:
      process.env.DEEPSEEK_BASE_URL ||
      process.env.OPENAI_BASE_URL ||
      "https://api.deepseek.com",
  });
}

export function getChatModel() {
  return (
    process.env.DEEPSEEK_CHAT_MODEL ||
    process.env.OPENAI_CHAT_MODEL ||
    "deepseek-chat"
  );
}

function trimEnv(value?: string) {
  if (!value) return value;
  return value.trim().replace(/^['"]|['"]$/g, "");
}

export function createEmbeddingClient() {
  const apiKey = trimEnv(
    process.env.EMBEDDING_API_KEY || process.env.SILICONFLOW_API_KEY
  );
  if (!apiKey) {
    throw new Error("未配置 SILICONFLOW_API_KEY（Embedding 不能用 DeepSeek Key）");
  }
  const baseURL =
    trimEnv(process.env.EMBEDDING_BASE_URL) || "https://api.siliconflow.cn/v1";
  return new OpenAI({ apiKey, baseURL });
}

export function getEmbeddingModel() {
  return (
    process.env.EMBEDDING_MODEL ||
    process.env.OPENAI_EMBEDDING_MODEL ||
    "BAAI/bge-m3"
  );
}
