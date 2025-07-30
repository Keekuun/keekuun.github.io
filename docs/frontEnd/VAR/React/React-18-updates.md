---
title: React18 版本主要有那些更新
date: 2025-7-20
sidebar: auto
categories:
- React
- 前端
tags:
- JS
- React
---

[[toc]]

## Batch update
在 React 18 中，**Batch Update（批量更新）机制得到了全面增强**，这是 React 为提升性能而进行的一项重要优化。

---

## ✅ 什么是 Batch Update？

**Batch Update** 是指 React 将多个状态更新合并为一次更新，以减少不必要的重复渲染，从而提升性能。

---

## 📌 React 18 前后的变化

| 特性 | React 17 及之前 | React 18 |
|------|------------------|----------|
| 同一批事件中的多个 `setState` | ✅ 合并更新 | ✅ 合并更新 |
| 异步操作中的 `setState`（如 `setTimeout`、`Promise`） | ❌ 不合并 | ✅ 合并 |
| 事件回调外的更新 | ❌ 不合并 | ✅ 合并 |
| 是否默认启用 | ❌ 需手动处理 | ✅ 默认启用（通过并发模式） |

---

## 🧪 示例：React 18 中的批量更新

```jsx
import React, { useState } from 'react';

function App() {
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  const handleClick = () => {
    setCount1(c => c + 1);
    setCount2(c => c + 1);
  };

  return (
    <div>
      <button onClick={handleClick}>点击</button>
      <div>count1: {count1}</div>
      <div>count2: {count2}</div>
    </div>
  );
}
```


在 React 18 中，两次 `setState` 会合并为一次渲染，而不是触发两次渲染。

---

## 🧩 异步场景下也能批量更新

```jsx
const handleClick = () => {
  setTimeout(() => {
    setCount1(c => c + 1);
    setCount2(c => c + 1);
  }, 100);
};
```


在 React 18 中，即使在 `setTimeout` 中，这两个 `setState` 也会被合并成一次更新。

---

## 🔧 如何退出批量更新？

如果你希望某个更新立即执行，可以使用 `flushSync`：

```jsx
import { flushSync } from 'react-dom';

flushSync(() => {
  setCount1(c => c + 1);
});
flushSync(() => {
  setCount2(c => c + 1);
});
```


---

## 📈 优势总结

| 优势 | 说明 |
|------|------|
| 提升性能 | 减少不必要的渲染次数 |
| 更智能的批处理 | 支持异步操作中的合并 |
| 开发体验优化 | 不再需要手动使用 `unstable_batchedUpdates` |
| 更好支持并发模式 | 与 `useDeferredValue`、`startTransition` 等特性协同工作 |

---

## 📝 注意事项

- 如果你依赖某些副作用必须在每次状态更新后执行，可能需要使用 `useEffect` 并注意依赖项。
- 使用 `flushSync` 时要谨慎，避免滥用，以免影响性能。

---

## Concurrent Mode
+ 18之前，挂载组件 `ReactDOM.render(<App />, root)`，卸载组件 `ReactDOM.unmountComponentAtNode(root)`
+ 18之后，使用 `ReactDOM.createRoot(root).render(<App />)`，卸载组件 `root.unmount()`
+ 并发模式不是一个功能，而是一个底层设计。
+ 并发模式可以帮助应用保持响应，根据用户的设备性能和网速进行调整，通过渲染可终端来修复阻塞渲染机制。
+ 并发模式下，React可以同时更新多个状态
+ 区别与之前：同步不可中断更新 --> 异步可中断更新
+ 新增 `useDeferredValue` 和 `startTransition` 用来标记一次非紧急更新：
  - `useDeferredValue`：用于延迟更新低优先级的状态，避免高优先级任务被阻塞。
  - `startTransition`：显式标记一组状态更新为“非紧急”，允许 React 在必要时暂停这些更新以处理更高优先级的任务。

`useDeferredValue` 使用示例：
```jsx
import { useState, useDeferredValue } from 'react';

function MyComponent() {
  const [input, setInput] = useState('');
  const deferredInput = useDeferredValue(input);

  return (
    <div>
      <input value={input} onChange={(e) => setInput(e.target.value)} />
      <MySlowList filter={deferredInput} />
    </div>
  );
}
```

`startTransition` 使用示例：
```jsx
import { useState, startTransition } from 'react';

function MyComponent() {
  const [input, setInput] = useState('');
  const [resource, setResource] = useState(null);

  function handleChange(e) {
    setInput(e.target.value);
    startTransition(() => {
      // 模拟昂贵的计算或资源加载
      const result = heavyProcessing(e.target.value);
      setResource(result);
    });
  }

  return (
    <div>
      <input value={input} onChange={handleChange} />
      {resource && <DisplayResource resource={resource} />}
    </div>
  );
}

```

