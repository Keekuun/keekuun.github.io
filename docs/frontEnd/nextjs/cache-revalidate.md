---
title: Next.js 缓存与重新验证机制
sidebar: auto
date: 2025-06-11
categories: 
- Next.js
- 前端
tags: 
- Next.js
---

## Next.js 缓存与重新验证机制详解

### 一、Next.js 缓存机制详解

Next.js 的缓存是一个精密的多层系统，它协同工作，以在服务器和客户端之间提供极致的速度和灵活性。

#### **第一层：请求记忆化 (Request Memoization) - 厨师的短期记忆**

*   **它是什么？** 在**单次服务端渲染**过程中，对 `fetch` 请求的自动去重。
*   **它在哪里？** 服务器内存中，仅在单次请求-响应周期内有效。
*   **底层原理：** Next.js 自动使用 React 的 `cache` 函数包裹了原生的 `fetch` API。当一个被 `cache` 包裹的函数首次执行时，React 会用函数参数作为键（Key），用返回值作为值（Value），存入一个临时的 Map 中。在同一次渲染树中，后续使用相同参数的调用会直接命中这个 Map，从而避免了重复执行函数体（即重复的网络请求）。这是一种典型的**记忆化（Memoization）**模式。
*   **如何控制：** 对于 `fetch` 是全自动的。如果你有不使用 `fetch` 的自定义数据获取函数（例如直接调用数据库客户端），你应该手动用 `import { cache } from 'react'` 包裹它，以获得同样的好处。

#### **第二层：数据缓存 (Data Cache) - 备好的食材冷库**

*   **它是什么？** 一个**持久化**在服务器端的数据缓存，用于存储 `fetch` 请求的结果。这是实现 SSG（静态站点生成）和 ISR（增量静态再生）的基石。
*   **它在哪里？** 默认在 Next.js 服务器的**文件系统**中（`.next/cache/fetch-cache`）。在 Vercel 等平台上，它会被存储在分布式的边缘缓存网络中，实现全球加速。
*   **底层原理：** Next.js 对 `fetch` API 进行了扩展。当你在服务器组件中调用 `fetch` 时：
    1.  **生成缓存键：** Next.js 会根据请求的 URL、方法（GET）、Headers 和 Body 生成一个唯一的哈希键。
    2.  **查找缓存：** 它会拿着这个键去文件系统（或边缘缓存）中查找对应的缓存条目。
    3.  **处理缓存：**
        *   **命中 (Cache HIT):** 如果找到缓存且未过期（根据 `revalidate` 时间判断），则直接返回缓存数据，**完全跳过网络请求**。
        *   **过时 (Cache STALE):** 如果找到缓存但已过期，Next.js 会**立即返回旧的（stale）数据**给用户，保证快速响应，同时在**后台触发一次新的网络请求**以更新缓存。这被称为 `stale-while-revalidate` 策略。
        *   **未命中 (Cache MISS):** 如果未找到缓存，则发起网络请求，获取数据后，将结果写入缓存，再返回给用户。
*   **如何控制：** 通过 `fetch` 的 `next` 选项：
    *   `{ next: { revalidate: number } }`: 设置以秒为单位的缓存有效期。
    *   `{ next: { tags: string[] } }`: 为缓存打上标签，用于按需失效。
    *   `{ cache: 'no-store' }`: 完全禁用此层缓存，强制动态获取。
    *   `{ cache: 'force-cache' }`: 默认行为，强制使用缓存。

#### **第三层：全路由缓存 (Full Route Cache) - “即取”出餐台**

*   **它是什么？** 缓存一个路由完整渲染后的**最终产物**，包括静态的 HTML 和动态部分的 RSC Payload。
*   **它在哪里？** 在服务器或 CDN 边缘节点上。
*   **底层原理：**
    *   **静态路由：** 如果一个路由及其所有子组件的数据获取都**可以被缓存**（即没有使用 `no-store` 或动态函数如 `cookies()`），Next.js 就认为该路由是**静态的**。
    *   **构建时 (`next build`)：** Next.js 会预渲染所有静态路由，将生成的 HTML 和 RSC Payload 作为静态文件存入缓存。
    *   **请求时：** 对静态路由的请求可以直接由 CDN 或服务器提供这些文件，无需执行任何 React 渲染逻辑，速度极快。
    *   **失效机制：** 这一层的缓存是**被动失效**的。当它所依赖的**数据缓存（第二层）**因为时间到期或按需 `revalidate` 而失效时，全路由缓存会被标记为“脏”。在下一个请求到达时，Next.js 会重新渲染该页面，并将新的产物更新到缓存中。你也可以通过 `revalidatePath` 直接、主动地让它失效。
*   **如何控制：** 间接通过数据缓存策略控制，或通过 `revalidatePath('/path-to-revalidate')` 主动控制。

#### **第四层：路由缓存 (Router Cache) - 服务员的托盘**

*   **它是什么？** 一个**客户端**的、存在于**浏览器内存中**的缓存。它存储了用户已访问过的路由的 RSC Payload。
*   **它在哪里？** 用户浏览器的内存中，刷新页面即消失。
*   **底层原理：**
    *   **RSC Payload：** 这是 App Router 的核心。服务器组件在服务器上渲染后，不会生成 HTML 字符串，而是生成一种紧凑的、描述 UI 结构和内容的虚拟 DOM 格式（RSC Payload）。
    *   **导航：** 当你使用 `<Link>` 组件导航时，Next.js 客户端路由会：
        1.  **预取 (Prefetch)：** 默认情况下，当 `<Link>` 进入视口，客户端会**预先获取**目标路由的 RSC Payload 并存入路由缓存。
        2.  **点击导航：** 点击时，如果缓存中已有 Payload，React 会直接用它在客户端渲染出新页面的 UI，**无需整页刷新**，实现了极快的“应用内”导航体验。
        3.  **状态保持：** 由于只是部分更新，共享的 `layout.js` 组件及其 `useState` 状态会被保留，不会重置。
