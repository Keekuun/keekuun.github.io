import path from "node:path";
import { fileURLToPath } from "node:url";
import fg from "fast-glob";
import { Index } from "@upstash/vector";
import {
  createEmbeddingClient,
  getEmbeddingDimensions,
  getEmbeddingModel,
  getEmbeddingProviderHint,
} from "./lib/ai.mjs";
import {
  chunkCountsFromRecords,
  loadChunkCountCache,
  saveChunkCountCache,
} from "./lib/chunk-count-cache.mjs";
import {
  deleteOrphanChunks,
  deleteVectorsForPath,
} from "./lib/delete-chunks.mjs";
import { embedTexts } from "./lib/embed.mjs";
import { getGitDocChanges, parseChangedFilesEnv } from "./lib/git-changes.mjs";
import { loadRagEnv } from "./lib/load-env.mjs";
import { buildRecordsForFiles } from "./lib/records.mjs";
import {
  loadPayloadCache,
  savePayloadCache,
  writeUpsertBatches,
} from "./lib/upsert-batch.mjs";

loadRagEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "../..");

const dryRun = process.argv.includes("--dry-run");
const forceFull = process.argv.includes("--full");
const forceIncremental = process.argv.includes("--incremental");

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
  return fg(["docs/**/*.md", "!docs/.vuepress/**"], {
    cwd: REPO_ROOT,
    absolute: true,
    onlyFiles: true,
  });
}

function resolveAbsolutePaths(relativePaths) {
  return relativePaths.map((rel) => path.join(REPO_ROOT, rel));
}

