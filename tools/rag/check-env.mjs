import { loadRagEnv } from "./lib/load-env.mjs";
import { createEmbeddingClient, getEmbeddingModel } from "./lib/ai.mjs";

loadRagEnv();

const required = ["UPSTASH_VECTOR_REST_URL", "UPSTASH_VECTOR_REST_TOKEN"];
const missing = required.filter((k) => !process.env[k]?.trim());
if (missing.length) {
  console.error("缺少:", missing.join(", "));
  process.exit(1);
}

if (!process.env.SILICONFLOW_API_KEY?.trim() && !process.env.EMBEDDING_API_KEY?.trim()) {
  console.error("缺少 SILICONFLOW_API_KEY（硅基流动 Embedding 专用，不能用 DeepSeek Key）");
  process.exit(1);
}

const base = (process.env.EMBEDDING_BASE_URL || "https://api.siliconflow.cn/v1").trim();
if (base.includes("deepseek")) {
  console.error("EMBEDDING_BASE_URL 不能指向 DeepSeek，请改为 https://api.siliconflow.cn/v1");
  process.exit(1);
}

console.log("环境变量检查通过");
console.log("Upstash URL:", process.env.UPSTASH_VECTOR_REST_URL?.slice(0, 40) + "...");
console.log("Embedding:", getEmbeddingModel(), "@", base);

const client = createEmbeddingClient();
try {
  const res = await client.embeddings.create({
    model: getEmbeddingModel(),
    input: "测试",
  });
  console.log("Embedding API 连通 OK，向量维度:", res.data[0].embedding.length);
} catch (err) {
  console.error("Embedding API 失败:", err.message || err);
  process.exit(1);
}
