---
title: LangChain.js 13 · 会话历史与 RunnableWithMessageHistory
date: 2026-06-11
isComment: true
categories:
- AI
- LangChain
tags:
- MessageHistory
- Session
- LangChain
---

# LangChain.js 13 · 会话历史与 RunnableWithMessageHistory

> 多轮聊天要把 **历史 messages** 自动塞进链，而不是每次手写数组。LangChain 用 **ChatMessageHistory** + **RunnableWithMessageHistory** 管读写；生产里常和 LangGraph **checkpoint** 分工协作。

**系列导航：** [12 Retrievers](./12-retrievers.md) · [专系列首页](./README.md) · 下一篇：[14 Community 集成](./14-community-integrations.md)

**对照：** [10 Memory](../10-memory-planning-agent.md) · [LangGraph 05 Checkpoint](../langgraph/05-checkpointer.md)

---

## 三层「记忆」别混

| 层 | 机制 | 存什么 |
|----|------|--------|
| 会话历史 | ChatMessageHistory / DB | 用户可见多轮 messages |
| LangGraph Checkpoint | checkpointer | 整图 State + 执行位置 |
| 长期记忆 | 向量库 / profile | 跨会话偏好（[13 进阶](../13-advanced-memory.md)） |

本篇讲 **第一层**；Agent 图状态见 LangGraph 专系列。

---

## InMemoryChatMessageHistory

```typescript
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";

const history = new InMemoryChatMessageHistory();
await history.addMessage(new HumanMessage("我叫 Jeek"));
await history.addMessage(new AIMessage("你好 Jeek！"));

const messages = await history.getMessages();
```

| 方法 | 说明 |
|------|------|
| `addMessage` / `addUserMessage` | 追加 |
| `getMessages` | 返回副本 |
| `clear` | 清空会话 |

**仅开发/单测**；重启丢失。

---

## RunnableWithMessageHistory

把任意「吃 messages 输出 messages/文本」的链包一层，自动 **读历史 → 调链 → 写回历史**：

```typescript
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";

const prompt = ChatPromptTemplate.fromMessages([
    ["system", "你是助手"],
    new MessagesPlaceholder("history"),
    ["human", "{input}"],
]);

const chain = prompt.pipe(model).pipe(new StringOutputParser());

const sessionHistories = new Map<string, InMemoryChatMessageHistory>();

const chainWithHistory = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: async (sessionId) => {
        if (!sessionHistories.has(sessionId)) {
            sessionHistories.set(sessionId, new InMemoryChatMessageHistory());
        }
        return sessionHistories.get(sessionId)!;
    },
    inputMessagesKey: "input",
    historyMessagesKey: "history",
});

await chainWithHistory.invoke(
    { input: "我叫什么？" },
    { configurable: { sessionId: "user-1-session-a" } },
);
```

### 关键参数

| 参数 | 说明 |
|------|------|
| `runnable` | 内层链 |
| `getMessageHistory` | `sessionId → ChatMessageHistory` |
| `inputMessagesKey` | 当前用户输入字段名 |
| `historyMessagesKey` | Prompt 里 `MessagesPlaceholder` 对应 key |
| `configurable.sessionId` | **必填**，会话隔离键 |

**底层流程：**

1. 用 `sessionId` 取 history
2. `getMessages()` 填入 `history` 变量
3. `invoke` 内层链
4. 把本轮 Human/AI 写入 history

---

## 持久化到数据库

```typescript
// 概念：用自定义 ChatMessageHistory 接 Postgres
class PostgresChatMessageHistory extends BaseChatMessageHistory {
    constructor(private sessionId: string) { super(); }

    async getMessages(): Promise<BaseMessage[]> {
        const rows = await db.query("SELECT ... WHERE session_id = $1", [this.sessionId]);
        return mapStoredMessagesToChatMessages(rows);
    }

    async addMessage(message: BaseMessage): Promise<void> {
        await db.insert(...);
    }
}

getMessageHistory: async (sessionId) => new PostgresChatMessageHistory(sessionId),
```

**使用场景：** 普通 Chatbot（无复杂 Agent 图）；表结构简单：`session_id, role, content, created_at`。

---

## 与 LangGraph checkpoint 怎么选

| 场景 | 建议 |
|------|------|
| 纯聊天链，无 Tool 循环 | `RunnableWithMessageHistory` |
| ReAct / 多节点 / interrupt | LangGraph + checkpointer |
| 既要图又要长期会话 | checkpoint 管 State；DB 只存用户可见消息做展示 |

同一 `sessionId` / `thread_id` 可对齐，但 **存储内容不同**——不要只存 UI 消息却指望恢复 Tool 中间态。

---

## 历史过长：裁剪策略

```typescript
async function getTrimmedHistory(sessionId: string) {
    const h = await getHistory(sessionId);
    const all = await h.getMessages();
    if (all.length <= 20) return h;
    const trimmed = new InMemoryChatMessageHistory();
    for (const m of all.slice(-20)) await trimmed.addMessage(m);
    return trimmed;
}
```

或：摘要旧消息为一条 `SystemMessage`（[10 压缩](../10-memory-planning-agent.md)）。

---

## 常见坑

**1. 忘传 configurable.sessionId**  
抛错或所有用户共用一个 history。

**2. Prompt 没有 MessagesPlaceholder**  
历史进不了模型。

**3. 链输出 string 但 history 要 AIMessage**  
`RunnableWithMessageHistory` 会包装；自定义 runnable 要注意输出类型。

**4. 与 checkpoint 双写不一致**  
UI 显示 DB 消息，Agent 用 checkpoint，内容不同步。定单一数据源或同步策略。

**5. getMessageHistory 每次 new 实例**  
应 sessionId 级缓存或从 DB 读。

---

## 小结

| 组件 | 作用 |
|------|------|
| `ChatMessageHistory` | 存 messages |
| `RunnableWithMessageHistory` | 链自动读写信历史 |
| `sessionId` | 会话隔离 |
| 自定义 History | 接 Postgres |

**下一篇：** [14 @langchain/community 集成](./14-community-integrations.md)
