---
title: Mastra 08 · Next.js 集成与部署
date: 2026-06-11
isComment: true
categories:
- AI
- Mastra
tags:
- Next.js
- Deployment
- Mastra
---

# Mastra 08 · Next.js 集成与部署

> Route 示例摘自 [Next.js 指南](https://mastra.ai/guides/getting-started/next-js)、[Deployment overview](https://mastra.ai/docs/deployment/overview)。对照本站 [blog-assistant](../../apps/blog-assistant/) 与 [20 AI SDK](../20-vercel-ai-sdk-guide.md)。

**系列导航：** [07 Observability](./07-observability-evals.md) · [专系列首页](./README.md)

---

## 官方推荐：嵌入 Next.js

1. `npx mastra@latest init` 生成 `src/mastra/`
2. 安装 `@mastra/ai-sdk`、`ai`、`@ai-sdk/react`
3. Route 用 **`handleChatStream`**，而非手写解析 Mastra 流

### POST — 流式聊天

```typescript
// src/app/api/chat/route.ts
import { handleChatStream } from '@mastra/ai-sdk'
import { createUIMessageStreamResponse } from 'ai'
import { mastra } from '@/mastra'

const THREAD_ID = 'example-thread'
const RESOURCE_ID = 'blog-user'

export async function POST(req: Request) {
  const params = await req.json()
  const stream = await handleChatStream({
    mastra,
    agentId: 'blog-agent', // Agent 的 id 字段
    params: {
      ...params,
      memory: {
        ...params.memory,
        thread: THREAD_ID,
        resource: RESOURCE_ID,
      },
    },
  })
  return createUIMessageStreamResponse({ stream })
}
```

### GET — 从 Memory 恢复历史

```typescript
import { toAISdkV5Messages } from '@mastra/ai-sdk/ui'
import { mastra } from '@/mastra'
import { NextResponse } from 'next/server'

export async function GET() {
  const memory = await mastra.getAgentById('blog-agent').getMemory()
  const recalled = await memory?.recall({
    threadId: THREAD_ID,
    resourceId: RESOURCE_ID,
  })
  const uiMessages = toAISdkV5Messages(recalled?.messages || [])
  return NextResponse.json(uiMessages)
}
```

前端用 `useChat` + `DefaultChatTransport`（指南全文含 AI Elements 示例）。

---

## 备选：手写 SSE（非官方默认路径）

若要与 blog-assistant 自研 `AgentChat` 事件格式对齐，可自行遍历 `agent.stream().textStream` 写 SSE——这是**应用层适配**，官方 Next 指南走 `@mastra/ai-sdk`。

```typescript
const stream = await agent.stream(message, {
  memory: { thread: threadId, resource: userId },
})
for await (const chunk of stream.textStream) {
  // 写入 SSE...
}
```

Tool 事件可用 `fullStream` 或流结束后的 `toolCalls` promise（[MastraModelOutput](https://mastra.ai/reference/streaming/agents/MastraModelOutput)）。

---

## 部署

[Deployment overview](https://mastra.ai/docs/deployment/overview) 选项：

| 方式 | 说明 |
|------|------|
| **嵌入 Web 框架** | Mastra 随 Next.js 一起部署（本指南） |
| **Mastra server** | `mastra build` → `mastra start`，独立 Hono 服务 |
| **Vercel 等** | 可选 `@mastra/deployer-vercel` 等 deployer |

要求：**Node.js `v22.13.0+`**（或 Bun / Deno / Cloudflare，见同页 Runtime support）。

Next on Vercel：`maxDuration`、服务端环境变量存放 Provider Key；**勿** `NEXT_PUBLIC_*` 暴露密钥。

---

## 与 blog-assistant 并存

当前收官 demo 为 LangGraph 实现；Mastra POC 可作为 **平行 API 路径**（`/api/chat` vs 自研 `/api/agent/chat`），UI 层优先复用官方 AI SDK 适配以降低维护成本。

---

## 常见坑

**1. `agentId` 写成注册 key**  
`handleChatStream` 的 `agentId` 对应 Agent **`id` 字段**（指南示例 `'weather-agent'`）。

**2. LibSQL 相对路径**  
`next dev` 与 `mastra dev` cwd 不同会导致库文件不一致；storage `url` 用绝对路径（Next.js 指南 Note）。

**3. 混用 `memory.thread` 与 `recall({ threadId })`**  
两套 API 命名不同，按各自文档传参。

---

**上一篇：** [07 Observability](./07-observability-evals.md) · **专系列：** [README](./README.md) · **主线：** [AI 系列索引](../README.md)
