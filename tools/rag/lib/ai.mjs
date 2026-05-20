import OpenAI from "openai";

/** DeepSeek 对话 API（OpenAI 兼容） */
export function createChatClient() {
  const apiKey = trimEnv(
    process.env.DEEPSEEK_API_KEY || process.env.OPENAI_API_KEY
  );
  if (!apiKey) {
    throw new Error("缺少 DEEPSEEK_API_KEY（或兼容变量 OPENAI_API_KEY）");
  }
  return new OpenAI({
    apiKey,
    baseURL:
      trimEnv(process.env.DEEPSEEK_BASE_URL) ||
      trimEnv(process.env.OPENAI_BASE_URL) ||
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

function trimEnv(value) {
  if (!value) return value;
  return value.trim().replace(/^['"]|['"]$/g, "");
}

/**
 * Embedding 客户端（DeepSeek 暂无官方 Embedding API）
 * 默认硅基流动 BAAI/bge-m3（1024 维）
 * 注意：勿用 DEEPSEEK_API_KEY / OPENAI_BASE_URL，避免请求发到 DeepSeek 导致 401
 */
export function createEmbeddingClient() {
  const apiKey = trimEnv(
    process.env.EMBEDDING_API_KEY || process.env.SILICONFLOW_API_KEY
  );
  if (!apiKey) {
    throw new Error(
      "缺少 SILICONFLOW_API_KEY（或 EMBEDDING_API_KEY）。须在 https://cloud.siliconflow.cn 申请，不能使用 DeepSeek Key"
    );
  }
  const baseURL =
    trimEnv(process.env.EMBEDDING_BASE_URL) || "https://api.siliconflow.cn/v1";
  return new OpenAI({ apiKey, baseURL });
}

export function getEmbeddingProviderHint() {
  const baseURL =
    trimEnv(process.env.EMBEDDING_BASE_URL) || "https://api.siliconflow.cn/v1";
  if (baseURL.includes("siliconflow")) return "硅基流动";
  if (baseURL.includes("deepseek")) {
    return "DeepSeek（当前无 Embedding API，请改 EMBEDDING_BASE_URL）";
  }
  return baseURL;
}

export function getEmbeddingModel() {
  return (
    process.env.EMBEDDING_MODEL ||
    process.env.OPENAI_EMBEDDING_MODEL ||
    "BAAI/bge-m3"
  );
}

export function getEmbeddingDimensions() {
  const raw = process.env.EMBEDDING_DIMENSIONS;
  if (raw) return Number(raw);
  const model = getEmbeddingModel();
  if (model.includes("bge-m3") || model.includes("bge-large-zh")) return 1024;
  if (model.includes("text-embedding-3-large")) return 3072;
  return 1536;
}
