---
title: Next.js 配置 Sentry
sidebar: auto
date: 2025-07-1
categories: 
- Next.js
- 前端
tags:
- Next.js
- Sentry
---

### **一、准备工作**
1. **创建 Sentry 账号和项目**
    - 访问 [Sentry 官网](https://sentry.io/) 或内部sentry网址， 注册账号并创建新项目，记录项目的 **DSN（Data Source Name）** 和 **Org/Project 信息**。
2. **确保项目运行正常**
    - 确认你的 Next.js 项目已启动，且能正常访问页面和 API。


### **二、安装 Sentry SDK**
在终端运行以下命令安装官方 SDK：
```bash
# 使用 npm
npm install @sentry/nextjs --save

# 或 yarn/pnpm
yarn add @sentry/nextjs
pnpm add @sentry/nextjs
```

或者在nextjs项目下直接执行:
```bash
npx @sentry/wizard@latest -i nextjs
```
执行这个命令会在控制台提示输入sentry 相关配置然后自动安装 Sentry SDK，并生成必要的配置文件。

### **三、配置 Next.js 项目**
#### **1. 修改 `next.config.js`**
添加 Sentry 配置包装器 `withSentryConfig`，并配置组织和项目信息：
```javascript
// next.config.js
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  // 原有的 Next.js 配置（如 reactStrictMode、swcMinify 等）
};

module.exports = withSentryConfig(nextConfig, {
  org: "你的组织 ID（如 example-org）", // 替换为实际值
  project: "你的项目 ID（如 example-project）", // 替换为实际值
  silent: process.env.CI || false, // 生产环境关闭日志（可选）
  disableLogger: true, // 自动摇树优化日志语句（可选）
});
```

#### **2. 初始化客户端和服务端 SDK**
在项目根目录创建以下文件：
- **客户端配置**：`instrumentation-client.js`（浏览器环境）
  ```javascript
  import * as Sentry from "@sentry/nextjs";

  Sentry.init({
    dsn: "你的 DSN 地址", // 替换为实际值 或者从环境变量获取，如：NEXT_PUBLIC_SENTRY_DSN
    sendDefaultPii: true, // 发送用户 IP 和请求头（可选）
    tracesSampleRate: 0.1, // 性能监控采样率（建议生产环境设为 0.1-1）
    replaysSessionSampleRate: 0.1, // 会话重放采样率（可选）
    integrations: [
      Sentry.replayIntegration(), // 启用会话重放（可选）
      Sentry.feedbackIntegration(), // 启用用户反馈（可选）
    ],
  });

  // 可选：捕获路由跳转的性能数据（需启用 tracing）
  export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
  ```

- **服务端配置**：`sentry.server.config.js`（Node.js 环境）
  ```javascript
  import * as Sentry from "@sentry/nextjs";

  Sentry.init({
    dsn: "你的 DSN 地址", // 替换为实际值
    tracesSampleRate: 0.1, // 服务端性能监控采样率
  });
  ```

- **边缘配置（有的话）**：`sentry.edge.config.js`（Edge 环境，如使用 App Router）
  ```javascript
  import * as Sentry from "@sentry/nextjs";

  Sentry.init({
    dsn: "你的 DSN 地址", // 替换为实际值
  });
  ```

#### **3. 注册服务端初始化**
创建 `instrumentation.js` 用于注册不同环境的 SDK：
```javascript
// instrumentation.js
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config"); // 服务端环境
  }
  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config"); // Edge 环境（如 App Router）
  }
}
```


### **四、捕获 React 渲染错误**
#### **1. App Router（Next.js 13+）**
创建 `app/global-error.tsx` 自定义全局错误组件：
```tsx
// app/global-error.tsx（需标记为客户端组件）
"use client";

import * as Sentry from "@sentry/nextjs";
import NextError from "next/error";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error); // 捕获渲染错误
  }, [error]);

  return <NextError statusCode={0} />; // 显示 Next.js 默认错误页
}
```
`error.tsx` 用于捕获页面级错误：
```tsx
"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function ErrorPage({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong!</h2>
    </div>
  );
}

```

### **五、可选增强配置**
#### **1. 源映射（Source Maps）**
添加源映射以美化堆栈跟踪（需 Sentry Auth Token）：
```javascript
// next.config.js 中补充
module.exports = withSentryConfig(nextConfig, {
  // ...其他配置
  authToken: process.env.SENTRY_AUTH_TOKEN, // 从环境变量获取 Token
  widenClientFileUpload: true, // 上传更完整的源映射（可选）
});
```
- 在 `.env` 中添加：`SENTRY_AUTH_TOKEN=你的 Token`（注意保密）。

#### **2. 避免广告拦截（隧道模式）**
通过自定义路由转发事件，绕过广告拦截器：
```javascript
// next.config.js 中补充
module.exports = withSentryConfig(nextConfig, {
  tunnelRoute: "/sentry-tunnel", // 在 Next.js 中创建同名 API 路由
});
```

#### **3. 性能监控（Tracing）**
在客户端和服务端配置中设置 `tracesSampleRate`（如 `0.1` 表示 10% 的请求会被采样）。


### **六、验证接入是否成功**
#### **1. 触发测试错误**
在页面中添加测试按钮，手动触发错误：
```jsx
// pages/test-page.tsx 或 app/page.tsx
<button onClick={() => {
  throw new Error("Sentry 测试错误"); // 客户端错误
}}>
  触发错误
</button>
```

#### **2. 检查 Sentry 后台**
访问 [Sentry 项目页面](https://sentry.io/)，查看：
- **Issues**：是否出现测试错误。
- **Performance**：是否有事务（Transactions）和跨度（Spans）数据。
- **Replays**：是否捕获到会话重放（如需启用）。


### **七、常见问题**
1. **错误未被捕获**
    - 确保 `Sentry.init()` 中的 `dsn` 正确无误。
    - 检查浏览器控制台是否有 SDK 加载错误。
    - 避免在服务端组件中使用客户端 SDK（如 `instrumentation-client.js` 仅运行于浏览器）。

2. **源映射未生效**
    - 确认 `SENTRY_AUTH_TOKEN` 已正确配置。
    - 检查构建日志中是否有源映射上传成功的提示。

3. **性能数据缺失**
    - 确保 `tracesSampleRate` 设置不为 `0`。
    - 测试时通过页面交互触发请求（控制台直接调用可能被拦截）。

最后的建议：
-   **用户关联**：在用户登录后，调用 `Sentry.setUser({ id: user.id, email: user.email })`，这样每个错误都可以直接关联到具体用户，排查问题时非常方便。
-   **自定义标签**: 使用 `Sentry.setTag("feature", "new-checkout")` 来为错误打上业务标签，方便筛选和统计。

### **推荐更进一步**
- [配置nextjs环境变量](https://nextjs.org/docs/app/guides/environment-variables)区分开发和生产环境。
- 启用 [会话重放（Session Replay）](https://docs.sentry.io/platforms/javascript/session-replay/)功能。
- 查看 [Next.js 官方集成文档](https://docs.sentry.io/platforms/javascript/guides/nextjs/) 获取更多高级用法。
