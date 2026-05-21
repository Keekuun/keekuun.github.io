import fs from "node:fs/promises";
import matter from "gray-matter";
import path from "node:path";
import { chunkMarkdown, extractTitle } from "./chunk.mjs";
import { markdownPathToBlogUrl, stableChunkId, toRepoRelative } from "./paths.mjs";

export async function buildRecordsForFiles(absolutePaths, repoRoot, blogBaseUrl) {
  const records = [];

  for (const absolutePath of absolutePaths) {
    const raw = await fs.readFile(absolutePath, "utf8");
    const { data: frontmatter, content } = matter(raw);
    const relativePath = toRepoRelative(absolutePath, repoRoot);
    const fileName = path.basename(absolutePath);
    const title = extractTitle(content, frontmatter.title, fileName);
    const url = markdownPathToBlogUrl(relativePath, blogBaseUrl);
    const category =
      relativePath.replace(/^docs\//, "").split("/")[0] || "docs";
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

  return records;
}
