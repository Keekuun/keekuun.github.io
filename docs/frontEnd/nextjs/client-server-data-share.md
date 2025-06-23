---
title: Next.js 服务端和客户端共享数据或状态
sidebar: auto
categories: 
- Next.js
- 前端
tags: 
- Next.js
---

简单来说，遵循一个核心原则：**数据从服务端流向客户端，而状态变更从客户端通过特定机制“通知”服务端。**

下面我们来详细解读几种主要的共享数据和状态的模式。

### 核心原则：单向数据流 (Server → Client)

服务端组件（Server Components）在服务器上渲染，并且它们的生命周期在响应发送到浏览器之前就已经结束了。因此，你**不能**直接从客户端组件“读取”或“修改”服务端组件的状态。

数据传递的主要方向是 **从服务端组件到客户端组件**。

---

### 1. 从服务端组件向客户端组件传递数据（最常见）

这是最直接、最基础的通信方式，主要通过 props 实现。

#### 方法 A: 通过 Props 传递

这是最简单直接的方法。服务端组件获取数据后，像传递普通 props 一样，将数据传递给它渲染的客户端组件。

**工作原理：**
1.  服务端组件 (`ServerPage`) 在服务器上运行，执行 `fetch` 获取数据。
2.  它将获取到的 `initialData` 作为 prop 传递给客户端组件 (`ClientCounter`)。
3.  Next.js 在生成 HTML 的同时，会序列化这个 prop，并将其嵌入到发送给浏览器的 JavaScript 载荷中。
4.  当客户端组件在浏览器中“激活”（Hydration）时，它会接收到这个初始 prop，并可以用它来初始化自己的状态（如 `useState`）。

**`app/page.tsx` (服务端组件)**
```typescript
import ClientCounter from './ClientCounter';

interface User {
  id: number;
  name: string;
}

async function getUserData(): Promise<User> {
  // 这在服务器上执行
  const res = await fetch('https://api.example.com/user/1', { cache: 'no-store' });
  return res.json();
}

export default async function ServerPage() {
  const user = await getUserData();

  // 将从服务器获取的数据作为 prop 传递给客户端组件
  return (
    <div>
      <h1>Welcome from the Server!</h1>
      <p>This part is rendered on the server.</p>
      <ClientCounter initialUser={user} />
    </div>
  );
}
```

**`app/ClientCounter.tsx` (客户端组件)**
```typescript
'use client';

import { useState } from 'react';

interface User {
  id: number;
  name: string;
}

interface ClientCounterProps {
  initialUser: User;
}

export default function ClientCounter({ initialUser }: ClientCounterProps) {
  // 使用从服务器传来的 prop 来初始化客户端状态
  const [user, setUser] = useState<User>(initialUser);
  const [count, setCount] = useState(0);

  return (
    <div style={{ border: '1px solid blue', padding: '10px', marginTop: '10px' }}>
      <h2>Hello, {user.name}! (This is a Client Component)</h2>
      <p>Your ID is: {user.id}</p>
      <p>Current count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Increment</button>
    </div>
  );
}
```

#### 方法 B: 通过 `children` Prop (插槽模式)

这种方式非常强大，它允许你用一个客户端组件包裹一个或多个服务端组件，实现布局和交互的解耦。

**`app/ClientLayoutWrapper.tsx` (客户端组件)**
```typescript
'use client';

import { useState } from 'react';

// 这个组件本身是客户端的，但它可以接收服务端渲染的 children
export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? 'Collapse' : 'Expand'}
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```

**`app/page.tsx` (服务端组件)**
```typescript
import ClientLayoutWrapper from './ClientLayoutWrapper';
import ServerInfo from './ServerInfo'; // 另一个服务端组件

export default function Page() {
  return (
    <ClientLayoutWrapper>
      {/* 
        ServerInfo 是一个服务端组件，它被渲染在服务器上。
        它的 HTML 结果被“插入”到 ClientLayoutWrapper 的 children 位置。
        ClientLayoutWrapper 在客户端控制这个已渲染内容的显示/隐藏。
      */}
      <ServerInfo />
    </ClientLayoutWrapper>
  );
}
```
**`app/ServerInfo.tsx`**
```typescript
// 这是一个纯服务端组件
export default async function ServerInfo() {
  const data = await fetch('...', { cache: 'no-store' }).then(res => res.json());
  return <div>This is server-rendered content with data: {data.info}</div>;
}
```

---

### 2. 从客户端组件向服务端“发送”信息

客户端的状态（如 `useState`）存在于浏览器中，服务器对此一无所知。当客户端状态改变时，我们不能直接更新服务端组件。相反，我们需要**触发一个服务端的动作**，让服务器重新获取数据并渲染更新后的UI。

#### 方法 A: Server Actions (推荐)

