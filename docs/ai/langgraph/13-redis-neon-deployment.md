---
title: LangGraph.js 13 · Redis 与 Neon 部署清单
date: 2026-06-11
isComment: true
categories:
- AI
- LangGraph
tags:
- Neon
- Redis
- Deployment
---

# LangGraph.js 13 · Redis 与 Neon 部署清单

> [09 Postgres Checkpointer](./09-production-checkpointer.md) 讲了原理；这篇给 **Neon Postgres +（可选）Redis** 的 **环境变量、连接池、Vercel 部署 checklist**——LangGraph Agent 上线常用组合。

**系列导航：** [12 完整 Route](./12-full-route-example.md) · [专系列首页](./README.md)

**对照：** [16 上线篇](../18-agent-production-checklist.md) · [LC 15 Eval](../langchain/15-langsmith-eval.md)

---

## 架构选型

```mermaid
flowchart TB
    Vercel[Vercel Next.js] --> Graph[LangGraph]
    Graph --> Neon[(Neon Postgres checkpoints)]
    Graph --> Upstash[(Upstash Vector 可选)]
    Graph --> Redis[(Redis 可选 缓存/限流)]
```

| 组件 | 典型用途 |
|------|----------|
| **Neon Postgres** | checkpoint 持久化、用户会话表 |
| **Upstash Redis** | 限流计数、短缓存（非必须 checkpoint） |
| **Upstash Vector** | RAG（[LC 09](../langchain/09-vector-stores.md)） |

**checkpoint 主存推荐 Postgres**；Redis checkpoint 适合已有 Redis 运维团队，见 09 对比。

---

## Neon + PostgresSaver

### 1. 创建库

Neon Console → 项目 → Connection string（** pooled** 推荐 Serverless）：

```
postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb?sslmode=require
```

Serverless 用 **pooler** 端点（`-pooler` 主机名），减少连接数。

### 2. 依赖与初始化

```bash
pnpm add @langchain/langgraph-checkpoint-postgres pg
```

```typescript
// lib/db/pool.ts
import pg from "pg";

export const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
});

// lib/agent/checkpointer.ts
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";
import { pool } from "./pool";

let saver: PostgresSaver | null = null;

export async function getCheckpointer() {
    if (!saver) {
        saver = new PostgresSaver(pool);
        await saver.setup();
    }
    return saver;
}
```

**冷启动：** `setup()` 检查表；已存在则跳过。避免每请求 `setup()`——模块级单例。

### 3. 编译图

```typescript
const checkpointer = await getCheckpointer();
export const graph = workflow.compile({ checkpointer });
```

---

## 环境变量清单

```bash
# LLM
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=          # 可选兼容网关

# LangSmith（推荐）
LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=lsv2_...
LANGCHAIN_PROJECT=blog-agent-prod

# Neon
DATABASE_URL=postgresql://...?sslmode=require

# RAG（若用 Upstash Vector）
UPSTASH_VECTOR_REST_URL=
UPSTASH_VECTOR_REST_TOKEN=

# Redis（限流/缓存，可选）
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

| 变量 | 泄露风险 |
|------|----------|
| `OPENAI_API_KEY` | 高，仅服务端 |
| `DATABASE_URL` | 高 |
| 前端只拿 | `threadId`（无密钥） |

---

## Vercel 部署配置

```json
// vercel.json 片段
{
  "functions": {
    "app/api/agent/chat/route.ts": {
      "maxDuration": 60
    }
  }
}
```

| 项 | 建议 |
|----|------|
| `runtime` | `nodejs`（[12 Route](./12-full-route-example.md)） |
| `maxDuration` | Pro 60s+； Hobby 注意上限 |
| Region | 靠近 Neon region |
| `DATABASE_URL` | Vercel Env，Production/Preview 分离 |

**SSE：** Vercel 对长连接可用；仍建议监控超时，超长 Agent 改 Job 队列。

---

## Redis：限流示例（非 checkpoint）

```typescript
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

async function rateLimit(userId: string, limit = 30, windowSec = 3600) {
    const key = `agent:rl:${userId}`;
    const count = await redis.incr(key);
    if (count === 1) await redis.expire(key, windowSec);
    if (count > limit) throw new Error("请求过于频繁");
}
```

在 Route 入口 `await rateLimit(session.userId)`。

**与 checkpoint 分工：** Redis 计数；Postgres 存 State。

---

## 会话表（UI 列表，可选）

checkpoint 含完整 messages，但 **聊天列表 UI** 常单独表：

```sql
CREATE TABLE chat_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_sessions_user ON chat_sessions(user_id, updated_at DESC);
```

`thread_id` = `chat_sessions.id`。列表查 SQL；Agent 续跑仍走 checkpointer。

---

## 迁移与版本

1. 锁 `@langchain/langgraph-checkpoint-postgres` 与 `@langchain/langgraph` 版本
2. 升级前在 staging 跑 `setup()` + 一条 invoke
3. checkpoint 表 schema 变更读官方 migration 说明
4. [15 Eval](../langchain/15-langsmith-eval.md) 发版前跑 golden

---

## 监控

| 指标 | 来源 |
|------|------|
| API p95 延迟 | Vercel Analytics |
| Token 用量 | LangSmith |
| DB 连接数 | Neon Dashboard |
| checkpoint 失败率 | 应用日志 |
| 限流触发 | Redis 计数 |

告警：连续 5xx、单用户 Token 异常尖峰。

---

## 安全 checklist

- [ ] `thread_id` 校验归属 `userId`（`getState` 前查 session 表）
- [ ] Tool 内二次鉴权（[05](../langchain/05-tools.md)）
- [ ] `DATABASE_URL` 不进客户端
- [ ] Preview 环境用独立 Neon branch
- [ ] PII 进 LangSmith 前评估留存策略
- [ ] interrupt 审批接口单独鉴权（管理员角色）

---

## 常见坑

**1. 直连 Neon 非 pooler**  
Serverless 连接耗尽。用 pooler URL。

**2. 每请求 new Pool**  
连接泄漏。全局单例 Pool。

**3. Hobby 10s 杀长 Agent**  
升 Pro 或异步 Job。

**4. Redis 当 checkpoint 又没 AOF**  
丢会话。checkpoint 仍推荐 Postgres。

**5. Preview 连生产 Neon**  
数据污染。branch 隔离。

---

## 小结

| 场景 | 选型 |
|------|------|
| Checkpoint | Neon + `PostgresSaver` |
| 限流/缓存 | Upstash Redis |
| RAG | Upstash Vector 或 Pinecone |
| 部署 | Vercel `nodejs` + `maxDuration` |
| 质量 | LangSmith Eval |

**LangGraph 专系列 01～13 完结。** 全栈串联：[12 Route](./12-full-route-example.md) · [16 实战篇](../16-langgraphjs-practice.md) · [LC 专系列](../langchain/README.md)。
