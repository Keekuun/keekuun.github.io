#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { APP_DIR, REPO_ROOT, trimValue } from "./load-env.mjs";
import { buildEnvLocalContent } from "./env-template.mjs";

const TARGET = path.join(APP_DIR, ".env.local");
const SOURCES = [
  path.join(REPO_ROOT, "tools/rag/.env"),
  path.join(REPO_ROOT, "apps/kb-search/.env.local"),
];

const SHARED_KEYS = [
  "UPSTASH_VECTOR_REST_URL",
  "UPSTASH_VECTOR_REST_TOKEN",
  "DEEPSEEK_API_KEY",
  "DEEPSEEK_BASE_URL",
  "DEEPSEEK_CHAT_MODEL",
  "SILICONFLOW_API_KEY",
  "EMBEDDING_BASE_URL",
  "EMBEDDING_MODEL",
  "NEXT_PUBLIC_BLOG_BASE_URL",
  "KB_SEARCH_PASSWORD",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

function parseEnvFile(content) {
  const parsed = {};
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const index = trimmed.indexOf("=");
    if (index === -1) continue;
    parsed[trimmed.slice(0, index).trim()] = trimmed.slice(index + 1);
  }
  return parsed;
}

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};
  return parseEnvFile(fs.readFileSync(filePath, "utf8"));
}

function parseLocal(filePath) {
  return readEnvFile(filePath);
}

const merged = {};
for (const source of SOURCES) {
  for (const [key, raw] of Object.entries(readEnvFile(source))) {
    const value = trimValue(raw);
    if (value && SHARED_KEYS.includes(key)) {
      merged[key] = value;
    }
  }
}

const existing = parseLocal(TARGET);
const next = { ...existing };

for (const [key, value] of Object.entries(merged)) {
  if (!trimValue(next[key] || "")) {
    next[key] = value;
  }
}

if (!next.BLOG_ASSISTANT_DEMO) next.BLOG_ASSISTANT_DEMO = "0";
if (!next.NEXT_PUBLIC_BLOG_BASE_URL) {
  next.NEXT_PUBLIC_BLOG_BASE_URL = "https://blog.zkkysqs.top";
}
if (!next.DEEPSEEK_BASE_URL) next.DEEPSEEK_BASE_URL = "https://api.deepseek.com";
if (!next.DEEPSEEK_CHAT_MODEL) next.DEEPSEEK_CHAT_MODEL = "deepseek-chat";
if (!next.EMBEDDING_BASE_URL) {
  next.EMBEDDING_BASE_URL = "https://api.siliconflow.cn/v1";
}
if (!next.EMBEDDING_MODEL) next.EMBEDDING_MODEL = "BAAI/bge-m3";

const lines = buildEnvLocalContent(next);

fs.writeFileSync(TARGET, lines.endsWith("\n") ? lines : `${lines}\n`);

const filled = SHARED_KEYS.filter((k) => trimValue(next[k] || merged[k] || ""));
console.log(`已写入 ${TARGET}`);
console.log(`已从其它项目合并 ${Object.keys(merged).length} 项`);
console.log(`已配置密钥: ${filled.join(", ") || "无"}`);

const missing = ["UPSTASH_VECTOR_REST_URL", "UPSTASH_VECTOR_REST_TOKEN", "DEEPSEEK_API_KEY", "SILICONFLOW_API_KEY"].filter(
  (k) => !trimValue(next[k] || "")
);
if (missing.length) {
  console.log("\n仍需手工填入:", missing.join(", "));
  console.log("  Upstash → https://console.upstash.com/ → Vector → REST");
  console.log("  DeepSeek → https://platform.deepseek.com");
  console.log("  硅基流动 → https://cloud.siliconflow.cn");
} else {
  console.log("\n密钥齐全，可运行: pnpm blog-assistant:check-env");
}