*   **如何控制：**
    *   `router.refresh()`: 这是主要的控制手段。它会清空**当前路由**的路由缓存，并向服务器请求最新的 RSC Payload，用于在不丢失共享布局状态的情况下更新页面内容。
    *   **缓存寿命：** 缓存有自动的有效期（动态页面30秒，静态页面5分钟），以确保用户最终能看到更新。

---

### 二、最佳实践 (Best Practices)

根据你的应用场景，选择合适的缓存策略组合是关键。

#### 1. **优先静态化：最大化性能**
*   **场景：** 博客、文档、营销网站、公司官网等内容不频繁变更的页面。
*   **实践：**
    *   在获取数据时，**不要**添加任何 `revalidate` 或 `cache` 选项，让 `fetch` 使用默认的永久缓存策略。
    *   `next build` 会将这些页面完全静态化，部署后由 CDN 全球分发，提供最佳的加载性能（TTFB 极低）。
    *   当内容更新时（例如，通过 CMS），使用**按需重新验证 (On-Demand Revalidation)**。

#### 2. **按需重新验证：内容驱动型应用的首选**
*   **场景：** 新闻网站、电商商品列表、内容管理系统（CMS）驱动的页面。
*   **实践：**
    *   **为数据打标签 (Tagging):** 在 `fetch` 时，根据数据类型打上精细的标签。
        ```javascript
        // 获取所有文章列表
        fetch('.../posts', { next: { tags: ['posts'] } });
        // 获取单篇文章
        fetch(`.../posts/${id}`, { next: { tags: ['posts', `post:${id}`] } });
        ```
    *   **设置 Webhook:** 在你的 CMS 或后台系统中，当内容发生变化时，调用一个安全的 API 路由。
    *   **在 API 路由中触发失效:**
        ```javascript
        // app/api/revalidate/route.js
        import { revalidateTag } from 'next/cache';
      
        export async function POST(request) {
          const { secret, tag } = await request.json();
          if (secret !== process.env.REVALIDATION_TOKEN) {
            return Response.json({ message: 'Invalid token' }, { status: 401 });
          }
          if (!tag) {
            return Response.json({ message: 'Tag is required' }, { status: 400 });
          }
          revalidateTag(tag); // e.g., 'posts' 或 'post:123'
          return Response.json({ revalidated: true, now: Date.now() });
        }
        ```
    *   **优势：** 实现了内容的即时更新，同时在绝大多数时间里享受静态缓存带来的性能优势。

#### 3. **增量静态再生 (ISR)：平衡时效与性能**
*   **场景：** 社交媒体 Feed、热门榜单、股票信息等需要定期刷新但又能容忍短暂延迟的页面。
*   **实践：**
    *   使用基于时间的重新验证。
        ```javascript
        // 每分钟更新一次排行榜
        fetch('.../leaderboard', { next: { revalidate: 60 } });
        ```
    *   **优势：** 自动保持内容新鲜，无需手动干预，同时有效减少了对数据源的请求压力。

#### 4. **策略性地选择动态渲染**
*   **场景：** 用户仪表盘、购物车、基于 Cookie 或地理位置的个性化内容。
*   **实践：**
    *   **对于整个页面：** 如果整个页面都必须是动态的，可以在页面文件顶部导出 `export const dynamic = 'force-dynamic';`。这等同于将页面内所有 `fetch` 都设置为 `cache: 'no-store'`。
    *   **对于部分组件：** 这是 App Router 的强大之处。你可以让一个页面主体是静态缓存的，但其中一小部分组件（如显示用户名的 `Header`）是动态的。只需在该组件的数据获取中使用 `cache: 'no-store'` 或动态函数 `cookies()`、`headers()`，Next.js 会在请求时动态渲染这部分，然后将其余静态部分组合起来。
    *   **Server Actions:** 对于表单提交等写操作，使用 Server Actions。成功后，调用 `revalidateTag` 或 `revalidatePath` 来更新受影响的缓存，实现数据的闭环。

#### 5. **理解客户端缓存的交互**
*   **`router.push('/path')` vs `router.refresh()`**
    *   使用 `<Link>` 或 `router.push()` 进行导航时，优先使用**路由缓存（第四层）**，旨在快速切换视图。
    *   当需要**在当前页面**重新获取服务器数据时（例如，提交评论后刷新评论列表），使用 `router.refresh()`。它会绕过路由缓存，向服务器请求新数据，并平滑更新 UI。

### 总结

掌握 Next.js 缓存的关键在于理解其分层模型，并根据你的业务需求做出明智的选择：

*   **默认静态，按需更新** 是最高性能的黄金法则。
*   使用 **Tags** 和 **`revalidateTag`** 来构建事件驱动的、即时更新的系统。
*   使用 **`revalidate: seconds`** 来实现自动、定期的内容刷新。
*   仅在绝对必要时才选择 **`cache: 'no-store'`** 或 `force-dynamic`。
*   善用 **`router.refresh()`** 来在客户端触发服务端数据的刷新。

通过这套组合拳，可以为用户提供闪电般的加载速度和无缝的导航体验，同时保持后台数据的灵活性和实时性。
