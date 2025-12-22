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

---

#### 1. 安装 Jotai

首先，你需要安装 Jotai：
```bash
npm install jotai
```

---

#### 2. 核心概念和 API

Jotai 的核心是 `atom` 和 React hooks。以下是 Jotai 的主要 API 和用法：

##### 2.1 `atom`

`atom` 是 Jotai 的基本单位，用于存储状态。

```typescript
import { atom } from 'jotai';

export const countAtom = atom(0); // 创建一个 atom
```

##### 2.2 `useAtom`

`useAtom` 是最常用的 hook，用于读取和写入 atom 的值。

```typescript
import { useAtom } from 'jotai';
import { countAtom } from '../store/atoms';

const Counter = () => {
  const [count, setCount] = useAtom(countAtom);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
    </div>
  );
};
```

##### 2.3 `useAtomValue`

`useAtomValue` 用于只读取 atom 的值，适合不需要更新状态的场景。

```typescript
import { useAtomValue } from 'jotai';
import { countAtom } from '../store/atoms';

const DisplayCount = () => {
  const count = useAtomValue(countAtom);

  return <h1>Count: {count}</h1>;
};
```

##### 2.4 `useSetAtom`

`useSetAtom` 用于只更新 atom 的值，适合不需要读取状态的场景。

```typescript
import { useSetAtom } from 'jotai';
import { countAtom } from '../store/atoms';

const IncrementButton = () => {
  const setCount = useSetAtom(countAtom);

  return <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>;
};
```

##### 2.5 `atomWithDefault`

`atomWithDefault` 用于创建带有默认值的 atom，默认值可以是动态计算的。

```typescript
import { atom, atomWithDefault } from 'jotai';

const baseCountAtom = atom(0);
export const doubleCountAtom = atomWithDefault((get) => get(baseCountAtom) * 2);
```

##### 2.6 `loadable`

`loadable` 用于处理异步状态，支持加载中和错误状态。

```typescript
import { atom, loadable } from 'jotai';

const asyncDataAtom = atom(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  return response.json();
});

export const loadableDataAtom = loadable(asyncDataAtom);
```

##### 2.7 `atomWithStorage`

`atomWithStorage` 用于将状态持久化到 `localStorage` 或 `sessionStorage`。

```typescript
import { atomWithStorage } from 'jotai/utils';

export const themeAtom = atomWithStorage('theme', 'light');
```

---

#### 3. 在 Next.js 中使用 Jotai

Jotai 可以无缝集成到 Next.js 中。以下是一个示例：

##### 3.1 创建 Atom

```typescript
// src/store/atoms.ts
import { atom } from 'jotai';

export const countAtom = atom(0);
```

##### 3.2 使用 Atom

```typescript
// src/pages/index.tsx
import { useAtom } from 'jotai';
import { countAtom } from '../store/atoms';

const Home = () => {
  const [count, setCount] = useAtom(countAtom);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
    </div>
  );
};

export default Home;
```

##### 3.3 服务端渲染

Jotai 支持服务端渲染（SSR）。你可以在 `getServerSideProps` 或 `getStaticProps` 中初始化状态。

```typescript
// src/pages/index.tsx
import { useAtom } from 'jotai';
import { countAtom } from '../store/atoms';

export const getServerSideProps = async () => {
  return {
    props: {
      initialCount: 10,
    },
  };
};

const Home = ({ initialCount }: { initialCount: number }) => {
  const [count, setCount] = useAtom(countAtom);

  // 初始化状态
  React.useEffect(() => {
    setCount(initialCount);
  }, [initialCount, setCount]);

  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount((prev) => prev + 1)}>Increment</button>
    </div>
  );
};

export default Home;
```

---

#### 4. 高级用法

##### 4.1 组合 Atom

通过组合 atom，可以创建复杂的状态逻辑。

```typescript
import { atom } from 'jotai';

const countAtom = atom(0);
export const doubleCountAtom = atom((get) => get(countAtom) * 2);
```

##### 4.2 异步状态管理

Jotai 支持异步状态管理，适合数据加载场景。

```typescript
import { atom } from 'jotai';

export const asyncDataAtom = atom(async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
  return response.json();
});
```

##### 4.3 中间件

使用 `atomWithStorage` 或自定义逻辑实现状态持久化。

```typescript
import { atomWithStorage } from 'jotai/utils';

export const userPreferencesAtom = atomWithStorage('preferences', { theme: 'light' });
```

---

#### 5. 最佳实践

- **使用 `useAtomValue` 和 `useSetAtom`**：根据需求选择合适的 hook，避免不必要的重新渲染。
- **状态持久化**：使用 `atomWithStorage` 持久化重要状态。
- **异步操作**：使用 `loadable` 处理异步状态。
- **类型安全**：在 TypeScript 中定义 atom 的类型。
- **模块化**：将 atom 和组件分离，保持代码清晰。

---

#### 6. 示例项目结构

以下是一个推荐的项目结构：

```
my-project/
├── src/
│   ├── store/
│   │   └── atoms.ts
│   ├── components/
│   │   ├── Counter.tsx
│   │   ├── AsyncData.tsx
│   │   └── DoubleCounter.tsx
│   ├── pages/
│   │   └── index.tsx
├── package.json
└── tsconfig.json
```

---

#### 7. 总结

Jotai 是一个功能强大且易于使用的状态管理库。通过掌握其核心 API 和最佳实践，你可以轻松管理 React 和 Next.js 应用中的状态。
