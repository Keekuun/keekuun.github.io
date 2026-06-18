---
title: LangChain.js 09 · Vector Stores
date: 2026-06-11
isComment: true
categories:
- AI
- LangChain
tags:
- VectorStore
- RAG
- LangChain
---

# LangChain.js 09 · Vector Stores

> 向量库负责 **存向量 + metadata** 并做 **相似度检索**。LangChain 用统一接口包 Upstash、Pinecone、内存库等，换后端时业务代码改动小。

**系列导航：** [08 Embeddings](./08-embeddings.md) · [专系列首页](./README.md) · 下一篇：[10 Output Parsers](./10-output-parsers.md)

**对照：** [RAG 博客实战](../rag-blog-knowledge-search.md) · [11 RAG 进阶](../11-advanced-rag-patterns.md)

---

## 核心 API

```typescript
interface VectorStore {
    addDocuments(documents: Document[]): Promise<string[] | void>;
    similaritySearch(query: string, k?: number, filter?: object): Promise<Document[]>;
    similaritySearchWithScore(query: string, k?: number): Promise<[Document, number][]>;
    asRetriever(k?: number): VectorStoreRetriever;
}
```

| 方法 | 说明 |
|------|------|
| `addDocuments` | 自动 embed `pageContent` 后写入 |
| `similaritySearch` | 返回 top-k `Document` |
| `similaritySearchWithScore` | 带距离/分数，便于阈值过滤 |
| `asRetriever` | 转成 Retriever 接 LCEL / Agent Tool |

---

## Upstash Vector 示例

```typescript
import { UpstashVectorStore } from "@langchain/community/vectorstores/upstash";
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({ model: "text-embedding-3-small" });

const vectorStore = await UpstashVectorStore.fromExistingIndex(embeddings, {
    url: process.env.UPSTASH_VECTOR_REST_URL!,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN!,
});

// 索引
const ids = await vectorStore.addDocuments(chunks);

// 检索
const hits = await vectorStore.similaritySearch("ReAct 怎么写", 5);
```

### fromDocuments vs fromExistingIndex

| 工厂方法 | 场景 |
|----------|------|
| `fromDocuments(docs, embeddings, opts)` | 新建索引并写入 |
| `fromExistingIndex(embeddings, opts)` | 连已有索引，在线检索 |
| `fromTexts(texts, metadatas, embeddings)` | 快速 POC |

---

## similaritySearch 参数

```typescript
await vectorStore.similaritySearch(
    "用户问题",
    5, // k
    { tenantId: "team-a" }, // filter，依向量库能力
);
```

| 参数 | 说明 |
|------|------|
| `query` | 自然语言问句（内部 `embedQuery`） |
| `k` | 返回条数，常 3～10 |
| `filter` | metadata 过滤（多租户、章节） |

**使用场景：** k 太小漏召回；太大噪声多——用 [11 重排](../11-advanced-rag-patterns.md) 二次筛选。

---

## 分数阈值

```typescript
const withScore = await vectorStore.similaritySearchWithScore(query, 10);
const filtered = withScore.filter(([_, score]) => score > 0.75);
```

分数含义 **因库而异**（余弦、点积）。要在自己数据上标定阈值。

---

## asRetriever 接 LCEL

```typescript
const retriever = vectorStore.asRetriever({ k: 4 });

const ragChain = RunnableSequence.from([
    {
        context: retriever.pipe(formatDocs),
        question: new RunnablePassthrough(),
    },
    prompt,
    model,
    parser,
]);
```

`Retriever` 是 `invoke(query) => Document[]` 的 Runnable——Agent 可把检索封装成 Tool 或直接用链。

---

## MemoryVectorStore（开发）

```typescript
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";

const store = await MemoryVectorStore.fromDocuments(chunks, embeddings);
```

**仅开发/单测**；生产用 Upstash / Pinecone / pgvector。

---

## 增量与删除

依具体 VectorStore 实现：

```typescript
// 部分实现支持
await vectorStore.delete({ ids: ["id1", "id2"] });
```

博客索引 CI 常见策略：**全量重建** 或按 `source` 删旧再 `addDocuments`。

---

## 与自研向量脚本对照

| | 自研 fetch Upstash | LangChain VectorStore |
|--|-------------------|------------------------|
| embed | 手写 batch | `addDocuments` 内置 |
| 检索 | 手写 REST | `similaritySearch` |
| 换库 | 改 REST 封装 | 换 `VectorStore` 类 |
| 可控性 | 完全 | 依赖集成质量 |

[15 生态篇](../15-langchain-js-guide.md) 建议：胶水多时用 LangChain；CI 索引逻辑简单可自研。

---

## 常见坑

**1. 索引与查询 embedding 模型不一致**  
召回随机。

**2. metadata filter 字段未索引**  
过滤不生效或报错。查向量库文档。

**3. k=1 上线**  
召回不足。至少 4～5，配合重排。

**4. pageContent 过大仍写入**  
单向量质量差。先 [07 split](./07-text-splitters.md)。

**5. 把向量库当会话记忆**  
向量库是 **知识**；对话历史用 checkpoint / DB（[10](../10-memory-planning-agent.md)）。

---

## 小结

| API | 场景 |
|-----|------|
| `addDocuments` | 建索引 |
| `similaritySearch` | 在线检索 |
| `similaritySearchWithScore` | 阈值过滤 |
| `asRetriever` | 接 LCEL / RAG 链 |

**上一篇：** [09 Vector Stores](./09-vector-stores.md) · **专系列：** [README](./README.md)
