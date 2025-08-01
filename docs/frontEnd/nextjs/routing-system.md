---
title: Next.js 文件路由系统
sidebar: auto
date: 2025-06-20
categories: 
- Next.js
- 前端
tags: 
- Next.js
---

### 核心理念：一切始于 `app` 目录

在 Next.js 项目的根目录下，有一个特殊的 `app` 文件夹。你网站的所有路由、UI 和逻辑都存放在这里。

*   **文件夹即路由段 (Segments):** `app` 目录下的每个文件夹都代表一个 URL 的路径段。
*   **`page.tsx` 文件定义页面:** 只有当一个文件夹中包含 `page.tsx` (或 `.js`, `.jsx`) 文件时，它才成为一个公开可访问的路由。

### 1. 基础路由 (Static Routes)

这是最简单的形式。文件夹结构直接映射到 URL 结构。

*   `app/page.tsx` -> `/` (网站根目录)
*   `app/about/page.tsx` -> `/about`
*   `app/dashboard/settings/page.tsx` -> `/dashboard/settings`

**示例: `app/about/page.tsx`**
```typescript
// 这是一个服务端组件 (Server Component) by default
export default function AboutPage() {
  return (
    <div>
      <h1>About Us</h1>
      <p>This is the about page.</p>
    </div>
  );
}
```
当你访问 `http://yourdomain.com/about` 时，Next.js 就会渲染这个组件。

### 2. 动态路由 (Dynamic Segments)

在实际应用中，很多页面路径是动态的，比如用户个人主页、产品详情页等。这时就需要动态路由。

通过在文件夹名外包裹方括号 `[]` 来创建动态段。例如 `[slug]`, `[id]`。

*   `app/blog/[slug]/page.tsx` -> `/blog/post-1`, `/blog/another-post`, 等。
*   `app/products/[id]/page.tsx` -> `/products/123`, `/products/abc-xyz`, 等。

**如何访问动态参数？**
动态段的名称会作为 `params` 对象的属性传递给 `page`、`layout` 等组件。

**示例: `app/blog/[slug]/page.tsx`**
```typescript
// slug 的类型可以根据你的需要更精确，比如 string
interface BlogPageProps {
  params: {
    slug: string;
  };
}

// 这是一个服务端组件，可以直接进行数据获取
export default async function BlogPostPage({ params }: BlogPageProps) {
  // params.slug 的值就是 URL中的动态部分, e.g., "post-1"
  // 你可以用它来从数据库或 CMS 获取数据
  // const post = await getPostData(params.slug);

  return (
    <article>
      <h1>Blog Post: {params.slug}</h1>
      {/* <div>{post.content}</div> */}
    </article>
  );
}
```

### 3. 特殊文件约定 (Special File Conventions)

App Router 的强大之处在于它不仅仅用 `page.tsx` 定义页面，还提供了一系列具有特殊功能的文件，用于构建复杂的 UI 布局和处理各种状态。

#### `layout.tsx` - 共享布局
这是最重要的特殊文件之一。它用于定义在某个路由段及其所有子路由中共享的 UI。

*   一个 `layout.tsx` 必须 `export default` 一个接收 `children` prop 的 React 组件。
*   `app` 目录下的根 `layout.tsx` (即 `app/layout.tsx`) 是必须的，它定义了整个应用的 HTML 骨架。

**示例: `app/dashboard/layout.tsx`**
```typescript
import { ReactNode } from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

// 这个布局会应用到所有 /dashboard/* 下的页面
export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div style={{ display: 'flex' }}>
      <DashboardSidebar />
      <main style={{ flexGrow: 1, padding: '1rem' }}>
        {/* 子页面 (e.g., /dashboard/settings/page.tsx) 或嵌套布局会在这里渲染 */}
        {children}
      </main>
    </div>
  );
}
```

#### `loading.tsx` - 加载状态 UI
Next.js 会自动使用这个文件，结合 React Suspense，在你页面组件的数据正在加载时显示一个即时的加载 UI。

*   当同级目录下的 `page.tsx` 及其子组件是服务端组件并正在进行 `await` 数据获取时，`loading.tsx` 就会显示。

**示例: `app/dashboard/loading.tsx`**
```typescript
export default function DashboardLoading() {
  // 你可以在这里放一个骨架屏 (Skeleton) 或加载动画
  return <div>Loading dashboard data...</div>;
}
```

#### `error.tsx` - 错误处理 UI
用于在该路由段及其子路由中捕获运行时错误，并优雅地显示一个错误界面，同时提供一个重试功能。

*   **`error.tsx` 必须是一个客户端组件 (`'use client'`)**。
*   它接收 `error` 和 `reset` 两个 props。

**示例: `app/dashboard/error.tsx`**
```typescript
'use client'; // 错误组件必须是客户端组件

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void; // 调用此函数会尝试重新渲染该路由段
}

export default function DashboardError({ error, reset }: ErrorProps) {
  return (
    <div>
      <h2>Something went wrong in the dashboard!</h2>
      <p>{error.message}</p>
      <button onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
```

