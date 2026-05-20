/** 单条 Embedding 请求时 bge-m3 支持更长上下文；检索块约 1200 字 */
const MAX_CHUNK_CHARS = Number(process.env.RAG_CHUNK_MAX_CHARS) || 1200;
const OVERLAP_CHARS = 100;

/**
 * 按标题切段，过长段落再按字符切分并保留重叠。
 */
export function chunkMarkdown(body) {
  const trimmed = body.trim();
  if (!trimmed) return [];

  const sections = splitByHeadings(trimmed);
  const chunks = [];

  for (const section of sections) {
    if (section.length <= MAX_CHUNK_CHARS) {
      chunks.push(section);
      continue;
    }
    chunks.push(...splitLongText(section, MAX_CHUNK_CHARS, OVERLAP_CHARS));
  }

  return chunks.filter((c) => c.trim().length >= 80);
}

function splitByHeadings(text) {
  const parts = text.split(/(?=^#{1,3}\s)/m).map((p) => p.trim()).filter(Boolean);
  if (parts.length === 0) return [text];
  return parts;
}

function splitLongText(text, maxLen, overlap) {
  const result = [];
  let start = 0;

  while (start < text.length) {
    let end = Math.min(start + maxLen, text.length);
    if (end < text.length) {
      const slice = text.slice(start, end);
      const breakAt = Math.max(
        slice.lastIndexOf("\n\n"),
        slice.lastIndexOf("\n"),
        slice.lastIndexOf("。"),
        slice.lastIndexOf(". ")
      );
      if (breakAt > maxLen * 0.4) {
        end = start + breakAt + 1;
      }
    }
    result.push(text.slice(start, end).trim());
    if (end >= text.length) break;
    start = Math.max(end - overlap, start + 1);
  }

  return result;
}

export function extractTitle(rawBody, frontmatterTitle, fileName) {
  if (frontmatterTitle && String(frontmatterTitle).trim()) {
    return String(frontmatterTitle).trim();
  }
  const h1 = rawBody.match(/^#\s+(.+)$/m);
  if (h1) return h1[1].trim();
  return fileName.replace(/\.md$/i, "");
}
