---
title: Next.js 中的 layout 与 template
sidebar: auto
date: 2025-06-11
categories: 
- Next.js
- 前端
tags: 
- Next.js
---

## Next.js 中的 `layout.js` 与 `template.js`：深入理解与最佳实践


### 一、核心区别速览

首先，我们用一个表格来快速对比，让你有一个直观的印象。

| 特性 | `layout.js` (布局) | `template.js` (模板) |
| :--- | :--- | :--- |
| **核心行为** | **持久化 (Persistent)** | **重新创建 (Re-created)** |
| **状态保持** | 切换路由时，**保持**组件状态 (`useState`, `useContext`) | 切换路由时，**重置**组件状态 |
| **DOM 元素** | 切换路由时，**不重新渲染**共享的 UI 部分 | 切换路由时，**重新挂载 (remount)** 所有 DOM 元素 |
| **`useEffect` 行为**| 仅在首次加载时运行（或依赖项变化时） | 每次切换路由时都会重新运行 |
| **主要用途** | 共享且不需随路由变化的 UI，如导航栏、页脚、侧边栏 | 需要在路由切换时执行的逻辑，如进入/退出动画、页面浏览量统计 |
| **性能** | **更高**，避免了不必要的重新渲染 | **较低**，因为有完整的挂载和卸载过程 |

**一句话总结：`Layout` 是一个“持久的画框”，你只是在更换里面的“画”（页面）；而 `Template` 是为每一幅“画”都提供一个“全新的画框”。**

---

### 二、`layout.js`：持久化与性能的基石

#### 1. 工作方式

当你定义一个 `layout.js` 文件时，Next.js 会将其渲染为一个 **React 组件**，这个组件会包裹住它的子级路由（`page.js` 或嵌套的 `layout.js`）。

当你通过 `<Link>` 在该布局下的不同页面之间导航时：

*   `Layout` 组件本身**不会被卸载 (unmount)**。
*   只有 `page.js` 组件会被卸载和替换。
*   因为 `Layout` 组件实例得以保留，所以它内部的 React 状态（`useState`）和上下文（`useContext`）也**得以保留**。

#### 2. 底层原理 (The "Why")

这背后的原理是 **React 的组件树调和（Reconciliation）**。

在 Next.js 的路由切换中，`Layout` 组件在组件树中的位置是固定的。当路由变化时，Next.js 会比较新旧组件树，发现 `Layout` 组件的类型和 `key`都没有变，因此 React 会选择**更新它**而不是重新创建它。被替换的只是它的 `children` prop。

```jsx
// 简化版的组件树结构
// 路由: /dashboard/settings
<RootLayout>
  <DashboardLayout> {/* <--- 这个 Layout 实例被保留 */}
    <SettingsPage /> {/* <--- 这个 Page 会被替换 */}
  </DashboardLayout>
</RootLayout>

// 切换路由到: /dashboard/analytics
<RootLayout>
  <DashboardLayout> {/* <--- 同样的 Layout 实例，状态保留 */}
    <AnalyticsPage /> {/* <--- SettingsPage 被卸载，AnalyticsPage 被挂载 */}
  </DashboardLayout>
</RootLayout>
```

#### 3. 经典用例

*   **导航栏和页脚**：它们在整个网站中几乎不变。
*   **侧边栏**：例如，在 dashboard 中，侧边栏是固定的，只有主内容区在变。
*   **全局状态提供者**：用 `Context.Provider` 包裹整个应用，确保状态在页面切换时不会丢失。
*   **需要保持状态的输入框**：比如一个一直悬浮在页面上的搜索框。

#### 4. 代码示例：验证状态保持

