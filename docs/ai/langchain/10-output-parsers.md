---
title: LangChain.js 10 · Output Parsers
date: 2026-06-11
isComment: true
categories:
- AI
- LangChain
tags:
- OutputParser
- StructuredOutput
- LangChain
---

# LangChain.js 10 · Output Parsers

> Model 返回的是 **字符串或 Message**；业务往往要 **JSON、枚举、列表**。Output Parser 负责把 LLM 输出解析成类型安全的结构，并可在 Prompt 里注入格式说明。

**系列导航：** [09 Vector Stores](./09-vector-stores.md) · [专系列首页](./README.md) · 下一篇：[11 Callbacks 与 LangSmith](./11-callbacks-langsmith.md)

---

## Parser 在链中的位置

```mermaid
flowchart LR
    P[Prompt] --> M[ChatModel]
    M --> Parser[OutputParser]
    Parser --> T[string / object]
```

Parser 本身也是 **Runnable**：输入 `AIMessage` 或 `string`，输出解析后的类型。

---

## StringOutputParser

最常用：取出文本 content。

```typescript
import { StringOutputParser } from "@langchain/core/output_parsers";

const chain = prompt.pipe(model).pipe(new StringOutputParser());

const text = await chain.invoke({ question: "什么是 LCEL？" });
// string，不是 AIMessage
```

| 行为 | 说明 |
|------|------|
| 输入 | `AIMessage` 或带 `content` 的对象 |
| 输出 | `content` 转 string |
| 流式 | 支持 `stream`，逐 chunk 拼接 |

**使用场景：** RAG 问答链尾；任何只要纯文本的 LCEL。

---

## JsonOutputParser

让模型输出 JSON，再 `JSON.parse`：

```typescript
import { JsonOutputParser } from "@langchain/core/output_parsers";

const parser = new JsonOutputParser<{ title: string; tags: string[] }>();

const formatInstructions = parser.getFormatInstructions();
// 注入 Prompt：「按以下 JSON 格式输出…」

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "提取文章元数据。{format_instructions}"],
    ["human", "{text}"],
]);

const chain = prompt
    .pipe(model)
    .pipe(parser);

const meta = await chain.invoke({
    text: "一篇关于 LangChain 的长文…",
    format_instructions: formatInstructions,
});
```

| API | 说明 |
|-----|------|
| `getFormatInstructions()` | 生成格式说明字符串，塞进 Prompt |
| `parse(text)` | 手动解析 |
| `invoke` / `pipe` | 作为 Runnable |

**底层：** 依赖模型遵守 JSON；复杂结构优先 [02 withStructuredOutput](./02-chat-models.md)。

---

## StructuredOutputParser + Zod

旧式 Zod 字段列表（仍可见于老代码）：

```typescript
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { z } from "zod";

const schema = z.object({
    sentiment: z.enum(["positive", "negative", "neutral"]),
    score: z.number(),
});

const parser = StructuredOutputParser.fromZodSchema(schema);
```

现代路径：**Model 侧** `withStructuredOutput(schema)` 更稳，Parser 侧适合 **非 ChatModel** 或要格式说明进 Prompt 的场景。

---

## 与 withStructuredOutput 怎么选

| 方式 | 优点 | 缺点 |
|------|------|------|
| `withStructuredOutput` | 原生 API、少解析失败 | 绑在 Model 上 |
| `JsonOutputParser` + Prompt | 任意链尾、可换模型 | 模型可能输出非法 JSON |
| `StringOutputParser` | 简单 | 无结构 |

```typescript
// 推荐：Router 分类
const router = model.withStructuredOutput(
    z.object({ intent: z.enum(["search", "chat"]) }),
);
```

---

## XMLOutputParser / 自定义 Parser

```typescript
import { BaseOutputParser } from "@langchain/core/output_parsers";

class LineListParser extends BaseOutputParser<string[]> {
    lc_namespace = ["custom"];

    getFormatInstructions(): string {
        return "每行一条，不要编号。";
    }

    async parse(text: string): Promise<string[]> {
        return text.split("\n").map((s) => s.trim()).filter(Boolean);
    }
}
```

**使用场景：** 固定行格式、Markdown 表格等 Parser 库未覆盖时。

---

## 流式 + Parser

`StringOutputParser` 在 `stream` 时会 **增量拼接** chunk 再 yield 字符串片段。

结构化 JSON **不适合边流边 parse**（不完整 JSON 无法解析）。做法：

1. 流式只展示 `StringOutputParser` 给用户看
2. 结束后对完整串 `JSON.parse`
3. 或用 `withStructuredOutput` 非流式拿结构

---

## 在 Agent 里

Tool 参数由 **bindTools + Zod** 解析，不靠 OutputParser。Parser 用于：

- RAG 链最后一节
- 从模型自由文本抽结构化字段（标题、标签）
- Eval 脚本批量打分

---

## 常见坑

**1. 忘了 `getFormatInstructions` 进 Prompt**  
`JsonOutputParser` 解析失败率高。

**2. 模型输出 markdown 代码块包裹 JSON**  
```json ... ``` 要先 strip 再 parse；或 Prompt 禁止代码块。

**3. 流式解析 JSON**  
半截 JSON parse 报错。

**4. 类型泛型只信 TS**  
运行时仍要 Zod parse 校验。

**5. Parser 链在 Tool Calling Agent 中间**  
会破坏 message 结构；Parser 放链尾或独立链。

---

## 小结

| Parser | 输出 | 场景 |
|--------|------|------|
| `StringOutputParser` | string | 通用文本 |
| `JsonOutputParser` | object | Prompt 约束 JSON |
| `withStructuredOutput` | Zod 类型 | 分类、抽槽 |
| 自定义 `BaseOutputParser` | 任意 | 特殊格式 |

**下一篇：** [11 Callbacks 与 LangSmith](./11-callbacks-langsmith.md)