## 仅支持现代浏览器
React 18 **仅支持现代浏览器**，这意味着它不再兼容一些老旧的浏览器版本（如 IE11）。这是为了更好地支持 React 的新特性（如并发模式、异步渲染、Hooks 优化等），并提升性能和开发体验。

---

### ✅ 支持的浏览器

React 18 支持以下现代浏览器：

| 浏览器       | 版本要求（大致） |
|--------------|------------------|
| Chrome       | 60+              |
| Firefox      | 60+              |
| Safari       | 11+              |
| Edge         | 18+              |
| iOS          | 10+              |
| Android      | 5+               |

---

### ❌ 不再支持的浏览器

| 浏览器       | 说明 |
|--------------|------|
| **IE11**     | 完全不支持，React 17 是最后一个支持 IE11 的版本 |
| **旧版 Safari / iOS** | 低于 iOS 10 的版本不支持 |
| **旧版 Android** | 低于 Android 5 的版本不支持 |

---

### 📌 影响与注意事项

1. **不再支持 ES5 环境**
    - React 18 默认使用 ES6+ 语法（如 `Proxy`, `Promise`, `let/const`, `箭头函数` 等）。
    - 如果你仍需支持老旧浏览器，建议：
        - 使用 Babel 转译代码
        - 使用 Webpack 或 Vite 配置目标浏览器兼容性
        - 降级到 React 17

2. **构建工具配置建议**
   在 `package.json` 中使用 `browserslist` 字段指定目标浏览器，确保构建工具（如 Babel、PostCSS）正确转译：

   ```json
   "browserslist": {
     "production": [">0.2%", "not dead", "not op_mini all"],
     "development": ["last 1 chrome version", "last 1 firefox version"]
   }
   ```


3. **企业项目迁移建议**
    - 如果项目需支持 IE11，建议使用 React 17 并配合 Create React App（CRA）或手动配置 polyfill。
    - 否则建议升级到 React 18，以充分利用并发模式、Hooks 优化等新特性。

---

### 🧪 Polyfill 建议（如需兼容旧环境）

如果你仍需支持旧浏览器，可以手动添加以下 polyfill：

```bash
npm install --save react-app-polyfill
```


然后在入口文件顶部引入：

```js
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
```


并在 `package.json` 中设置兼容目标：

```json
"browserslist": {
  "production": ["ie 11"],
  "development": ["ie 11"]
}
```


---

### 📈 优势总结

| 优势 | 说明 |
|------|------|
| 更好的性能 | 利用现代浏览器特性优化渲染、调度等 |
| 支持并发模式 | React 18 的核心特性，依赖现代 JS 特性 |
| 减少打包体积 | 不再需要大量 polyfill |
| 更简洁的代码 | 使用现代 JS 特性，提升开发效率 |


## flushSync
批量更新是React一个破坏性的升级，如果想退出批量更新，可以使用 `flushSync`

```jsx
import React, {useState} from "react"
import {flushSync} from "react-dom"

const App = () => {
    const [count1, setCount1] = useState()
    const [count2, setCount2] = useState()
    
    const handleClick = () => {
        // 第一次更新
        flushSync(() => {
            setCount1(count1 => count1+1)
        })
        
        // 第二次更新
        flushSync(() => {
            setCount1(count2 => count2+1)
        })
    }
    return (
        <div className="App">
            <button onClick={handlClick}>点击</button>
            
            <span>count1: {count1}</span>
            <span>count2: {count2}</span>
        </div>
    )
}
```

## 组件可返回 `null` 或者 `undefined`

18 版本之前只能返回 `null`, 返回 `undefined` 会报错，现在可以返回 `null` 或 `undefined`

## Strict Mode 更新
当使用严格模式的时候， React 会对每个组件返回两次渲染，以便观察一些意想不到的结果

## `Suspense`不强制`fallback`
在 React 18 中，`<Suspense>` 的使用变得更加灵活，**不再强制要求提供 `fallback` 属性**。这是对异步加载体验的一次重要改进，尤其在并发模式（Concurrent Mode）下更显优势。

---

### ✅ React 18 中 `<Suspense>` 的变化

| 特性 | React 17 及之前 | React 18 |
|------|------------------|----------|
| `fallback` 属性 | **必须提供**，否则报错 | **可选**，不提供时显示“空白”或“上一次有效内容” |
| 支持嵌套 | ✅ | ✅ |
| 支持服务端渲染（SSR） | ✅ 需要 fallback | ✅ 更好支持，可省略 fallback |

---

