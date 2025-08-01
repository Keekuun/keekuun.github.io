---
title: 专为 Next.js 设计的 React Hooks
sidebar: auto
date: 2025-06-23
categories: 
- Next.js
- 前端
tags: 
- Next.js
---

从 React 18 开始，许多新引入的 Hooks 其主要设计目标就是为了**深化客户端与服务端的集成**，尤其是在 **React Server Components (RSC)** 这个新范式下。

理解这些 Hooks 是掌握未来 React 开发模式的关键。它们不再仅仅是为“在服务器上渲染 HTML”服务，而是为了构建一种全新的、服务器与客户端无缝协作的应用模型。

我将这些 Hooks 分为三类，以便更好地理解它们的职责：

1.  **直接为 React Server Components & Server Actions 设计的 Hooks**
2.  **为解决传统 SSR 水合（Hydration）问题的 Hooks**
3.  **为支持并发渲染（现代 SSR 的基础）的 Hooks**

---

### 1. 直接为 React Server Components & Server Actions 设计的 Hooks

这些是最新、与服务端耦合最紧密的 Hooks。它们只能在客户端组件（`'use client'`）中使用，但其目的是与在服务端运行的逻辑进行交互。

#### `use()`

这是 React 18.3 引入的革命性 Hook。它极大简化了在组件中处理 Promise 和 Context 的方式。

*   **核心目的**: 在组件渲染期间，同步地“解包”一个 Promise 或 Context 的值。
*   **为何为服务端服务**: 在 **Server Components** 中，`use(promise)` 是进行数据获取的**推荐方式**。它允许你在服务端组件中像写同步代码一样去获取数据，React 会在底层处理数据加载的暂停与恢复。在客户端，它也可以用来读取传递过来的 Promise。

**示例 (在 Server Component 中)**:
```typescript
// app/page.tsx (Server Component)
import { fetchPost } from '@/lib/api'; // 这是一个返回 Promise<Post> 的函数
import { use } from 'react';

// 注意：Server Component 本身可以是 async 函数
async function PostDetails({ id }: { id: string }) {
  // `use` 像 await 一样“暂停”组件的渲染，直到 Promise resolve
  const post = use(fetchPost(id)); 

  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
    </article>
  );
}

export default PostDetails;
```

#### `useOptimistic()`

它就是为了给异步操作（尤其是 Server Actions）提供即时 UI 反馈而生的。

*   **核心目的**: 在等待一个异步操作（尤其是 Server Action）完成时，立即在 UI 上展示一个“乐观”的、预期的成功状态。
*   **为何为服务端服务**: 当你调用一个 Server Action (一个在服务器上执行的函数) 时，网络延迟是不可避免的。`useOptimistic` 可以在客户端立即模拟出成功后的 UI，极大地改善用户体验。

最佳实践：
+ 总是与 Server Action 配合使用，用于提升表单提交、点赞、评论等交互的即时性。
+ 确保传递给它的 updateFn 是一个纯函数，它只负责计算下一个乐观状态，不应有副作用。
+ 当异步操作失败时，React 会自动回滚到原始状态，你无需编写手动回滚逻辑。

#### `useFormStatus()`

这是一个辅助 Hook，必须在使用了 Server Action 的 `<form>` 组件内部使用。

*   **核心目的**: 获取父级 `<form>` 的提交状态，例如 `pending`（是否正在提交）。
*   **为何为服务端服务**: 它让你能够根据 Server Action 的执行状态轻松地更新 UI，比如在提交期间禁用按钮或显示加载指示器，而无需手动管理加载状态。

最佳实践：
+ 必须在作为 `<form>` 后代的组件中使用。
+ 极适合用来创建可复用的 SubmitButton 组件，该组件能自动感知其所在表单的提交状态。

**示例 (`useOptimistic` 和 `useFormStatus` 组合)**:
```typescript
// components/OptimisticForm.tsx ('use client')
'use client';

import { useOptimistic } from 'react';
import { useFormStatus } from 'react-dom'; // 注意，来自 react-dom
import { submitMessageAction } from '@/app/actions'; // 这是一个 Server Action

function SubmitButton() {
  const { pending } = useFormStatus(); // 获取表单提交状态
  return <button type="submit" disabled={pending}>{pending ? 'Submitting...' : 'Submit'}</button>;
}

export function OptimisticForm({ messages }: { messages: string[] }) {
  const [optimisticMessages, addOptimisticMessage] = useOptimistic(
    messages,
    (currentMessages, newMessage: string) => [...currentMessages, newMessage]
  );

  const formAction = async (formData: FormData) => {
    const message = formData.get('message') as string;
    addOptimisticMessage(message); // 立即应用乐观更新
    await submitMessageAction(message); // 调用 Server Action
  };

  return (
    <form action={formAction}>
      <ul>{optimisticMessages.map((m, i) => <li key={i}>{m}</li>)}</ul>
      <input type="text" name="message" />
      <SubmitButton />
    </form>
  );
}
```

#### `useActionState()` (前身为 `useFormState`)

用于处理 Server Action 返回的结果和状态。

*   **核心目的**: 运行一个 Action，并根据其返回值更新状态，同时处理 pending/error 等状态。
*   **为何为服务端服务**: 它是专门为管理 Server Action 的完整生命周期而设计的，非常适合处理表单验证后的错误信息或成功消息。

