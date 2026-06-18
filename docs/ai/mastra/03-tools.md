---
title: Mastra 03 · Tools 定义与复用
date: 2026-06-11
isComment: true
categories:
- AI
- Mastra
tags:
- Tools
- Mastra
---

# Mastra 03 · Tools 定义与复用

> API 摘自 [createTool() 参考](https://mastra.ai/reference/tools/create-tool)、[Workflows — Agents and tools](https://mastra.ai/docs/workflows/agents-and-tools)。

**系列导航：** [02 Agent API](./02-agents-api.md) · [专系列首页](./README.md) · 下一篇：[04 Workflows](./04-workflows.md)

---

## 定义 Tool：`createTool()`

官方要求使用 **`createTool()`**（`@mastra/core/tools`），不是随意 plain object：

```typescript
import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export const searchBlogTool = createTool({
  id: 'search-blog',
  description:
    '搜索本站技术博客（AI、前端）。用户问本站文章、系列教程时使用。',
  inputSchema: z.object({
    query: z.string().describe('检索关键词'),
  }),
  outputSchema: z.object({
    results: z.array(
      z.object({
        title: z.string(),
        url: z.string(),
        excerpt: z.string(),
      }),
    ),
  }),
  execute: async (inputData, { requestContext }) => {
    const userId = requestContext?.get('user-id')
    // 业务检索逻辑 — 见 06 RAG
    return { results: [] }
  },
})
```

`execute` 签名（[createTool 参考](https://mastra.ai/reference/tools/create-tool)）：

- **第一参数**：校验后的 `inputData`（可直接解构字段，如 `({ city }) =>`）
- **第二参数**（可选）：`{ requestContext, tracingContext, abortSignal, agent, workflow, mcp }`

审批类场景可用 `requireApproval: true`；挂起恢复用 `suspendSchema` / `resumeSchema`（同参考文档 Parameters 表）。

---

## 注册到 Agent

```typescript
import { Agent } from '@mastra/core/agent'

export const blogAgent = new Agent({
  id: 'blog-agent',
  name: 'Blog Agent',
  instructions: '...',
  model: 'openai/gpt-4o-mini',
  tools: { searchBlog: searchBlogTool },
})
```

也可在 `Mastra({ tools: { ... } })` 实例级注册，供多处引用（[Mastra class](https://mastra.ai/reference/core/mastra-class)）。

---

## Workflow 里调用 Tool

官方 [Calling tools](https://mastra.ai/docs/workflows/agents-and-tools#calling-tools)：

```typescript
import { createStep } from '@mastra/core/workflows'
import { searchBlogTool } from '../tools/search-blog'

const retrieveStep = createStep({
  id: 'retrieve',
  inputSchema: z.object({ query: z.string() }),
  outputSchema: z.object({ context: z.string() }),
  execute: async ({ inputData, requestContext }) => {
    const response = await searchBlogTool.execute(
      { query: inputData.query },
      { requestContext },
    )
    return { context: JSON.stringify(response.results) }
  },
})
```

也可 **`createStep(searchBlogTool)`** 把 Tool 直接 compose 为一步（输入须与 tool schema 对齐，必要时用 `.map()` 转换）。

---

## 与 LangChain `tool()` 对照

| | LC 05 `tool()` | Mastra `createTool()` |
|---|----------------|----------------------|
| 定义 | `@langchain/core/tools` | `@mastra/core/tools` |
| Schema | Zod | Standard JSON Schema（Zod 等） |
| 绑定 Agent | `bindTools` | `Agent({ tools: {} })` |
| 请求上下文 | RunnableConfig metadata | `requestContext` 第二参数 |

---

## 常见坑

**1. description 过于笼统**  
模型不知道何时调用；写清数据源与边界。

**2. `execute` 只写一个合并对象参数**  
类型与运行时以官方两参数签名为准。

**3. 返回过长原文**  
Observation 撑爆 context；截断 + 结构化 `outputSchema`。

---

**上一篇：** [02 Agent API](./02-agents-api.md) · **下一篇：** [04 Workflows](./04-workflows.md)
