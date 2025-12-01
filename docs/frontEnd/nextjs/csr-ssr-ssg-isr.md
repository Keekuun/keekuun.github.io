---
title: Next.js (App Router) 渲染方式
sidebar: auto
date: 2025-06-20
categories: 
- Next.js
- 前端
tags: 
- Next.js
---

本文详细解读 Next.js 中这些至关重要的渲染策略：CSR、SSR、SSG 和 ISR。理解它们的区别和实现原理，是掌握 Next.js、优化应用性能和用户体验的关键。

### 渲染策略概览

在 Web 开发中，“渲染”指的是将代码（如 React 组件）转换为用户可以在浏览器中看到和交互的 HTML 和 CSS 的过程。这个过程可以在不同的时间和地点发生，从而衍生出不同的渲染策略。

| 策略 | 全称 | 渲染发生地 | 渲染时机 |
| :--- | :--- | :--- | :--- |
| **CSR** | Client-Side Rendering | 浏览器 | 每次访问时 |
| **SSR** | Server-Side Rendering | 服务器 | 每次请求时 |
| **SSG** | Static Site Generation | 服务器 | 构建应用时 |
| **ISR** | Incremental Static Regeneration| 服务器 | 构建时 + 后台按需 |

---

### 1. CSR (客户端渲染 - Client-Side Rendering)

#### 概念
CSR 是传统 React 单页应用（SPA）的模式。服务器发送一个近乎空白的 HTML 文件和一个巨大的 JavaScript 包。浏览器下载并执行这个 JS 包，然后由 JS 代码获取数据、渲染组件，最终生成完整的页面。

#### 实现原理 / 工作流程
1.  用户请求页面。
2.  服务器立即响应一个“空壳” HTML 文件和一个 `<script>` 标签，指向 JavaScript 文件。
    ```html
    <!DOCTYPE html>
    <html>
      <head>...</head>
      <body>
        <div id="root"></div> <!-- 通常只有一个挂载点 -->
        <script src="/_next/static/chunks/app.js"></script> <!-- 大量的 JS -->
      </body>
    </html>
    ```
3.  浏览器下载并执行 `app.js`。
4.  JavaScript 代码（例如在 `useEffect` Hook 中）向 API 发起数据请求。
5.  数据返回后，React 将数据和组件结合，在浏览器中生成 DOM，并挂载到 `<div id="root"></div>`。
6.  页面最终变得可见且可交互。

#### Next.js 中的实现 (App Router)
在 App Router 中，任何组件只要在文件顶部声明了 **`'use client';`**，它及其所有子组件就会变成客户端组件，采用 CSR 模式（或 SSR 后的 Hydration 模式）。

**`app/dashboard/page.tsx`**
```typescript
'use client'; // 关键指令：标记为客户端组件

import { useState, useEffect } from 'react';

interface UserData {
  name: string;
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 这个 fetch 在浏览器中执行
    fetch('/api/user/profile')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setIsLoading(false);
      });
  }, []); // 空依赖数组，仅在组件挂载时执行一次

  if (isLoading) {
    return <div>Loading your dashboard...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}</h1>
      <p>Email: {user?.email}</p>
    </div>
  );
}
```

#### 优缺点
*   **优点:**
    *   页面切换快：后续导航无需刷新页面，只更新变化的部分，体验流畅。
    *   服务端压力小：服务器只负责提供静态资源和 API。
*   **缺点:**
    *   **首屏加载慢 (FCP/LCP 差):** 需要下载、解析和执行大量 JS 后才能看到内容。
    *   **SEO 不友好:** 搜索引擎爬虫可能无法正确执行 JS，导致抓取到的是空内容。

#### 适用场景
*   需要高度交互的应用，如后台管理面板、复杂的表单应用、在线编辑器等。
*   内容在登录后才可见，对 SEO 没有要求的页面。

---

### 2. SSR (服务端渲染 - Server-Side Rendering)

#### 概念
对于每一个用户的请求，服务器都会获取最新数据，将 React 组件渲染成完整的 HTML 字符串，然后将这个 HTML 发送给浏览器。浏览器接收到后能立即显示页面内容。之后，JS 代码在后台“注水”（Hydration），让页面变得可交互。

