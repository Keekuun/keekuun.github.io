---
title: LangChain.js 14 · @langchain/community 集成选型
date: 2026-06-11
isComment: true
categories:
- AI
- LangChain
tags:
- community
- Integrations
- LangChain
---

# LangChain.js 14 · @langchain/community 集成选型

> 核心包装 `@langchain/core` + `@langchain/openai`；**海量第三方**（向量库、Loader、Embedding、Tool）在 `@langchain/community`。这篇按场景列常用集成、装包方式与和自研的取舍。

**系列导航：** [13 会话历史](./13-message-history.md) · [专系列首页](./README.md)

---

## 包结构速查

| 包 | 内容 |
|----|------|
| `@langchain/core` | Runnable、Message、基础接口 |
| `@langchain/openai` | OpenAI Chat、Embedding |
| `@langchain/anthropic` | Claude |
| `@langchain/classic` | Loader、Retriever、部分 VectorStore 等 legacy 模块（v1 从 `langchain/*` 迁入） |
| `@langchain/community` | 第三方集成大合集 |
| `@langchain/textsplitters` | Splitter（部分版本独立包） |
| `@langchain/langgraph` | 图编排 |

```bash
pnpm add @langchain/community
# 按需：社区包可能拉大量可选依赖，尽量精确 import 路径
```

**tree-shaking：** 用子路径 import，避免 `import everything`。

---

## 向量库集成

| 集成类 | 场景 | 专系列 |
|--------|------|--------|
| `UpstashVectorStore` | Serverless、博客 RAG | [09](./09-vector-stores.md) |
| `PineconeStore` | 托管向量、大规模 | 09 |
| `SupabaseVectorStore` | 已有 Supabase 栈 | — |
| `MemoryVectorStore` | 本地开发 | 09 |

```typescript
import { PineconeStore } from "@langchain/community/vectorstores/pinecone";
```

**选型：** 已有云厂商栈优先其集成；否则 Upstash/Pinecone 二选一看运维偏好。

---

## Document Loader

| Loader | 输入 |
|--------|------|
| `PDFLoader` | PDF 文件 |
| `CheerioWebBaseLoader` | 网页 HTML |
| `NotionAPILoader` | Notion |
| `GithubRepoLoader` | 仓库文件 |

```typescript
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

const webDocs = await new CheerioWebBaseLoader("https://example.com/docs").load();
```

见 [06 Documents](./06-documents.md)。**网页**务必清洗正文区，防导航噪声进索引。

---

## Embedding 集成

| 类 | 场景 |
|----|------|
| `OpenAIEmbeddings` | 默认云端（`@langchain/openai`） |
| `HuggingFaceTransformersEmbeddings` | 本地/私有化 |
| `OllamaEmbeddings` | 本地 Ollama |

```typescript
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
```

见 [08 Embeddings](./08-embeddings.md)、[14 WebAI](../14-webai-and-edge-inference.md)。

---

## Tool 集成示例

| Tool | 用途 |
|------|------|
| `WikipediaQueryRun` | 维基百科 |
| `SerpAPI` / 搜索类 | 联网搜索 |
| `DallEAPIWrapper` | 生图（多模态扩展） |

```typescript
import { WikipediaQueryRun } from "@langchain/community/tools/wikipedia_query_run";

const wiki = new WikipediaQueryRun({
    topKResults: 1,
    maxDocContentLength: 3000,
});
```

生产搜索 Tool 更常接 **自有 API + [05 tool()](./05-tools.md)**，便于鉴权与限流。

---

## ChatModel 除 OpenAI 外

```typescript
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { ChatAnthropic } from "@langchain/anthropic";
```

与 [02 Chat Models](./02-chat-models.md) 同一套 `invoke` / `stream` / `bindTools`（能力取决于模型）。

---

## 何时用 community、何时自研

| 用 community | 用自研 |
|--------------|--------|
| 标准 Loader/VectorStore，快速 POC | CI 索引脚本极简、要完全可控 |
| 团队不熟某 API 官方封装 | 已有成熟内部 SDK |
| 要跟 LangSmith trace 一致 | 集成质量差或长期不维护的 Loader |

[15 选型表](../15-langchain-js-guide.md) 总览；community **减胶水**，不替代 [11 RAG 策略](../11-advanced-rag-patterns.md)。

---

## 依赖与体积

- `@langchain/community` 元包大；只 import 用到的子模块
- 部分 Loader 依赖原生模块（pdf、crypto），Serverless 要测冷启动
- 锁定版本，与 `@langchain/core` 对齐

---

## 常见坑

**1. 整包 import**  
bundle/安装体积暴涨。

**2. 不读集成文档的环境变量**  
Pinecone/Upstash key 名各不同。

**3. 假设所有 Loader 流式**  
大 PDF 一次读入内存。

**4. 社区集成无人维护**  
看 npm 下载与 GitHub issue；关键路径可自研 wrapper。

**5. 混用不同 major 的 core**  
类型与 runtime 异常。

---

## 小结

| 类别 | community 典型入口 |
|------|-------------------|
| 向量库 | `vectorstores/*` |
| Loader | `document_loaders/*` |
| Embedding | `embeddings/*` |
| Tool | `tools/*` |
| ChatModel | `chat_models/*` |

**上一篇：** [13 会话历史](./13-message-history.md) · **专系列：** [README](./README.md) · **下一篇：** [15 LangSmith Eval](./15-langsmith-eval.md)
