import { stableChunkId } from "./paths.mjs";

const MAX_CHUNKS_PER_FILE =
  Number(process.env.RAG_MAX_CHUNKS_PER_FILE) || 256;

/** 删除某篇文章可能存在的全部 chunk 向量（按 id 后缀 #0..#N-1） */
export async function deleteVectorsForPath(index, relativePath) {
  const ids = [];
  for (let i = 0; i < MAX_CHUNKS_PER_FILE; i++) {
    ids.push(stableChunkId(relativePath, i));
  }

  const BATCH = 100;
  for (let i = 0; i < ids.length; i += BATCH) {
    await index.delete(ids.slice(i, i + BATCH));
  }
}
