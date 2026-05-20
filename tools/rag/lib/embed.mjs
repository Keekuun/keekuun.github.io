/**
 * 硅基流动 BAAI/bge-m3：
 * - 数组批量：每批≤32，每条≤512 tokens（易 400）
 * - 单条字符串：最多 8192 tokens（更稳，默认采用）
 */
const SINGLE_MAX_CHARS = Number(process.env.EMBEDDING_MAX_CHARS) || 6000;
const CONCURRENCY = Math.min(
  Number(process.env.EMBEDDING_CONCURRENCY) || 6,
  12
);

export function prepareEmbeddingText(text) {
  let cleaned = text
    .replace(/\u0000/g, "")
    .replace(/\r\n/g, "\n")
    // 去掉 base64 图片/大块二进制
    .replace(/!\[[^\]]*]\(data:[^)]+\)/gi, "[image]")
    .replace(/\[([^\]]+)]\(data:[^)]+\)/gi, "[$1]")
    // 超长代码块压缩
    .replace(/```[\s\S]*?```/g, (block) =>
      block.length > 800 ? "```\n[code omitted]\n```" : block
    )
    .trim();

  cleaned = cleaned.replace(
    /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g,
    ""
  );

  if (cleaned.length > SINGLE_MAX_CHARS) {
    cleaned = cleaned.slice(0, SINGLE_MAX_CHARS);
  }
  return cleaned;
}

function formatApiError(err) {
  const body = err?.error;
  if (body?.message) return `${body.message} (code: ${body.code ?? "?"})`;
  if (typeof body === "string") return body;
  return err?.message || String(err);
}

async function embedOne(client, model, text) {
  const input = prepareEmbeddingText(text);
  if (input.length < 10) {
    return { vector: null, skip: true, reason: "文本过短" };
  }

  const res = await client.embeddings.create({
    model,
    input,
    encoding_format: "float",
  });
  return { vector: res.data[0].embedding, skip: false };
}

async function embedOneWithFallback(client, model, text, meta) {
  try {
    return await embedOne(client, model, text);
  } catch (err) {
    const status = err?.status;
    const detail = formatApiError(err);

    if (status === 401) {
      throw new Error(`Embedding 鉴权失败 (401)：${detail}`);
    }

    if (status === 400) {
      const minimal = prepareEmbeddingText(text).slice(0, 200);
      if (minimal.length >= 10) {
        try {
          const res = await client.embeddings.create({
            model,
            input: minimal,
            encoding_format: "float",
          });
          return { vector: res.data[0].embedding, skip: false, truncated: true };
        } catch {
          /* fall through */
        }
      }
      return {
        vector: null,
        skip: true,
        reason: detail,
        meta,
      };
    }

    if (status === 429) {
      await sleep(4000);
      return embedOneWithFallback(client, model, text, meta);
    }

    throw new Error(`Embedding 失败 (${status ?? "?"}): ${detail}`);
  }
}

/**
 * 单条请求 + 有限并发；失败块跳过并继续
 */
export async function embedTexts(client, model, texts, { onProgress, metas } = {}) {
  const results = new Array(texts.length);
  let done = 0;
  let skipped = 0;
  let cursor = 0;

  async function worker() {
    while (cursor < texts.length) {
      const i = cursor++;
      const outcome = await embedOneWithFallback(
        client,
        model,
        texts[i],
        metas?.[i]
      );
      results[i] = outcome.vector;
      if (outcome.skip) {
        skipped++;
        const id = metas?.[i]?.id ?? `#${i}`;
        console.warn(`跳过向量化 ${id}: ${outcome.reason}`);
      }
      done++;
      onProgress?.(done, texts.length);
    }
  }

  await Promise.all(
    Array.from({ length: CONCURRENCY }, () => worker())
  );

  return { vectors: results, skipped };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
