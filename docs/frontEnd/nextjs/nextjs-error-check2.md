---
title: Next.js 线上白屏问题排查指南（Docker部署版）
sidebar: auto
date: 2025-7-1
categories: 
- Next.js
- 前端
tags: 
- Next.js
- Docker
- Error
- 白屏
---

线上用户反馈页面白屏是一个**P0级（最高优先级）**的紧急问题。如果没有 Sentry 这样的可观测性工具，意味着我们失去了自动错误聚合、Source Map 解析和丰富的上下文信息。我们必须回归到更“原始”但同样有效的调试方法：**日志分析和环境复现**。

### 核心理念：当没有眼睛时，耳朵（日志）就是一切

既然我们没有 Sentry 这个“千里眼”，那么 `docker logs` 就是我们唯一能依赖的“顺风耳”。所有问题的蛛丝马迹都隐藏在其中。

---

### 第 1 阶段：紧急情况下的快速判断 (Golden 5 Minutes)

和有 Sentry 时一样，首要目标是快速评估和恢复。

**1. 亲自复现并打开开发者工具**
- **隐身模式**打开出问题的页面。白屏了吗？
- **F12 打开开发者工具**，这是你此刻在客户端最重要的信息源。
    - **Console (控制台)**：这是最关键的地方。
        - **情况A：看到红色JS错误** (如 `Uncaught TypeError`, `ReferenceError`)。这强烈暗示问题出在**客户端**。应用代码被下载到浏览器，但在执行时崩溃了。
        - **情况B：控制台是干净的，但 Network 面板显示页面请求（第一个文档请求）返回了 5xx 或 4xx 错误**。这强烈暗示问题在**服务端**。服务器在渲染页面时就失败了，HTML 根本没能成功生成并发送给浏览器。
    - **Network (网络)**: 确认 JS 和 CSS 文件是否都加载成功（状态码 200）。如果某个关键的 JS chunk 文件 404，那可能是构建或部署路径配置问题。

**2. 立刻检查 Docker 容器日志！**
这是定位服务端问题的核心。你需要通过 SSH 登录到部署了 Docker 的服务器上。

   ```bash
   # 1. 找到你的 Next.js 应用容器的名称或 ID
   docker ps

   # 2. 查看容器的实时日志 (查看最后100行并持续跟踪新日志)
   docker logs <container_name_or_id> --tail 100 --follow
   ```
**你要找的是什么？**
- 任何以 `Error:` 开头的行。
- JavaScrip 的堆栈跟踪信息 (stack trace)。
- 数据库连接错误、第三方 API 请求失败的日志。
- `FATAL` 或 `ERROR` 级别的日志。

**3. 快速决策：回滚**
如果问题是在一次新部署后出现的，最快的止损方法仍然是回滚。这可能意味着重新部署上一个稳定的 Docker 镜像 Tag。**先恢复服务，再排查根源。**

---

### 第 2 阶段：深度定位根源

根据第一阶段的判断，我们分两种情况深入排查。

#### 场景一：定位客户端错误（浏览器控制台有错）

**挑战**：没有 Sentry，你在浏览器里看到的错误堆栈是**被压缩和丑化过的**，类似 `error in t.a.b (main.asdf123.js:1:12345)`。这几乎无法直接阅读。

**解决方案：本地复现与 Source Map 解码**

1.  **在本地构建生产环境**:
    为了复现问题，你需要在本地模拟生产环境。
    ```bash
    # 1. 确保你的代码是线上出问题的那个版本
    git checkout <release_commit_hash>

    # 2. 构建生产包
    npm run build

    # 3. 启动生产服务器
    npm run start
    ```
    现在在本地访问 `http://localhost:3000`，看能否复现白屏。如果能，恭喜你，问题解决了一半，你可以用常规方式调试了。

2.  **手动解码 Source Map (如果构建时生成了的话)**
    默认情况下，Next.js 在 `npm run build` 时会为生产环境生成 Source Map，但不会把 `.map` 文件暴露给公网。它们存在于 Docker 镜像的 `.next/static/chunks/` 目录下。
    - **你需要**：
        1. 线上报错的**文件名** (`main.asdf123.js`)
        2. **行号**和**列号** (`1:12345`)
        3. 对应版本的 **Source Map 文件** (`main.asdf123.js.map`)
    - **如何操作**：
        1.  从出问题的 Docker 镜像中，使用 `docker cp` 命令将 `.next` 目录复制出来。
            ```bash
            # 从容器内复制 .next 目录到宿主机当前目录
            docker cp <container_id>:/app/.next .
            ```
        2.  使用 `source-map` 这样的库或在线工具，输入以上三项信息，它会告诉你错误对应到你写的 TypeScript 源码的哪一行。这很繁琐，但这是没有 Sentry 时的唯一精准方法。

#### 场景二：定位服务端错误（页面请求 500）

**挑战**: 问题可能出在数据获取 (`getServerSideProps`)、API 路由或中间件中。

**解决方案：深挖 Docker 日志与容器内部排查**

