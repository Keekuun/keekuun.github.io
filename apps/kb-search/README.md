# 博客知识库检索站（Vercel + Upstash + DeepSeek）

与 GitHub Pages 博客分离部署。检索向量来自硅基流动 Embedding，**AI 总结**使用 DeepSeek。

## Vercel 环境变量

| 变量 | 说明 |
|------|------|
| `UPSTASH_VECTOR_REST_URL` | 与索引相同 |
| `UPSTASH_VECTOR_REST_TOKEN` | 与索引相同 |
| `DEEPSEEK_API_KEY` | [DeepSeek 平台](https://platform.deepseek.com) API Key |
| `DEEPSEEK_CHAT_MODEL` | 默认 `deepseek-chat` |
| `SILICONFLOW_API_KEY` | 查询向量（与索引相同） |
| `EMBEDDING_MODEL` | 默认 `BAAI/bge-m3`（1024 维，须与 Upstash Index 一致） |
| `NEXT_PUBLIC_BLOG_BASE_URL` | `https://blog.zkkysqs.top` |
| `KB_SEARCH_PASSWORD` | 可选，私人访问密码 |

## 部署

1. Vercel 导入仓库，**Root Directory** = `apps/kb-search`  
2. 填入上表变量 → Deploy  
3. 可选绑定 `ask.zkkysqs.top`

## 本地

```bash
cd apps/kb-search
cp .env.example .env.local
pnpm install && pnpm dev
```

索引需先执行，见 `tools/rag/README.md`。
