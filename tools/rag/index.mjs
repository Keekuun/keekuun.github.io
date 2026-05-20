import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import matter from "gray-matter";
import { Index } from "@upstash/vector";
import {
  createEmbeddingClient,
  getEmbeddingDimensions,
  getEmbeddingModel,
  getEmbeddingProviderHint,
} from "./lib/ai.mjs";
import { embedTexts } from "./lib/embed.mjs";
import { loadRagEnv } from "./lib/load-env.mjs";
import { chunkMarkdown, extractTitle } from "./lib/chunk.mjs";
import { markdownPathToBlogUrl, stableChunkId, toRepoRelative } from "./lib/paths.mjs";

loadRagEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");

const dryRun = process.argv.includes("--dry-run");

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `缺少环境变量: ${name}。请在 tools/rag/.env 中配置（可参考 .env.example）`
    );
  }
  return value;
}

async function collectMarkdownFiles() {
  const patterns = ["docs/**/*.md", "!docs/.vuepress/**"];
  return fg(patterns, {
    cwd: REPO_ROOT,
    absolute: true,
    onlyFiles: true,
  });
}

async function main() {
  const blogBaseUrl = process.env.BLOG_BASE_URL || "https://blog.zkkysqs.top";
  const embeddingModel = getEmbeddingModel();

  const files = await collectMarkdownFiles();
  const records = [];

  for (const absolutePath of files) {
    const raw = await fs.readFile(absolutePath, "utf8");
    const { data: frontmatter, content } = matter(raw);
    const relativePath = toRepoRelative(absolutePath, REPO_ROOT);
    const fileName = path.basename(absolutePath);
    const title = extractTitle(content, frontmatter.title, fileName);
    const url = markdownPathToBlogUrl(relativePath, blogBaseUrl);
    const category = relativePath.replace(/^docs\//, "").split("/")[0] || "docs";
    const chunks = chunkMarkdown(content);

    chunks.forEach((chunkText, chunkIndex) => {
      const headingMatch = chunkText.match(/^#{1,3}\s+(.+)$/m);
      records.push({
        id: stableChunkId(relativePath, chunkIndex),
        text: chunkText,
        metadata: {
          path: relativePath,
          title,
          heading: headingMatch ? headingMatch[1].trim() : "",
          url,
          category,
          chunkIndex,
          preview: chunkText.slice(0, 400),
        },
      });
    });
  }

  console.log(`扫描到 ${files.length} 篇 Markdown，生成 ${records.length} 个文本块`);

  if (dryRun) {
    console.log("dry-run 模式，跳过 embedding 与写入 Upstash");
    console.log("示例:", records[0]?.id, records[0]?.metadata?.title);
    return;
  }

  requireEnv("UPSTASH_VECTOR_REST_URL");
  requireEnv("UPSTASH_VECTOR_REST_TOKEN");

  const embeddingClient = createEmbeddingClient();
  console.log(
    `Embedding: ${embeddingModel} @ ${embeddingClient.baseURL} (${getEmbeddingProviderHint()})`
  );

  const index = new Index({
    url: process.env.UPSTASH_VECTOR_REST_URL,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN,
  });

  if (process.env.RAG_RESET_INDEX === "1") {
    console.log("RAG_RESET_INDEX=1，清空 Upstash 索引…");
    await index.reset();
  }

  console.log(
    `开始向量化（单条请求，并发 ${process.env.EMBEDDING_CONCURRENCY || 6}，文本≤${process.env.EMBEDDING_MAX_CHARS || 6000} 字）…`
  );

  const { vectors, skipped } = await embedTexts(
    embeddingClient,
    embeddingModel,
    records.map((r) => r.text),
    {
      metas: records.map((r) => ({ id: r.id, path: r.metadata.path })),
      onProgress(done, total) {
        if (done % 50 === 0 || done === total) {
          console.log(`已向量化 ${done} / ${total}`);
        }
      },
    }
  );

  const upsertPayload = [];
  records.forEach((record, j) => {
    if (!vectors[j]) return;
    upsertPayload.push({
      id: record.id,
      vector: vectors[j],
      metadata: record.metadata,
    });
  });

  if (skipped > 0) {
    console.warn(`共跳过 ${skipped} 个无法向量化的文本块`);
  }
  console.log(`有效向量 ${upsertPayload.length} / ${records.length}`);

  const vectorDim = upsertPayload[0]?.vector?.length;
  const expectedDim = getEmbeddingDimensions();
  console.log(
    `向量维度: ${vectorDim}（模型 ${embeddingModel}，配置 EMBEDDING_DIMENSIONS=${expectedDim}）`
  );
  if (vectorDim && vectorDim !== expectedDim) {
    console.warn(
      `警告: 实际维度 ${vectorDim} 与 EMBEDDING_DIMENSIONS ${expectedDim} 不一致，请检查模型配置`
    );
  }
  console.log(
    `请确认 Upstash Vector Index 的 Dimensions 也为 ${vectorDim}（bge-m3 为 1024，勿用 1536）`
  );

  const UPSERT_BATCH = 100;
  for (let i = 0; i < upsertPayload.length; i += UPSERT_BATCH) {
    const slice = upsertPayload.slice(i, i + UPSERT_BATCH);
    try {
      await index.upsert(slice);
    } catch (err) {
      const msg = err?.message || String(err);
      if (msg.includes("Invalid vector dimension")) {
        const m = msg.match(/(\d+),\s*expected:\s*(\d+)/);
        const got = m?.[1] ?? vectorDim;
        const want = m?.[2] ?? "?";
        throw new Error(
          `Upstash 向量维度不匹配：Embedding 输出 ${got} 维，但当前 Index 要求 ${want} 维。\n` +
            `解决：在 Upstash 控制台新建 Dimensions=${got} 的 Index，更新 .env 的 UPSTASH_VECTOR_REST_URL / TOKEN，再执行 pnpm index。\n` +
            `（若坚持用 ${want} 维 Index，需改用输出 ${want} 维的 Embedding 模型并修改 EMBEDDING_MODEL）`
        );
      }
      throw err;
    }
    console.log(`已写入 Upstash ${Math.min(i + UPSERT_BATCH, upsertPayload.length)} / ${upsertPayload.length}`);
  }

  console.log("索引完成");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
