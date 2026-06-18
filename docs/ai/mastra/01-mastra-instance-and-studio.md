---
title: Mastra 01 · Mastra 实例与 Studio
date: 2026-06-11
isComment: true
categories:
- AI
- Mastra
tags:
- Mastra
- Studio
---

# Mastra 01 · Mastra 实例与 Studio

> 一切从 **`Mastra` 根实例** 开始：注册 Agent、Workflow、Storage；本地用 **`mastra dev`** 启动 Studio + REST API。下文 API 摘自 [Mastra class](https://mastra.ai/reference/core/mastra-class)、[Agents overview](https://mastra.ai/docs/agents/overview)、[Studio](https://mastra.ai/docs/studio/overview)。

**系列导航：** [Mastra 专系列首页](./README.md) · 下一篇：[02 Agent API](./02-agents-api.md)

---

## 项目结构（典型）

`create mastra` 或 `mastra init` 后常见布局：

```
src/mastra/
  index.ts           # export const mastra = new Mastra({...})
  agents/
    blog-agent.ts
  workflows/
    ingest-workflow.ts
  tools/
    search-blog.ts
```

| 目录 | 职责 |
|------|------|
| `index.ts` | **唯一** `Mastra` 单例，汇总 agents / workflows / storage 等 |
| `agents/` | `Agent` 定义（instructions、model、tools） |
| `workflows/` | `createWorkflow` 链 |
| `tools/` | `createTool()` 定义，供 Agent / Workflow 复用 |

---

## 创建 Mastra 实例

官方示例（含 `storage`、`logger`）：

```typescript
import { Mastra } from '@mastra/core'
import { LibSQLStore } from '@mastra/libsql'
import { blogAgent } from './agents/blog-agent'
import { ragWorkflow } from './workflows/rag-workflow'

export const mastra = new Mastra({
  workflows: { ragWorkflow },
  agents: { blogAgent },
  storage: new LibSQLStore({
    id: 'mastra-storage',
    url: ':memory:',
  }),
})
```

`Mastra` 构造函数还可注册 `vectors`、`scorers`、`observability` 等，见 [Mastra class 参数表](https://mastra.ai/reference/core/mastra-class)。

### 为什么要经 `Mastra` 实例调用

[Agents overview](https://mastra.ai/docs/agents/overview) 明确建议：

> When referencing an agent from your Mastra instance, use `mastra.getAgentById()` to ensure it has access to shared services such as instance-level storage, logging, and agent registry.

| 做法 | 结果 |
|------|------|
| 直接 `import { blogAgent }` 并调用 | 能跑，但**拿不到**实例级 storage / logger / registry |
| `mastra.getAgentById('blog-agent')` | 挂接共享服务，Studio / Client 可发现 |

**Workflow 同理：** 优先 `mastra.getWorkflow('ragWorkflow')`（注册时的 **key**），见 [Workflows — Referencing a workflow](https://mastra.ai/docs/workflows/overview#referencing-a-workflow)。

### `getAgent` vs `getAgentById`

| 方法 | 查找依据 | 典型场景 |
|------|----------|----------|
| `getAgentById('blog-agent')` | Agent 的 **`id` 字段** | Route、脚本按稳定 id 调用 |
| `getAgent('blogAgent')` | `Mastra({ agents: { blogAgent } })` 的 **注册 key** | Workflow step 内调用（[官方示例](https://mastra.ai/docs/workflows/agents-and-tools#calling-agents)） |

二者不要混用：注册 key 是 `blogAgent`，`id` 可以是 `'blog-agent'`。

---

## Agent 最小注册

```typescript
import { Agent } from '@mastra/core/agent'

export const blogAgent = new Agent({
  id: 'blog-agent',
  name: 'Blog Agent',
  instructions: '你是本站技术博客助手。',
  model: 'openai/gpt-4o-mini', // provider/model，Model Router 格式
})
```

注册：

```typescript
export const mastra = new Mastra({
  agents: { blogAgent },
})
```

---

## Mastra Studio 与 CLI

[Studio overview](https://mastra.ai/docs/studio/overview)：`mastra dev` 同时启动 **Studio UI** 与 **REST API**（默认 `http://localhost:4111`，Swagger 在 `/swagger-ui`）。

```bash
# 模板项目常用 npm run dev；也可直接：
npx mastra dev
```

| Studio 能力 | 官方说明 |
|-------------|----------|
| Agent 对话调试 | Agents 页签 |
| Workflow 图 + 输入表单 | Workflows 页签，按 `inputSchema` 生成表单 |
| Time travel | Workflow 跑完后可重放单步（[Workflows overview — Studio](https://mastra.ai/docs/workflows/overview#studio)） |
| Observability | Trace / Scorer 结果（需配置 observability） |

与 Next.js 并存时，若共用 LibSQL 文件库，storage 的 `url` 建议用**绝对路径**，避免 `next dev` 与 `mastra dev` 工作目录不同导致库文件不一致（见 [Next.js 指南](https://mastra.ai/guides/getting-started/next-js)）。

---

## 与 LangChain 初始化对比

| LangChain | Mastra |
|-----------|--------|
| 无全局实例 | **`new Mastra({ agents, workflows, storage })`** |
| LCEL `pipe` | Agent / Workflow 注册 + `getAgentById` / `getWorkflow` |
| LangSmith 另配 env | `observability` + Studio |

---

## 常见坑

**1. Serverless 里多个 `new Mastra()`**  
模块级单例，避免重复 init storage。

**2. 把注册 key 传给 `getAgentById`**  
`getAgentById` 只认 Agent 的 **`id` 属性**，不是 `agents: { blogAgent }` 的 key。

**3. Studio 调通 ≠ 生产就绪**  
仍要走 [18 Checklist](../18-agent-production-checklist.md)。

---

**下一篇：** [02 Agent API](./02-agents-api.md) · **专系列：** [README](./README.md)
