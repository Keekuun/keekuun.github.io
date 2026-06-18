---
title: LangChain.js 02 · Chat Models
date: 2026-06-11
isComment: true
categories:
- AI
- LangChain
tags:
- ChatOpenAI
- LLM
- LangChain
---

# LangChain.js 02 · Chat Models

> Model 是 Runnable 链里最常见的一环。这篇以 `ChatOpenAI` 为主（OpenAI 兼容 API 通用），把 **构造参数、invoke/stream、bindTools、结构化输出** 逐项拆开。

**系列导航：** [01 Runnable](./01-runnable-lcel.md) · [专系列首页](./README.md) · 下一篇：[03 Messages](./03-messages.md)

---

## ChatModel vs LLM

| 类型 | 输入 | 典型类 |
|------|------|--------|
| **ChatModel** | `BaseMessage[]` 或消息对象 | `ChatOpenAI`、`ChatAnthropic` |
| **LLM**（旧） | 纯字符串 | `OpenAI`（逐步少用） |

现代应用几乎都用 **ChatModel**——因为 Tool Calling、多轮对话、System Prompt 都基于消息数组。

```mermaid
flowchart LR
    Messages[BaseMessage 数组] --> CM[ChatModel]
    CM --> AIMsg[AIMessage]
    AIMsg --> TC[可选 tool_calls]
```

---

## 安装与实例化

```bash
pnpm add @langchain/openai @langchain/core
```

```typescript
import { ChatOpenAI } from "@langchain/openai";

const model = new ChatOpenAI({
    model: "gpt-4o-mini",
    temperature: 0,
    apiKey: process.env.OPENAI_API_KEY,
    configuration: {
        baseURL: process.env.OPENAI_BASE_URL, // 兼容网关 / 国产 API
    },
});
```

### 构造参数说明

| 参数 | 类型 | 默认 | 说明 | 使用场景 |
|------|------|------|------|----------|
| `model` | `string` | — | 模型 ID | 选型：`mini` 便宜快，`gpt-4o` 质量高 |
| `temperature` | `number` | `1` | 随机性 0～2 | **0** 事实问答/RAG；**0.7+** 创意写作 |
| `maxTokens` | `number` | 模型上限 | 单次最大生成 token | 控制成本、防长篇废话 |
| `topP` | `number` | `1` | 核采样 | 与 temperature 一般只调一个 |
| `frequencyPenalty` | `number` | `0` | 重复惩罚 | 长文防复读 |
| `presencePenalty` | `number` | `0` | 新话题惩罚 | 对话多样性 |
| `timeout` | `number` | — | 请求超时 ms | Serverless 必设 |
| `maxRetries` | `number` | `6` | 失败重试 | 网络抖动；注意幂等 |
| `apiKey` | `string` | 环境变量 | API 密钥 | 勿写进前端 |
| `configuration.baseURL` | `string` | OpenAI 官方 | 兼容端点 | 代理、Azure、国内中转 |
| `streaming` | `boolean` | `false` | 构造时默认流式 | 常与 `stream()` 配合 |

**底层：** `ChatOpenAI` 继承 `BaseChatModel`，内部把 `BaseMessage[]` 转成 OpenAI Chat Completions JSON，再解析回 `AIMessage`。

---

## `invoke` — 单次调用

```typescript
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const response = await model.invoke([
    new SystemMessage("只回答技术问题，简洁"),
    new HumanMessage("什么是 Embedding？"),
]);

console.log(response.content);
// string 或 多模态 content 数组

console.log(response.usage_metadata);
// { input_tokens, output_tokens, total_tokens }（视提供商支持）
```

| 返回字段 | 说明 |
|----------|------|
| `content` | 文本或多模态块 |
| `tool_calls` | 模型请求调用的 Tool 列表 |
| `response_metadata` | 原始 API 元数据（finish_reason 等） |
| `usage_metadata` | Token 统计，成本核算用 |

**使用场景：** 后台批处理、不需要流式的 API。

---

## `stream` — 流式

```typescript
const stream = await model.stream([
    new HumanMessage("用三句话介绍 TypeScript"),
]);

let full = "";
for await (const chunk of stream) {
    const delta = chunk.content as string;
    full += delta;
    // 推给 SSE / WebSocket
}
```

**底层行为：**

1. HTTP 请求带 `stream: true`
2. 每个 chunk 是 **partial AIMessage**，`content` 多为增量字符串
3. 最后一个 chunk 可能带 `usage_metadata`（取决于提供商）

