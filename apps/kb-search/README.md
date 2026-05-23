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
| `KB_SEARCH_PASSWORD` | 可选；设后 **AI 总结必须带密码**，语义检索可走访客日限额 |
| `KB_ANONYMOUS_DAILY_SEARCH_LIMIT` | 设密码时默认 `3`（次/天/IP）；`0` 表示访客完全不能检索 |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | 可选；多实例部署时用于准确限流，不配则用进程内计数（Vercel 上略宽松） |

### 访问策略（设了 `KB_SEARCH_PASSWORD` 时）

| 能力 | 无密码访客 | 填写正确密码 |
|------|------------|--------------|
| 语义检索 `/api/search` | 每日限额（默认 3 次） | 不限 |
| AI 总结 `/api/chat` | 拒绝 | 允许 |

访客检索仍消耗硅基流动 Embedding + Upstash 查询；AI 总结额外消耗 DeepSeek token。

## 部署

1. Vercel 导入仓库，**Root Directory** = `apps/kb-search`  
2. 填入上表变量 → Deploy  
3. 可选绑定 `ask.zkkysqs.top`

## 本地

需要 **Node.js ≥ 20.9**（Next.js 16 要求）。仓库内 `apps/kb-search/.nvmrc` 为 `22`。

```bash
cd apps/kb-search
cp .env.example .env.local
pnpm install && pnpm dev
```

索引需先执行，见 `tools/rag/README.md`。
