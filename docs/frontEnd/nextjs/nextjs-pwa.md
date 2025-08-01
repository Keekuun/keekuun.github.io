---
title: Next.js 配置 PWA
sidebar: auto
date: 2025-07-2
categories: 
- Next.js
- 前端
tags: 
- Next.js
- PWA
---

## **一、技术调研**
在开始配置 PWA 之前，我们需要了解一些基本概念和技术：
- **PWA（Progressive Web App）**：渐进式 Web 应用，结合了网页和移动应用的优点，支持离线访问、推送通知等功能。
- **Service Worker**：浏览器后台运行的脚本，负责处理网络请求、缓存资源等。
- **Next.js PWA 插件**：用于简化 Next.js 项目中 PWA 的配置。如： `next-pwa`、`@serwist/next`、`next-offline` 等。
- **Workbox**：Google 提供的库，用于简化 Service Worker 的编写和管理。
- **Manifest 文件**：定义应用的图标、名称、主题色等信息。
- **离线支持**：通过 Service Worker 缓存资源，实现离线访问。
- **推送通知**：允许应用向用户发送实时通知。借助 Service Worker 实现。
- **HTTPS**：PWA 需要在安全的环境下运行，通常通过 HTTPS 提供服务。
- **性能优化**：通过缓存和懒加载等技术提升应用性能。
- **用户体验**：提供类似原生应用的交互体验，如全屏模式、启动画面等。
- **SEO 优化**：确保 PWA 在搜索引擎中可被索引。
- **测试和调试**：使用 Chrome DevTools 等工具测试 PWA 功能。

[查看`next-pwa`、`@serwist/next`、`next-offline` npm 对比](https://npm-compare.com/zh-CN/@serwist/next,next-pwa), 虽然 `next-pwa` 下载量和star数量最多，但是它更新时间在三年前几乎不维护了，而 `@serwist/next` 是目前最活跃的 PWA 插件，提供了更好的支持和功能，文档也很丰富，关键是对最新版 next.js 支持度很好。所以推荐使用 `@serwist/next` 插件来配置 PWA。

## **二、安装依赖**

在 Next.js 项目中安装 PWA 相关依赖。这里我们使用 `@serwist/next` 插件，它提供了简单的配置方式。

在现有项目中执行以下命令安装依赖：
```bash
pnpm add @serwist/next && pnpm add -D serwist
```

或者直接使用模板创建新项目：
```bash
npx degit serwist/serwist/examples/next-basic my-app
```

## **三、配置 PWA**
假设你已经有一个 Next.js 项目，并且希望将其转换为 PWA。以下是配置步骤：

### 1.更新 `next.config.ts`
在项目根目录下的 `next.config.ts` 文件中添加 PWA 配置：

```javascript
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

export default withSerwist({
  // Your Next.js config
});
```
### 2.更新 `tsconfig.json`
在 `tsconfig.json` 中添加以下配置，以确保 TypeScript 能正确识别 PWA 相关类型：

```json
{
  // Other stuff...
  "compilerOptions": {
    // Other options...
    "types": [
      // Other types...
      // This allows Serwist to type `window.serwist`.
      "@serwist/next/typings"
    ],
    "lib": [
      // Other libs...
      // Add this! Doing so adds WebWorker and ServiceWorker types to the global.
      "webworker"
    ],
  },
  "exclude": ["public/sw.js"]
}
```

### 3.更新 `.gitignore`
在 `.gitignore` 文件中添加以下内容，以忽略生成的 Service Worker 文件：
```
# Serwist
public/sw*
public/swe-worker*
```

### 4.创建 Service Worker 文件
在 `app` 目录下创建 `sw.ts` 文件，内容如下：
```typescript
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
});

serwist.addEventListeners();
```

### 5.添加 `metadata`
在 `app/layout.ts` 文件中添加 PWA 相关的元数据：
```typescript
import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

const APP_NAME = "PWA App";
const APP_DEFAULT_TITLE = "My Awesome PWA App";
const APP_TITLE_TEMPLATE = "%s - PWA App";
const APP_DESCRIPTION = "Best PWA app in the world!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr">
      <head />
      <body>{children}</body>
    </html>
  );
}
```

### 6.生成图标
在 `public/icons` 目录下添加应用图标。可以使用在线工具生成不同尺寸的图标，也可以使用下列命令生成：
```bash
# npx vue-pwa-asset-generator -a {512x512_png_source | svg_source} [-o {output_folder} [-b {fallback background color}]]
npx vue-pwa-asset-generator -a .\logo.png -b "#000000" -o icons
```

> [https://github.com/elegantapp/pwa-asset-generator](https://github.com/elegantapp/pwa-asset-generator)
> 
> [https://github.com/jcalixte/vue-pwa-asset-generator](https://github.com/jcalixte/vue-pwa-asset-generator)

### 7.添加 Manifest 文件
在 `app/manifest.json` 文件中添加 PWA 的相关信息：
```json
{
  "name": "PWA App",
  "short_name": "PWA",
  "description": "Best PWA app in the world!",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#FFFFFF",
  "background_color": "#FFFFFF",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/icons/android-chrome-maskable-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable"
    },
    {
      "src": "/icons/android-chrome-maskable-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
    ... ... // 其他图标
  ]
}
```

## 测试 PWA
本地运行 PWA 功能，确保一切正常工作。可以使用 Chrome DevTools 进行调试和测试。
1. 启动 Next.js 项目：
   ```bash
   pnpm dev
   ```
   
2. 打开浏览器，访问 `http://localhost:3000`。
3. 打开 Chrome DevTools，切换到 **Application** 面板。
4. 在左侧导航栏中找到 **Manifest**，检查 PWA 的相关信息是否正确显示。
5. 在 **Service Workers** 部分，确认 Service Worker 已成功注册。
6. 在 **Cache Storage** 中查看缓存的资源列表，确保应用资源已被正确缓存。
7. 在浏览器地址栏中，点击 **添加到主屏幕** 按钮，确认 PWA 能够成功安装到桌面或移动设备上。
8. 在离线状态下重新加载页面，确认应用能够正常工作。
9. 在 **Network** 面板中，检查资源是否从缓存中加载，确保离线访问功能正常。
10. 在 **Console** 面板中，查看是否有任何错误或警告信息，确保 PWA 功能正常。
11. 在 **Lighthouse** 面板中运行 PWA 性能测试，查看得分和建议。

生产环境部署时，请确保使用 HTTPS 协议提供服务，以满足 PWA 的安全要求。

> [https://serwist.pages.dev/docs/next/getting-started](https://serwist.pages.dev/docs/next/getting-started)

> [next.js pwa demo 项目](https://github.com/Keekuun/nextjs-dashboard)
