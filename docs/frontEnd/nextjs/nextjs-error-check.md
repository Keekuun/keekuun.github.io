---
title: Next.js 线上白屏问题排查指南（Sentry监控版）
sidebar: auto
date: 2025-07-1
categories: 
- Next.js
- 前端
tags:
- Next.js
- Sentry
- Error
- 白屏
---

线上用户反馈页面白屏是一个**P0级（最高优先级）**的紧急问题。针对使用了 Next.js 和 Sentry 监控排查问题。

### 立刻行动：线上故障应急响应流程

#### 第 1 阶段：紧急评估与快速止损 (First 5 Minutes)

你的首要目标是确认问题范围并尽可能快地恢复服务。

**1. 立刻检查 Sentry！**
这是你最有力的武器。立即打开你的内部 Sentry 项目页面。
*   **查看 Issues 列表**：按 "Last Seen" 排序。是否有新的、高频的错误刚刚出现？错误标题通常能给你第一条线索，比如 `TypeError: Cannot read properties of undefined`。
*   **检查 Release Health**: Sentry 会展示每个版本的健康度。最新版本的 Crash Rate 是否突然飙升？这能立刻将问题锁定在最近的一次上线。
*   **设置告警**：如果还没做，现在就去设置告警规则（例如：当一个新错误在5分钟内发生超过10次时，发送邮件/Slack通知），亡羊补牢，为时未晚。

**2. 亲自复现**
*   **使用浏览器隐身模式**：打开用户反馈的那个页面 URL。这可以排除本地缓存、Cookies 或浏览器插件的干扰。
*   **打开开发者工具 (F12)**：
    *   **Console (控制台) 面板**：这是最重要的。白屏最常见的原因是客户端 JavaScript 执行出错，导致 React 应用无法渲染（或在 "Hydration" 阶段崩溃）。这里有没有红色的错误信息？有的话，这就是你的“第一案发现场”。
    *   **Network (网络) 面板**：刷新页面，检查是否有关键资源加载失败（状态码为 4xx 或 5xx）？比如核心的 JS chunk 文件、CSS 文件或关键的 API 请求。

**3. 快速决策：回滚！**
如果 Sentry 显示错误是新版本引入的，或者你能确认问题是在最近一次部署后出现的，**最快恢复服务的方案是立即回滚到上一个稳定版本**。
在 Vercel 或你的部署系统上，这通常是一键操作。**先恢复服务，再慢慢排查问题根源。**

---

#### 第 2 阶段：深度定位问题根源 (Root Cause Analysis)

在服务恢复后（或如果无法回滚），你需要像侦探一样，利用手头的工具找到罪魁祸首。

我们将问题分为两大类：**客户端错误** 和 **服务端错误**。

##### 场景一：定位客户端错误 (Client-Side Error)

这是最常见的情况，通常是 JS 在浏览器中执行时崩溃。

**线索：**
*   浏览器控制台有红色的 JS 错误。
*   Sentry 报告了一个前端错误，堆栈跟踪指向组件代码 (`useEffect`, 事件处理函数等)。
*   页面有部分内容（如 `<html><head></head><body></body></html>`），但 `<body>` 内是空的，或者卡在加载动画。

**调试步骤：**
1.  **深入分析 Sentry Issue**:
    *   **查看堆栈跟踪 (Stack Trace)**：由于你已经配置了 Source Maps，Sentry 会告诉你错误发生在你写的 TypeScript 源码的**哪一行**。这是最有价值的信息！
    *   **查看面包屑 (Breadcrumbs)**：它会记录错误发生前用户的行为序列：点击了哪个按钮、访问了哪个路由、发起了哪个 API 请求。这能帮你理解用户是如何触发这个 Bug 的。
    *   **查看上下文 (Tags & Context)**：错误发生在哪个浏览器/OS版本？是不是只在移动端 Safari 上出现？这能帮你缩小复现范围。
    *   **查看会话重放 (Session Replay)**: 如果你配置了会话重放，这是终极武器。直接观看导致白屏的用户操作录像，一切都将真相大白。

