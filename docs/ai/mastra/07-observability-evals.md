---
title: Mastra 07 · Observability 与 Scorers
date: 2026-06-11
isComment: true
categories:
- AI
- Mastra
tags:
- Observability
- Scorers
- Mastra
---

# Mastra 07 · Observability 与 Scorers

> 官方产品名是 **Scorers**（`@mastra/evals`），不是泛称「Eval API」。摘自 [Scorers overview](https://mastra.ai/docs/evals/overview)、[Memory — Observability](https://mastra.ai/docs/memory/overview#observability)。

**系列导航：** [06 RAG](./06-rag-vector.md) · [专系列首页](./README.md) · 下一篇：[08 Next.js](./08-nextjs-integration.md)

---

## Observability

配置 `observability` 后可在 Studio **Observability** 页查看 Trace（[Memory overview](https://mastra.ai/docs/memory/overview#observability) 引导至 Tracing 文档）。

| 看什么 | 用途 |
|--------|------|
| LLM span | 延迟、token |
| Tool call | 参数是否合理 |
| Workflow step | 失败 / suspend 停在哪 |
| Memory 载入消息 | 是否串 thread |

生产：采样 + PII 脱敏（[18 Checklist](../18-agent-production-checklist.md)）。

---

## Scorers（官方评测）

安装：

```bash
pnpm add @mastra/evals@latest
```

### 挂到 Agent 上（Live evaluations）

[Scorers overview — Adding scorers to agents](https://mastra.ai/docs/evals/overview#adding-scorers-to-agents)：

```typescript
import { Agent } from '@mastra/core/agent'
import {
  createAnswerRelevancyScorer,
  createToxicityScorer,
} from '@mastra/evals/scorers/prebuilt'

export const evaluatedAgent = new Agent({
  id: 'blog-agent',
  name: 'Blog Agent',
  instructions: '...',
  model: 'openai/gpt-4o-mini',
  scorers: {
    relevancy: {
      scorer: createAnswerRelevancyScorer({ model: 'openai/gpt-5-mini' }),
      sampling: { type: 'ratio', rate: 0.5 },
    },
    safety: {
      scorer: createToxicityScorer({ model: 'openai/gpt-5-mini' }),
      sampling: { type: 'ratio', rate: 1 },
    },
  },
})
```

`sampling.rate`：`1.0` = 全量评分，`0.1` = 10% 采样。结果存入配置的 DB 表 `mastra_scorers`（官方文档）。

### 挂到 Workflow step

```typescript
const contentStep = createStep({
  id: 'content',
  scorers: {
    customStepScorer: {
      scorer: customStepScorer(),
      sampling: { type: 'ratio', rate: 1 },
    },
  },
  // inputSchema, outputSchema, execute...
})
```

### 实例级注册 + Studio

```typescript
const mastra = new Mastra({
  scorers: {
    answerRelevancy: myAnswerRelevancyScorer,
  },
})
```

Studio → Observability / Agent **Evaluate** 页可跑实验、看分数（[Studio 小节](https://mastra.ai/docs/evals/overview#studio)）。

---

## 补充：自建 golden 脚本（非 Mastra 内置）

本站 [blog-assistant eval](../../apps/blog-assistant/eval/golden.json) 用 **`expectContains`** 做冒烟回归，属于 **CI 补充**，与 Scorers 并行：

```typescript
for (const case_ of golden) {
  const res = await agent.generate(case_.question)
  const pass = case_.expectContains.every(s => res.text.includes(s))
}
```

Scorers 适合语义/安全类指标；golden 适合「必须提到某系列名」类硬断言。

---

## 与 LangSmith 对照

| | LangSmith | Mastra Scorers |
|---|-----------|----------------|
| 定位 | 通用 trace + eval 平台 | 框架内置 Scorer + Studio |
| Agent 绑定 | env + 任意框架 | `Agent({ scorers })` / `Mastra({ scorers })` |
| 存储 | 云端 | 自建 storage 表 `mastra_scorers` |

---

## 常见坑

**1. 未配 observability 却想在 Studio 看全量 trace**  
先按 Tracing 文档启用。

**2. 把 Scorers 当唯一门禁**  
关键业务断言仍建议 golden + Scorers 双轨。

**3. `sampling.rate: 1` 在生产全 Agent**  
成本与延迟显著上升，生产常降采样。

---

**上一篇：** [06 RAG](./06-rag-vector.md) · **下一篇：** [08 Next.js](./08-nextjs-integration.md)
