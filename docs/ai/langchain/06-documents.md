---
title: LangChain.js 06 · Documents 与 Loader
date: 2026-06-11
isComment: true
categories:
- AI
- LangChain
tags:
- Document
- Loader
- LangChain
---

# LangChain.js 06 · Documents 与 Loader

> RAG 索引的输入不是「整文件字符串」，而是 **`Document` 对象列表**——正文 + 元数据。Loader 负责从文件、URL、数据库读出 Document。

**系列导航：** [05 Tools](./05-tools.md) · [专系列首页](./README.md) · 下一篇：[07 Text Splitters](./07-text-splitters.md)

---

## Document 结构

```typescript
import { Document } from "@langchain/core/documents";

const doc = new Document({
    pageContent: "## Runnable\n\nRunnable 是可组合…",
    metadata: {
        source: "docs/ai/langchain/01-runnable-lcel.md",
        title: "Runnable 与 LCEL",
        chunk: 0,
    },
});
```

| 字段 | 说明 | 使用场景 |
|------|------|----------|
| `pageContent` | 正文，参与 Embedding | 检索匹配的主体 |
| `metadata` | 任意 JSON 可序列化对象 | 过滤、展示来源、回链 |

**底层：** VectorStore 通常把 `pageContent` 向量化；`metadata` 原样存入向量库 payload（Upstash/Pinecone 等）。

---

## 手动构建（博客 / CI 索引）

对齐 [RAG 博客实战](../rag-blog-knowledge-search.md)：

```typescript
import fs from "node:fs/promises";
import path from "node:path";

async function loadMarkdownDocs(dir: string): Promise<Document[]> {
    const files = await fs.readdir(dir);
    const docs: Document[] = [];

    for (const file of files) {
        if (!file.endsWith(".md")) continue;
        const full = path.join(dir, file);
        const text = await fs.readFile(full, "utf-8");
        docs.push(new Document({
            pageContent: text,
            metadata: { source: full, type: "markdown" },
        }));
    }
    return docs;
}
```

**使用场景：** 完全可控的 CI 索引脚本；与自研逻辑无缝，无需 Loader 库。

---

## TextLoader / DirectoryLoader

```typescript
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";

const loader = new TextLoader("data/notes.txt");
const docs = await loader.load();

const dirLoader = new DirectoryLoader("./docs/ai", {
    ".md": (p) => new TextLoader(p),
});
const all = await dirLoader.load();
```

| Loader | 说明 |
|--------|------|
| `TextLoader` | 单文件纯文本 |
| `DirectoryLoader` | 目录 + 扩展名映射 |
| `@langchain/community` | PDF、Notion、Cheerio 等 |

```typescript
// PDF 示例（需 @langchain/community）
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
const pdfDocs = await new PDFLoader("paper.pdf").load();
```

---

## metadata 设计建议

| 字段 | 用途 |
|------|------|
| `source` | 文件路径或 URL，答案引用 |
| `title` | UI 展示 |
| `section` | 按章节过滤检索 |
| `updatedAt` | 增量索引 |
| `acl` / `tenantId` | 多租户过滤 |

```typescript
await vectorStore.similaritySearch(query, 5, {
    filter: { tenantId: "team-a" },
});
```

**使用场景：** 企业 Wiki 按部门可见性检索（见 [11 RAG 进阶](../11-advanced-rag-patterns.md) 权限）。

---

## 加载后分块

LangChain v1 已移除 `BaseDocumentLoader.loadAndSplit`（[迁移指南](https://docs.langchain.com/oss/javascript/migrate/langchain-v1)）。应 **先 `load()` 再 `splitDocuments()`**：

```typescript
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 512, chunkOverlap: 64 });
const docs = await dirLoader.load();
const chunks = await splitter.splitDocuments(docs);
```

详见 [07 篇](./07-text-splitters.md)。

---

## 与向量库索引

```typescript
await vectorStore.addDocuments(chunks);
```

`addDocuments` 会对每个 Document 的 `pageContent` 调 Embedding（见 [08](./08-embeddings.md)、[09](./09-vector-stores.md)）。

---

## 常见坑

**1. 整本书一个 Document 不 split**  
向量语义模糊，检索差。必须 [07 分块](./07-text-splitters.md)。

**2. metadata 存超大对象**  
向量库 payload 限制；只存必要字段。

**3. source 用相对路径**  
部署环境不一致。用 repo 内统一相对根或 URL。

**4. 忽略编码**  
非 UTF-8 文件先转码。

**5. 在线 Loader 抓网页不清洗**  
导航栏噪声进索引。Cheerio 提取正文区。

---

## 小结

| 概念 | 作用 |
|------|------|
| `Document` | 正文 + metadata |
| Loader | 文件 → Document[] |
| `load` + `splitDocuments` | 加载 + 分块（v1 推荐，替代已移除的 `loadAndSplit`） |

**下一篇：** [07 Text Splitters](./07-text-splitters.md)
