---
title: Next.js 使用Zustand 管理状态
sidebar: auto
date: 2025-6-23
categories: 
- Next.js
- 前端
tags: 
- Next.js
---

Zustand 因其轻量、简单和强大的 API 而备受青睐，但要在 Next.js 的服务端/客户端混合环境中正确使用它，需要遵循一些关键模式以避免常见的陷阱，如 hydration 错误和请求间状态污染。

### 核心原则

1.  **状态是客户端的**：全局状态本质上是客户端的概念。它存在于用户的浏览器中，并随着用户的交互而改变。服务端组件（RSC）无法直接访问或修改这些状态。
2.  **避免单例模式**：在 Node.js 环境（服务端渲染时）中，如果将 Zustand store 创建为模块顶层的单例，那么所有用户的请求都会共享同一个 store 实例。这会导致一个用户的状态泄露给另一个用户，是严重的安全和逻辑问题。
3.  **服务端渲染 (SSR) 与客户端 Hydration 的一致性**：服务器生成的 HTML 必须与客户端首次渲染（Hydration）时的 HTML 完全匹配。如果 Zustand 的状态导致两者不一致（例如，从 `localStorage` 读取了持久化的状态），就会出现 Hydration Mismatch 错误。

基于这些原则，以下是集成的最佳实践。

---

### 最佳实践：使用 Provider 模式

这是在 Next.js 中使用 Zustand 最推荐、最健壮的方法。它确保每个请求在服务端都有一个独立的 store 实例，并在客户端安全地进行 hydration。

#### 第 1 步：创建你的 Store (无需改动)

首先，像平常一样定义你的 store。这一步与在纯客户端应用中没有区别。注意，我们将创建逻辑封装在一个函数中，而不是直接调用 `create`。

**`lib/store.ts`**
```typescript
import { create } from 'zustand';

// 定义 State 和 Actions 的类型
export interface AppState {
  count: number;
  userName: string;
}

export interface AppActions {
  increment: (by: number) => void;
  setUserName: (name: string) => void;
}

// createStore 函数用于每次调用时创建一个新的 store 实例
export const createStore = (initialState?: Partial<AppState>) => 
  create<AppState & AppActions>((set) => ({
    // 初始状态
    count: initialState?.count ?? 0,
    userName: initialState?.userName ?? 'Guest',

    // Actions
    increment: (by: number) => set((state) => ({ count: state.count + by })),
    setUserName: (name: string) => set({ userName: name }),
  }));
```
**重点**：我们导出了一个 `createStore` 函数，而不是一个 store 实例。这是避免服务端单例问题的关键。

#### 第 2 步：创建 Store Provider 组件

这个 Provider 将是整个模式的核心。它是一个客户端组件，负责为每个会话或请求创建和提供 store 实例。

**`components/providers/ZustandProvider.tsx`**
```typescript
'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { type StoreApi, useStore } from 'zustand';
import { type AppState, createStore } from '@/lib/store';

// 1. 创建 React Context
export const StoreContext = createContext<StoreApi<AppState> | null>(null);

export interface StoreProviderProps {
  children: ReactNode;
  initialState?: Partial<AppState>; // 允许从服务器传入初始状态
}

export const ZustandProvider = ({ children, initialState }: StoreProviderProps) => {
  // 2. 使用 useRef 确保 store 实例在组件生命周期内只创建一次
  const storeRef = useRef<StoreApi<AppState>>();

  if (!storeRef.current) {
    storeRef.current = createStore(initialState);
  }

  // 3. 将 store 实例通过 Context Provider 提供给下层组件
  return (
    <StoreContext.Provider value={storeRef.current}>
      {children}
    </StoreContext.Provider>
  );
};
```
**重点**：
*   它必须是客户端组件 (`'use client';`)。
*   使用 `useRef` 来存储 store 实例。这确保了即使用户在客户端导航，只要 Provider 组件不被卸载，store 实例就不会被重新创建，从而保持了状态。
*   它接受 `initialState` props，这是我们从服务端向客户端“注入”初始数据的通道。

#### 第 3 步：创建自定义 Hook

为了方便在客户端组件中消费 store，我们创建一个自定义 hook。

**`hooks/useAppStore.ts`**
```typescript
'use client';

import { useContext } from 'react';
import { useStore } from 'zustand';
import { StoreContext } from '@/components/providers/ZustandProvider';
import { type AppState, type AppActions } from '@/lib/store';

// 自定义 Hook，整合了 Context 和 useStore
export const useAppStore = <T,>(
  selector: (state: AppState & AppActions) => T,
): T => {
  const storeApi = useContext(StoreContext);

  if (!storeApi) {
    throw new Error('useAppStore must be used within a ZustandProvider');
  }

  return useStore(storeApi, selector);
};
```
**重点**：
*   这个 hook 封装了从 Context 获取 `storeApi` 并传递给 `useStore` 的逻辑。
*   它提供了一个友好的错误提示，防止在 Provider 之外使用。

