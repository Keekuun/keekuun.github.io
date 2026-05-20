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
pnpm index
```

## 3. GitHub Actions Secrets

| Secret | 说明 |
|--------|------|
| `UPSTASH_VECTOR_REST_URL` | Upstash REST URL |
| `UPSTASH_VECTOR_REST_TOKEN` | Upstash Token |
| `SILICONFLOW_API_KEY` | Embedding（或 `EMBEDDING_API_KEY`） |
| `DEEPSEEK_API_KEY` | 可选，仅检索站对话需要 |

`master` 上 `docs/**` 变更时运行 `.github/workflows/rag-index.yml`。

## 4. 检索站点

见 `apps/kb-search/README.md`（Vercel 部署 + DeepSeek 环境变量）。
