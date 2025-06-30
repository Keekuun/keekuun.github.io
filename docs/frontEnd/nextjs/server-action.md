---
title: Next.js Server Action 最佳实践
sidebar: auto
date: 2025-6-20
categories: 
- Next.js
- 前端
tags: 
- Next.js
---

Server Action 是 Next.js App Router 中最具革命性的功能之一，它极大地简化了客户端与服务端的数据交互，特别是对于数据变更（Mutations）操作。

---

### 什么是 Server Action？

简单来说，Server Action 是在服务器端执行的异步函数，但它可以直接在客户端组件中（尤其是在表单中）被调用，就像调用一个本地函数一样。Next.js 的构建系统会自动创建一个 RPC (Remote Procedure Call) 端点，客户端的调用会被安全地代理到这个服务端函数。

**核心优势：**

*   **代码共置 (Colocation):** 数据变更逻辑可以和使用它的组件放在一起，不再需要创建分散的 `/api` 路由。
*   **减少客户端 JavaScript:** 许多表单处理逻辑可以完全在服务端完成，无需发送额外的 JS 到浏览器。
*   **渐进式增强 (Progressive Enhancement):** 基于原生 `<form>` 元素的 Server Action 即使在 JavaScript 被禁用的情况下也能工作，这对于可访问性和健壮性是巨大的胜利。

---

### Server Action 最佳实践

我们将从基础到高级，涵盖安全、用户体验、代码组织等多个方面。

#### 1. 优先使用 `<form>` 触发 Action (渐进式增强)

这是 Server Action 最核心、最推荐的用法。将 action 绑定到 `<form>` 的 `action` 属性上。

```typescript
// app/page.tsx
import { revalidatePath } from 'next/cache';

// 这是一个 Server Action
async function createItem(formData: FormData) {
  'use server'; // 关键指令

  const name = formData.get('name') as string;

  // 假设这里有数据库操作
  // await db.items.create({ data: { name } });
  console.log('Created item:', name);

  // 操作完成后，重新验证当前页面的数据
  revalidatePath('/');
}

export default function HomePage() {
  return (
    <form action={createItem}>
      <input type="text" name="name" required />
      <button type="submit">Add Item</button>
    </form>
  );
}
```

**why？**
*   **无需 JS 也能工作:** 用户可以提交表单并完成操作。
*   **自动处理 `formData`:** Next.js 自动将表单数据序列化并作为 `FormData` 对象传递给你的 action。
*   **简化状态管理:** 很多场景下你不再需要 `useState`, `onSubmit`, `e.preventDefault()` 这一套繁琐的客户端逻辑。

#### 2. 提供即时的用户反馈：Pending 状态

用户提交表单后，需要知道操作正在进行中。这时 `useFormStatus` Hook 就派上用场了。

**重要提示：** `useFormStatus` 只能在作为 `<form>` 的子组件中使用。

```typescript
// components/SubmitButton.tsx
'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Submitting...' : text}
    </button>
  );
}
```

然后在你的表单中使用它：
```typescript
// app/page.tsx
// ... (createItem action from above)
import { SubmitButton } from '@/components/SubmitButton';

export default function HomePage() {
  return (
    <form action={createItem}>
      <input type="text" name="name" required />
      <SubmitButton text="Add Item" />
    </form>
  );
}
```

**why？**
*   **提升 UX:** 明确告知用户系统正在处理他们的请求，防止重复提交。
*   **代码解耦:** 将提交按钮的 pending 逻辑封装在独立的组件中，可复用性高。

#### 3. 优雅地处理错误和返回状态：`useFormState`

当表单提交失败（例如，验证错误）时，你需要将错误信息返回给用户。`useFormState` 是处理这种情况的官方方案。

`useFormState` Hook 接收一个 action 和一个初始状态，返回一个新的 action 和最新的表单状态。

**`app/actions.ts`** (将 Action 独立出来，方便管理)
```typescript
'use server';

import { z } from 'zod';

// 定义表单状态的类型
export interface FormState {
  message: string;
  errors?: {
    name?: string[];
  };
}

// 定义 Zod schema 用于验证
const ItemSchema = z.object({
  name: z.string().min(3, { message: 'Name must be at least 3 characters long.' }),
});

// `prevState` 由 useFormState 自动传入
export async function createItemWithState(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = ItemSchema.safeParse({
    name: formData.get('name'),
  });

  // 1. 验证失败，返回错误信息
  if (!validatedFields.success) {
    return {
      message: 'Validation failed.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. 数据库操作等（这里用 try/catch 包裹真实操作）
  try {
    console.log('Creating item:', validatedFields.data.name);
    // await db.items.create({ data: { name: validatedFields.data.name } });
  } catch (e) {
    return { message: 'Database error: Failed to create item.' };
  }

  // 3. 成功后，重新验证数据并返回成功信息
  revalidatePath('/');
  return { message: 'Successfully created item!' };
}
```

