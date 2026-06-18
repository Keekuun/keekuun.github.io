---
title: LangGraph.js 从入门到深入
sidebar: auto
date: 2026-06-11
isComment: true
categories:
- AI
- LangGraph
tags:
- LangGraph
- StateGraph
- Agent
---

# LangGraph.js 从入门到深入

> 独立于 [Agent 系列 16 篇实战概览](../16-langgraphjs-practice.md)：这里按 **LangGraph.js 官方图 API** 深挖。代码以 [LangGraph.js Docs](https://docs.langchain.com/oss/javascript/langgraph/overview) 与 [API Reference](https://langchain-ai.github.io/langgraphjs/reference/) 为准，不编造未文档化的 API。

---

## 这套系列学什么

LangGraph.js 在 LangChain 的 Message / Model / Tool 之上，提供 **有状态图编排**：

- 把 Agent 每一步变成 **节点**
- 用 **边** 表达固定跳转或条件分支
- 用 **Checkpoint** 持久化 State，支持断点续跑与人机协同

本系列适合：

- [08 的 `for` 循环](../08-build-first-agent.md#第四步实现-react-循环) 里 `if` 越来越多
- [12 Multi-Agent](../12-multi-agent-systems.md) 概念已读，需要 API 级落地
- 要在 Next.js 里接 `streamEvents` 做 Chatbot UI

**前置：** 建议先读 [LangChain 01 Runnable](../langchain/01-runnable-lcel.md) 与 [02 Chat Models](../langchain/02-chat-models.md)。

---

## 学习路线

| 篇 | 链接 | 深挖对象 |
|----|------|----------|
| 01 | [State 与 Annotation](./01-state-and-annotation.md) | reducer、默认值、State/Update 类型 |
| 02 | [StateGraph API](./02-stategraph-api.md) | `addNode` / `addEdge` / `compile` |
| 03 | [条件边与路由](./03-conditional-edges.md) | `addConditionalEdges`、Router 模式 |
| 04 | [ReAct 与 ToolNode](./04-react-toolnode.md) | 手写 ReAct 图；`createReactAgent`（**已弃用**，见该文） |
| 05 | [Checkpoint 与持久化](./05-checkpointer.md) | `MemorySaver`、`thread_id` |
| 06 | [流式与 streamEvents](./06-streaming.md) | SSE、事件类型、前端对接 |
| 07 | [子图与多 Agent](./07-subgraphs.md) | 嵌套图、Supervisor |
| 08 | [人机协同 interrupt](./08-human-in-the-loop.md) | 暂停、审批、续跑 |
| 09 | [生产级 Checkpointer](./09-production-checkpointer.md) | Postgres、Redis、运维 |
| 10 | [Command 动态路由](./10-command-api.md) | `Command.goto`、handoff |
| 11 | [调试与时间旅行](./11-debugging-time-travel.md) | `getStateHistory`、回滚 |
| 12 | [完整 Route 示例](./12-full-route-example.md) | Next.js SSE、Chatbot 骨架 |
| 13 | [Redis / Neon 部署](./13-redis-neon-deployment.md) | 生产 checklist |

---

## 版本基准与维护

> 读文时先看 **校对日期**。专系列按 **LangGraph.js 1.x** 文档撰写；本仓库 demo 可能仍锁定 **0.4.x**，部分 API 名与 import 略有差异。

| 项 | 说明 |
|----|------|
| **专系列校对日期** | 2026-06-11 |
| **编写 API 世代** | LangGraph.js **1.x**（`@langchain/langgraph` 1.x） |
| **Node.js** | 与 LangChain v1 一致建议 **22+** |
| **本仓库 demo** | [blog-assistant](../../apps/blog-assistant/)：`@langchain/langgraph` **^0.4.9** |

### 校对日 npm 最新（专系列撰写基准）

| 包 | npm latest | blog-assistant 锁定 |
|----|------------|---------------------|
| `@langchain/langgraph` | 1.4.4 | ^0.4.9 |
| `@langchain/langgraph-checkpoint-postgres` | — | ^0.1.2 |

跟练专系列建议新建项目安装 **1.x**；对照收官 demo 时以 demo 的 `package.json` 为准。

### 官方文档滞后时怎么查

1. [LangGraph.js overview](https://docs.langchain.com/oss/javascript/langgraph/overview)
2. [langgraphjs Releases](https://github.com/langchain-ai/langgraphjs/releases)
3. `createReactAgent` 等：**以 Reference 弃用标注为准**（见 [LG04](./04-react-toolnode.md)）

### 维护者更新清单

- [ ] 更新「校对日期」与 npm 版本
- [ ] 核对 LG01～13 与 [12 Route 示例](./12-full-route-example.md)
- [ ] demo 升级 1.x 后同步 [16 实战篇](../16-langgraphjs-practice.md)

---

## 环境与约定

```bash
pnpm add @langchain/langgraph @langchain/core @langchain/openai
# 生产 checkpointer 按需：@langchain/langgraph-checkpoint-postgres 等
```

- 图编译与 `invoke` **只在服务端**执行
- `thread_id` 与前端 `conversationId` 同一概念（Chatbot UI 篇会展开）
- 生产环境勿长期使用内存 `MemorySaver`

**官方入口：** [LangGraph overview](https://docs.langchain.com/oss/javascript/langgraph/overview) · [Graph API](https://docs.langchain.com/oss/javascript/langgraph/graph-api) · [Persistence](https://docs.langchain.com/oss/javascript/langgraph/persistence) · [Streaming](https://docs.langchain.com/oss/javascript/langgraph/streaming)

---

## 与 Agent 系列交叉阅读

| 想做的事 | Agent 系列 | 本专系列 |
|----------|------------|----------|
| 何时上图 vs 手写循环 | [16 概览](../16-langgraphjs-practice.md) | 01～02 起 |
| Multi-Agent 模式 | [12 多智能体](../12-multi-agent-systems.md) | 07 子图 |
| Memory 与 checkpoint 区别 | [10 Memory](../10-memory-planning-agent.md)、[13 进阶](../13-advanced-memory.md) | 05、09 生产 Checkpointer |
| LangChain Tool 定义 | [LangChain 05 Tools](../langchain/05-tools.md) | 04 ToolNode |
| 生产部署 | — | 12 Route、13 Neon/Redis |

**返回主线：** [AI Agent 系列总索引](../README.md) · [完整路线图](../ai-agent-learning-roadmap.md)
