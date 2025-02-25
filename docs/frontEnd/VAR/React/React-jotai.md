---
title: React-状态管理之jotai
sidebar: auto
categories: 
- React
- 前端
tags: 
- JS
- React
---
### React 状态管理之 Jotai 入门和最佳实践

Jotai 是一个轻量级的状态管理库，专为 React 应用设计。它提供了简单且高效的状态管理解决方案，易于上手且功能强大。以下是 Jotai 的入门指南和实践示例。

#### 1. 安装 Jotai

首先，你需要安装 Jotai：
```bash
npm install jotai
```


#### 2. 创建 Atom

使用 Jotai 创建一个简单的 atom。Atom 是 Jotai 中的基本单位，用于存储和管理状态。

```typescript
// src/store/atoms.ts
import { atom } from 'jotai';

// 创建一个简单的 atom 来存储计数器的值
export const countAtom = atom(0);
```


#### 3. 使用 Atom

在 React 组件中使用 atom 来访问和更新状态。

```typescript
// src/components/Counter.tsx
import React from 'react';
import { useAtom } from 'jotai';
import { countAtom } from '../store/atoms';

const Counter = () => {
  const [count, setCount] = useAtom(countAtom);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount((prevCount) => prevCount + 1)}>Increment</button>
      <button onClick={() => setCount((prevCount) => prevCount - 1)}>Decrement</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
};

export default Counter;
```


#### 4. 提供 Store

Jotai 不需要像 Redux 那样提供一个 Provider，因为它直接在组件中使用。因此，你可以直接在应用中使用 Jotai atom。

```typescript
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

Jotai 支持异步操作，你可以使用 `async` 函数来处理异步逻辑。

```typescript
// src/store/atoms.ts
import { atom, atomWithDefault, loadable } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 创建一个简单的 atom 来存储计数器的值
export const countAtom = atom(0);

// 创建一个 atom 来存储异步加载的数据
export const asyncDataAtom = atomWithDefault(async (get) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  const data = await response.json();
  return data.title;
});

// 创建一个可加载的 atom
export const loadableAsyncDataAtom = loadable(asyncDataAtom);
```
```typescript
// src/components/AsyncData.tsx
import React from 'react';
import { useAtom } from 'jotai';
import { loadableAsyncDataAtom } from '../store/atoms';

const AsyncData = () => {
  const [asyncData] = useAtom(loadableAsyncDataAtom);

  if (asyncData.state === 'loading') {
    return <div>Loading...</div>;
  }

  if (asyncData.state === 'hasError') {
    return <div>Error: {asyncData.error.message}</div>;
  }

  return (
    <div>
      <h1>Async Data: {asyncData.data}</h1>
    </div>
  );
};

export default AsyncData;
```


#### 6. 使用中间件

Jotai 支持中间件，可以用于日志记录、持久化等。例如，使用 `atomWithStorage` 进行持久化。

```typescript
// src/store/atoms.ts
import { atom, atomWithDefault, loadable } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 创建一个简单的 atom 来存储计数器的值，并使用 atomWithStorage 进行持久化
export const countAtom = atomWithStorage('count', 0);

// 创建一个 atom 来存储异步加载的数据
export const asyncDataAtom = atomWithDefault(async (get) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  const data = await response.json();
  return data.title;
});

// 创建一个可加载的 atom
export const loadableAsyncDataAtom = loadable(asyncDataAtom);
```


#### 7. 组合 Atom

Jotai 支持组合 atom，可以创建复杂的逻辑和状态。

```typescript
// src/store/atoms.ts
import { atom, atomWithDefault, loadable } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 创建一个简单的 atom 来存储计数器的值，并使用 atomWithStorage 进行持久化
export const countAtom = atomWithStorage('count', 0);

// 创建一个 atom 来存储异步加载的数据
export const asyncDataAtom = atomWithDefault(async (get) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  const data = await response.json();
  return data.title;
});

// 创建一个可加载的 atom
export const loadableAsyncDataAtom = loadable(asyncDataAtom);

// 创建一个组合 atom 来计算双倍的计数值
export const doubleCountAtom = atom((get) => get(countAtom) * 2);
```
```typescript
// src/components/DoubleCounter.tsx
import React from 'react';
import { useAtom } from 'jotai';
import { doubleCountAtom } from '../store/atoms';

const DoubleCounter = () => {
  const [doubleCount] = useAtom(doubleCountAtom);

  return (
    <div>
      <h1>Double Count: {doubleCount}</h1>
    </div>
  );
};

export default DoubleCounter;
```


#### 8. 最佳实践

- **类型定义**：使用 TypeScript 类型系统来确保类型安全。
- **组合 Atom**：通过组合 atom 来创建复杂的逻辑和状态。
- **持久化**：使用 `atomWithStorage` 进行状态持久化。
- **异步操作**：使用 `loadable` 处理异步数据加载。
- **中间件**：使用中间件进行日志记录、持久化等。

#### 9. 示例项目结构

以下是一个简单的项目结构示例，展示了如何组织代码：
```
my-project/
├── src/
│   ├── store/
│   │   └── atoms.ts
│   ├── components/
│   │   ├── Counter.tsx
│   │   ├── AsyncData.tsx
│   │   └── DoubleCounter.tsx
│   └── index.tsx
├── package.json
└── tsconfig.json
```


#### 10. 总结

通过以上步骤，你可以快速入门并实践 Jotai。Jotai 提供了简单且高效的状态管理解决方案，适用于各种规模的 React 应用。遵循这些最佳实践，可以帮助你编写更健壮、更易维护的代码。