#### `not-found.tsx` - 404 页面
用于渲染一个自定义的 404 Not Found 页面。当你在服务端组件中调用 `notFound()` 函数时，或者用户访问一个不存在的 URL 时，Next.js 会寻找并渲染最近的 `not-found.tsx`。

**示例: `app/not-found.tsx` (全局 404 页面)**
```typescript
import Link from 'next/link';

export default function NotFound() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>Could not find the requested page.</p>
      <Link href="/">Return Home</Link>
    </div>
  );
}
```

#### `route.ts` - API 端点
如果你需要创建 API 接口（类似于 `pages/api` 的功能），可以在任何文件夹下创建 `route.ts` 文件。它通过导出名为 `GET`, `POST`, `PUT`, `DELETE` 等的函数来定义 HTTP 方法。

**示例: `app/api/hello/route.ts`**
```typescript
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Hello, World!' });
}
```
访问 `http://yourdomain.com/api/hello` 会得到一个 JSON 响应。

### 4. 高级路由模式

#### 路由组 (Route Groups)
有时候你希望将一些路由组织在一起，但不希望这个组织用的文件夹名出现在 URL 中。这时可以用圆括号 `()` 包裹文件夹名。

**用途：**
1.  **代码组织:** 将功能相关的路由放在一起。
2.  **创建不同的根布局:** 为应用的不同部分（如营销页面和应用主面板）应用不同的根布局。

**示例:**
*   `app/(marketing)/about/page.tsx` -> URL 仍然是 `/about`
*   `app/(shop)/products/page.tsx` -> URL 仍然是 `/products`

你可以为 `(marketing)` 和 `(shop)` 分别创建 `layout.tsx`，从而实现 `/about` 和 `/products` 拥有完全不同的根布局，而它们又共享同一个根 `app/layout.tsx`。

#### 捕获所有段 (Catch-all Segments)
如果你想让一个路由匹配所有后续的路径段，可以在动态路由的方括号内加上三个点 `...`。

*   `app/docs/[...slug]/page.tsx`
    *   匹配 `/docs/getting-started` (`slug` 是 `['getting-started']`)
    *   匹配 `/docs/api/components/button` (`slug` 是 `['api', 'components', 'button']`)

#### 可选的捕获所有段 (Optional Catch-all Segments)
在 `[...slug]` 的基础上再加一层方括号 `[[...slug]]`，可以让它也匹配没有任何子路径的根路径。

*   `app/shop/[[...filters]]/page.tsx`
    *   匹配 `/shop` (`filters` 是 `undefined`)
    *   匹配 `/shop/t-shirts` (`filters` 是 `['t-shirts']`)
    *   匹配 `/shop/t-shirts/blue` (`filters` 是 `['t-shirts', 'blue']`)

### 5. 程序化导航 (Programmatic Navigation)

在组件中进行导航，主要有两种方式：

1.  **`<Link>` 组件 (推荐)**: 这是在页面间导航的标准方式，它会自动预取页面，实现快速的客户端导航。

    ```typescript
    import Link from 'next/link';
  
    <Link href="/dashboard">Go to Dashboard</Link>
    ```

2.  **`useRouter` Hook (客户端组件)**: 用于在事件处理器等函数逻辑中进行导航。

    ```typescript
    'use client';
  
    import { useRouter } from 'next/navigation'; // 注意是从 'next/navigation' 导入
  
    export default function MyComponent() {
      const router = useRouter();
  
      const handleLogin = () => {
        // ...登录逻辑...
        router.push('/dashboard');
      };
  
      return <button onClick={handleLogin}>Login</button>;
    }
    ```

### 总结

| 文件/文件夹 | 作用 | URL 影响 |
| :--- | :--- | :--- |
| `app/` | 路由系统的根目录 | - |
| `folder/` | 创建一个新的 URL 路径段 | `.../folder` |
| `page.tsx` | 创建一个公开可访问的页面 | 是 |
| `layout.tsx` | 定义共享 UI 布局 | 否 |
| `loading.tsx` | 定义加载中状态的 UI (Suspense 边界) | 否 |
| `error.tsx` | 定义错误状态的 UI (Error 边界) | 否 |
| `not-found.tsx` | 定义 404 页面的 UI | 否 |
| `route.ts` | 创建 API 端点 | 是 |
| `[slug]/` | 动态路由段 | `.../dynamic-value` |
| `[...slug]/` | 捕获所有后续路由段 | `.../a/b/c` |
| `[[...slug]]/` | 可选的捕获所有路由段 | `...` 或 `.../a/b` |
| `(group)/` | 路由组，用于组织代码或布局，不影响 URL | 否 |

这个基于文件和约定的系统非常强大，一旦熟悉了这些规则，构建和管理复杂的 Web 应用会变得异常高效和直观。
