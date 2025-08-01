---
title: Next.js 中的一些专门的hooks
sidebar: auto
date: 2025-06-23
categories:
- Next.js
- 前端
tags:
- Next.js
---

首先，一个至关重要的概念是：**在 Next.js App Router 中，React Hooks 只能在客户端组件 (Client Components) 中使用。** 你通过在文件顶部添加 `'use client';` 指令来标记一个组件为客户端组件。服务端组件 (Server Components) 无法使用 Hooks，因为它们在服务器上渲染，没有交互性或生命周期。

### 核心 Hooks (来自 `next/navigation`)

这些是日常开发中最常使用的 Hooks，它们负责处理路由和导航。

---

#### 1. `useRouter()`

这是用于程序化导航的核心 Hook。它返回一个 router 实例，你可以用它来跳转页面、刷新数据等。

*   **用途**: 在事件处理函数（如点击按钮、提交表单）后进行页面跳转。

*   **最佳实践案例**:
    *   **表单提交后跳转**: 用户登录或创建文章后，将他们重定向到个人主页或文章详情页。
    *   **使用 `router.refresh()`**: 当你执行了一个会改变数据库中数据的操作（如更新用户信息），但又不希望整个页面重新加载时，`router.refresh()` 是一个绝佳的选择。它会重新从服务器获取数据（重新运行 Server Components），但会保留客户端的状态（如 `useState`、`useRef`），提供无缝的更新体验。
    *   **区分 `push` 和 `replace`**: 使用 `router.push('/dashboard')` 会在浏览器历史记录中添加一个新条目。而 `router.replace('/dashboard')` 会替换当前的历史记录条目，用户无法通过“后退”按钮返回到之前的页面（非常适合登录流程）。

**代码示例: 更新用户资料**

```typescript
// components/ProfileForm.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function ProfileForm({ userId }: { userId: string }) {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
  
    // 1. 调用 API 更新用户信息
    await fetch(`/api/users/${userId}`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });

    // 2. 最佳实践：使用 router.refresh()
    // 这会重新获取服务器数据（比如页面上显示用户名的部分）
    // 但不会丢失此组件或其他客户端组件的状态，体验非常好。
    router.refresh(); 
  
    // 如果需要跳转，可以这样做：
    // router.push('/profile/success');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button type="submit">Update Name</button>
    </form>
  );
}
```

---

#### 2. `usePathname()`

一个只读的 Hook，返回当前页面的 URL 路径名 (pathname)。

*   **用途**: 根据当前路径动态改变 UI，最常见的场景是导航栏的高亮状态。

*   **最佳实践案例**: 创建一个可复用的 `NavLink` 组件，当它的 `href` 与当前 `pathname` 匹配时，自动添加高亮样式。

**代码示例: 动态导航链接**

```typescript
// components/NavLink.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} style={{ color: isActive ? 'blue' : 'black' }}>
      {children}
    </Link>
  );
}

// 在你的导航栏中使用
// <nav>
//   <NavLink href="/">Home</NavLink>
//   <NavLink href="/about">About</NavLink>
//   <NavLink href="/products">Products</NavLink>
// </nav>
```

---

#### 3. `useSearchParams()`

一个只读的 Hook，返回一个 `URLSearchParams` 接口的实例，让你能够方便地读取 URL 中的查询参数（`?` 后面的部分）。

*   **用途**: 实现基于 URL 查询参数的过滤、排序和分页功能。

*   **最佳实践案例**:
    *   构建一个产品列表页，用户可以通过 URL (`/products?category=electronics&sort=price_desc`) 来筛选和排序。
    *   将 `useSearchParams` 与 `useRouter` 和 `usePathname` 结合，以编程方式更新查询参数，同时保持现有参数不变。

**代码示例: 产品搜索和过滤**

