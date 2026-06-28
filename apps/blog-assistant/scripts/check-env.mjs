#!/usr/bin/env node
import OpenAI from "openai";
import { loadBlogAssistantEnv } from "./load-env.mjs";

loadBlogAssistantEnv();

const required = [
  "UPSTASH_VECTOR_REST_URL",
  "UPSTASH_VECTOR_REST_TOKEN",
  "DEEPSEEK_API_KEY",
];

const missing = required.filter((key) => !process.env[key]?.trim());
if (!process.env.SILICONFLOW_API_KEY?.trim() && !process.env.EMBEDDING_API_KEY?.trim()) {
  missing.push("SILICONFLOW_API_KEY");
}

if (missing.length) {
  console.error("❌ 缺少必填变量:", missing.join(", "));
  console.error("\n请编辑 apps/blog-assistant/.env.local");
  console.error("或运行: pnpm blog-assistant:setup-env");
  process.exit(1);
}

const embedBase = (process.env.EMBEDDING_BASE_URL || "https://api.siliconflow.cn/v1").trim();
if (embedBase.includes("deepseek")) {
  console.error("❌ EMBEDDING_BASE_URL 不能指向 DeepSeek");
  process.exit(1);
}

const demoForced =
  process.env.BLOG_ASSISTANT_DEMO === "1"
    ? "强制演示"
    : process.env.BLOG_ASSISTANT_DEMO === "0"
      ? "已关闭"
      : "自动（有 Key 即真实 AI）";

console.log("✓ 环境变量齐全");
console.log("  Upstash:", `${process.env.UPSTASH_VECTOR_REST_URL?.slice(0, 48)}...`);
console.log("  DeepSeek:", process.env.DEEPSEEK_CHAT_MODEL || "deepseek-chat");
console.log("  Embedding:", process.env.EMBEDDING_MODEL || "BAAI/bge-m3");
console.log("  演示模式:", demoForced);
console.log(
  "  Checkpoint:",
  process.env.DATABASE_URL?.trim() ? "Neon Postgres" : "MemorySaver（本地）"
);

const embedKey = (
  process.env.SILICONFLOW_API_KEY || process.env.EMBEDDING_API_KEY
)?.trim();
const embedClient = new OpenAI({ apiKey: embedKey, baseURL: embedBase });
const embedModel = process.env.EMBEDDING_MODEL || "BAAI/bge-m3";

try {
  const res = await embedClient.embeddings.create({
    model: embedModel,
    input: "blog-assistant env check",
  });
  console.log("✓ Embedding API 连通，维度:", res.data[0].embedding.length);
} catch (err) {
  console.error("❌ Embedding API 失败:", err instanceof Error ? err.message : err);
  process.exit(1);
}

console.log("\n下一步:");
console.log("  pnpm blog-assistant:index   # 向量库未索引时");
console.log("  pnpm blog-assistant:dev     # http://localhost:3010");