### 📌 示例：不使用 fallback 的 `<Suspense>`

```jsx
import React, { Suspense } from 'react';
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function App() {
  return (
    <div>
      <h1>主内容</h1>
      <Suspense>
        <LazyComponent />
      </Suspense>
    </div>
  );
}
```


在这个例子中，如果 `LazyComponent` 正在加载，React 会显示 `<Suspense>` 的父级内容（如 `<h1>`），而不是强制显示一个 fallback UI。

---

### 🧪 使用场景

| 场景 | 是否需要 fallback |
|------|------------------|
| 加载轻量级组件 | ❌ 可省略，使用空白或骨架屏 |
| 加载关键功能组件 | ✅ 建议提供 fallback 提升用户体验 |
| 服务端渲染（SSR） | ✅ 支持，可省略 fallback |
| 并发模式下异步加载 | ✅ 更加灵活，React 自动处理加载状态 |

---

### 🔁 与之前版本对比

| 项目 | React 17 | React 18 |
|------|-----------|-----------|
| `fallback` 必填 | ✅ 是 | ❌ 否 |
| 用户体验 | 固定 loading 状态 | 可选择渐进式显示内容 |
| SSR 支持 | 需 fallback | 更友好，可省略 |

---

### 📝 注意事项

- 不提供 `fallback` 时，React 会尝试显示 `<Suspense>` 边界外的内容。
- 在开发体验中，建议根据业务场景决定是否使用 fallback，以提升用户体验。
- 如果你使用了 `React.lazy` + `Suspense` 实现代码分割，推荐在关键路径中提供 fallback。

---

如需了解如何在实际项目中结合 `Suspense` 与异步加载、SSR、骨架屏等场景，欢迎继续提问！

## 支持 `useId`
在服务端和客户端生成相同的唯一ID, 避免 hydrating 的不兼容

`useId` 是 React 18 中新增的一个 Hook，主要用于**在服务端和客户端生成稳定的唯一 ID**，特别适用于需要在服务端渲染（SSR）或静态生成（SSG）场景下保持 ID 一致性的场景。

---

### ✅ 主要用途

- 生成跨服务端和客户端的**唯一且稳定的 ID**。
- 适用于需要绑定 HTML 元素属性（如 `id`、`aria-labelledby`）的场景。
- 解决在 SSR/SSG 中使用随机 ID 导致的 **hydration 不一致问题**。

---

### 📌 基本用法

```jsx
import React, { useId } from 'react';

function MyComponent() {
  const id = useId();

  return (
    <div>
      <label htmlFor={id}>用户名：</label>
      <input type="text" id={id} />
    </div>
  );
}
```


---

### 🧪 示例：服务端渲染（SSR）场景

```jsx
import React, { useId } from 'react';

function PasswordField() {
  const passwordId = useId();

  return (
    <div>
      <label htmlFor={passwordId}>密码：</label>
      <input type="password" id={passwordId} />
    </div>
  );
}
```


在服务端渲染时，`useId` 会生成稳定的 ID，确保服务端和客户端的 HTML 一致，避免 hydration 错误。

---

### 🔁 与 `Math.random()` 或 `uuid` 的区别

| 特性               | `useId()`                          | `Math.random()` / `uuid`         |
|--------------------|-------------------------------------|-----------------------------------|
| 稳定性             | ✅ 服务端和客户端一致               | ❌ 服务端和客户端不一致           |
| Hydration 支持     | ✅ 支持                             | ❌ 容易导致 hydration 失败        |
| 生成方式           | React 内部生成                     | 手动生成                          |
| 推荐使用场景       | 表单、ARIA 属性、SSR/CSR 一致性     | 非 SSR 场景、临时 ID              |

---

### 📝 注意事项

- `useId` 生成的 ID 是**全局唯一但不可预测**的。
- 不要依赖 `useId` 的格式，React 可能在未来版本中调整其结构。
- 不适用于需要**可预测 ID**的场景，应手动指定。

---

## `useSyncExternalStore`
`useSyncExternalStore` 是 React 18 中引入的一个新的 Hook，用于**将外部数据源同步到 React 组件的状态**。它解决了之前通过 `useState` 或 `useReducer` 手动同步外部状态时可能出现的问题，例如性能开销或不必要的重新渲染。

---

### ✅ 主要用途

- **与外部状态管理库集成**：如 Redux、MobX、Zustand 等。
- **订阅外部数据源**：如浏览器 API（localStorage、sessionStorage、media queries）、自定义事件总线等。
- **确保一致性**：即使在并发模式下，也能保证组件读取到最新的外部状态。

---

### 📌 核心 API

```jsx
const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```


