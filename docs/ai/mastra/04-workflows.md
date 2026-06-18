---
title: Mastra 04 · Workflows：createStep 与 suspend
date: 2026-06-11
isComment: true
categories:
- AI
- Mastra
tags:
- Workflow
- Mastra
---

# Mastra 04 · Workflows：createStep 与 suspend

> API 摘自 [Workflows overview](https://mastra.ai/docs/workflows/overview)、[Suspend & resume](https://mastra.ai/docs/workflows/suspend-and-resume)、[Agents and tools in workflows](https://mastra.ai/docs/workflows/agents-and-tools)。

**系列导航：** [03 Tools](./03-tools.md) · [专系列首页](./README.md) · 下一篇：[05 Memory](./05-memory.md)

---

## 最小 Workflow

```typescript
import { createWorkflow, createStep } from '@mastra/core/workflows'
import { z } from 'zod'

const retrieveStep = createStep({
  id: 'retrieve',
  inputSchema: z.object({ question: z.string() }),
  outputSchema: z.object({ context: z.string() }),
  execute: async ({ inputData }) => {
    const chunks = await searchBlog(inputData.question)
    return { context: formatChunks(chunks) }
  },
})

const answerStep = createStep({
  id: 'answer',
  inputSchema: z.object({ question: z.string(), context: z.string() }),
  outputSchema: z.object({ answer: z.string() }),
  execute: async ({ inputData, mastra }) => {
    // 官方 Workflow 示例：step 内用 mastra.getAgent(注册 key)
    const agent = mastra.getAgent('blogAgent')
    const res = await agent.generate(
      `参考：\n${inputData.context}\n\n问题：${inputData.question}`,
    )
    return { answer: res.text }
  },
})

export const ragWorkflow = createWorkflow({
  id: 'rag-workflow',
  inputSchema: z.object({ question: z.string() }),
  outputSchema: z.object({ answer: z.string() }),
})
  .then(retrieveStep)
  .then(answerStep)
  .commit()
```

注册与引用：

```typescript
export const mastra = new Mastra({
  workflows: { ragWorkflow },
})

const workflow = mastra.getWorkflow('ragWorkflow') // 注册 key，非 id 字段
```

---

## 运行 Workflow

官方两种模式（[Running workflows](https://mastra.ai/docs/workflows/overview#running-workflows)）：

### `.start()` — 等全部跑完

```typescript
const run = await workflow.createRun()
const result = await run.start({
  inputData: { question: 'RAG 是什么？' },
})

if (result.status === 'success') {
  console.log(result.result)
}
```

`result.status` 还可能为 `failed` | `suspended` | `tripwire` | `paused`（见官方 Result 表）。

### `.stream()` — 进度事件

```typescript
const run = await workflow.createRun()
const stream = run.stream({
  inputData: { question: 'RAG 是什么？' },
})

for await (const chunk of stream.fullStream) {
  console.log(chunk)
}

const result = await stream.result
```

> 注意：没有 `workflow.run()` / `workflow.stream()` 顶层方法；须 **`createRun()`** 再 `.start()` 或 `.stream()`。

---

## suspend 与 resume

官方 [Suspend & resume](https://mastra.ai/docs/workflows/suspend-and-resume) 模式：定义 **`resumeSchema`**，在 `execute` 里读 `resumeData`，条件不满足时 **`return await suspend({})`**。

```typescript
const approveStep = createStep({
  id: 'approve',
  inputSchema: z.object({ userEmail: z.string() }),
  outputSchema: z.object({ output: z.string() }),
  resumeSchema: z.object({ approved: z.boolean() }),
  execute: async ({ inputData, resumeData, suspend }) => {
    const { userEmail } = inputData
    const { approved } = resumeData ?? {}

    if (!approved) {
      return await suspend({})
    }

    return { output: `Email sent to ${userEmail}` }
  },
})
```

恢复：

```typescript
const run = await workflow.createRun()
await run.start({ inputData: { userEmail: 'alex@example.com' } })

await run.resume({
  step: 'approve', // 或传入 step 对象
  resumeData: { approved: true },
})
```

挂起状态保存在配置的 **Storage** 中，跨重启可恢复（官方 Suspend 文档首段）。

---

## 与 LangGraph 对照

| LangGraph | Mastra Workflow |
|-----------|-----------------|
| `StateGraph` | `createWorkflow` + `.then()` |
| `interrupt_before` | `suspend()` + `run.resume()` |
| `streamEvents` | `run.stream().fullStream` |
| `checkpointer` | Workflow Storage / snapshot |

---

## 常见坑

**1. Step 的 input/output schema 未对齐**  
`.then()` 链要求上一步 `outputSchema` 与下一步 `inputSchema` 匹配（可用 `.map()` 转换，见 Agents and tools 文档）。

**2. 用 `getWorkflow` 时传 workflow 的 `id` 字符串**  
应用注册 key（`ragWorkflow`），类型推断才完整。

**3. suspend 未配 `resumeSchema`**  
`resumeData` 无类型约束，恢复端易传错字段。

---

**上一篇：** [03 Tools](./03-tools.md) · **下一篇：** [05 Memory](./05-memory.md)