```typescript
import { useActionState, useState } from "react";
import { addToCart } from "./actions.js";

function AddToCartForm({itemID, itemTitle}) {
  const [message, formAction, isPending] = useActionState(addToCart, null);
  return (
    <form action={formAction}>
      <h2>{itemTitle}</h2>
      <input type="hidden" name="itemID" value={itemID} />
      <button type="submit">Add to Cart</button>
      {isPending ? "Loading..." : message}
    </form>
  );
}
```

```typescript
// actions.js
"use server";

export async function addToCart(prevState, queryData) {
  const itemID = queryData.get('itemID');
  if (itemID === "1") {
    return "Added to cart";
  } else {
    // Add a fake delay to make waiting noticeable.
    await new Promise(resolve => {
      setTimeout(resolve, 2000);
    });
    return "Couldn't add to cart: the item is sold out.";
  }
}
```
---

### 2. 为解决传统 SSR 水合（Hydration）问题的 Hooks

这些 Hooks 解决了长期以来在 SSR 中存在的痛点。

#### `useId()`

*   **核心目的**: 生成在服务端和客户端之间都保持稳定的唯一 ID。
*   **为何为服务端服务**: 在传统的 SSR 中，如果你使用 `Math.random()` 或计数器生成 ID，服务器生成的 ID 和客户端生成的 ID 会不匹配，导致**水合错误 (hydration mismatch)**。`useId` 通过一个确定的算法解决了这个问题，确保组件无论在何处渲染，其 ID 都是一致的，这对于 `aria-` 属性和 `<label htmlFor="...">` 至关重要。

最佳实践：
+ 在任何需要将两个元素通过 ID 关联的地方使用它，例如 `<label>` 和 `<input>`。
+ 不要用它来生成列表中的 key。列表的 key 应该源自你的数据（例如 item.id）。

**示例**:
```typescript
// components/FormField.tsx ('use client' or can be used in server component)
import { useId } from 'react';

function FormField() {
  const id = useId(); // ✅ 在服务端和客户端生成相同的 ID: ":r0:", ":r1:" 等
  return (
    <>
      <label htmlFor={id}>Your Name:</label>
      <input id={id} type="text" name="name" />
    </>
  );
}
```

---

### 3. 为支持并发渲染（现代 SSR 的基础）的 Hooks

React 18 的流式 SSR (Streaming SSR) 和选择性水合 (Selective Hydration) 都建立在并发渲染之上。这些 Hooks 是启用并发特性的关键。

#### `useTransition()`

*   **核心目的**: 将某个状态更新标记为“非紧急”，允许其他更紧急的渲染（如用户输入）优先进行，而不会被阻塞。
*   **为何为服务端服务**: 在与服务端交互时，比如触发一个 Server Action 或一个需要重新获取数据的操作，你可以用 `startTransition` 包裹它。这样，即使在等待服务端响应时，你的 UI 也能保持响应，不会因为数据加载而卡住。这是实现流畅体验的关键。

最佳实践：
+ 用于包裹会触发昂贵渲染或数据请求的状态更新，例如搜索框输入、筛选器变更等。
+ 使用返回的 isPending 状态，向用户展示一个加载指示器，告知他们后台正在发生变化。

```typescript
function SubmitButton({ submitAction }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await submitAction();
        });
      }}
    >
      Submit
    </button>
  );
}
```

#### `useSyncExternalStore()`

*   **核心目的**: 允许 React 安全地从外部数据源（如 Redux, Zustand, 甚至 `window.matchMedia`）读取数据，并支持并发渲染。
*   **为何为服务端服务**: 在并发渲染（如流式 SSR）中，React 可能会在后台“暂停”和“恢复”渲染。如果外部 store 在此期间发生变化，可能会导致 UI “撕裂” (tearing)——即 UI 的一部分显示旧数据，另一部分显示新数据。`useSyncExternalStore` 通过订阅和强制同步读取来防止这种情况，确保了在 SSR 和并发模式下的数据一致性。

最佳实践：
+ 用于从任何外部数据源读取数据，尤其是那些可能在渲染过程中发生变化的。
+ 确保在服务端和客户端都能正确读取数据，避免 UI 撕裂。

```typescript
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true; // Always show "Online" for server-generated HTML
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```

### 总结

| Hook | 主要职责 | 在服务端渲染中的核心作用 |
| :--- | :--- | :--- |
| **`use()`** | 同步地读取 Promise / Context | **在 Server Component 中进行数据获取**。 |
| **`useOptimistic()`** | 提供乐观 UI 状态 | 为 Server Action 提供即时 UI 反馈，隐藏网络延迟。 |
| **`useFormStatus()`** | 获取表单提交状态 | 在 Server Action 执行期间，轻松管理 UI（如禁用按钮）。 |
| **`useActionState()`** | 管理 Action 的状态和结果 | 处理 Server Action 的返回值，如错误信息。 |
| **`useId()`** | 生成稳定的唯一 ID | **防止服务端和客户端 ID 不匹配导致的水合错误**。 |
| **`useTransition()`** | 标记非紧急更新 | 保持 UI 在等待服务端响应（如 Server Action）时不被卡住。 |
| **`useSyncExternalStore()`** | 安全地从外部 store 读取数据 | 在并发和流式 SSR 中，**保证外部数据源的一致性，防止 UI 撕裂**。 |
