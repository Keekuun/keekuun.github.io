import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PAYLOAD_CACHE = path.join(__dirname, "../.upsert-payload.json");
const PROGRESS_FILE = path.join(__dirname, "../.upsert-progress.json");

const UPSERT_BATCH = 100;
const DAILY_WRITE_BUDGET = Number(process.env.RAG_DAILY_WRITE_BUDGET) || 9500;

export async function savePayloadCache(payload) {
  await fs.writeFile(PAYLOAD_CACHE, JSON.stringify(payload));
}

export async function loadPayloadCache() {
  try {
    const raw = await fs.readFile(PAYLOAD_CACHE, "utf8");
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function saveUpsertProgress(offset, total) {
  await fs.writeFile(
    PROGRESS_FILE,
    JSON.stringify({ offset, total, savedAt: new Date().toISOString() })
  );
}

export async function loadUpsertProgress() {
  try {
    return JSON.parse(await fs.readFile(PROGRESS_FILE, "utf8"));
  } catch {
    return null;
  }
}

export async function clearUpsertProgress() {
  try {
    await fs.unlink(PROGRESS_FILE);
  } catch {
    /* ignore */
  }
}

function isWriteLimitError(err) {
  const msg = err?.message || String(err);
  return msg.includes("Exceeded daily write limit");
}

/**
 * 分批 upsert，支持断点续传（避免 Upstash 免费版每日 1 万次写入超限）
 */
export async function writeUpsertBatches(index, upsertPayload) {
  const total = upsertPayload.length;
  let start = Number(process.env.RAG_RESUME_UPSERT_FROM) || 0;

  const progress = await loadUpsertProgress();
  if (start === 0 && progress?.offset > 0 && progress.offset < progress.total) {
    start = progress.offset;
    console.log(`从进度文件续传 upsert: ${start} / ${total}`);
  }

  if (start >= total) {
    console.log("upsert 已全部完成，无需写入");
    await clearUpsertProgress();
    return;
  }

  const remaining = total - start;
  if (remaining > DAILY_WRITE_BUDGET) {
    console.warn(
      `警告: 待写入 ${remaining} 条，接近 Upstash 免费版每日约 1 万次写入上限。` +
        `建议分批：今日 RAG_RESUME_UPSERT_FROM=${start}，明日从断点继续。`
    );
  }

  for (let i = start; i < total; i += UPSERT_BATCH) {
    const slice = upsertPayload.slice(i, i + UPSERT_BATCH);
    try {
      await index.upsert(slice);
    } catch (err) {
      if (isWriteLimitError(err)) {
        await saveUpsertProgress(i, total);
        throw new Error(
          `Upstash 今日写入已达上限（免费版约 10000 次/天）。` +
            `已完成 ${i}/${total}。请明日再运行，并设置:\n` +
            `  RAG_RESUME_UPSERT_FROM=${i}\n` +
            `且保留 tools/rag/.upsert-payload.json（勿删）。` +
            `Embedding 不会重跑，仅续传剩余 upsert。`
        );
      }
      throw err;
    }
    const done = Math.min(i + UPSERT_BATCH, total);
    console.log(`已写入 Upstash ${done} / ${total}`);
    await saveUpsertProgress(done, total);
  }

  await clearUpsertProgress();
  try {
    await fs.unlink(PAYLOAD_CACHE);
  } catch {
    /* 完成后可删缓存 */
  }
}