| 参数 | 说明 |
|------|------|
| `stream` 第二参数 `options` | 同 RunnableConfig，可挂 callbacks |

**使用场景：** Chatbot UI；长报告边生成边展示。

---

## `bindTools` — 挂载 Tool Calling

```typescript
import { tool } from "@langchain/core/tools";
import { z } from "zod";

const getWeather = tool(
    async ({ city }) => `${city}：晴 25°C`,
    {
        name: "get_weather",
        description: "查询城市天气",
        schema: z.object({ city: z.string() }),
    },
);

const modelWithTools = model.bindTools([getWeather]);

const ai = await modelWithTools.invoke([
    new HumanMessage("北京天气怎么样？"),
]);

if (ai.tool_calls?.length) {
    for (const call of ai.tool_calls) {
        console.log(call.name, call.args);
        // get_weather { city: "北京" }
    }
}
```

### `bindTools` 参数

| 参数 | 说明 |
|------|------|
| `tools` | `StructuredToolInterface[]` 或 OpenAI 格式 schema |
| `tool_choice` | `"auto"` / `"none"` / `"required"` / 指定工具名 | 强制或禁止 Tool |

**底层：**

1. LangChain 把 Tool 的 name、description、JSON Schema 写入请求 `tools` 字段
2. 模型返回 `tool_calls` 而非纯文本（或两者兼有）
3. **不会自动执行 Tool**——执行由 Agent 循环或 `ToolNode`（LangGraph 专系列 04 篇）负责

**使用场景：** ReAct Agent、函数调用型助手；与 [09 自研 Tool](../09-tools-system-design.md) 同一业务模型。

---

## `withStructuredOutput` — 结构化 JSON

```typescript
import { z } from "zod";

const schema = z.object({
    intent: z.enum(["search", "chat", "code"]),
    confidence: z.number(),
});

const router = model.withStructuredOutput(schema);

const result = await router.invoke("帮我查一下 React 19 新特性");
// { intent: "search", confidence: 0.92 }
```

| 参数 | 说明 |
|------|------|
| `schema` | Zod schema 或 JSON Schema |
| `name` | 可选，structured output 名称 |
| `method` | `"jsonSchema"` / `"functionCalling"` 等 | 依模型能力选择 |

**底层：** 优先用模型原生 Structured Output；否则 fallback 到 function calling + 解析。

**使用场景：** Router 意图分类；从用户话里抽槽位（日期、订单号）。

---

## 兼容 OpenAI 的国产 / 自建 API

```typescript
const model = new ChatOpenAI({
    model: "deepseek-chat",
    apiKey: process.env.DEEPSEEK_API_KEY,
    configuration: {
        baseURL: "https://api.deepseek.com/v1",
    },
});
```

**注意：**

- `tool_calls`、`stream`、`usage` 是否完整取决于网关实现
- 上线前用 golden 用例测：`invoke`、`stream`、`bindTools` 三条路径

---

## 与 Runnable 链组合

```typescript
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "你是博客助手"],
    ["human", "{input}"],
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

await chain.invoke({ input: "总结 Runnable" });
```

Model 作为 Runnable 中间段，自动参与 LangSmith trace 树。

---

## 常见坑

**1. `temperature` 和 `topP` 同时拉满**  
输出不稳定。RAG 问答固定 `temperature: 0`。

**2. 没设 `timeout`**  
Serverless 10s 杀进程，客户端一直等。`timeout: 8000` + 前端 Abort。

**3. 以为 `bindTools` 会执行 Tool**  
只返回 `tool_calls`；执行要另写循环或 LangGraph。

**4. `maxTokens` 太小**  
Tool 参数 JSON 被截断，解析失败。Tool 多的 Agent 适当加大。

**5. 流式 chunk 当完整 message 存库**  
应累积 `content` 或存最终 `invoke` 结果；chunk 可能为空字符串。

---

## 小结

| API | 何时用 |
|-----|--------|
| `new ChatOpenAI({...})` | 配置模型与网关 |
| `invoke` | 一次性完整回复 |
| `stream` | Chatbot 流式 |
| `bindTools` | Agent / Tool Calling |
| `withStructuredOutput` | 分类、抽结构化字段 |

**上一篇：** [01 Runnable](./01-runnable-lcel.md) · **专系列：** [README](./README.md)
