---
title: Mastra.js 从入门到深入
sidebar: auto
date: 2026-06-11
isComment: true
categories:
- AI
- Mastra
tags:
- Mastra
- TypeScript
- Agent
---

# Mastra.js 从入门到深入

> 独立于 [Agent 系列 27 篇生态速览](../27-mastra-typescript-agent-framework.md)：这里按 **Mastra 官方 API** 颗粒度深挖。代码与参数以 [Mastra Docs](https://mastra.ai/docs) 与 [Reference](https://mastra.ai/reference) 为准；博客侧仅做选型对照与场景说明，**不编造未在文档出现的 API**。

---

## 这套系列学什么

Mastra 是 **TypeScript 原生** 的 Agent 框架，不是 LangChain 的语法糖。它把：

- **Agent**（开放域 ReAct）
- **Workflow**（确定多步 + suspend）
- **Scorers**（`@mastra/evals`，官方称 Scorers 非泛称 Eval）

收进同一套 `Mastra` 实例。

本系列适合：

- 读完 [27 三角对照](../27-mastra-typescript-agent-framework.md)，决定技术选型或做 POC
- 已有 [08 手写 Agent](../08-build-first-agent.md)，想对比「框架版」边界
- 不想拼 LangChain + LangSmith + 自研 Eval 脚本

**与 LangChain / LangGraph 专系列：** LC/LG 讲 Runnable 与图 API；Mastra 讲 **另一套一体化 API**。三者可对照读，不必二选一。

---

## 学习路线

| 篇 | 链接 | 深挖对象 |
|----|------|----------|
| 01 | [Mastra 实例与 Studio](./01-mastra-instance-and-studio.md) | 项目结构、`Mastra` 注册、本地调试 |
| 02 | [Agent API](./02-agents-api.md) | `generate` / `stream`、Model Router |
| 03 | [Tools](./03-tools.md) | Tool 定义、Agent 与 Workflow 复用 |
| 04 | [Workflows](./04-workflows.md) | `createStep`、`suspend`、流式 |
| 05 | [Memory](./05-memory.md) | 跨会话记忆、与 checkpoint 区别 |
| 06 | [RAG 与 Vector](./06-rag-vector.md) | 检索管道、博客知识库对接 |
| 07 | [Observability 与 Scorers](./07-observability-evals.md) | Trace、Studio、回归评测 |
| 08 | [Next.js 集成与部署](./08-nextjs-integration.md) | Route、流式 UI、Vercel |

---

## 版本基准与维护

> 框架 API 会变。读文时先看 **校对日期** 与下表；你本地 major 版本更新后，以官方文档为准，勿盲信旧示例。

| 项 | 说明 |
|----|------|
| **专系列校对日期** | 2026-06-11 |
| **编写 API 世代** | Mastra **1.x**（`@mastra/core` 等） |
| **Node.js** | `v22.13.0+`（[官方要求](https://mastra.ai/docs/deployment/overview)） |
| **本仓库代码** | 暂无 `apps/*` Mastra 实现；[blog-assistant](../../apps/blog-assistant/) 为 LangGraph 栈 |

### 校对日 npm 最新（`npm view <pkg> version`）

| 包 | 版本 |
|----|------|
| `@mastra/core` | 1.43.0 |

安装模板常用 `@latest`，实际以你项目 `package.json` 为准。

### 官方文档滞后时怎么查

1. [Mastra Releases](https://github.com/mastra-ai/mastra/releases) — breaking changes
2. [mastra.ai/docs](https://mastra.ai/docs) — 以线上文档为准
3. 专系列校对日期 **早于** 你安装的 **major** 大版本 → 先读官方 Changelog 再对照本系列

### 维护者更新清单（发版或大版本后）

- [ ] 更新上表「校对日期」与 npm 版本
- [ ] 核对 MS01～08 中带 `import` 的代码块
- [ ] 同步 [27 生态速览](../27-mastra-typescript-agent-framework.md) 三角表

---

## 环境与约定

```bash
# 新建项目（官方 Quickstart）
pnpm create mastra@latest

# 已有 Next.js 等项目嵌入
npx mastra@latest init
```

- 运行时：**Node.js `v22.13.0+`**（见 [Deployment overview](https://mastra.ai/docs/deployment/overview)）
- Model 密钥仅服务端；`model: 'openai/gpt-4o-mini'` 为 Model Router 字符串格式
- API 随版本演进，升级请对照 [GitHub Releases](https://github.com/mastra-ai/mastra/releases)

**官方入口：** [Docs](https://mastra.ai/docs) · [Agents](https://mastra.ai/docs/agents/overview) · [Workflows](https://mastra.ai/docs/workflows/overview) · [Memory](https://mastra.ai/docs/memory/overview) · [RAG](https://mastra.ai/docs/rag/overview) · [Scorers](https://mastra.ai/docs/evals/overview) · [CLI](https://mastra.ai/reference/cli/mastra)

---

## 与 Agent 系列交叉阅读

| 想做的事 | Agent 系列 | 本专系列 |
|----------|------------|----------|
| 三角选型 LC / SDK / Mastra | [27 速览](../27-mastra-typescript-agent-framework.md) | 01 起 |
| 对照 LangGraph 图 | [16 LG 实战](../16-langgraphjs-practice.md) | 04 Workflows |
| 对照 LCEL 链 | [LC 01 Runnable](../langchain/01-runnable-lcel.md) | 04 + 06 |
| Chat UI | [17 UI](../17-build-production-chatbot-ui.md)、[20 SDK](../20-vercel-ai-sdk-guide.md) | 08 |
| 上线清单 | [18 Checklist](../18-agent-production-checklist.md) | 07 Scorers |
| 博客助手架构 | [19 收官](../19-blog-ai-assistant-capstone.md) | 06 RAG + 08 部署 |

**返回主线：** [AI Agent 系列总索引](../README.md) · [完整路线图](../ai-agent-learning-roadmap.md)
