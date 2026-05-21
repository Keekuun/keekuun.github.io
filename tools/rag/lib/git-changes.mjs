import { execSync } from "node:child_process";

/**
 * 解析 git diff，返回需更新 / 需删除的 docs 下 Markdown 路径（仓库相对路径）
 * @returns {{ toUpdate: string[], toDelete: string[] } | null} null 表示应走全量索引
 */
export function getGitDocChanges(repoRoot) {
  const before = process.env.RAG_GIT_BEFORE?.trim();
  const after = process.env.RAG_GIT_AFTER?.trim() || "HEAD";

  if (!before || /^0+$/.test(before)) {
    return null;
  }

  let output = "";
  try {
    output = execSync(`git diff --name-status "${before}" "${after}" -- docs/`, {
      cwd: repoRoot,
      encoding: "utf8",
    }).trim();
  } catch {
    return null;
  }

  if (!output) {
    return { toUpdate: [], toDelete: [] };
  }

  const toUpdate = [];
  const toDelete = [];

  for (const line of output.split("\n")) {
    if (!line.trim()) continue;
    const tab = line.indexOf("\t");
    if (tab === -1) continue;
    const status = line.slice(0, tab).trim();
    const rest = line
      .slice(tab + 1)
      .split("\t")
      .map((p) => p.trim().replace(/\\/g, "/"))
      .filter(Boolean);

    const isMd = (p) => p.endsWith(".md") && !p.includes(".vuepress/");

    if (status.startsWith("R") && rest.length >= 2) {
      if (isMd(rest[0])) toDelete.push(rest[0]);
      if (isMd(rest[1])) toUpdate.push(rest[1]);
      continue;
    }

    const file = rest[0];
    if (!isMd(file)) continue;

    if (status === "D") {
      toDelete.push(file);
    } else {
      toUpdate.push(file);
    }
  }

  return { toUpdate, toDelete };
}

/** CI 传入的逗号分隔路径（仅更新，不区分删除） */
export function parseChangedFilesEnv() {
  const raw = process.env.RAG_CHANGED_FILES?.trim();
  if (!raw) return [];
  return raw
    .split(",")
    .map((p) => p.trim().replace(/\\/g, "/"))
    .filter((p) => p.endsWith(".md"));
}
