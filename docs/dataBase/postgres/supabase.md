### Supabase 快速上手

Supabase 是一个开源的、实时的、无服务器的数据库平台，提供 PostgreSQL 数据库、实时监听、认证、存储等功能。以下是 Supabase 的快速上手指南，帮助你快速开始使用 Supabase。

#### 1. 注册和创建项目

1. **注册 Supabase 账号**：
    - 访问 [Supabase 官网](https://supabase.io/) 并注册一个账号。
    - 登录后，点击 "New Project" 创建一个新的项目。

2. **配置项目**：
    - 输入项目名称、选择数据库区域、选择计划（免费计划通常足够用于开发和测试）。
    - 创建项目后，你会获得一个项目 URL 和 API 密钥，这些信息在后续步骤中会用到。

#### 2. 安装 Supabase 客户端

在你的项目中安装 Supabase 客户端库。假设你使用的是 JavaScript 或 TypeScript 项目：

```bash
npm install @supabase/supabase-js
```


#### 3. 初始化 Supabase 客户端

在你的项目中初始化 Supabase 客户端。通常在项目的入口文件中进行初始化，例如 `index.js` 或 `App.js`。

```typescript
// src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://your-project-url.supabase.co'; // 替换为你的项目 URL
const supabaseKey = 'your-anon-key'; // 替换为你的 anon key

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
```


#### 4. 创建数据库表

你可以通过 Supabase 的 Web 界面或 SQL 命令来创建数据库表。

**通过 Web 界面创建表**：
1. 登录到 Supabase 控制台。
2. 选择你的项目。
3. 导航到 "SQL" 标签页。
4. 输入 SQL 命令创建表，例如：

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL
);
```


5. 点击 "Run" 执行 SQL 命令。

**通过 SQL 命令创建表**：
你也可以在代码中使用 Supabase 客户端执行 SQL 命令。

```typescript
// src/utils/createTable.js
import supabase from './supabaseClient';

const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    );
  `;

  const { data, error } = await supabase.from(query).select();
  if (error) {
    console.error('Error creating table:', error);
  } else {
    console.log('Table created successfully:', data);
  }
};

createTable();
```


#### 5. 插入和查询数据

使用 Supabase 客户端插入和查询数据。

**插入数据**：

```typescript
// src/utils/insertData.js
import supabase from './supabaseClient';

const insertUser = async (name, email) => {
  const { data, error } = await supabase
    .from('users')
    .insert([{ name, email }]);

  if (error) {
    console.error('Error inserting data:', error);
  } else {
    console.log('Data inserted successfully:', data);
  }
};

insertUser('Alice', 'alice@example.com');
```


**查询数据**：

```typescript
// src/utils/fetchData.js
import supabase from './supabaseClient';

const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');

  if (error) {
    console.error('Error fetching data:', error);
  } else {
    console.log('Data fetched successfully:', data);
  }
};

fetchUsers();
```


#### 6. 认证

Supabase 提供了简单的认证功能，支持电子邮件、OAuth 等多种认证方式。

**注册用户**：

```typescript
// src/utils/registerUser.js
import supabase from './supabaseClient';

const registerUser = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.error('Error registering user:', error);
  } else {
    console.log('User registered successfully:', user);
  }
};

registerUser('alice@example.com', 'securepassword123');
```


**登录用户**：

```typescript
// src/utils/loginUser.js
import supabase from './supabaseClient';

const loginUser = async (email, password) => {
  const { user, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Error logging in user:', error);
  } else {
    console.log('User logged in successfully:', user);
  }
};

loginUser('alice@example.com', 'securepassword123');
```


**监听认证状态**：

```typescript
// src/utils/authListener.js
import supabase from './supabaseClient';

supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session);
});
```


#### 7. 实时监听

Supabase 支持实时监听数据库变化。

**监听数据变化**：

```typescript
// src/utils/realtimeListener.js
import supabase from './supabaseClient';

const listenToUsers = () => {
  const mySubscription = supabase
    .from('users')
    .on('*', (payload) => {
      console.log('Change received!', payload);
    })
    .subscribe();
};

listenToUsers();
```


#### 8. 存储文件

Supabase 提供了存储功能，可以上传和管理文件。

**上传文件**：

```typescript
// src/utils/uploadFile.js
import supabase from './supabaseClient';

const uploadFile = async (file) => {
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(file.name, file);

  if (error) {
    console.error('Error uploading file:', error);
  } else {
    console.log('File uploaded successfully:', data);
  }
};

// 使用示例
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  uploadFile(file);
});
```


**获取文件 URL**：

```typescript
// src/utils/getFileUrl.js
import supabase from './supabaseClient';

const getFileUrl = async (filePath) => {
  const { data, error } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  if (error) {
    console.error('Error getting file URL:', error);
  } else {
    console.log('File URL:', data.publicUrl);
  }
};

getFileUrl('avatars/example.png');
```

### 9. 总结

通过以上步骤，你可以在 Next.js 14 或其他项目中快速上手 Supabase。Supabase 提供了丰富的功能，包括数据库管理、实时监听、认证、存储等，帮助你快速构建现代化的 Web 应用。遵循这些最佳实践，可以帮助你编写更健壮、更易维护的代码。

如果你有任何问题或需要进一步的帮助，可以参考 [Supabase 官方文档](https://supabase.io/docs) 或加入 [Supabase 社区](https://supabase.io/community)。
