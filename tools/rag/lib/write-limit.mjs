export function isWriteLimitError(err) {
  const msg = err?.message || String(err);
  return msg.includes("Exceeded daily write limit");
}

export function writeLimitMessage(done, total, extra = "") {
  return (
    `Upstash 今日写入已达上限（免费版约 10000 次/天）。` +
    `已完成 ${done}/${total}。${extra}` +
    `请明日再运行；若 upsert 中断请设置 RAG_RESUME_UPSERT_FROM 并保留 .upsert-payload.json。`
  );
}
