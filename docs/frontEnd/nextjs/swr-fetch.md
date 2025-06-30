---
title: Next.js 使用swr fetch
sidebar: auto
date: 2025-6-23
categories: 
- Next.js
- 前端
tags: 
- Next.js
---

### 核心理念：抽象与封装

最佳实践的核心在于**不要在每个组件中重复编写 fetch 逻辑**。我们应该将数据请求的通用逻辑（如添加认证头、错误处理）抽象到一个中心位置。

我们将分三步实现这个目标：
1.  **创建一个中心化的 `fetcher` 函数**：处理所有 API 请求的通用逻辑。
2.  **使用 `SWRConfig` 进行全局配置**：让应用内的所有 `useSWR` Hook 默认使用我们的 `fetcher`。
3.  **创建一个自定义 Hook (`useApi`)**：进一步封装 `useSWR`，提供更强的类型支持和更简洁的组件内调用。

---

### 第 1 步：创建中心化的 Fetcher

这是最关键的一步。这个函数将是我们所有 API 请求的入口。

在你的项目中创建一个文件，例如 `lib/fetcher.ts`。

```typescript
// lib/fetcher.ts

/**
 * 一个增强的 fetcher 函数，用于 SWR。
 * 它会自动处理：
 * 1. Token 认证：从 localStorage 读取 token 并添加到 Authorization header。
 * 2. 自定义 Headers：允许在调用时传入额外的 header。
 * 3. JSON 解析：自动解析响应体为 JSON。
 * 4. 错误处理：当 API 返回非 2xx 状态码时，抛出包含状态和消息的错误。
 */
export async function fetcher<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  // 1. 准备 Headers
  const headers = new Headers(options.headers);
  headers.append('Content-Type', 'application/json');

  // 2. Token 认证
  // 注意：在客户端组件中，我们可以安全地访问 localStorage。
  // 如果你的 token 存储在 cookie 中，你需要使用不同的方式来获取它。
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers.append('Authorization', `Bearer ${token}`);
    } else {
      console.warn("No auth token found in localStorage.");
      // 如果没有 token，可以选择是否抛出错误或继续请求
      // throw new Error("No auth token found.");
      // 是否需要 重新获取 token 或其他处理逻辑取决于业务需求
      // window.location.href = '/login'; // 例如：重定向到登录页面
    }
  } else {
    // 如果在服务端环境中（如 SSR），可以考虑从请求头中获取 token
    // 例如：headers.append('Authorization', `Bearer ${req.headers.authorization}`);
    console.warn("Running in a non-browser environment, token will not be added.");
  }

  // 3. 发起请求
  const response = await fetch(url, {
    ...options,
    headers,
  });

  // 4. 健壮的错误处理
  if (!response.ok) {
    let errorMessage = `An error occurred: ${response.status}`;
    try {
      // 尝试解析 API 返回的错误信息
      const errorData = await response.json();
      errorMessage = errorData.message || JSON.stringify(errorData);
    } catch (e) {
      // 如果响应体不是 JSON 或为空，则使用状态文本
      errorMessage = response.statusText;
    }
    const error = new Error(errorMessage);
    // @ts-ignore // 附加额外信息到错误对象上
    error.status = response.status;
    // 401 或 403 状态码通常表示认证失败或权限不足
    if (response.status === 401 || response.status === 403) {
      // 可以在这里处理 token 失效的逻辑，比如重定向到登录页面
      console.warn("Token invalid or access denied, redirecting to login...");
      // window.location.href = '/login'; // 重定向到登录页面
    }
    throw error;
  }

  // 5. 解析并返回 JSON 数据
  // 如果 API 可能返回空内容（如 204 No Content），则需要处理
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  // 处理 event-stream 或其他文本类型的响应
  if (contentType && contentType.includes('text/event-stream')) {
    // 处理 Server-Sent Events (SSE) 的特殊情况
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Response body is not readable.");
    }
    const decoder = new TextDecoder();
    let result = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }
    // 这里可以根据需要进一步处理 SSE 数据
    return result as unknown as T; // 将 SSE 文本转换为 T 类型
  }
  if (contentType && contentType.includes('text/plain')) {
    const text = await response.text();
    return text as unknown as T; // 将文本转换为 T 类型
  }

  // 对于没有返回体的成功响应，返回 null 或 true
  return null as T;
}
```

**why？**
*   **中心化**: 所有认证和 Header 逻辑都在一个地方，修改和维护非常方便。
*   **健壮的错误处理**: SWR 依赖 `fetcher` 抛出错误来触发 `error` 状态。这段代码确保了任何非成功的 HTTP 响应都会被正确捕获。
*   **可扩展**: `options` 参数让我们可以在需要时轻松传递额外的 Header 或其他 `fetch` 选项。

