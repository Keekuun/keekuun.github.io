---
title: Mastra 02 · Agent API：generate 与 stream
date: 2026-06-11
isComment: true
categories:
- AI
- Mastra
tags:
- Agent
- Streaming
---

# Mastra 02 · Agent API：generate 与 stream

> API 摘自 [Agents overview](https://mastra.ai/docs/agents/overview)、[Agent.generate()](https://mastra.ai/reference/agents/generate)、[Agent.stream()](https://mastra.ai/reference/streaming/agents/stream)、[MastraModelOutput](https://mastra.ai/reference/streaming/agents/MastraModelOutput)。

**系列导航：** [01 实例与 Studio](./01-mastra-instance-and-studio.md) · [专系列首页](./README.md) · 下一篇：[03 Tools](./03-tools.md)

---

## 何时用 Agent

[Agents overview](https://mastra.ai/docs/agents/overview)：

> Use agents when the task is open-ended and the steps aren't known in advance. … For predetermined, multi-step processes with explicit control flow, use workflows instead.

| 用 Agent | 用 Workflow |
|----------|-------------|
| 步骤事先未知 | 步骤事先定义 |
| 模型选 Tool | 你定每步调什么 |
| 开放问答 | 审批、ETL、固定 RAG 链 |

---

## generate：一次性结果

```typescript
const agent = mastra.getAgentById('blog-agent')
const response = await agent.generate('11 篇 RAG 进阶讲什么？')

console.log(response.text)
// 官方文档：还包含 toolCalls、toolResults、steps、usage
```

[generate 参考](https://mastra.ai/reference/agents/generate) 常用选项：

| 选项 | 说明 |
|------|------|
| `maxSteps` | Tool 循环上限，**默认 5** |
| `memory: { thread, resource }` | 多轮记忆（见 [05](./05-memory.md)） |
| `requestContext` | 请求级上下文（见下文） |
| `modelSettings` | `temperature`、`maxOutputTokens` 等 |

---

## stream：流式文本

```typescript
const stream = await agent.stream('LangGraph checkpoint 怎么用？')

for await (const chunk of stream.textStream) {
  process.stdout.write(chunk)
}

// 流结束后 resolve：toolCalls、toolResults、steps、usage
// 另有 fullStream、getFullOutput() — 见 MastraModelOutput 参考
```

| 字段 | 用途 |
|------|------|
| `textStream` | 纯文本增量 |
| `fullStream` | 含 tool call、reasoning 等全部 chunk 类型 |
| `getFullOutput()` | 一次拿齐 text / usage / steps |

---

## 与 Vercel AI SDK 官方接法

Mastra 提供 **`@mastra/ai-sdk`**，不必手写 SSE 解析。官方 [Agent.stream()](https://mastra.ai/reference/streaming/agents/stream) 示例：

```typescript
import { createUIMessageStreamResponse } from 'ai'
import { toAISdkStream } from '@mastra/ai-sdk'

const stream = await agent.stream('Tell me a story')
return createUIMessageStreamResponse({
  stream: toAISdkStream(stream, { from: 'agent' }),
})
```

Next.js 完整 Route 见 [Next.js 指南](https://mastra.ai/guides/getting-started/next-js) 的 `handleChatStream`（[08](./08-nextjs-integration.md)）。

---

## RequestContext（非 RunnableConfig 字面对象）

[Request context 文档](https://mastra.ai/docs/server/request-context)：`RequestContext` 是 **`new RequestContext()` + `.set()`**，不是普通 `{ userId: '...' }` 对象。

```typescript
import { RequestContext } from '@mastra/core/request-context'

const requestContext = new RequestContext()
requestContext.set('user-id', 'u-1')

await agent.generate('你好', { requestContext })
```

Tool / Agent 的 `instructions` 动态函数里用 `requestContext.get('user-id')` 读取。可配合 `requestContextSchema`（Zod）做运行时校验。

---

## 与 LangGraph ReAct 对比

| LangGraph | Mastra Agent |
|-----------|--------------|
| 自建 `ToolNode` + 条件边 | 内置 Tool 循环（`maxSteps`） |
| `streamEvents` | `stream` / `fullStream` |
| `checkpointer` | Memory + Storage（[05](./05-memory.md)） |

---

## 常见坑

**1. Client Component 里 `getAgentById`**  
Agent 仅服务端。

**2. V1 模型误用 `.stream()`**  
官方说明：V1 模型应使用 `.streamLegacy()`，否则会报错。

**3. 开放域任务硬写 Workflow**  
多 Tool 分支用 Agent；固定流水线用 Workflow。

---

**上一篇：** [01 实例与 Studio](./01-mastra-instance-and-studio.md) · **下一篇：** [03 Tools](./03-tools.md)
