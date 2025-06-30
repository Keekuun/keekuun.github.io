---
title: Next.js 中的 React.cache 函数详解
sidebar: auto
date: 2025-6-11
categories: 
- Next.js
- 前端
tags: 
- Next.js
---

### `React.cache` 解决了什么问题？

首先，我们必须搞清楚*为什么*需要这个函数。想象一下在服务端组件树中这个非常常见的场景：

```jsx
// app/layout.js
import { getUser } from './lib/data';

export default async function RootLayout({ children }) {
  // 我们需要用户信息来展示在页头
  const user = await getUser(123); 
  return (
    <html>
      <body>
        <header>欢迎, {user.name}!</header>
        <main>{children}</main>
      </body>
    </html>
  );
}

// app/dashboard/page.js
import { getUser } from '../lib/data';

export default async function DashboardPage() {
  // 仪表盘页面也需要同样的用户信息
  const user = await getUser(123); 
  return <h1>{user.name}的仪表盘</h1>;
}
```

在没有任何缓存的情况下，当用户请求 `/dashboard` 页面时，`getUser(123)` 函数会在同一次服务端渲染过程中被执行**两次**。这意味着会发生两次完全相同的数据库查询或 API 调用，这是冗余且低效的。

**`React.cache` 正是解决了这个问题：它可以在单次服务端渲染过程中，对拥有相同参数的函数调用进行去重（deduplication）。**

---

### React `cache` 的核心原理

`React.cache` 是一种**记忆化（memoization）**的形式，但有一个至关重要的区别：它的缓存**作用域仅限于单次服务器请求/渲染周期的生命周期**。它不是一个像 Next.js 数据缓存那样的长期持久化缓存。

它的底层工作原理如下：

1.  **请求作用域的存储空间 (Request-Scoped Store):** 当 React 开始在服务器上为特定请求渲染组件树时，它会创建一个临时的、存在于内存中的存储空间（你可以把它想象成一个 `Map`）。这个存储空间对于本次渲染是唯一的。

2.  **函数包装 (Function Wrapping):** 当你用 `React.cache` 包装一个函数时，你并没有改变原始函数。相反，你创建了一个新的、“带缓存”的版本。

3.  **首次调用 (缓存未命中 - Cache MISS):**
    *   当这个带缓存的函数首次被一组参数调用时（例如 `getUser(123)`），React 会生成一个唯一的键（Key）。这个键是函数本身和传递给它的参数的组合。
    *   React 会在这个请求作用域的存储空间中查找这个键。它找不到。
    *   然后，它会执行原始函数（`getUser(123)`）。
    *   至关重要的一步：它将**返回值**（如果是一个异步函数，它会存储 `Promise` 本身）与生成的键一起存入存储空间。
    *   最后返回结果。

4.  **后续调用 (缓存命中 - Cache HIT):**
    *   在*同一次*渲染过程中晚些时候（例如，当 `DashboardPage` 组件被渲染时），这个带缓存的函数再次被完全相同的参数调用（`getUser(123)`）。
    *   React 生成了相同的唯一键。
    *   它在请求作用域的存储空间中检查，并**找到了这个键**。
    *   它会立即返回**已存储的值**（与第一次调用时相同的那个 `Promise`），而**不会再次执行原始函数**。

5.  **渲染完成 (Render Completion):** 一旦整个服务端渲染完成并且响应已经发送给客户端，React 就会**丢弃这个临时存储空间**。内存被释放，下一个请求将从一个全新的、空的存储空间开始。

这个机制确保了在一次逻辑操作（渲染一个页面）中，你永远不会为获取相同数据支付多次成本。

---

### 手动实现：构建我们自己的 `cache`

现在到了有趣的部分。让我们构建一个这个功能的简化版本来巩固我们的理解。我们将创建一个工厂函数来模拟缓存的“请求作用域”特性。

