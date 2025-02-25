---
title: React-状态管理之zustand
sidebar: auto
categories: 
- React
- 前端
tags: 
- JS
- React
---

### 状态管理之 Zustand 入门和实践

Zustand 是一个轻量级的状态管理库，专为 React 应用设计。它提供了简单且高效的状态管理解决方案，易于上手且功能强大。以下是 Zustand 的入门指南和实践示例。

#### 1. 安装 Zustand

首先，你需要安装 Zustand：
```bash
npm install zustand
```


#### 2. 创建 Zustand Store

使用 Zustand 创建一个简单的 store。Zustand 使用一个函数来定义 store 的初始状态和操作。

```typescript
// src/store/useStore.ts
import create from 'zustand';

interface CounterState {
  count: number;
  increment: () => void;
  decrement: () => void;
  incrementByAmount: (amount: number) => void;
}

const useStore = create<CounterState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  incrementByAmount: (amount) => set((state) => ({ count: state.count + amount })),
}));

export default useStore;
```


#### 3. 使用 Zustand Store

在 React 组件中使用 Zustand store 来访问和更新状态。

```tsx
// src/components/Counter.tsx
import React from 'react';
import useStore from '../store/useStore';

const Counter = () => {
  const count = useStore((state) => state.count);
  const increment = useStore((state) => state.increment);
  const decrement = useStore((state) => state.decrement);
  const incrementByAmount = useStore((state) => state.incrementByAmount);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={() => incrementByAmount(5)}>Increment by 5</button>
    </div>
  );
};

export default Counter;
```


#### 4. 提供 Store

Zustand 不需要像 Redux 那样提供一个 Provider，因为它直接在组件中使用。因此，你可以直接在应用中使用 Zustand store。

```tsx
// src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```


#### 5. 实践示例：异步操作

Zustand 支持异步操作，你可以使用 `async` 函数来处理异步逻辑。

```typescript
// src/store/useStore.ts
import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface CounterState {
  count: number;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  increment: () => void;
  decrement: () => void;
  incrementByAmount: (amount: number) => void;
  fetchCount: (amount: number) => void;
}

const useStore = create<CounterState>()(
  devtools((set) => ({
    count: 0,
    status: 'idle',
    error: null,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    incrementByAmount: (amount) => set((state) => ({ count: state.count + amount })),
    fetchCount: async (amount) => {
      set({ status: 'loading', error: null });
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${amount}`);
        const data = await response.json();
        set((state) => ({ count: state.count + data.id, status: 'idle' }));
      } catch (error) {
        set({ status: 'failed', error: (error as Error).message || 'Failed to fetch count' });
      }
    },
  }))
);

export default useStore;
```
```tsx
// src/components/Counter.tsx
import React from 'react';
import useStore from '../store/useStore';

const Counter = () => {
  const count = useStore((state) => state.count);
  const status = useStore((state) => state.status);
  const error = useStore((state) => state.error);
  const increment = useStore((state) => state.increment);
  const decrement = useStore((state) => state.decrement);
  const incrementByAmount = useStore((state) => state.incrementByAmount);
  const fetchCount = useStore((state) => state.fetchCount);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={() => incrementByAmount(5)}>Increment by 5</button>
      <button onClick={() => fetchCount(1)}>
        {status === 'loading' ? 'Loading...' : 'Fetch Count'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Counter;
```


#### 6. 中间件

Zustand 支持中间件，可以用于日志记录、持久化等。例如，使用 `zustand/middleware/devtools` 进行调试。

```typescript
// src/store/useStore.ts
import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface CounterState {
  count: number;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  increment: () => void;
  decrement: () => void;
  incrementByAmount: (amount: number) => void;
  fetchCount: (amount: number) => void;
}

const useStore = create<CounterState>()(
  devtools((set) => ({
    count: 0,
    status: 'idle',
    error: null,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    incrementByAmount: (amount) => set((state) => ({ count: state.count + amount })),
    fetchCount: async (amount) => {
      set({ status: 'loading', error: null });
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${amount}`);
        const data = await response.json();
        set((state) => ({ count: state.count + data.id, status: 'idle' }));
      } catch (error) {
        set({ status: 'failed', error: (error as Error).message || 'Failed to fetch count' });
      }
    },
  }))
);

export default useStore;
```


#### 7. 类型定义

Zustand 使用 TypeScript 类型系统来确保类型安全。你可以为 store 定义接口，并在组件中使用这些类型。

```typescript
// src/store/useStore.ts
import create from 'zustand';
import { devtools } from 'zustand/middleware';

interface CounterState {
  count: number;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  increment: () => void;
  decrement: () => void;
  incrementByAmount: (amount: number) => void;
  fetchCount: (amount: number) => void;
}

const useStore = create<CounterState>()(
  devtools((set) => ({
    count: 0,
    status: 'idle',
    error: null,
    increment: () => set((state) => ({ count: state.count + 1 })),
    decrement: () => set((state) => ({ count: state.count - 1 })),
    incrementByAmount: (amount) => set((state) => ({ count: state.count + amount })),
    fetchCount: async (amount) => {
      set({ status: 'loading', error: null });
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${amount}`);
        const data = await response.json();
        set((state) => ({ count: state.count + data.id, status: 'idle' }));
      } catch (error) {
        set({ status: 'failed', error: (error as Error).message || 'Failed to fetch count' });
      }
    },
  }))
);

export default useStore;
```
```tsx
// src/components/Counter.tsx
import React from 'react';
import useStore from '../store/useStore';

const Counter = () => {
  const count = useStore((state) => state.count);
  const status = useStore((state) => state.status);
  const error = useStore((state) => state.error);
  const increment = useStore((state) => state.increment);
  const decrement = useStore((state) => state.decrement);
  const incrementByAmount = useStore((state) => state.incrementByAmount);
  const fetchCount = useStore((state) => state.fetchCount);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
      <button onClick={() => incrementByAmount(5)}>Increment by 5</button>
      <button onClick={() => fetchCount(1)}>
        {status === 'loading' ? 'Loading...' : 'Fetch Count'}
      </button>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Counter;
```


### 总结

通过以上步骤，你可以快速入门并实践 Zustand。Zustand 提供了简单且高效的状态管理解决方案，适用于各种规模的 React 应用。遵循这些最佳实践，可以帮助你编写更健壮、更易维护的代码。