```typescript
// components/ProductFilters.tsx
'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // 只读的

  const handleCategoryChange = (category: string) => {
    // 最佳实践：创建一个新的 URLSearchParams 实例来修改参数
    // 这可以避免直接操作字符串，更健壮。
    const currentParams = new URLSearchParams(searchParams.toString());
  
    if (category) {
      currentParams.set('category', category);
    } else {
      currentParams.delete('category');
    }

    // 将用户导航到带有新查询参数的 URL
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const currentCategory = searchParams.get('category');

  return (
    <div>
      <p>Current Category: {currentCategory || 'All'}</p>
      <button onClick={() => handleCategoryChange('electronics')}>Electronics</button>
      <button onClick={() => handleCategoryChange('books')}>Books</button>
      <button onClick={() => handleCategoryChange('')}>Clear</button>
    </div>
  );
}
```

---

#### 4. `useParams()`

一个只读的 Hook，返回一个包含当前路由动态段参数的对象。

*   **用途**: 在动态路由页面（如 `app/blog/[slug]/page.tsx`）中获取动态参数的值（如 `slug`）。

*   **最佳实践案例**: 在博客文章、产品详情或用户个人资料等页面中，获取其唯一标识符以加载相应的数据。

**代码示例: 博客文章页面**

```typescript
// app/blog/[slug]/page.tsx 
// 这个组件本身是 Server Component，但它可以将 params 传递给 Client Component

// components/PostContent.tsx (Client Component)
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// 虽然可以直接从 page props 获取 params，但这个例子展示了在子客户端组件中如何使用 hook
export function PostContent() {
  const params = useParams(); // params 会是 { slug: 'my-first-post' }
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (slug) {
      // 根据 slug 从 API 获取文章内容
      fetch(`/api/posts/${slug}`)
        .then(res => res.json())
        .then(data => setPost(data));
    }
  }, [slug]);

  if (!post) return <div>Loading...</div>;

  return <h1>{post.title}</h1>;
}
```

### 进阶 Hooks

这些 Hooks 用于更特定的场景。

---

#### 5. `useSelectedLayoutSegment(s)()`

*   **用途**: 获取 URL 路径中，某个 `layout.tsx` 下一级的活动路径段（segment）。这比 `usePathname` 更具体，它只关心布局的直属子级。
*   **最佳实践案例**: 当你有一个复杂的嵌套布局（如带有多级 Tab 的仪表盘），并且希望父布局能知道哪个子 Tab 是激活状态时，这个 Hook 非常有用。

**代码示例: 仪表盘的 Tab 布局**

```typescript
// app/dashboard/layout.tsx
'use client';

import { useSelectedLayoutSegment } from 'next/navigation';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // 当 URL 是 /dashboard/settings 时, segment 是 'settings'
  // 当 URL 是 /dashboard/analytics 时, segment 是 'analytics'
  // 当 URL 是 /dashboard 时, segment 是 null
  const segment = useSelectedLayoutSegment();

  return (
    <div>
      <nav>
        <Link href="/dashboard/settings" style={{ textDecoration: segment === 'settings' ? 'underline' : 'none' }}>
          Settings
        </Link>
        <Link href="/dashboard/analytics" style={{ textDecoration: segment === 'analytics' ? 'underline' : 'none' }}>
          Analytics
        </Link>
      </nav>
      {children}
    </div>
  );
}
```

### 总结：最佳实践清单

| Hook | 主要用途 | 关键最佳实践 |
| :--- | :--- | :--- |
| **`useRouter`** | 程序化导航、刷新数据 | 使用 `router.refresh()` 实现无缝数据更新；在登录后使用 `router.replace()`。 |
| **`usePathname`** | 读取当前路径，用于 UI 逻辑 | 创建可复用的高亮 `NavLink` 组件，提高代码整洁度。 |
| **`useSearchParams`** | 读取 URL 查询参数 | 结合 `URLSearchParams` API 来安全地构造新的查询字符串，避免手动拼接。 |
| **`useParams`** | 读取动态路由参数 | 在动态页面（如 `[id]`, `[slug]`）中获取唯一标识符。 |
| **`useSelectedLayoutSegment`** | 识别布局下的活动子路由 | 用于嵌套布局中的 Tab 或侧边栏高亮，比 `usePathname` 更精确。 |

牢记这些 Hooks 的用途和最佳实践，可以让你在 Next.js App Router 中构建出交互性强、代码优雅且性能卓越的用户界面。