---

### 第 2 步：使用 `SWRConfig` 全局配置

现在我们有了 `fetcher`，我们不希望在每次调用 `useSWR` 时都手动传入它。`SWRConfig` Provider 就是为此而生的。

在你的主布局文件 `app/layout.tsx` 中配置它。

```typescript
// app/layout.tsx (或你选择的 provider 封装层)
'use client'; // SWRConfig 需要在客户端组件中使用

import { SWRConfig } from 'swr';
import { fetcher } from '@/lib/fetcher'; // 确保路径正确

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        // 全局配置我们的 fetcher
        fetcher,
        // 其他可选的全局配置
        revalidateOnFocus: false, // 可以在此禁用或配置 SWR 的行为
        onError: (error, key) => {
          // 全局错误日志记录或上报
          console.error(`SWR Error for key ${key}:`, error);
          if (error.status === 401 || error.status === 403) {
            // Token 失效或无权限，可以触发全局登出逻辑
            // 例如： window.location.href = '/login';
            console.log("Token invalid, redirecting to login...");
          }
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}

// 然后在你的根 layout.tsx 中使用这个 Provider
// app/layout.tsx (根布局)
// import AppProviders from './AppProviders'
// export default function RootLayout({ children }) {
//   return (
//     <html>
//       <body>
//         <AppProviders>{children}</AppProviders>
//       </body>
//     </html>
//   )
// }
```