async function buildUpsertPayload(records, embeddingClient, embeddingModel) {
  const resumeFrom = Number(process.env.RAG_RESUME_UPSERT_FROM) || 0;
  if (resumeFrom > 0) {
    const cached = await loadPayloadCache();
    if (cached?.length) {
      console.log(`复用缓存向量 ${cached.length} 条，跳过 Embedding（续传 upsert）`);
      return cached;
    }
    console.warn("未找到 .upsert-payload.json，将重新 Embedding");
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

  await savePayloadCache(upsertPayload);
  return upsertPayload;
}

async function upsertRecords(index, records, embeddingClient, embeddingModel) {
  if (records.length === 0) {
    console.log("没有需要写入的文本块");
    return;
  }

  const upsertPayload = await buildUpsertPayload(
    records,
    embeddingClient,
    embeddingModel
  );
  await writeUpsertBatches(index, upsertPayload);
}

async function runIncremental(index, embeddingClient, embeddingModel, blogBaseUrl) {
  const gitChanges = getGitDocChanges(REPO_ROOT);
  let toUpdate = [];
  let toDelete = [];

  if (gitChanges) {
    toUpdate = gitChanges.toUpdate;
    toDelete = gitChanges.toDelete;
    console.log(
      `增量模式（git ${process.env.RAG_GIT_BEFORE?.slice(0, 7)}..${process.env.RAG_GIT_AFTER?.slice(0, 7) || "HEAD"}）`
    );
  } else {
    toUpdate = parseChangedFilesEnv();
    console.log("增量模式（RAG_CHANGED_FILES）");
  }

  if (toUpdate.length === 0 && toDelete.length === 0) {
    console.log("docs/ 无 Markdown 变更，跳过索引");
    return;
  }

  console.log(`更新 ${toUpdate.length} 篇，删除 ${toDelete.length} 篇`);

  const chunkCache = dryRun ? {} : await loadChunkCountCache();

  for (const rel of toDelete) {
    const cached = chunkCache[rel];
    console.log(
      `  删除文章向量: ${rel}` +
        (cached ? `（缓存 ${cached} 块）` : "（按上限扫删）")
    );
    if (!dryRun) await deleteVectorsForPath(index, rel, cached);
    delete chunkCache[rel];
  }

  if (toDelete.length > 0 && toUpdate.length === 0) {
    if (!dryRun) await saveChunkCountCache(chunkCache);
    console.log("仅删除已完成，无需 Embedding");
    return;
  }

  const absolutePaths = resolveAbsolutePaths(toUpdate);
  const records = await buildRecordsForFiles(
    absolutePaths,
    REPO_ROOT,
    blogBaseUrl
  );
  const newCounts = chunkCountsFromRecords(records);
  console.log(`本次生成 ${records.length} 个文本块`);

  if (dryRun) {
    for (const rel of toUpdate) {
      const n = newCounts[rel] ?? 0;
      const old = chunkCache[rel];
      if (old != null && old > n) {
        console.log(`  [dry-run] 将清除尾部孤儿: ${rel} #${n}..${old - 1}`);
      }
    }
    console.log("dry-run 模式，跳过 embedding 与写入");
    return;
  }

  for (const rel of toUpdate) {
    const newCount = newCounts[rel] ?? 0;
    const oldCount = chunkCache[rel];
    if (oldCount != null && oldCount > newCount) {
      console.log(
        `  清除变短文章的尾部块: ${rel}（${oldCount} → ${newCount}，删 ${oldCount - newCount} 条）`
      );
      await deleteOrphanChunks(index, rel, newCount);
    }
  }

  await upsertRecords(index, records, embeddingClient, embeddingModel);

  for (const rel of toUpdate) {
    if (newCounts[rel] != null) chunkCache[rel] = newCounts[rel];
  }
  await saveChunkCountCache(chunkCache);
}

async function runFull(index, embeddingClient, embeddingModel, blogBaseUrl) {
  const files = await collectMarkdownFiles();
  const records = await buildRecordsForFiles(files, REPO_ROOT, blogBaseUrl);
  console.log(`全量模式：${files.length} 篇 Markdown，${records.length} 个文本块`);

  if (dryRun) {
    console.log("dry-run 模式，跳过 embedding 与写入 Upstash");
    console.log("示例:", records[0]?.id, records[0]?.metadata?.title);
    return;
  }

  if (process.env.RAG_FORCE_RESET === "1") {
    console.log(
      "RAG_FORCE_RESET=1，清空 Upstash 索引（约消耗 1 次写入配额，但后续 upsert 仍占条数）…"
    );
    await index.reset();
  } else {
    console.log(
      "全量 upsert（不 reset）：覆盖已有 id，约每向量 1 次写入；删文产生的孤儿向量可定期 full_reindex+reset 清理"
    );
  }

  await upsertRecords(index, records, embeddingClient, embeddingModel);

  if (!dryRun) {
    const counts = chunkCountsFromRecords(records);
    await saveChunkCountCache(counts);
    console.log(`已更新 chunk 计数缓存（${Object.keys(counts).length} 篇）`);
  }
}

async function main() {
  const blogBaseUrl = process.env.BLOG_BASE_URL || "https://blog.zkkysqs.top";
  const embeddingModel = getEmbeddingModel();

  const useIncremental =
    forceIncremental ||
    (!forceFull &&
      process.env.RAG_FORCE_RESET !== "1" &&
      (process.env.RAG_GIT_BEFORE || process.env.RAG_CHANGED_FILES));

  if (dryRun && !useIncremental) {
    const files = await collectMarkdownFiles();
    const records = await buildRecordsForFiles(files, REPO_ROOT, blogBaseUrl);
    console.log(`扫描到 ${files.length} 篇 Markdown，生成 ${records.length} 个文本块`);
    console.log("dry-run 模式，跳过 embedding 与写入 Upstash");
    return;
  }

  if (dryRun && useIncremental) {
    await runIncremental(null, null, null, blogBaseUrl);
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

  const vectorDim = getEmbeddingDimensions();
  console.log(`目标向量维度: ${vectorDim}`);

  if (useIncremental) {
    await runIncremental(index, embeddingClient, embeddingModel, blogBaseUrl);
  } else {
    await runFull(index, embeddingClient, embeddingModel, blogBaseUrl);
  }

  console.log("索引完成");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