1.  **精读 `docker logs`**:
    这是你的主要阵地。服务端错误通常会打印出完整的、未压缩的堆栈跟踪，因为它直接在 Node.js 环境中运行。
    - **仔细阅读错误信息**：它通常会告诉你 `Cannot read properties of undefined`，或者 `Failed to connect to database`。
    - **跟随堆栈跟踪**：它会指出错误发生在你代码的哪个文件哪一行。

2.  **实施结构化日志**:
    如果你的日志只是 `console.log('error')`，那基本没用。**即使没有 Sentry，你也要打出结构化的 JSON 日志**。这是专业的做法。

    ```typescript
    // 在你的 getServerSideProps 或 API Route 中
    try {
      // ... 危险操作，比如数据库查询
      const data = await db.query("SELECT * FROM users WHERE id = ?", [userId]);
      if (!data) {
          // 主动记录预期的“空”状态
          console.log(JSON.stringify({
              level: 'info',
              message: 'User not found in DB',
              userId: userId,
              traceId: req.headers['x-request-id'], // 如果有链路追踪ID
          }));
      }
    } catch (error) {
      console.error(JSON.stringify({
        level: 'error',
        message: 'Failed to fetch user data in getServerSideProps',
        errorMessage: error.message,
        errorStack: error.stack,
        userId: userId,
        traceId: req.headers['x-request-id'],
      }));
      // 抛出或返回错误，触发 500
      throw error;
    }
    ```
    这样的日志在 `docker logs` 中查看时，你就可以轻松地搜索 `level: 'error'` 或特定的 `userId`，极大地提高了排查效率。

3.  **进入容器内部进行“侦查”**:
    有时候你需要进入正在运行的容器来检查环境。

    ```bash
    docker exec -it <container_id> /bin/sh # or /bin/bash
    ```
    进入容器后，你可以：
    - **检查环境变量**：运行 `printenv` 或 `env`。是不是某个 `API_KEY` 或 `DATABASE_URL` 环境变量漏了或错了？
    - **检查文件系统**：`ls -l .next/standalone`，确认构建产物是否完整。
    - **检查网络连接**：从容器内部尝试 `ping` 或 `curl` 你的数据库或依赖的第三方 API。`curl db.internal.host:5432`。如果这里不通，说明是 Docker 网络配置或防火墙问题。

---
### 预防和改进：没有 Sentry 时的最佳实践

修复问题后，你需要推动改进，避免下次再如此痛苦。

1.  **强烈建议引入日志聚合系统**：
    你不需要 Sentry，但至少需要一个集中的地方来收集、存储和搜索所有容器的日志。开源的方案如 **ELK Stack (Elasticsearch, Logstash, Kibana)** 或 **Loki + Grafana** 是非常好的选择。运维同事可以把所有 Docker 容器的 `stdout/stderr` 输出都接入到这里。这样你就有了一个可搜索的日志平台。

2.  **实现健康检查 (Health Check) 端点**：
    在 Next.js 中创建一个 API 路由，如 `/pages/api/health.ts`。它会检查数据库连接、关键服务是否正常。
    ```typescript
    // pages/api/health.ts
    export default async function handler(req, res) {
      try {
        // await checkDatabaseConnection();
        // await checkRedisConnection();
        res.status(200).json({ status: 'ok' });
      } catch (error) {
        res.status(503).json({ status: 'error', details: error.message });
      }
    }
    ```
    然后在你的 `Dockerfile` 中或容器编排工具（如 Docker Compose, Kubernetes）中配置健康检查，让容器在不健康时能被自动重启或下线。

3.  **在 `next.config.js` 中开启 Source Map**：
    虽然有安全风险（可能暴露源码），但在没有 Sentry 的情况下，为了能调试线上问题，可以考虑开启它，并通过网络策略限制对 `.map` 文件的访问。
    ```javascript
    // next.config.js
    module.exports = {
      productionSourceMap: true,
    }
    ```
4.  **向上级和团队阐述可观测性工具的价值**：
    将这次痛苦的调试经历作为案例，向你的技术主管或团队说明，引入 Sentry 或类似工具所节省的人力成本和减少的故障恢复时间，远超工具本身的费用。这是**技术投资**，不是成本。

总之，没有 Sentry 时的调试工作是一场硬仗，但通过**严谨的日志规范、系统化的排查流程和对 Docker 工具的熟练运用**，依然可以精准地定位并解决问题。

### 总结
在没有 Sentry 的情况下，线上白屏问题的排查依然可以通过系统化的日志分析和环境复现来完成。通过 Docker 日志、Source Map 解码和容器内部检查，我们可以有效地定位问题并进行修复。同时，推动日志聚合和健康检查的实施，可以为未来的故障排查提供更好的基础设施支持。


> [Next.js 线上白屏问题排查指南（Sentry监控版）](./nextjs-error-check.md)
> 
> [Next.js 线上白屏问题排查指南（PM2部署版）](./nextjs-error-check3.md)