2.  **本地代码复现**:
    *   根据 Sentry 的线索，在本地切换到对应的 release 代码分支。
    *   尝试模拟用户的操作或环境，在本地复现错误。一旦能在本地复现，你就可以使用 `debugger` 或 `console.log` 进行更精细的调试了。
    *   **尤其注意 `Hydration Error`**: Next.js 中，如果服务器渲染的 HTML 和客户端首次渲染的 HTML 不匹配，就会报这个错，也可能导致白屏。例如，在代码中使用了 `new Date()` 或 `Math.random()` 等在服务端和客户端结果不一致的 API。

##### 场景二：定位服务端错误 (Server-Side Error)

这种情况意味着服务器在生成页面 HTML 时就失败了。

**线索：**
*   浏览器直接显示一个错误页面（如 Next.js 默认的 "500 - Internal Server Error" 或 Vercel 的错误页）。
*   Network 面板显示页面文档请求本身就返回了 5xx 状态码。
*   Sentry 报告了一个后端错误，堆栈跟踪指向 `getServerSideProps`、`getStaticProps` 或 API Routes。

**调试步骤：**
1.  **直奔部署平台日志**：
    *   对于 Vercel，进入项目 Dashboard -> Logs 标签页，查看**运行时日志 (Runtime Logs)**。
    *   筛选函数为你出问题的页面路由（如 `/my-page`）或 API 路由。
    *   你会在这里看到最原始、最完整的错误日志和堆栈跟踪，Sentry 捕获的也是源于这里。

2.  **分析错误原因**：
    *   **外部依赖问题**：是不是 `getServerSideProps` 中调用的数据库连接失败了？调用的第三方 API 超时或返回了错误？这是最常见的原因。
    *   **代码逻辑错误**：是否在服务端代码中访问了一个 `undefined` 的属性？例如 `const name = user.profile.name`，但 `profile` 可能不存在。
    *   **环境变量缺失**：服务端代码依赖某个环境变量 (`process.env.API_KEY`)，但这个变量在生产环境中没有被正确设置。

---
### 总结：白屏问题排查清单 (Workflow)

当线上白屏发生时，按照这个顺序行动：

1.  `[ ]` **看 Sentry**: 有没有新出现的、高频的错误？
2.  `[ ]` **看浏览器控制台**: 能否在隐身模式下复现？控制台是否有错误？
3.  `[ ]` **决策**: 是否为新版引入？是 -> **立即回滚**。
4.  `[ ]` **定位：**
    *   **如果是客户端错误** (浏览器 Console 有错):
        *   `[ ]` 分析 Sentry Issue 的堆栈、面包屑和上下文。
        *   `[ ]` 在本地尝试复现并修复。
    *   **如果是服务端错误** (页面请求返回 500):
        *   `[ ]` 查看部署平台（Vercel）的运行时日志，找到具体错误。
        *   `[ ]` 检查数据库、第三方 API、环境变量等外部依赖。
5.  `[ ]` **修复与验证**:
    *   `[ ]` 提交修复代码的 PR。
    *   `[ ]` 在 **预览环境 (Preview Deployment)** 中严格验证该问题已修复。
    *   `[ ]` **编写一个自动化测试（E2E或单元测试）来覆盖这个场景，防止未来再次发生。**
6.  `[ ]` **上线与监控**:
    *   `[ ]` 部署修复版本到生产。
    *   `[ ]` 在 Sentry 中监控之前的 Issue，确保它被标记为 "Resolved" 并且不再出现。

记住，**Sentry + 平台日志 + 浏览器开发者工具** 是你处理线上问题的三驾马车。沉着、冷静地按照流程排查，一定能找到问题的根源。

> [Next.js 线上白屏问题排查指南（Docker部署版）](./nextjs-error-check2.md)
>
> [Next.js 线上白屏问题排查指南（PM2部署版）](./nextjs-error-check3.md)
