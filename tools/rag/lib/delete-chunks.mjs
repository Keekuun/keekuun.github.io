import { stableChunkId } from "./paths.mjs";
import { isWriteLimitError, writeLimitMessage } from "./write-limit.mjs";

const MAX_CHUNKS_PER_FILE =
  Number(process.env.RAG_MAX_CHUNKS_PER_FILE) || 256;

const DELETE_BATCH = 100;

function chunkIdsForRange(relativePath, fromIndex, toExclusive) {
  const ids = [];
  for (let i = fromIndex; i < toExclusive; i++) {
    ids.push(stableChunkId(relativePath, i));
  }
  return ids;
}

/** 分批 delete，写入超限时抛出可续跑提示 */
export async function deleteChunkIdsInBatches(index, ids, label = "delete") {
  if (ids.length === 0) return;

  let done = 0;
  const total = ids.length;

  for (let i = 0; i < ids.length; i += DELETE_BATCH) {
    const slice = ids.slice(i, i + DELETE_BATCH);
    try {
      await index.delete(slice);
    } catch (err) {
      if (isWriteLimitError(err)) {
        throw new Error(writeLimitMessage(done, total, `（${label}）`));
      }
      throw err;
    }
    done += slice.length;
  }
}

/**
 * 删除某篇文章的向量。
 * @param {number} [chunkCount] 若已知上次 chunk 数则只删 0..count-1，否则扫满 MAX（删稿用）
 */
export async function deleteVectorsForPath(index, relativePath, chunkCount) {
  const limit =
    chunkCount != null && chunkCount > 0
      ? Math.min(chunkCount, MAX_CHUNKS_PER_FILE)
      : MAX_CHUNKS_PER_FILE;
  const ids = chunkIdsForRange(relativePath, 0, limit);
  await deleteChunkIdsInBatches(index, ids, `清除 ${relativePath}`);
}

/** 文章变短后，删除多出来的尾部 chunk（fromIndex 起） */
export async function deleteOrphanChunks(index, relativePath, fromIndex) {
  if (fromIndex >= MAX_CHUNKS_PER_FILE) return;
  const ids = chunkIdsForRange(relativePath, fromIndex, MAX_CHUNKS_PER_FILE);
  await deleteChunkIdsInBatches(
    index,
    ids,
    `清除孤儿块 ${relativePath}#${fromIndex}+`
  );
}
