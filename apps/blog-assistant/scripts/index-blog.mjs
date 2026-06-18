import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");

console.log("博客助手索引：调用仓库 tools/rag（覆盖 docs/**/*.md）");
console.log("若仅索引 AI 系列，可在 tools/rag 增量时指定变更范围。");
console.log(`仓库根目录: ${repoRoot}\n`);

execSync("pnpm --dir tools/rag index", {
  cwd: repoRoot,
  stdio: "inherit",
  env: process.env,
});
