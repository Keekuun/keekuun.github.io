import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.resolve(__dirname, "..");
const REPO_ROOT = path.resolve(APP_DIR, "../..");

function trimValue(value) {
  return value.trim().replace(/^['"]|['"]$/g, "");
}

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

function applyEnvFile(envPath) {
  if (!fs.existsSync(envPath)) return;
  const parsed = parseEnvFile(fs.readFileSync(envPath, "utf8"));
  for (const [key, raw] of Object.entries(parsed)) {
    const value = trimValue(raw);
    if (!value) continue;
    const current = process.env[key]?.trim();
    if (!current) {
      process.env[key] = value;
    }
  }
}

/** 加载顺序：blog-assistant/.env.local → kb-search → tools/rag */
export function loadBlogAssistantEnv() {
  const files = [
    path.join(APP_DIR, ".env.local"),
    path.join(REPO_ROOT, "apps/kb-search/.env.local"),
    path.join(REPO_ROOT, "tools/rag/.env"),
  ];
  for (const envPath of files) {
    applyEnvFile(envPath);
  }
}

export { APP_DIR, REPO_ROOT, trimValue };