```javascript
/**
 * 创建一个新的缓存实例。在真实的服务器环境中，
 * 你会在每个服务器请求开始时调用它。
 */
function createRequestCache() {
  // 这个 WeakMap 用于存储每个函数的缓存。
  // 结构是：WeakMap<Function, Map<Key, Value>>
  // 我们使用 WeakMap，这样如果函数本身被垃圾回收，它的缓存也会被自动移除。
  const cacheStore = new WeakMap();

  console.log('[系统]一个新的请求作用域缓存已被创建。');

  /**
   * 缓存函数，功能类似于 React.cache。
   * @param {Function} fn 要被记忆化的异步函数。
   */
  function cache(fn) {
    // 返回一个新的、包含了缓存逻辑的包装函数。
    return async function(...args) {
      // 1. 获取或创建针对这个特定函数 `fn` 的参数缓存。
      if (!cacheStore.has(fn)) {
        cacheStore.set(fn, new Map());
      }
      const argumentCache = cacheStore.get(fn);

      // 2. 从参数创建一个稳定的键。
      // 注意：这是一个简化的键生成策略。React 的内部实现更健壮。
      // JSON.stringify 并不完美（例如，对于对象键的顺序），但用于演示已经足够好。
      const key = JSON.stringify(args);

      // 3. 检查缓存是否命中。
      if (argumentCache.has(key)) {
        console.log(`[缓存命中] 函数: ${fn.name}, 参数: ${key}`);
        return argumentCache.get(key);
      }

      // 4. 处理缓存未命中的情况。
      console.log(`[缓存未命中] 函数: ${fn.name}, 参数: ${key}`);
    
      // 执行原始函数。其结果是一个 Promise。
      const resultPromise = fn(...args);
    
      // 将这个 Promise 存入缓存。
      argumentCache.set(key, resultPromise);
    
      return resultPromise;
    };
  }

  return { cache };
}

// --- 模拟场景 ---

// 定义一个我们假想的、很慢的数据获取函数。
async function getUser(id) {
  console.log(`[网络] 正在获取 ID 为 ${id} 的用户... (这会很慢)`);
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 1000)); 
  return { id, name: `用户 ${id}` };
}

// 这个函数模拟一次完整的服务器请求和页面渲染。
async function handleServerRequest() {
  console.log("--- 收到新的服务器请求 ---");

  // 对每个请求，我们都获取一个全新的、干净的缓存实例。
  const { cache } = createRequestCache();

  // 用我们自己实现的 cache 来包装数据获取函数。
  const getCachedUser = cache(getUser);

  // 现在，我们模拟一个组件树的渲染过程。
  console.log("正在渲染组件树...");

  // 想象 Layout.js 调用它，然后 Page.js 也调用它。
  const userPromise1 = getCachedUser(123); // 第一次调用
  const userPromise2 = getCachedUser(123); // 第二次调用，参数相同
  const userPromise3 = getCachedUser(456); // 第三次调用，参数不同

  // 等待所有结果返回
  const [user1, user2, user3] = await Promise.all([
    userPromise1,
    userPromise2,
    userPromise3,
  ]);

  console.log("\n--- 渲染完成 ---");
  console.log("结果 1:", user1);
  console.log("结果 2:", user2);
  console.log("结果 3:", user3);

  console.assert(user1 === user2, "断言失败: user1 和 user2 应该是同一个对象引用！");
  console.log("\n断言通过: user1 和 user2 指向同一份数据，证明去重成功。");
}

// 运行模拟
handleServerRequest();
```

#### 运行代码并分析输出

如果你在 Node.js 环境中运行这段代码，你会看到类似下面的输出：

```
--- 收到新的服务器请求 ---
[系统]一个新的请求作用域缓存已被创建。
正在渲染组件树...
[缓存未命中] 函数: getUser, 参数: [123]
[网络] 正在获取 ID 为 123 的用户... (这会很慢)
[缓存命中] 函数: getUser, 参数: [123]
[缓存未命中] 函数: getUser, 参数: [456]
[网络] 正在获取 ID 为 456 的用户... (这会很慢)

--- 渲染完成 ---
结果 1: { id: 123, name: '用户 123' }
结果 2: { id: 123, name: '用户 123' }
结果 3: { id: 456, name: '用户 456' }

断言通过: user1 和 user2 指向同一份数据，证明去重成功。
```

**从输出中得出的关键观察：**

1.  **`[123]` 的缓存未命中：** 第一次调用 `getCachedUser(123)` 是未命中的，所以它触发了“慢速”的网络请求。
2.  **`[123]` 的缓存命中：** 第二次调用 `getCachedUser(123)` 是一个即时的命中。我们看到 `[网络]` 的日志**没有**再次打印，证明了函数没有被重复执行。
3.  **`[456]` 的缓存未命中：** 使用不同参数的调用是未命中的，这符合预期，并触发了它自己的网络请求。
4.  **作用域缓存：** 如果你再次调用 `handleServerRequest()`，它会创建一个全新的缓存实例，整个过程会重新开始。

这个手动实现完美地展示了 Next.js 所利用的原理：**`React.cache` 提供了一个可靠的、请求作用域的机制，来防止在单次渲染中进行重复工作，使得在复杂的服务端组件树中获取数据既简单又高效。**
