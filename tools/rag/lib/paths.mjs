import path from "node:path";

const DOCS_ROOT = "docs";

/**
 * docs/frontEnd/JS/8.es6-promise.md → https://blog.../frontEnd/JS/8.es6-promise.html
 */
export function markdownPathToBlogUrl(filePath, blogBaseUrl) {
  const normalized = filePath.replace(/\\/g, "/");
  const rel = normalized.startsWith(`${DOCS_ROOT}/`)
    ? normalized.slice(DOCS_ROOT.length + 1)
    : normalized;
  const pathname = rel.replace(/\.md$/i, ".html");
  const base = blogBaseUrl.replace(/\/$/, "");
  return `${base}/${pathname}`;
}

export function stableChunkId(relativePath, chunkIndex) {
  return `${relativePath}#${chunkIndex}`;
}

export function toRepoRelative(filePath, repoRoot) {
  return path.relative(repoRoot, filePath).replace(/\\/g, "/");
}
