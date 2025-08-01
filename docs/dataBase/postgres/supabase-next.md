---
title: 使用 Next.js Server Actions 操作 Supabase
date: 2025-02-25
sidebar: auto
categories: 
- 数据库
tags: 
- supabase
- nextjs
- database
---

## 使用 Next.js Server Actions 操作 Supabase 

在 Next.js 13 及以上版本中，Server Actions 提供了一种在服务器端处理表单提交和其他操作的方式，而无需编写额外的 API 路由。结合 Supabase，你可以在 Server Actions 中直接操作数据库，从而简化代码结构并提高安全性。以下是详细的步骤和示例，展示如何在 Next.js 中使用 Server Actions 操作 Supabase。

### 1. 安装 Supabase 客户端

首先，确保你已经安装了 Supabase 客户端库：

```bash
npm install @supabase/supabase-js
```


### 2. 初始化 Supabase 客户端

在你的项目中初始化 Supabase 客户端。通常在项目的入口文件中进行初始化，例如 `lib/supabaseClient.js`。

```typescript
// lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
```


### 3. 设置环境变量

在 `.env.local` 文件中设置 Supabase 的 URL 和匿名密钥：

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```


### 4. 创建 Server Actions

在 Next.js 13 及以上版本中，Server Actions 可以在组件中直接定义。以下是如何在 Server Actions 中操作 Supabase 的示例。

#### 4.1 插入数据

创建一个 Server Action 来插入用户数据：

```typescript
 'use server'; // 确保这是一个 Server Action

// app/actions/insertUser.js
import supabase from '@/lib/supabaseClient';

export async function insertUser(formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');

  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email }]);

  if (error) {
    console.error('Error inserting data:', error);
    throw new Error('Failed to insert user');
  }

  return { success: true, message: 'User inserted successfully' };
}

```


#### 4.2 查询数据

创建一个 Server Action 来查询用户数据：

```typescript
  'use server'; // 确保这是一个 Server Action

// app/actions/fetchUsers.js
import supabase from '@/lib/supabaseClient';

export async function fetchUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch users');
  }

  return data;
}
```


### 5. 在组件中使用 Server Actions

在组件中使用 Server Actions 来插入和查询数据。

#### 5.1 插入用户

创建一个表单组件来插入用户数据：

```tsx
// app/components/UserForm.js
'use client';

import { useState } from 'react';
import { insertUser } from '@/app/actions/insertUser';

const UserForm = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = async (formData) => {
    const result = await insertUser(formData);
    setMessage(result.message);
  };

  return (
    <form action={handleSubmit}>
      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          required
        />
      </div>
      <button type="submit">Insert User</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default UserForm;
```


#### 5.2 查询用户

创建一个组件来查询用户数据：

```tsx
// app/components/UserList.js
'use client';

import { useEffect, useState } from 'react';
import { fetchUsers } from '@/app/actions/fetchUsers';

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    loadUsers();
  }, []);

  return (
    <div>
      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
```


### 6. 示例项目结构

以下是一个简单的项目结构示例，展示了如何组织代码：

```
my-nextjs-project/
├── app/
│   ├── actions/
│   │   ├── insertUser.js
│   │   └── fetchUsers.js
│   ├── components/
│   │   ├── UserForm.js
│   │   └── UserList.js
│   ├── pages/
│   │   └── index.js
├── lib/
│   └── supabaseClient.js
├── public/
├── styles/
├── .env.local
├── package.json
└── tsconfig.json
```


### 7. 主应用组件

在主应用组件中使用 `UserForm` 和 `UserList` 组件：

```tsx
// app/pages/index.js
import UserForm from '@/app/components/UserForm';
import UserList from '@/app/components/UserList';

const Home = () => {
  return (
    <div>
      <h1>Supabase with Next.js Server Actions</h1>
      <UserForm />
      <UserList />
    </div>
  );
};

export default Home;
```


### 8. 运行项目

确保你的 Supabase 项目已经创建，并且 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 环境变量已经正确设置。然后运行你的 Next.js 项目：

```bash
npm run dev
```


### 9. 总结

通过以上步骤，你可以在 Next.js 13 及以上版本中使用 Server Actions 操作 Supabase。Server Actions 提供了一种简洁的方式来在服务器端处理表单提交和其他操作，而无需编写额外的 API 路由。结合 Supabase，你可以轻松地进行数据库操作，并保持代码的整洁和高效。

如果你有任何问题或需要进一步的帮助，可以参考 [Next.js 官方文档](https://nextjs.org/docs) 和 [Supabase 官方文档](https://supabase.io/docs)。