#### 第 4 步：在根布局中使用 Provider

现在，我们将 Provider 应用到应用的根部，以便所有页面都可以访问全局状态。同时，我们可以在这里从服务器获取初始数据并注入。

**`app/layout.tsx` (服务端组件)**
```typescript
import { ZustandProvider } from '@/components/providers/ZustandProvider';

// 模拟从服务器获取的初始用户数据
async function getInitialUserData() {
  // 在实际应用中，这里可能是从数据库或认证服务获取用户信息
  return { userName: 'Server Initial User' };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialData = await getInitialUserData();

  return (
    <html lang="en">
      <body>
        <ZustandProvider initialState={initialData}>
          {children}
        </ZustandProvider>
      </body>
    </html>
  );
}
```
**重点**：
*   根布局是一个服务端组件，它可以执行 `async` 操作获取数据。
*   获取的数据通过 `initialState` prop 传递给客户端的 `ZustandProvider`。

#### 第 5 步：在客户端组件中使用状态

现在，任何被 `ZustandProvider` 包裹的客户端组件都可以使用我们的自定义 hook 来访问和更新状态。

**`components/Counter.tsx` (客户端组件)**
```typescript
'use client';

import { useAppStore } from '@/hooks/useAppStore';

export function Counter() {
  const { count, increment } = useAppStore((state) => ({
    count: state.count,
    increment: state.increment,
  }));

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => increment(1)}>Increment</button>
    </div>
  );
}
```

**`components/UserInfo.tsx` (客户端组件)**
```typescript
'use client';

import { useAppStore } from '@/hooks/useAppStore';

export function UserInfo() {
  const userName = useAppStore((state) => state.userName);

  return <h2>Welcome, {userName}!</h2>;
}
```

---

### 高级实践：处理持久化状态 (LocalStorage)

当你使用 `zustand/middleware/persist` 时，会遇到 Hydration Mismatch 的问题，因为服务器没有 `localStorage`。

**解决方案：创建安全的 Hydration Hook**

我们可以创建一个自定义 hook，它只在组件挂载到客户端之后才返回真实的状态值，从而确保服务端和客户端的首次渲染结果一致。

1.  **修改 Store (添加 persist)**
    ```typescript
    import { create } from 'zustand';
    import { persist } from 'zustand/middleware';
    // ... types

    export const createStore = (initialState?: Partial<AppState>) => 
      create<AppState & AppActions>()(
        persist(
          (set) => ({ /* ... store logic ... */ }),
          { name: 'app-storage' } // localStorage key
        )
      );
    ```

2.  **创建 `useHydratedStore` Hook**
    ```typescript
    'use client';
  
    import { useState, useEffect } from 'react';
    import { useAppStore } from './useAppStore'; // 导入我们之前创建的 hook

    /**
     * 安全地从持久化存储中读取状态，避免 hydration mismatch。
     * 在服务端返回默认值，在客户端挂载后返回真实值。
     */
    export const useHydratedStore = <T, F>(
      selector: (state: AppState & AppActions) => T,
      fallback: F
    ): T | F => {
      const [isHydrated, setIsHydrated] = useState(false);
      const state = useAppStore(selector);

      useEffect(() => {
        setIsHydrated(true);
      }, []);

      return isHydrated ? state : fallback;
    };
    ```

3.  **在组件中使用**
    ```typescript
    'use client';

    import { useHydratedStore } from '@/hooks/useHydratedStore';

    export function PersistentCounter() {
      // 在 hydration 完成前，count 的值会是 0
      const count = useHydratedStore((state) => state.count, 0); 
      const increment = useAppStore((state) => state.increment); // Actions 可以直接用

      return (
        <div>
          {/* 这样可以避免在 hydration 期间显示不一致的内容 */}
          <p>Persisted Count: {count}</p> 
          <button onClick={() => increment(1)}>Increment</button>
        </div>
      );
    }
    ```

### 总结：最佳实践清单

✅ **使用 Provider 模式**：为每个请求/会话创建独立的 store 实例。

✅ **Provider 必须是客户端组件** (`'use client';`)。

✅ **在 Provider 内部使用 `useRef`**：确保 store 实例在客户端的生命周期内保持稳定。

✅ **创建自定义 Hook (`useAppStore`)**：简化状态消费，并提供类型安全。

✅ **从服务端组件向 Provider 注入初始状态**：通过 props 实现服务端数据到客户端状态的初始化。

✅ **处理持久化状态时，防止 Hydration Mismatch**：使用 `useEffect` 和一个 `isHydrated` 状态来延迟读取 `localStorage` 中的值。

✅ **将状态逻辑（Actions）保留在 Store 定义中**，保持组件的简洁。

遵循这套实践，你就可以在 Next.js 应用中无缝、安全且高效地使用 Zustand 进行状态管理了。
