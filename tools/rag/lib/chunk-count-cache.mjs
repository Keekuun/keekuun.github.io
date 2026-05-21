import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_FILE = path.join(__dirname, "../.chunk-counts.json");

/** @returns {Record<string, number>} path → 上次索引的 chunk 数量 */
export async function loadChunkCountCache() {
  try {
    return JSON.parse(await fs.readFile(CACHE_FILE, "utf8"));
  } catch {
    return {};
  }
}

export async function saveChunkCountCache(cache) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 0));
}

/** 从 records 统计每篇文章的 chunk 数 */
export function chunkCountsFromRecords(records) {
  const counts = {};
  for (const record of records) {
    const p = record.metadata?.path;
    if (!p) continue;
    const idx = record.metadata.chunkIndex ?? 0;
    counts[p] = Math.max(counts[p] ?? 0, idx + 1);
  }
  return counts;
}