| 参数             | 说明                                                                 |
|------------------|----------------------------------------------------------------------|
| `subscribe`      | 一个函数，用于订阅外部数据源变化，返回一个取消订阅的函数。           |
| `getSnapshot`    | 返回当前外部状态的快照，组件会用这个值进行渲染。                     |
| `getServerSnapshot` | 可选，在服务端渲染时返回初始快照，用于服务端和客户端一致性。         |

---

### 🧪 示例：使用 `useSyncExternalStore` 监听窗口大小

```jsx
import { useSyncExternalStore } from 'react';

function useWindowSize() {
  const getSnapshot = () => window.innerWidth;
  const subscribe = (callback) => {
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  };
  return useSyncExternalStore(subscribe, getSnapshot, () => 1024); // 服务端默认值
}

function App() {
  const width = useWindowSize();
  return <div>当前窗口宽度: {width}</div>;
}
```


---

### 🔁 与 `useState` 的对比

| 特性                         | `useState`                          | `useSyncExternalStore`                |
|------------------------------|--------------------------------------|----------------------------------------|
| 状态来源                     | React 内部状态                       | 外部状态（如浏览器、状态库等）         |
| 订阅机制                     | 无                                   | 支持订阅外部变化                        |
| 并发模式支持                 | 不够稳定                             | 更安全，React 会自动优化同步逻辑        |
| SSR 支持                     | 需手动处理                           | 支持 `getServerSnapshot` 提供初始值     |

---

### 📚 适用场景

- **状态管理库集成**：如 Redux 使用 `useSyncExternalStore` 替代 `useSelector`。
- **浏览器 API 监听**：如网络状态、设备方向、滚动位置等。
- **服务端渲染一致性**：确保服务端和客户端快照一致，避免 hydration 不匹配。

## `useInsertionEffect`
+ `useInsertionEffect` 只建议在 `css-in-js` 库中使用。
+ `useInsertionEffect` 执行时机在 Dom 生成之后， `useLayoutEffect` 执行之前。
+ `useInsertionEffect` 工作原理和`useLayoutEffect`大致相同，此时无法访问DOM节点，一般勇于提前注入脚本。
```jsx
import React, { useInsertionEffect } from 'react';

function injectGlobalStyles() {
  const style = document.createElement('style');
  style.textContent = 'body { background-color: lightblue; }';
  document.head.appendChild(style);
}

function App() {
  useInsertionEffect(injectGlobalStyles, []);

  return <div>Hello World</div>;
}
```

## 生命周期有哪些升级

在React 18中，生命周期方法本身没有发生重大变化，但由于并发模式的引入和一些新特性的加入，生命周期的行为可能会有所不同。以下是需要注意的几点：

1. **并发模式的影响**：
- 在并发模式下，React 可能会多次调用组件的渲染函数（包括类组件的 `render` 方法），直到最终确定渲染结果。这意味着某些生命周期方法（如 `componentDidUpdate`）可能会被多次调用。
- 开发者需要确保这些生命周期方法中的逻辑是幂等的，即多次调用不会产生副作用。

2. **Strict Mode 的影响**：
- 在严格模式下，React 会对每个组件进行两次渲染（开发环境下），以便检测潜在的问题。这会影响所有生命周期方法的调用次数。
- 第二次渲染是为了检查组件是否依赖于外部状态或副作用，因此开发者应避免在生命周期方法中执行不可重复的操作。

3. **新的 Hook 替代旧的生命周期方法**：
- React 18 推荐使用函数组件和 Hooks 来替代类组件及其生命周期方法。例如：
 - `componentDidMount` 和 `componentDidUpdate` 可以用 `useEffect` 替代。
 - `componentWillUnmount` 可以用 `useEffect` 的清理函数替代。
- 使用 Hooks 不仅更简洁，还能更好地适应并发模式的需求。

4. **异步渲染的影响**：
- 在并发模式下，React 渲染可能是异步的，这意味着生命周期方法的调用顺序可能与同步渲染时不同。
- 开发者需要确保生命周期方法中的逻辑能够正确处理这种异步行为。

5. **废弃的生命周期方法**：
- React 已经废弃了一些不安全的生命周期方法（如 `componentWillMount`、`componentWillReceiveProps` 和 `componentWillUpdate`），建议完全避免使用这些方法。
- 如果仍然需要类似的功能，可以使用 `getDerivedStateFromProps` 或自定义 Hooks 来实现。

总结来说，React 18 中的生命周期方法虽然没有直接升级，但由于并发模式和严格模式的引入，需要更加注意生命周期方法的调用时机和行为。推荐使用函数组件和 Hooks 来构建应用，以更好地适应 React 的未来发展方向。
