---
title: LangChain.js 08 · Embeddings
date: 2026-06-11
isComment: true
categories:
- AI
- LangChain
tags:
- Embeddings
- OpenAIEmbeddings
- LangChain
---

# LangChain.js 08 · Embeddings

> Embedding 把文本变成 **固定维度浮点向量**，相似语义距离更近。RAG 检索、聚类、意图粗分都依赖它。

**系列导航：** [07 Splitters](./07-text-splitters.md) · [专系列首页](./README.md) · 下一篇：[09 Vector Stores](./09-vector-stores.md)

---

## Embeddings 接口

所有 Embedding 类实现 `Embeddings` 接口，核心两个方法：

```typescript
interface Embeddings {
    embedDocuments(texts: string[]): Promise<number[][]>;
    embedQuery(text: string): Promise<number[]>;
}
```

| 方法 | 调用时机 | 底层差异（部分模型） |
|------|----------|----------------------|
| `embedDocuments` | 索引批量文档 | 可能走 batch API |
| `embedQuery` | 用户问句 | 部分模型对 query 有专门前缀 |

**使用场景：** 索引脚本调 `embedDocuments`；在线检索先 `embedQuery` 再查向量库。

---

## OpenAIEmbeddings

```typescript
import { OpenAIEmbeddings } from "@langchain/openai";

const embeddings = new OpenAIEmbeddings({
    model: "text-embedding-3-small",
    dimensions: 512, // 3 系列支持降维
    batchSize: 512,
    timeout: 30000,
    apiKey: process.env.OPENAI_API_KEY,
    configuration: { baseURL: process.env.OPENAI_BASE_URL },
});
```

### 常用参数

| 参数 | 说明 |
|------|------|
| `model` | `text-embedding-3-small` / `large` / `ada-002` |
| `dimensions` | 3 系列可指定输出维度（省存储） |
| `batchSize` | 单次 API 文本条数 |
| `stripNewLines` | 是否去掉换行 |
| `timeout` / `maxRetries` | 网络与重试 |

### 调用

```typescript
const vectors = await embeddings.embedDocuments([
    "Runnable 是 LangChain 核心抽象",
    "LangGraph 做图编排",
]);
const queryVec = await embeddings.embedQuery("什么是 pipe？");
```

---

## 维度与模型选型

| 模型 | 维度（默认） | 特点 |
|------|--------------|------|
| `text-embedding-3-small` | 1536 | 便宜、快，博客 RAG 够用 |
| `text-embedding-3-large` | 3072 | 质量更高 |
| `ada-002` | 1536 | 旧版，逐步迁移 3 |

**注意：** 换模型或 `dimensions` 后 **必须重建索引**——新旧向量不可比。

---

## 与 Runnable 组合

```typescript
import { Embeddings } from "@langchain/core/embeddings";

// embedDocuments 内部也是 Runnable
await embeddings.embedDocuments(["a", "b"]);
```

可进 LCEL，但 RAG 索引多在脚本里直接调，不必强行 `pipe`。

---

## 批处理与限流

```typescript
const embeddings = new OpenAIEmbeddings({
    batchSize: 64,
    maxRetries: 3,
});
```

索引几千 chunk 时：

- 调小 `batchSize` + 脚本里 `p-limit` 控制并发
- 失败 chunk 记日志重试，避免整批失败
- 增量索引只 embed 新 chunk

---

## 本地 Embedding（对比 [14 WebAI](../14-webai-and-edge-inference.md)）

```typescript
import { HuggingFaceTransformersEmbeddings } from "@langchain/community/embeddings/huggingface_transformers";
```

浏览器 Worker 里跑与 Node 里跑场景不同；LangChain 集成适合 **服务端** 本地模型。

---

## 缓存

重复文本（相同页脚、模板）可缓存向量：

- 自研 `Map<hash, vector>`
- 或 LangChain `CacheBackedEmbeddings`（社区实现）

**使用场景：** 降低索引成本；注意缓存 key 要含 model 名。

---

## 常见坑

**1. query 和 document 用不同模型**  
检索几乎无效。

**2. 不对空字符串过滤**  
API 报错或零向量。

**3. embed 超长文本**  
超模型输入上限。先 [07 split](./07-text-splitters.md)。

**4. 索引用 embedQuery**  
应用 `embedDocuments`（部分模型有差异）。

**5. 前端直接 embed**  
密钥与体积问题；服务端或 [14 边缘](../14-webai-and-edge-inference.md) 特例。

---

## 小结

| API | 场景 |
|-----|------|
| `embedDocuments` | 建索引 |
| `embedQuery` | 在线检索 |
| `dimensions` | 存储与成本权衡 |

**下一篇：** [09 Vector Stores](./09-vector-stores.md)