```jsx
// app/dashboard/layout.js
'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const [count, setCount] = useState(0);

  return (
    <section>
      {/* 这个 h1 和 button 在 /dashboard/... 路由下是持久的 */}
      <h1>Dashboard Layout (Persistent)</h1>
      <p>This counter state will be preserved across navigations.</p>
      <button onClick={() => setCount(count + 1)}>
        Layout Clicks: {count}
      </button>
      <nav>
        <Link href="/dashboard/settings">Settings</Link> |{" "}
        <Link href="/dashboard/analytics">Analytics</Link>
      </nav>
      <hr />
      {children}
    </section>
  );
}
```

当你点击 "Settings" 和 "Analytics" 链接来回切换时，会发现 `Layout Clicks` 的计数值不会重置。

---

### 三、`template.js`：重新创建与动效的利器

#### 1. 工作方式

`template.js` 与 `layout.js` 类似，它也包裹子级路由。但关键区别在于：**每次导航时，Next.js 都会为 `Template` 组件创建一个全新的实例**。

这意味着：

*   旧的 `Template` 组件实例和它所有的子组件都会被**卸载 (unmount)**。
*   新的 `Template` 组件实例和新的页面子组件会被**挂载 (mount)**。
*   所有内部状态都会被**重置**，`useEffect` 会重新运行。

#### 2. 底层原理 (The "Why")

Next.js 在内部实现上，给 `Template` 组件传递了一个会随路由变化的 `key` prop。在 React 中，**当一个组件的 `key` 改变时，React 会将其视为一个全新的组件**，从而销毁旧实例并创建新实例。

```jsx
// 简化版的组件树结构 (当同时存在 layout 和 template 时)
<Layout>
  {/* Template 组件的 key 会在路由切换时改变 */}
  <Template key={currentRouteSegment}>
    {children} {/* Page.js */}
  </Template>
</Layout>
```

例如，从 `/a` 导航到 `/b`，`key` 可能会从 `"a"` 变为 `"b"`，这强制 React 重新创建整个 `<Template>` 子树。

#### 3. 经典用例

*   **进入/退出动画**：这是 `template.js` 最核心的用途。因为组件被重新挂载，你可以利用 `framer-motion` 或 `react-transition-group` 等库，在 `useEffect` 或组件挂载时触发进入动画。同样，在组件卸载时可以触发退出动画。
*   **页面浏览量统计**：如果你想在每次用户访问一个页面时都向后端发送一个分析事件，`template.js` 中的 `useEffect` 是绝佳的实现位置，因为它保证了每次导航都会触发。
*   **重置依赖于 `useEffect` 的行为**：某些 `useEffect` Hook 可能需要在每次进入页面时都重新执行其逻辑（例如，重新获取数据或重置某些外部订阅），`template` 可以保证这一点。

#### 4. 代码示例：验证重新创建

```jsx
// app/dashboard/template.js
'use client';
import { useEffect, useState } from 'react';

export default function DashboardTemplate({ children }) {
  const [internalState, setInternalState] = useState(0);

  useEffect(() => {
    // 每次导航到 /dashboard/... 下的页面，这个 log 都会打印
    console.log('Template mounted or re-created! State is reset.');
  }, []);

  return (
    <div>
      <p>Template State (resets on nav): {internalState}</p>
      {children}
    </div>
  );
}
```

当你切换路由时，会看到控制台不断打印 "Template mounted or re-created!"，并且 `Template State` 始终为 0。

---

### 四、决策指南：何时使用哪个？

1.  **默认使用 `layout.js`**：在 95% 的情况下，`layout.js` 是你需要的。它是构建高效、可预测应用的基础。优先考虑性能和状态保持。

2.  **仅在特殊情况下使用 `template.js`**：
    *   你**明确需要**在路由切换时触发进入/退出动画。
    *   你**明确需要**在每次页面导航时重跑 `useEffect`（例如，用于日志记录）。
    *   你**明确需要**重置特定区域的状态，而不想通过手动逻辑处理。

**重要提示**：你可以在同一个路由段中同时使用 `layout.js` 和 `template.js`。它们的渲染顺序是：`Layout` -> `Template` -> `Page`。这允许你拥有一个持久的外部布局，同时在其内部实现路由切换的动画效果。
