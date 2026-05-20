import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RAG_DIR = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(RAG_DIR, "../..");

function trimValue(value) {
  return value.trim().replace(/^['"]|['"]$/g, "");
}

/** 仅当当前值为空时才写入，避免 .env 里的空占位覆盖已有配置 */
function applyEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;
  const parsed = parse(fs.readFileSync(envPath));
  for (const [key, raw] of Object.entries(parsed)) {
    const value = trimValue(raw);
    if (!value) continue;
    const current = process.env[key]?.trim();
    if (!current) {
      process.env[key] = value;
    }
  }
}

/**
 * 加载顺序（后者仅在变量仍为空时生效）：
 * 1. apps/kb-search/.env.local — 常与检索站共用 Upstash / 硅基流动
 * 2. tools/rag/.env — 索引专用
 * 3. 仓库根 .env
 */
export function loadRagEnv() {
  const files = [
    path.join(REPO_ROOT, "apps/kb-search/.env.local"),
    path.join(RAG_DIR, ".env"),
    path.join(REPO_ROOT, ".env"),
  ];
  for (const envPath of files) {
    applyEnvFile(envPath);
  }
}
