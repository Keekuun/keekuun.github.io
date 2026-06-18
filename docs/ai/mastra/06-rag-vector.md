---
title: Mastra 06 · RAG 与 Vector 检索
date: 2026-06-11
isComment: true
categories:
- AI
- Mastra
tags:
- RAG
- Vector
- Mastra
---

# Mastra 06 · RAG 与 Vector 检索

> 示例摘自 [RAG overview](https://mastra.ai/docs/rag/overview)、[PgVector 参考](https://mastra.ai/reference/vectors/pg)。博客入库编排思路对照本站 [RAG 实战](../rag-blog-knowledge-search.md)。

**系列导航：** [05 Memory](./05-memory.md) · [专系列首页](./README.md) · 下一篇：[07 Observability](./07-observability-evals.md)

---

## 官方 RAG 五步（文档原文结构）

```typescript
import { embedMany } from 'ai'
import { PgVector } from '@mastra/pg'
import { MDocument } from '@mastra/rag'
import { ModelRouterEmbeddingModel } from '@mastra/core/llm'

// 1. 初始化文档
const doc = MDocument.fromText(`Your document text here...`)

// 2. 分块
const chunks = await doc.chunk({
  strategy: 'recursive',
  size: 512,
  overlap: 50,
})

// 3. 生成 embedding
const { embeddings } = await embedMany({
  values: chunks.map(chunk => chunk.text),
  model: new ModelRouterEmbeddingModel('openai/text-embedding-3-small'),
})

// 4. 写入向量库
const pgVector = new PgVector({
  id: 'pg-vector',
  connectionString: process.env.POSTGRES_CONNECTION_STRING!,
})
await pgVector.upsert({
  indexName: 'embeddings',
  vectors: embeddings,
  metadata: chunks.map((chunk, i) => ({ text: chunk.text, ...chunk.metadata })),
})

// 5. 相似度查询
const results = await pgVector.query({
  indexName: 'embeddings',
  queryVector, // 查询文本的 embedding
  topK: 3,
})
```

以上与 [RAG overview Example](https://mastra.ai/docs/rag/overview) 一致；`upsert` 签名为 `vectors: number[][]` + `metadata` 数组，见 [PgVector.upsert()](https://mastra.ai/reference/vectors/pg)。

---

## 注册到 Mastra 实例

向量库可作为 `Mastra` 的 `vectors` 字段注册（[Mastra class](https://mastra.ai/reference/core/mastra-class)）：

```typescript
export const mastra = new Mastra({
  vectors: { pgVector },
  // agents, workflows, storage...
})
```

Agent 侧通过 **Tool** 封装 `pgVector.query()`，或在 Workflow step 里固定检索（[04 Workflows](./04-workflows.md)）。

---

## `PgVector` 要点

| 项 | 官方说明 |
|----|----------|
| 包名 | `@mastra/pg` |
| 构造 | 必须提供 `id`；`connectionString` 或 host/port/database |
| 索引 | 先 `createIndex(indexName, dimension, metric?)` 再 `upsert` |
| 查询 | `query({ indexName, queryVector, topK, filter? })` |

---

## Agentic RAG vs 固定 RAG

| 模式 | Mastra 实现 | 何时用 |
|------|-------------|--------|
| Agentic | Agent + `createTool` 内 `query` | 模型决定何时检索 |
| 固定 | Workflow：`retrieve` step → `answer` step | 每问必检索 |

[11 进阶](../11-advanced-rag-patterns.md) 的 HyDE、多查询等在 Tool `execute` 或额外 Workflow step 实现——Mastra 文档未提供同名 API，属应用层模式。

---

## 与 LangChain RAG 对照

| LangChain | Mastra |
|-----------|--------|
| `Document` + `TextSplitter` | `MDocument` + `.chunk()` |
| `PGVectorStore` | `PgVector`（`@mastra/pg`） |
| LCEL 链 | Workflow `.then()` 或 Agent Tool |

---

## 常见坑

**1. `upsert` 只传 `chunks` 对象**  
官方 API 要 `vectors`（二维数组）与平行 `metadata` 数组。

**2. 未 `createIndex` 就 upsert**  
维度须与 embedding 模型一致。

**3. 混淆 Memory 向量与 RAG 向量**  
Memory 的 `semanticRecall` 用 embedder + vector；站内知识库 RAG 通常独立 index（见 PgVector 文档 Memory 示例与 RAG 示例分工）。

---

**上一篇：** [05 Memory](./05-memory.md) · **下一篇：** [07 Observability](./07-observability-evals.md)