#### 实现原理 / 工作流程
1.  用户请求页面。
2.  Next.js 服务器接收到请求。
3.  服务器执行页面组件的代码，包括其中的数据获取逻辑 (`fetch`)。
4.  服务器等待数据返回，然后将数据和组件渲染成一个完整的 HTML 字符串。
5.  服务器将这个完整的 HTML 响应给浏览器。
6.  浏览器立即渲染 HTML，用户看到完整内容的页面（但还不可交互）。
7.  浏览器下载页面所需的 JS。
8.  JS 执行，将事件监听器等附加到已存在的 DOM 上（这个过程叫 Hydration），页面变得可交互。

#### Next.js 中的实现 (App Router)
在 App Router 中，**服务端组件是默认的**。任何没有 `'use client';` 指令的组件都是服务端组件。要实现动态的 SSR（即每次请求都重新渲染），你需要使用动态函数或设置 `fetch` 的缓存策略。

**`app/profile/[id]/page.tsx`**
```typescript
import { cookies } from 'next/headers'; // 使用动态函数会强制 SSR

interface UserProfileProps {
  params: { id: string };
}

// 这是一个服务端组件 (默认行为)
// async 关键字允许我们在组件内部直接 await 数据
export default async function UserProfilePage({ params }: UserProfileProps) {
  // 使用 cookies() 或 headers() 会使页面动态化，每次请求都重新渲染
  const cookieStore = cookies(); 
  const token = cookieStore.get('token')?.value;

  // 这个 fetch 在服务器上为每个请求执行
  // 'no-store' 确保数据总是最新的
  const res = await fetch(`https://api.example.com/users/${params.id}`, {
    cache: 'no-store', // 关键：禁用缓存，强制 SSR
    headers: { Authorization: `Bearer ${token}` },
  });
  const user = await res.json();

  return (
    <div>
      <h1>{user.name}'s Profile</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

#### 优缺点
*   **优点:**
    *   **极佳的 SEO:** 搜索引擎能直接抓取到完整的页面内容。
    *   **更快的可感知加载速度 (FCP):** 用户能更快看到内容，无需等待 JS 加载。
*   **缺点:**
    *   **服务器压力大:** 每个请求都需要服务端计算，增加了服务器成本和负载。
    *   **TTFB (Time to First Byte) 可能较慢:** 服务器需要完成数据获取和渲染后才能响应。

#### 适用场景
*   内容高度动态、个性化且需要 SEO 的页面。例如：新闻源、社交媒体时间线、电商搜索结果页。

---

### 3. SSG (静态站点生成 - Static Site Generation)

#### 概念
在**构建时 (build time)**，Next.js 就提前将所有页面渲染成静态的 HTML 文件。当用户请求页面时，服务器（通常是 CDN）直接返回这个已经生成好的 HTML 文件，无需任何实时计算。

#### 实现原理 / 工作流程
1.  开发者运行 `next build` 命令。
2.  Next.js 遍历所有可以静态生成的页面。
3.  对于每个页面，它获取所需数据，并将其渲染成一个 `page.html` 文件。
4.  所有生成的 HTML、CSS、JS 文件被部署到静态托管服务（如 Vercel, Netlify, CDN）。
5.  用户请求页面。
6.  CDN 直接将对应的 `page.html` 文件以最快的速度返回给用户。

#### Next.js 中的实现 (App Router)
在 App Router 中，如果一个页面**不使用任何动态函数**（如 `cookies()`, `headers()`）并且其 `fetch` 请求**没有禁用缓存**，那么它**默认就是 SSG**。

**`app/posts/[slug]/page.tsx`**
```typescript
interface PostPageProps {
  params: { slug: string };
}

// 1. 告诉 Next.js 在构建时要生成哪些动态页面
export async function generateStaticParams() {
  const res = await fetch('https://.../posts');
  const posts = await res.json();

  // 返回一个 params 数组，Next.js 会为每个对象生成一个静态页面
  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

// 2. 页面组件本身
export default async function PostPage({ params }: PostPageProps) {
  // 这个 fetch 在构建时执行
  const res = await fetch(`https://.../posts/${params.slug}`); // 默认缓存
  const post = await res.json();

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
```

#### 优缺点
*   **优点:**
    *   **速度极快:** 页面直接从 CDN 边缘节点提供，TTFB 几乎为零。
    *   **高可用、高安全性:** 没有实时服务器计算，减少了攻击面和故障点。
    *   **服务器成本极低:** 静态文件托管非常便宜。
*   **缺点:**
    *   **数据可能过时:** 内容只在构建时更新。任何数据变更都需要重新构建和部署整个站点。
    *   **构建时间长:** 如果有成千上万个页面，构建过程会非常耗时。

#### 适用场景
*   内容不经常变动的网站。例如：博客、文档站、营销页面、作品集。

---

### 4. ISR (增量静态再生 - Incremental Static Regeneration)

#### 概念
ISR 是 SSG 和 SSR 的完美结合。它首先在构建时生成一个静态页面（像 SSG），但同时设定一个“保质期”。当用户在保质期过后访问页面时，他们会先看到旧的静态页面（速度快），同时 Next.js 会在后台触发一次页面重新生成。下次再有用户访问时，他们就会看到这个全新的页面。

#### 实现原理 / 工作流程
1.  **构建时:** 与 SSG 一样，生成一个初始版本的静态页面。
2.  **第一个请求 (保质期内):** 用户立即收到静态页面。
3.  **第一个请求 (保質期后):**
    a. 用户**立即**收到**旧的 (stale)** 静态页面。
    b. **同时**，Next.js 在后台服务器上重新获取数据并渲染新页面。
    c. 渲染完成后，用新页面替换掉 CDN 上的旧页面。
4.  **后续请求:** 用户会收到这个新鲜出炉的页面，直到下一个保质期结束。

#### Next.js 中的实现 (App Router)
实现 ISR 非常简单，只需在 `fetch` 请求中添加 `revalidate` 选项。

**`app/products/[id]/page.tsx`**
```typescript
interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  // 这个 fetch 请求的结果会被缓存 60 秒
  const res = await fetch(`https://api.example.com/products/${params.id}`, {
    next: { revalidate: 60 }, // 关键：每 60 秒最多重新生成一次
  });
  const product = await res.json();

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>Price: ${product.price}</span>
    </div>
  );
}
```
此外，你还可以通过 Server Action 或 API 路由调用 `revalidatePath` 或 `revalidateTag` 来实现**按需 ISR (On-demand ISR)**，即在特定事件（如商品信息更新）发生时主动触发页面重新生成，而不是被动等待。

#### 优缺点
*   **优点:**
    *   **兼具静态速度和动态数据:** 用户总能快速获得响应，同时数据又能保持相对新鲜。
    *   **高容错性:** 即使后台数据源宕机，用户依然能看到旧的静态页面。
    *   **减轻服务器压力:** 避免了 SSR 的每次请求都计算。
*   **缺点:**
    *   **数据非实时:** 用户可能会在短时间内看到旧数据。

#### 适用场景
*   内容需要更新，但不需要实时性的页面。例如：电商的产品详情页（价格可能偶尔变动）、新闻文章、热门评论区。

### 总结与选择

| 特性 | CSR (客户端渲染) | SSR (服务端渲染) | SSG (静态站点生成) | ISR (增量静态再生) |
| :--- | :--- | :--- | :--- | :--- |
| **SEO** | 差 | 优秀 | 优秀 | 优秀 |
| **首屏加载 (FCP)** | 慢 | 快 | 最快 | 最快 |
| **数据新鲜度** | 实时 | 实时 | 构建时 | 近实时/可配置 |
| **服务器负载** | 低 (API服务器除外) | 高 | 无 | 低 |
| **TTFB** | 快 | 慢 | 最快 | 最快 |
| **构建时间** | 快 | 快 | 慢 (取决于页面数) | 中等 |

**如何选择？**

Next.js App Router 的最大优势在于你**无需为整个应用选择一种策略**。你可以根据每个页面的特性，甚至每个组件的特性，灵活地混合使用它们：

*   **默认使用服务端组件 (SSR/SSG/ISR)。** 这是最强大的模式，能带来最好的性能和 SEO。
*   如果你的页面内容万年不变，就让它**自然成为 SSG**。
*   如果页面内容需要定期更新但不是实时，使用 `fetch` 的 `revalidate` 选项**实现 ISR**。
*   如果页面内容必须为每个用户实时生成，使用动态函数或 `cache: 'no-store'` **强制 SSR**。
*   **只有当**你需要用户交互（如 `onClick`, `useState`）时，才将那部分组件抽离出来，并添加 `'use client';`，使其**成为客户端组件 (CSR)**。

---


### 核心理念：服务端优先，按需客户端

在 Next.js App Router 中，**所有组件默认都是在服务端渲染的 React 服务端组件 (RSC)**。你只需要在必要时，通过添加 `'use client';` 指令，将组件“降级”为客户端组件。

这意味着你的首要思考点是：“我的页面/组件应该如何**在服务端**被渲染？”

---

### 四大渲染方式速查表

| 渲染方式 | 一句话概括 | 何时渲染？ | 数据新鲜度 | 适用场景 | App Router 实现方式 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **静态渲染 (SSG)** | **一次构建，无限次快速服务。** | 构建时 (`next build`) | 静态的 | 博客文章、文档、营销页 | **默认行为。** 只要不使用动态函数和动态 `fetch` 缓存策略即可。 |
| **动态渲染 (SSR)** | **每个请求都在服务器上实时渲染。** | 每一次用户请求时 | 实时 | 个性化仪表盘、需要登录才能看的内容、搜索结果 | 使用动态函数 (`cookies()`, `headers()`) 或 `fetch` 中设置 `cache: 'no-store'`。 |
| **增量静态再生 (ISR)** | **静态的速度，加上自动的后台更新。** | 构建时 + N秒后访问时在后台触发 | 近实时 | 电商产品页、新闻文章、社交媒体帖子 | 在 `fetch` 中设置 `next: { revalidate: N }` (N为秒数)。 |
| **客户端渲染 (CSR)** | **在用户的浏览器中渲染交互界面。** | 浏览器加载 JS 后 | 实时 (加载后) | 需要状态 (`useState`)、事件 (`onClick`)、生命周期 (`useEffect`) 的组件 | 在文件顶部添加 `'use client';` 指令。 |

---

### 如何选择？一份决策指南

你可以按照这个思路来决定使用哪种渲染方式：

1.  **从默认开始：静态渲染 (SSG)**
    *   问问自己：“这个页面的内容可以提前生成吗？”
    *   如果可以，什么都不用做，它默认就是静态的。这是最快、最省成本的方式。

2.  **内容需要更新吗？ -> 增量静态再生 (ISR)**
    *   如果页面内容需要定期更新（比如每小时），但不需要为每个用户都实时变化。
    *   **解决方案**：在数据获取的 `fetch` 中添加 `revalidate` 选项。
    *   `fetch(url, { next: { revalidate: 3600 } })`

3.  **内容必须实时且个性化吗？ -> 动态渲染 (SSR)**
    *   如果页面内容必须根据当前登录的用户、请求头或 URL 参数来实时生成。
    *   **解决方案**：使用 `cookies()`、`headers()` 等动态函数，或者在 `fetch` 中禁用缓存 `cache: 'no-store'`。Next.js 会自动切换到动态渲染。

4.  **组件需要与用户交互吗？ -> 客户端渲染 (CSR)**
    *   如果你的组件需要响应点击事件、管理状态（`useState`）、或者使用浏览器独有的 API。
    *   **解决方案**：将这个组件（以及它的子组件）标记为客户端组件：`'use client';`。

### 关键最佳实践

*   **服务端组件是基础**：你的页面主体和布局应该尽量保持为服务端组件，以获得最佳的加载性能和 SEO。
*   **客户端组件是“孤岛”**：只在必要的地方使用 `'use client';`。将客户端组件想象成插入到服务端渲染的静态 HTML 中的交互式“孤岛”。
*   **最小化客户端组件**：尽量将客户端逻辑下推到组件树的叶子节点。例如，不要把整个页面都标记为 `'use client';`，而只把你真正需要交互的那个 `<SearchBar>` 或 `<Button>` 组件标记为客户端组件。
*   **`fetch` 是渲染的控制器**：在 App Router 中，`fetch` API 被深度集成，它的缓存选项 (`cache`, `revalidate`) 是决定一个服务端组件是静态、动态还是增量再生的关键。

**总而言之，Next.js 的现代渲染模型非常灵活，它鼓励你为应用的每个部分选择最合适的策略，而不是一刀切。**
