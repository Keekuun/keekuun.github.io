---
title: LangGraph.js 11 · 图调试与时间旅行
date: 2026-06-11
isComment: true
categories:
- AI
- LangGraph
tags:
- Debugging
- getStateHistory
- LangGraph
---

# LangGraph.js 11 · 图调试与时间旅行

> Agent 跑飞了，需要知道 **第几步 State 坏了**、能否 **回滚重跑**。LangGraph 的 `getStateHistory`、`updateState` 与 LangSmith 图 trace 组成调试三板斧。

**系列导航：** [10 Command](./10-command-api.md) · [专系列首页](./README.md)

**对照：** [11 LangSmith](../langchain/11-callbacks-langsmith.md) · [12 Multi-Agent 测试](../12-multi-agent-systems.md)

---

## 调试信息从哪来

| 来源 | 看什么 |
|------|--------|
| `getState` | 当前 State + `next` 待跑节点 |
| `getStateHistory` | 历史 checkpoint 链 |
| `stream({ streamMode: "debug" })` | 步进细节（开发） |
| LangSmith | 跨请求嵌套 trace |
| [06 streamEvents](./06-streaming.md) | 实时 token/tool |

---

## getState 快照

```typescript
const snap = await graph.getState({
    configurable: { thread_id: "debug-session-1" },
});

console.log(snap.values);   // 当前 State
console.log(snap.next);     // 下一批节点，暂停时非空
console.log(snap.config);   // checkpoint config
console.log(snap.metadata); // step、source 等
```

| 字段 | 排障 |
|------|------|
| `values.messages` | 模型实际看见什么 |
| `next` | 卡在 interrupt 还是死循环 |
| `metadata.step` | 第几超步 |

**interrupt 暂停时：** `next` 含待执行节点，但 `values` 已是 **暂停前** 状态（见 [08](./08-human-in-the-loop.md)）。

---

## getStateHistory 时间旅行

```typescript
const config = { configurable: { thread_id: "debug-session-1" } };

for await (const state of graph.getStateHistory(config)) {
    console.log(state.metadata?.step, state.metadata?.source, state.next);
}
```

每条历史记录是一个 **checkpoint 快照**，从新到旧排列（默认）。

### 回滚到某步再跑（概念）

```typescript
// 取历史某 snapshot 的 config（含 checkpoint_id）
const history = [];
for await (const s of graph.getStateHistory(config)) {
    history.push(s);
}

const target = history[3]; // 选较早一步
await graph.updateState(target.config, { messages: [...] }); // 可选修正
await graph.invoke(null, target.config); // 从该 checkpoint 续跑
```

**使用场景：**

- 审查节点误判，回滚到 `write` 前改 draft
- 复现 bug：同一 checkpoint 多次 invoke 对比

**注意：** 回滚产生 **新分支** checkpoint 链，不会抹掉原历史（依实现；生产慎用，多在 staging）。

---

## streamMode: debug

```typescript
const stream = await graph.stream(input, {
    streamMode: "debug",
    configurable: { thread_id: "t1" },
});

for await (const chunk of stream) {
    console.log(JSON.stringify(chunk, null, 2));
}
```

输出节点输入输出、路由决策等——**仅开发**，体积大勿对生产用户开。

---

## 结合 LangSmith

1. 环境变量开启 tracing（[11 篇](../langchain/11-callbacks-langsmith.md)）
2. 图 run 在 UI 显示 **节点图**
3. 点进 `tools` 节点看 Tool 输入输出
4. 对比两次 Prompt 改动的 run

| 本地 getStateHistory | LangSmith |
|--------------------|-----------|
| 精确 State 字节级 | 结构化 trace + 对比 |
| 需 thread 在本实例可访问 | 跨机器 |
| 适合回滚实验 | 适合团队协作 |

---

## 单元测试策略

对齐 [12](../12-multi-agent-systems.md)：

```typescript
// 只测路由函数 / Command 目标
const state = { messages: [...], route: "search" };
expect(routeFn(state)).toBe("rag");

// ToolNode 单测：mock Tool
// 全图 E2E：少量 golden + LangSmith dataset
```

**不要** 每次改 Prompt 跑 50 轮全链路——用 fixture State 测 `shouldContinue`。

---

## 生产监控（非 debug）

| 指标 | 说明 |
|------|------|
| 每 thread 超步数 | 死循环预警 |
| Tool 失败率 | Schema / 下游 API |
| checkpoint 写入延迟 | DB 瓶颈 |
| p95 invoke 时长 | 超时调优 |

日志带 `thread_id`、`runName`（[11 RunnableConfig](../langchain/11-callbacks-langsmith.md)）。

---

## 常见坑

**1. 无 checkpointer 时 getStateHistory 为空**  
只有 compile 带 checkpointer 才有历史。

**2. 回滚后以为覆盖原历史**  
实际是 fork 新链，审计要读全 history。

**3. debug stream 打生产**  
日志爆、泄露 prompt。

**4. 只看最后一则 AIMessage**  
中间 ToolMessage 才是 Observation 真相。

**5. MemorySaver 多实例**  
getState 在本进程，与线上用户 pod 不一致——用 Postgres + 统一 thread 查 staging 复现。

---

## 小结

| API | 用途 |
|-----|------|
| `getState` | 当前黑板 + next |
| `getStateHistory` | 逐步回溯 |
| `updateState` + 历史 config | 回滚重跑 |
| `streamMode: debug` | 本地步进 |
| LangSmith | 团队 trace |

**上一篇：** [10 Command](./10-command-api.md) · **下一篇：** [12 完整 Route](./12-full-route-example.md) · **专系列：** [README](./README.md)
