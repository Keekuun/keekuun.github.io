---
title: LangChain.js 从入门到深入
sidebar: auto
date: 2026-06-11
isComment: true
categories:
- AI
- LangChain
tags:
- LangChain
- TypeScript
- Runnable
---

# LangChain.js 从入门到深入

> 独立于 [Agent 系列 15 篇生态概览](../15-langchain-js-guide.md)：这里按 **LangChain.js 官方 API** 深挖。代码与 import 以 [LangChain.js Docs](https://docs.langchain.com/oss/javascript/langchain/overview) 与 [API Reference](https://reference.langchain.com/javascript) 为准；**LangChain v1** 起 legacy 模块迁入 `@langchain/classic`，文中示例已按 [v1 迁移指南](https://docs.langchain.com/oss/javascript/migrate/langchain-v1) 书写，不编造未文档化的 API。

---

## 这套系列学什么

LangChain.js 不是「又一个 Agent 框架」，而是一套 **Runnable 组合协议** + 一堆 **LLM 周边积木**（Model、Prompt、Document、Embedding、VectorStore、Tool）。

本系列适合：

- 已在 [08 手写 Agent](../08-build-first-agent.md) 跑通，想换框架减胶水
- 做 RAG 时不想手写所有 `fetch` 和分块逻辑
- 需要读懂 LangSmith trace 里每一层在干什么

**与 LangGraph 专系列的关系：** LangChain 管「单步能力」；多步编排、checkpoint 见 [LangGraph 专系列](../langgraph/README.md)。

---

## 学习路线

| 篇 | 链接 | 深挖对象 |
|----|------|----------|
| 01 | [Runnable 与 LCEL](./01-runnable-lcel.md) | `invoke` / `stream` / `pipe`、Runnable 协议 |
| 02 | [Chat Models](./02-chat-models.md) | `ChatOpenAI`、流式、`bindTools` |
| 03 | [Messages 消息体系](./03-messages.md) | `HumanMessage`、`AIMessage`、`tool_calls` |
| 04 | [Prompt Templates](./04-prompt-templates.md) | `ChatPromptTemplate`、变量与 Few-shot |
| 05 | [Tools 与 tool()](./05-tools.md) | Zod Schema、`DynamicStructuredTool` |
| 06 | [Documents 与 Loader](./06-documents.md) | `Document`、加载 Markdown / PDF |
| 07 | [Text Splitters](./07-text-splitters.md) | 分块策略、`chunkSize` / `overlap` |
| 08 | [Embeddings](./08-embeddings.md) | 向量维度、批处理、缓存 |
| 09 | [Vector Stores](./09-vector-stores.md) | `similaritySearch`、Upstash 集成 |
| 10 | [Output Parsers](./10-output-parsers.md) | 结构化输出、JSON 解析 |
| 11 | [Callbacks 与 LangSmith](./11-callbacks-langsmith.md) | Trace、自定义回调 |
| 12 | [Retrievers 检索器](./12-retrievers.md) | `asRetriever`、LCEL RAG、Agentic RAG |
| 13 | [会话历史](./13-message-history.md) | `RunnableWithMessageHistory` |
| 14 | [@langchain/community 集成](./14-community-integrations.md) | 向量库/Loader/Embedding 选型 |
| 15 | [LangSmith Eval](./15-langsmith-eval.md) | Datasets、evaluate、回归 |
| 16 | [Runnable 分支](./16-runnable-branch.md) | `RunnableBranch`、路由链 |

---

## 版本基准与维护

> 读文时先看 **校对日期** 与下表。LangChain **v1** 起大量 API 迁入 `@langchain/classic`；若你仍在 **0.3.x**，import 路径可能与本系列不同。

| 项 | 说明 |
|----|------|
| **专系列校对日期** | 2026-06-11 |
| **编写 API 世代** | LangChain.js **v1**（`langchain` 1.x + `@langchain/core` 1.x） |
| **Node.js** | **22+**（v1 要求，[迁移指南](https://docs.langchain.com/oss/javascript/migrate/langchain-v1)） |
| **本仓库 demo** | [blog-assistant](../../apps/blog-assistant/) 当前为 **0.3.x** 栈，见下表 |

### 校对日 npm 最新（专系列撰写基准 = v1）

| 包 | npm latest | blog-assistant 锁定 |
|----|------------|---------------------|
| `langchain` | 1.4.6 | — |
| `@langchain/core` | 1.2.0 | ^0.3.79 |
| `@langchain/classic` | 1.0.35 | 未使用 |
| `@langchain/openai` | — | ^0.6.16 |

专系列示例按 **v1 + `@langchain/classic`** 书写；跑 demo 时以 `apps/blog-assistant/package.json` 为准，或单独新建 v1 项目跟练。

### 官方文档滞后时怎么查

1. [langchainjs Releases](https://github.com/langchain-ai/langchainjs/releases)
2. [v1 迁移指南](https://docs.langchain.com/oss/javascript/migrate/langchain-v1)
3. [API Reference](https://reference.langchain.com/javascript) — 以 reference 为准

### 维护者更新清单

- [ ] 更新「校对日期」与上表 npm 版本
- [ ] 核对 LC01～16 中 `import` 与已移除 API（如 `loadAndSplit`）
- [ ] 若 demo 升级到 v1，同步 [15 生态篇](../15-langchain-js-guide.md)

---

## 环境与约定

```bash
pnpm add @langchain/core @langchain/openai @langchain/classic langchain zod
# 向量库 / PDF 等第三方集成按需：@langchain/community
```

- 示例默认 **TypeScript + Node.js 22+**（LangChain v1 要求，见 [迁移指南](https://docs.langchain.com/oss/javascript/migrate/langchain-v1)）
- 不在浏览器 bundle 里引 Model 客户端（密钥与体积）
- 升级时对照 [langchainjs Releases](https://github.com/langchain-ai/langchainjs/releases)

**官方入口：** [LangChain.js](https://docs.langchain.com/oss/javascript/langchain/overview) · [Runnable 概念](https://docs.langchain.com/oss/javascript/langchain/runtime) · [Integrations](https://docs.langchain.com/oss/javascript/integrations/providers/overview)

---

## 与 Agent 系列交叉阅读

| 想做的事 | Agent 系列 | 本专系列 |
|----------|------------|----------|
| 要不要引入 LangChain | [15 生态选型](../15-langchain-js-guide.md) | 01 Runnable 起 |
| 图编排、checkpoint | [16 LangGraph 实战](../16-langgraphjs-practice.md) | [LangGraph 专系列](../langgraph/README.md) |
| 自研 Tool 对照 | [09 Tools](../09-tools-system-design.md) | 05 Tools |
| RAG 策略 | [11 RAG 进阶](../11-advanced-rag-patterns.md) | 06～09、12 Retriever |
| 上线 Eval / 路由 | — | 15 Eval、16 Branch |

**返回主线：** [AI Agent 系列总索引](../README.md) · [完整路线图](../ai-agent-learning-roadmap.md)
