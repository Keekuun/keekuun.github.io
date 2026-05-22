# 博客 RAG 索引（Upstash Vector）

将 `docs/**/*.md` 分块、向量化并写入 Upstash Vector，供 `apps/kb-search` 检索。

## AI 服务说明

| 环节 | 服务 | 说明 |
|------|------|------|
| **AI 总结** | [DeepSeek](https://platform.deepseek.com) | `deepseek-chat`，OpenAI 兼容 |
| **向量化** | [硅基流动](https://cloud.siliconflow.cn) | 默认 `BAAI/bge-m3`；**单条**请求（避免批量 512 token 限制） |

## 1. 创建 Upstash Vector

1. [Upstash Console](https://console.upstash.com/) → **Vector** → Create Index  
2. **Dimensions = 1024**（`BAAI/bge-m3` 固定 1024；Index 若建成 1536 会写入失败，需新建 1024 维 Index）  
3. 复制 **REST URL**、**REST Token** 到 `tools/rag/.env` 与 `apps/kb-search/.env.local`

## 2. 本地索引

```bash
cd tools/rag
cp .env.example .env
# 必填：UPSTASH_*、SILICONFLOW_API_KEY（也可只写在 apps/kb-search/.env.local，索引脚本会自动读取）

pnpm install
pnpm check-env   # 先测 SILICONFLOW_API_KEY 是否可用
pnpm index:dry
pnpm index          # 默认：RAG_RESET_INDEX=0 且未传 git 时仍全量；见下
pnpm index:full     # 强制全量（可配合 RAG_RESET_INDEX=1）
pnpm index:incremental   # 仅处理 git 变更的 docs（本地需有 git 历史）
```

### 增量 vs 全量

| 场景 | 行为 |
|------|------|
| CI push 只改了少量 `docs/**/*.md` | **增量**：只删/重建变更文章对应的向量 |
| CI 首次 / `before` 为空 | **全量** + `RAG_RESET_INDEX=1` |
| 本地 `pnpm index:full` | 全量 upsert（默认**不** reset，约 5200 次写入） |
| Actions 手动运行并勾选 full_reindex | 全量且 `RAG_FORCE_RESET=1` 清空索引 |

### Upstash 免费版写入上限（约 1 万次/天）

- **不要**每次全量都 `reset` + 全量 upsert（约 1 万次+，易超限）。
- 日常改文章走 **增量**：同 id **upsert 覆盖**，不再每篇预删 256 条；仅文章变短时按 `.chunk-counts.json` 删尾部孤儿（CI 会缓存该文件）。
- 全量中断后：在失败 run 的 Artifacts 下载 `rag-state-cache` 解压到 `tools/rag/`，再在仓库 **Variables** 设 `RAG_RESUME_UPSERT_FROM=4800` 后重跑 workflow。未配置该 Variable 时**不会**尝试下载产物（避免 Artifact not found）。

### 本地从 4800 条续传（PowerShell）

1. 把 CI 产物里的 `.upsert-payload.json`、`.upsert-progress.json` 放到 `tools/rag/`（没有 payload 会重新 Embedding 全部，仅 upsert 仍从 4800 起写）。
2. 确认 `tools/rag/.env` 里 Upstash URL/Token 与线上 Index 一致；**不要**设 `RAG_FORCE_RESET=1`。
3. 在仓库根目录执行：

```powershell
cd d:\code\github\keekuun.github.io
$env:RAG_RESUME_UPSERT_FROM = "4800"
pnpm rag:index:resume
```

仅续传 upsert（不扫 `docs`、不调用 Embedding）。若已存在 `.upsert-progress.json` 且 `offset` 为 4800，也可不设环境变量直接 `pnpm rag:index:resume`。

等价：`pnpm rag:index:full` + `RAG_RESUME_UPSERT_FROM=4800`（有 payload 时同样跳过 Embedding，但会多扫一遍 Markdown）。

Upstash 免费版每日约 1 万次写入；剩余约 **382** 条可在配额重置后一次写完。

## 3. GitHub Actions（与 `.env` 对齐）

索引 workflow 的非敏感项已写死在 `.github/workflows/rag-index.yml`，与 `.env.example` 相同。  
**Secrets 必须与本地 `tools/rag/.env` 里三项一致**（值从 `.env` 复制，不要提交 `.env`）：

| GitHub Secret | 对应 `.env` 变量 |
|---------------|------------------|
| `UPSTASH_VECTOR_REST_URL` | `UPSTASH_VECTOR_REST_URL` |
| `UPSTASH_VECTOR_REST_TOKEN` | `UPSTASH_VECTOR_REST_TOKEN` |
| `SILICONFLOW_API_KEY` | `SILICONFLOW_API_KEY` |

`DEEPSEEK_API_KEY` 仅 `apps/kb-search` 需要，**不要**配进 `rag-index` workflow。

更换 Upstash Index 后，记得同时改本地 `.env` 与上述三个 Secret，否则 CI 会写入错误的向量库。

`master` 上 `docs/**` 变更时运行 `.github/workflows/rag-index.yml`。

## 4. 检索站点

见 `apps/kb-search/README.md`（Vercel 部署 + DeepSeek 环境变量）。