Server Actions 是 Next.js App Router 的核心功能。它们是定义在服务端，却可以从客户端安全调用的函数。

**工作原理：**
1.  你在客户端组件中调用一个标记为 Server Action 的函数。
2.  Next.js 通过 RPC 调用将这个请求发送到服务器。
3.  服务器上的函数执行（例如，更新数据库）。
4.  函数执行完毕后，可以通过 `revalidatePath` 或 `revalidateTag` 来清除缓存，使 Next.js 重新渲染受影响的页面或布局。
5.  更新后的服务端组件 HTML 会被发送回客户端，并无缝地更新 DOM。

**`app/actions.ts` (服务端动作)**
```typescript
'use server'; // 标记这个文件中的所有导出都是 Server Actions

import { revalidatePath } from 'next/cache';

// 假设我们有一个模拟数据库
let sharedText = 'Initial text from server';

export async function updateSharedText(newText: string) {
  console.log('Server Action called with:', newText);
  // 在这里可以进行数据库操作等
  sharedText = newText;

  // 关键：通知 Next.js '/' 路径的数据已经过时，需要重新渲染
  revalidatePath('/');
}

export async function getSharedText() {
    return sharedText;
}
```

**`app/page.tsx` (服务端组件，显示数据)**
```typescript
import { getSharedText } from './actions';
import ClientForm from './ClientForm';

export default async function Page() {
  // 每次页面重新渲染时，都会调用这个函数获取最新数据
  const text = await getSharedText();

  return (
    <div>
      <h1>Data on Server: {text}</h1>
      <ClientForm />
    </div>
  );
}
```

**`app/ClientForm.tsx` (客户端组件，触发动作)**
```typescript
'use client';

import { useState } from 'react';
import { updateSharedText } from './actions';

export default function ClientForm() {
  const [input, setInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 直接调用 Server Action！
    await updateSharedText(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={input} 
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter new text"
      />
      <button type="submit">Update Server Data</button>
    </form>
  );
}
```

#### 方法 B: 通过 URL 参数和 `router`

这是一种传统的、符合 RESTful 风格的方法。客户端通过改变 URL（通常是查询参数）来传递状态，服务端组件读取这些参数来渲染不同的内容。

1.  客户端使用 `next/navigation` 中的 `useRouter` 或 `<Link>` 来改变 URL。
2.  Next.js 捕获到 URL 变化，重新向服务器请求页面。
3.  服务端组件从 `params` 或 `searchParams` prop 中读取新的 URL 参数，获取相应的数据并渲染。

---

### 3. 全局状态管理 (Context, Zustand, Redux)

如果你需要在**多个客户端组件**之间共享**客户端状态**，传统的全局状态管理库依然适用。但需要注意初始化流程。

**关键模式：用服务端数据初始化客户端 Store**

1.  **创建 Provider**: 你的全局状态 Provider (如 `ReduxProvider`, `ZustandProvider`) **必须是一个客户端组件** (`'use client';`)。
2.  **服务端获取初始数据**: 在顶层的服务端组件（如 `layout.tsx` 或 `page.tsx`）中获取作为全局状态初始值的数据。
3.  **通过 Props 注入**: 将这些初始数据作为 props 传递给你创建的客户端 Provider。
4.  **初始化 Store**: 在 Provider 组件内部，仅在首次渲染时使用接收到的 props 来创建或初始化你的 store。
5.  **消费状态**: 所有被该 Provider 包裹的子客户端组件都可以通过相应的 hooks (`useContext`, `useStore`) 来访问和修改这个全局状态。

### 总结表格

| 场景 | 解决方案 | 实现方式 | 核心思想 |
| :--- | :--- | :--- | :--- |
| **Server → Client** | **Props 传递** | 在服务端组件中获取数据，作为 props 传给客户端组件。 | 单向数据流，服务器准备好数据，客户端接收并使用。 |
| **Server → Client** | **插槽 (`children`)** | 客户端组件作为布局，接收服务端组件作为 `children`。 | 关注点分离，交互逻辑在客户端，内容渲染在服务端。 |
| **Client → Server** | **Server Actions** | 在客户端调用一个 `async` 函数，该函数在服务端执行。 | 现代 RPC。客户端触发服务端逻辑，服务器负责数据更新和UI重渲染。 |
| **Client → Server** | **URL State** | 客户端通过 `router.push` 或 `<Link>` 修改 URL 查询参数。 | RESTful 风格。URL 是状态的来源，服务端根据 URL 渲染。 |
| **Client ↔ Client** | **全局状态管理器** | 使用 `'use client';` Provider，并从服务端获取初始数据注入。 | 客户端状态独立管理，但可以由服务器“播种”初始值。 |

掌握这些模式，你就能在 Next.js 的混合渲染环境中游刃有余地构建复杂而高效的应用程序了。
