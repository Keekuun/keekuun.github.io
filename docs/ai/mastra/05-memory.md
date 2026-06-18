---
title: Mastra 05 · Memory 与跨会话上下文
date: 2026-06-11
isComment: true
categories:
- AI
- Mastra
tags:
- Memory
- Mastra
---

# Mastra 05 · Memory 与跨会话上下文

> API 摘自 [Memory overview](https://mastra.ai/docs/memory/overview)、[Agent.generate() — memory](https://mastra.ai/reference/agents/generate)、[PgVector + Memory 示例](https://mastra.ai/reference/vectors/pg)。

**系列导航：** [04 Workflows](./04-workflows.md) · [专系列首页](./README.md) · 下一篇：[06 RAG](./06-rag-vector.md)

---

## Memory 解决什么

[Memory overview](https://mastra.ai/docs/memory/overview)：

> Memory enables your agent to remember user messages, agent replies, and tool results across interactions…

与 **Workflow suspend 快照** 不同：Memory 管对话历史 / working memory / semantic recall；Workflow Storage 管 run 状态。

---

## 配置 Storage + Memory

Quickstart 模式：Storage 挂在 **`Mastra` 实例**：

```typescript
import { Mastra } from '@mastra/core'
import { LibSQLStore } from '@mastra/libsql'
import { Memory } from '@mastra/memory'
import { Agent } from '@mastra/core/agent'

export const mastra = new Mastra({
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: ':memory:',
  }),
})

export const memoryAgent = new Agent({
  id: 'memory-agent',
  name: 'Memory Agent',
  instructions: '...',
  model: 'openai/gpt-4o-mini',
  memory: new Memory({
    options: {
      lastMessages: 20,
    },
  }),
})
```

生产可用 Postgres：`Memory` 也可自带 `storage` / `vector` / `embedder`（见 [PgVector 文档末尾 Agent 示例](https://mastra.ai/reference/vectors/pg)）。

---

## 调用时传入 `memory` 选项

[Memory overview — Message history](https://mastra.ai/docs/memory/overview#message-history) 与 [generate 参考](https://mastra.ai/reference/agents/generate)：

```typescript
await memoryAgent.generate('记住我喜欢的颜色是蓝色', {
  memory: {
    resource: 'user-jeek',      // 用户 / 实体稳定 ID
    thread: 'conversation-abc', // 会话线 ID
  },
})

await memoryAgent.generate('我喜欢什么颜色？', {
  memory: {
    resource: 'user-jeek',
    thread: 'conversation-abc',
  },
})
// 官方示例响应："Your favorite color is blue."
```

| 字段 | 含义（官方） |
|------|----------------|
| `resource` | 用户或实体标识，跨 thread 共享 resource 级记忆 |
| `thread` | 单条会话隔离；**创建后 owner 不可变** |

> 没有 `threadId` / `resourceId` 作为 `generate` 顶层字段；请使用 **`memory: { thread, resource }`**。

`thread` 还可传对象 `{ id, metadata?, title? }`（见 generate 参考 `options.memory.thread`）。

---

## Observational Memory

长对话官方推荐 [Observational Memory](https://mastra.ai/docs/memory/overview#observational-memory)：

```typescript
memory: new Memory({
  options: {
    observationalMemory: true,
  },
})
```

后台压缩历史为 observation，减小 context 占用。

---

## 与 LangGraph checkpointer 对比

| | LG checkpointer | Mastra Memory |
|---|-----------------|---------------|
| 主要用途 | 图 state 每步快照 | 聊天消息与语义回忆 |
| Agent 接入 | `compile({ checkpointer })` | `Agent({ memory })` + `memory` 调用选项 |
| Workflow 暂停 | checkpoint | Workflow Storage + `suspend` |

---

## Next.js 恢复历史

官方 [Next.js 指南 GET Route](https://mastra.ai/guides/getting-started/next-js) 使用 Memory API：

```typescript
const memory = await mastra.getAgentById('weather-agent').getMemory()
const recalled = await memory?.recall({
  threadId: THREAD_ID,
  resourceId: RESOURCE_ID,
})
```

注意：`recall()` 参数名为 `threadId` / `resourceId`，与 `generate({ memory: { thread, resource } })` **命名不同**——以各自 API 参考为准。

---

## 常见坑

**1. 未传 `memory.thread` / `memory.resource`**  
每次调用互不关联，无法「记住上次」。

**2. 同一 `thread` id 换不同 `resource`**  
官方 Warning：会查询报错；勿复用 thread id 给不同用户。

**3. 把 Workflow suspend 当成 Memory**  
审批挂起走 `run.resume()`，不是 Memory 模块。

---

**上一篇：** [04 Workflows](./04-workflows.md) · **下一篇：** [06 RAG](./06-rag-vector.md)