**`app/page.tsx`**
```typescript
'use client';

import { useFormState } from 'react-dom';
import { createItemWithState, type FormState } from '@/app/actions';
import { SubmitButton } from '@/components/SubmitButton';

const initialState: FormState = {
  message: '',
};

export default function ItemForm() {
  const [state, formAction] = useFormState(createItemWithState, initialState);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" id="name" name="name" />
        {state.errors?.name && (
          <p style={{ color: 'red' }}>{state.errors.name.join(', ')}</p>
        )}
      </div>

      <SubmitButton text="Create" />

      {state.message && <p>{state.message}</p>}
    </form>
  );
}
```

**why？**
*   **结构化状态:** `useFormState` 提供了一个清晰的模式来处理 action 的生命周期（pending, success, error）。
*   **服务端验证:** 将验证逻辑放在服务端，这是最安全的做法。
*   **清晰的错误反馈:** 可以将具体的字段错误信息精确地显示在对应输入框旁边。

#### 4. 安全，安全，还是安全！

Server Action 虽然强大，但它也是一个暴露在公网的入口。必须严肃对待安全问题。

*   **服务端输入验证 (最重要):** **永远不要相信来自客户端的任何数据。** 使用 `zod`, `joi` 或其他验证库在 Action 的最开始对 `formData` 或传入参数进行严格验证。上面的 `useFormState` 示例已经展示了这一点。
*   **认证与授权:** 对于需要登录才能执行的操作，必须在 Action 内部检查用户的会话状态和权限。

```typescript
// app/actions.ts
'use server';

import { auth } from '@/auth'; // 假设你使用了 next-auth

export async function deletePost(postId: string) {
  const session = await auth();

  // 1. 检查用户是否登录
  if (!session?.user) {
    throw new Error('You must be signed in to delete a post.');
    // 或者 return { error: 'Unauthorized' };
  }

  const post = await db.post.findUnique({ where: { id: postId } });

  // 2. 检查用户是否有权限操作该资源
  if (post?.authorId !== session.user.id) {
    throw new Error('You are not authorized to delete this post.');
  }

  // ...执行删除操作...
}
```
*   **CSRF 保护:** Next.js 默认对 Server Action 提供了 CSRF 保护，你通常无需担心，但要了解其存在。

#### 5. 使用 `revalidatePath` 和 `revalidateTag` 更新缓存

当数据变更后，你需要告诉 Next.js 更新相关页面的缓存数据。

*   **`revalidatePath('/path/to/revalidate')`:** 清除特定路径的缓存。适用于更新单个页面或一组相关页面。
*   **`revalidateTag('collection')`:** 清除所有使用了特定标签的 `fetch` 请求的缓存。适用于一类数据（例如所有文章、所有商品）的变更。

```typescript
// 在 action 中更新了产品信息后
import { revalidatePath, revalidateTag } from 'next/cache';

async function updateProduct(formData: FormData) {
  'use server';

  const productId = formData.get('id');
  // ...更新数据库...

  // 清理产品详情页的缓存
  revalidatePath(`/products/${productId}`);

  // 清理所有产品列表页的缓存（假设 fetch 时加了 'products' 标签）
  revalidateTag('products');
}
```

#### 6. 代码组织

*   **简单 Action:** 对于仅由单个组件使用的简单 Action，可以直接定义在组件文件顶部。
*   **复杂或共享 Action:** 当 Action 逻辑变复杂或需要在多个地方复用时，应将其抽离到专门的文件中，例如 `app/actions.ts` 或 `app/user/actions.ts`。约定俗成地使用 `actions.ts` 作为文件名。

### 总结

| 实践点 | 做什么？ | 为什么？ | 关键工具 |
| :--- | :--- | :--- | :--- |
| **渐进式增强** | 将 Action 绑定到 `<form>` | 无 JS 也能工作，健壮、可访问 | `<form action={...}>` |
| **用户反馈** | 显示加载状态 | 提升 UX，防止重复提交 | `useFormStatus` |
| **错误处理** | 返回结构化的状态和错误信息 | 清晰地向用户展示验证/服务器错误 | `useFormState` |
| **安全** | 服务端验证、鉴权 | 防止恶意数据和未授权访问 | `zod` 等库, `auth()` |
| **数据同步** | 更新后使缓存失效 | 确保用户看到最新数据 | `revalidatePath`, `revalidateTag` |
| **代码组织** | 将复杂 Action 抽离到 `actions.ts` | 保持代码清晰、可维护、可复用 | 文件模块化 |

遵循以上实践，你就能充分利用 Server Action 的强大能力，构建出既高效又安全的全栈 Next.js 应用。
