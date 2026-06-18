# 博客 AI 助手（blog-assistant）

[19 收官实战](../../docs/ai/19-blog-ai-assistant-capstone.md) 配套应用：LangGraph ReAct Agent + 本站博客向量检索 + SSE 流式 UI。

## 能力

| 模式 | 说明 |
|------|------|
| **Agent** | `search_blog` + `search_wikipedia`，checkpoint 多轮 |
| **RAG** | 固定检索链 + 流式回答 |
| **阶段 3** | Neon Postgres checkpoint、Cookie 会话、LangSmith、Eval |
| **阶段 4** | 多会话侧栏、引用跳转、悬浮 widget |

## 本地开发

### 零配置预览 UI（推荐先试）

```bash
pnpm install              # 仓库根目录，只需一次
pnpm blog-assistant:dev   # http://localhost:3010
```

**不用创建 `.env.local`**。开发模式下缺少 `DEEPSEEK_API_KEY` 会自动进入 **演示模式**：页面、侧栏、模拟 Tool 步骤、引用卡片、流式打字机都能体验。

### 接入真实 AI

```bash
cp .env.example .env.local   # 至少填 DEEPSEEK + Upstash Vector + Embedding
pnpm blog-assistant:index
pnpm blog-assistant:dev
```

## 环境变量

见 `.env.example`。生产建议配置：

| 变量 | 用途 |
|------|------|
| `DATABASE_URL` | Neon Postgres（checkpoint + `assistant_threads` 表） |
| `LANGCHAIN_*` | LangSmith Trace |
| `UPSTASH_*` | Vector 检索 + 可选 Redis 限流 |

未配置 `DATABASE_URL` 时自动降级为 `MemorySaver` + 浏览器 localStorage 会话列表。

## API

| 路径 | 说明 |
|------|------|
| `POST /api/agent/chat` | Agent SSE（`message`, `threadId`） |
| `GET /api/agent/chat?threadId=` | 从 checkpoint 恢复消息 |
| `GET /api/agent/threads` | 会话列表（需 `DATABASE_URL`） |
| `DELETE /api/agent/threads` | 删除会话记录 |
| `POST /api/rag/chat` | RAG SSE（`query`） |

SSE 事件：`meta` · `token` · `tool_start` / `tool_end` · `citations` · `done` · `error`

## Eval（golden 10 条）

```bash
pnpm blog-assistant:dev   # 另开终端
pnpm blog-assistant:eval  # 默认 http://localhost:3010，阈值 80%
```

用例在 `eval/golden.json`，可用 `EVAL_BASE_URL`、`EVAL_PASS_THRESHOLD` 覆盖。

## 嵌入博客（阶段 4）

部署后，在 VuePress 或任意页面加入：

```html
<script
  src="https://你的助手域名/embed.js"
  data-base="https://你的助手域名"
  data-position="right"
  defer
></script>
```

iframe 目标：`/widget`（精简 UI）。

## Vercel 部署

1. 新建项目，Root Directory = `apps/blog-assistant`
2. 配置环境变量（与 `.env.example` 一致）
3. `vercel.json` 已设 `maxDuration: 60`、`runtime: nodejs`

## 目录

```
app/api/agent/     chat + threads
components/agent-chat/
lib/agent/         graph、tools、checkpointer
lib/db/            pool、threads 表
eval/golden.json
scripts/run-eval.mjs
public/embed.js
```