**why？**
*   **DRY (Don't Repeat Yourself)**: 你只需配置一次，应用中的所有 `useSWR` 调用都会自动继承这个 `fetcher`。
*   **全局错误处理**: `onError` 回调是一个处理通用错误（如 401 未授权）的绝佳位置。

---

### 第 3 步：(推荐) 创建自定义 Hook

虽然前两步已经很好了，但我们可以通过自定义 Hook 让组件内的代码更干净、类型更安全。

创建一个文件 `hooks/useApi.ts`。

```typescript
// hooks/useApi.ts
import useSWR, { SWRConfiguration, SWRResponse } from 'swr';

// 导入你的 fetcher
import { fetcher } from '@/lib/fetcher';

// 定义自定义 Hook 返回的类型，增强 SWRResponse
interface UseApiResponse<Data> extends SWRResponse<Data, Error> {
  isLoading: boolean;
}

/**
 * 封装了 SWR 的自定义 Hook，专注于 API 调用。
 * @param path API 路径 (e.g., '/api/user')。如果为 null，则不发起请求。
 * @param swrOptions SWR 的额外配置。
 * @param fetchOptions fetch API 的额外配置 (e.g., method, body)。
 */
export function useApi<Data = any>(
  path: string | null,
  swrOptions: SWRConfiguration = {},
  fetchOptions: RequestInit = {}
): UseApiResponse<Data> {
  // SWR 的 key。当 fetchOptions 变化时，SWR 会重新请求。
  // 我们将 fetchOptions 序列化后作为 key 的一部分，确保请求的唯一性。
  const key = path ? [path, JSON.stringify(fetchOptions)] : null;

  const { data, error, mutate, isValidating, isLoading } = useSWR<Data, Error>(
    key,
    // SWR 会将 key 数组作为参数传递给 fetcher
    ([url]: [string, string]) => fetcher(url, fetchOptions),
    swrOptions
  );

  return {
    data,
    error,
    mutate,
    isValidating,
    // isLoading 是 SWR 2.0+ 的新特性，表示首次加载
    // 如果你使用的是旧版本，可以用 `!data && !error` 来模拟
    isLoading: isLoading,
  };
}
```

**why？**
*   **极致简洁**: 在组件中，你不再需要关心 `fetcher` 或复杂的 SWR key。
*   **类型安全**: `<Data>` 泛型让你在调用时就能指定返回数据的类型，获得完美的 TypeScript 智能提示。
*   **易于传递参数**: `fetchOptions` 参数使得发送 `POST` 请求或传递自定义 Header 变得非常简单明了。

---

### 最终实践：在组件中使用

现在，让我们看看在组件中使用我们的 `useApi` Hook 是多么优雅。

**场景 1: GET 请求获取用户资料**

```typescript
// components/UserProfile.tsx
'use client';

import { useApi } from '@/hooks/useApi';

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export function UserProfile() {
  const { data: user, error, isLoading } = useApi<UserProfile>('/api/user/profile');

  if (isLoading) return <div>Loading profile...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>No profile data.</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}
```

**场景 2: POST 请求更新数据，并传递一个自定义 Header**

```typescript
// components/UpdatePost.tsx
'use client';

import { useMutation } from '@/hooks/useMutation';
import { useState } from 'react';
import { useSWRConfig } from 'swr'; // SWR 提供的全局 mutate 函数

export function UpdatePost({ postId }: { postId: string }) {
  const [title, setTitle] = useState('');

  // 1. 获取全局 mutate 函数，用于在成功后刷新其他 SWR-managed 数据
  const { mutate } = useSWRConfig();

  // 2. 实例化我们的突变 Hook
  const postUrl = `/api/posts/${postId}`;
  const [triggerUpdate, { isMutating, error }] = useMutation(postUrl, 'POST');

  const handleUpdate = async () => {
    try {
      // 3. 调用 trigger 函数执行突变
      await triggerUpdate({ body: { title } });

      console.log('Post updated successfully!');

      // 4. 成功后，手动触发 SWR 重新验证以更新UI
      // 我们告诉 SWR，与 postUrl 关联的数据已经“过时”，需要重新获取。
      // 这会刷新任何使用 useApi(postUrl) 的组件。
      mutate(postUrl);

    } catch (e) {
      // 错误已在 Hook 中 console.error，这里可以做一些 UI 反馈
      console.log("Caught error in component, could show a toast notification.");
    }
  };

  return (
    <div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={isMutating} // 在提交时禁用输入框
      />
      <button onClick={handleUpdate} disabled={isMutating}>
        {isMutating ? 'Updating...' : 'Update Title'}
      </button>
      {error && <p style={{ color: 'red' }}>Failed to update: {error.message}</p>}
  </div>
  );
}
```

专门用于处理更新操作的 Hook：`useMutation.ts`:
```typescript
// hooks/useMutation.ts
import { useState } from 'react';
import { fetcher } from '@/lib/fetcher'; // 复用我们强大的 fetcher

// TBody 是请求体(body)的类型，TData 是成功响应数据的类型
type MutationOptions<TBody> = Omit<RequestInit, 'body'> & {
  body?: TBody;
};

interface MutationResult<TData> {
  data: TData | null;
  error: Error | null;
  isMutating: boolean;
}

// 返回一个元组，第一个是触发函数，第二个是状态对象
type UseMutationReturn<TBody, TData> = [
  (options?: MutationOptions<TBody>) => Promise<TData | undefined>,
  MutationResult<TData>
];

/**
 * 一个用于处理 POST, PUT, DELETE 等突变操作的自定义 Hook。
 * 它不会自动执行，而是返回一个可以被手动调用的 trigger 函数。
 *
 * @param url API 端点
 * @param method HTTP 方法，默认为 'POST'
 */
export function useMutation<TBody = any, TData = any>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'POST'
): UseMutationReturn<TBody, TData> {
  const [result, setResult] = useState<MutationResult<TData>>({
    data: null,
    error: null,
    isMutating: false,
  });

  const trigger = async (options?: MutationOptions<TBody>): Promise<TData | undefined> => {
    setResult({ data: null, error: null, isMutating: true });
    
    try {
      const body = options?.body ? JSON.stringify(options.body) : undefined;
      const response = await fetcher<TData>(url, {
        method,
        ...options,
        body,
      });
      
      setResult({ data: response, error: null, isMutating: false });
      return response;

    } catch (err) {
      const error = err as Error;
      console.error(`Mutation failed for ${method} ${url}:`, error);
      setResult({ data: null, error, isMutating: false });
      // 重新抛出错误，以便调用方可以在其自己的 try/catch 中处理
      throw error; 
    }
  };

  return [trigger, { ...result }];
}

```
### 总结：最佳实践清单

1.  ✅ **中心化 `fetcher.ts`**：统一处理认证、Header、错误和 JSON 解析。
2.  ✅ **在 `fetcher` 中抛出错误**：确保 `response.ok` 为 `false` 时 `throw new Error()`，以便 SWR 能够捕获。
3.  ✅ **使用 `SWRConfig` 全局配置**：在根布局中设置默认 `fetcher` 和全局 `onError` 处理器。
4.  ✅ **创建自定义 `useApi` Hook**：封装 `useSWR`，提供简洁的调用方式和强大的类型支持。
5.  ✅ **在组件中处理 `isLoading` 和 `error` 状态**：为用户提供清晰的 UI 反馈。
6.  ✅ **善用 `mutate`**：在执行 `POST`, `PUT`, `DELETE` 等操作后，调用 `mutate` 来更新相关 `GET` 请求的数据，保持 UI 同步。

