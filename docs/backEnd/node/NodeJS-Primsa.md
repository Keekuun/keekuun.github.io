---
title: NodeJS之Primsa
categories:
- 后端
tags:
- Node
- JS
---

### Node.js 中的 Prisma ORM

Prisma 是一个现代的、类型安全的 ORM（对象关系映射）工具，专为 TypeScript 和 JavaScript 应用程序设计。它简化了与数据库的交互，提供了强大的查询构建器和数据迁移工具。以下是关于如何在 Node.js 项目中使用 Prisma 的详细介绍。

#### 1. **安装 Prisma**

首先，你需要安装 Prisma CLI 和 Prisma 客户端：

```bash
npm install @prisma/client
npm install -D prisma
```


然后初始化 Prisma：

```bash
npx prisma init
```


这将创建一个 `prisma` 目录，并生成 `schema.prisma` 文件和 `.env` 文件模板。

#### 2. **配置数据库连接**

编辑 `prisma/schema.prisma` 文件，配置你的数据库连接字符串。例如，对于 PostgreSQL 数据库：

```prisma
generator client {
provider = "prisma-client-js"
}

datasource db {
provider = "postgresql"
url      = env("DATABASE_URL")
}
```


确保在 `.env` 文件中提供正确的数据库 URL：

```env
DATABASE_URL="postgresql://user:password@localhost:5432/mydb"
```


#### 3. **定义数据模型**

在 `schema.prisma` 文件中定义你的数据模型。例如，定义一个 `User` 模型：

```prisma
model User {
id        Int      @id @default(autoincrement())
name      String
email     String   @unique
posts     Post[]
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}

model Post {
id        Int      @id @default(autoincrement())
title     String
content   String?
published Boolean  @default(false)
author    User     @relation(fields: [authorId], references: [id])
authorId  Int
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
}
```


#### 4. **生成 Prisma 客户端**

运行以下命令生成 Prisma 客户端：

```bash
npx prisma generate
```


这将在 `node_modules/@prisma/client` 中生成 Prisma 客户端代码，使你可以通过 TypeScript 或 JavaScript 访问数据库。

#### 5. **执行数据库迁移**

使用 Prisma 迁移工具将你的数据模型应用到数据库：

```bash
npx prisma migrate dev --name init
```


这将根据 `schema.prisma` 文件中的定义创建相应的数据库表。

#### 6. **编写查询**

使用 Prisma 客户端进行数据库操作。例如，在 Express 应用中查询用户列表：

```javascript
const { PrismaClient } = require('@prisma/client');
const express = require('express');

const prisma = new PrismaClient();
const app = express();

app.get('/users', async (req, res) => {
const users = await prisma.user.findMany();
res.json(users);
});

app.listen(3000, () => {
console.log('服务器正在监听端口 3000');
});
```


#### 7. **常见操作**

##### 7.1 创建记录
```javascript
const user = await prisma.user.create({
data: {
name: 'Alice',
email: 'alice@example.com'
}
});
console.log(user);
```


##### 7.2 查询记录
```javascript
const users = await prisma.user.findMany({
where: {
email: {
contains: 'example.com'
}
}
});
console.log(users);
```


##### 7.3 更新记录
```javascript
const updatedUser = await prisma.user.update({
where: { id: 1 },
data: { name: 'Bob' }
});
console.log(updatedUser);
```


##### 7.4 删除记录
```javascript
const deletedUser = await prisma.user.delete({
where: { id: 1 }
});
console.log(deletedUser);
```


#### 8. **类型安全**

Prisma 提供了强大的类型推断功能，特别是在 TypeScript 环境下。所有查询结果都是类型安全的，减少了运行时错误的可能性。

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
const user = await prisma.user.findUnique({
where: { id: 1 }
});

if (user) {
console.log(user.name); // 类型安全，编译时检查
}
}

main().catch(e => console.error(e)).finally(async () => {
await prisma.$disconnect();
});
```


#### 9. **总结**

Prisma 是一个现代化的 ORM 工具，提供了简洁的 API 和强大的功能，适用于各种数据库操作。通过 Prisma，你可以轻松地管理数据库模式、执行迁移、编写类型安全的查询，并提高开发效率。

### Prisma 操作数据库字段

在使用 Prisma 进行数据库模式的修改（如新增字段、删除字段、修改字段）时，你需要按照以下步骤进行操作：

1. **修改 `schema.prisma` 文件**：在 `prisma/schema.prisma` 文件中进行相应的修改。
2. **创建迁移**：使用 Prisma 迁移工具创建新的迁移文件。
3. **应用迁移**：将迁移应用到本地数据库。
4. **应用迁移到远程数据库**：将迁移应用到远程数据库。

以下是详细步骤和示例：

#### 1. 修改 `schema.prisma` 文件

假设你已经有一个 `User` 模型，并且你想进行以下修改：
- 新增一个 `age` 字段。
- 修改 `email` 字段的默认值。
- 删除 `updatedAt` 字段。

修改后的 `schema.prisma` 文件如下：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique @default("default@example.com")
  age       Int?     // 新增字段
  posts     Post[]
  createdAt DateTime @default(now())
  // 删除字段
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```


#### 2. 创建迁移

使用 Prisma 迁移工具创建新的迁移文件：

```bash
npx prisma migrate dev --name add_age_field
```


这将生成一个新的迁移文件，记录了你对 `schema.prisma` 文件所做的修改。

#### 3. 应用迁移

Prisma 迁移工具会自动将迁移应用到本地数据库。如果一切顺利，你会看到类似以下的输出：

```bash
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "mydb" at "localhost:5432"

Applying migration `20231010123456_add_age_field`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └── 20231010123456_add_age_field/
    └── migration.sql

Your database is now in sync with your schema.

Running generate... (Use --skip-generate to skip the generators)

added 1 package, and audited 1 package in 1.2s

found 0 vulnerabilities

✔ Generated Prisma Client (4.11.0 | library) to ./node_modules/@prisma/client in 255ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client
```


#### 4. 应用迁移到远程数据库

要将迁移应用到远程数据库，你需要确保 `DATABASE_URL` 环境变量指向远程数据库。然后运行以下命令：

```bash
npx prisma migrate deploy
```

这将应用所有未应用的迁移文件到远程数据库。


#### 5. 验证迁移

你可以通过以下方式验证迁移是否成功：

- **使用数据库管理工具**：连接到你的数据库，检查 `User` 表是否包含 `age` 字段，`email` 字段的默认值是否已更改，`updatedAt` 字段是否已被删除。
- **使用 Prisma Studio**：Prisma 提供了一个图形化的数据库管理工具，可以方便地查看和管理数据库。

```bash
npx prisma studio
```


#### 6. 总结

通过以上步骤，你可以轻松地使用 Prisma 修改数据库字段、新增字段、删除字段，并将这些更改应用到远程数据库。Prisma 的迁移工具确保了数据库模式的版本控制和一致性，使得数据库管理更加高效和可靠。


### Prisma 增加约束
在使用 Prisma 修改数据库字段并添加约束条件时，你需要在 `schema.prisma` 文件中进行相应的定义，然后创建和应用迁移。以下是一些常见的约束条件及其在 Prisma 中的定义方法。

#### 常见约束条件

1. **唯一约束（Unique Constraint）**： 在字段上添加 `@unique`，Prisma 将自动为该字段添加唯一约束。
2. **非空约束（Not Null Constraint）**： 默认情况下，字段是非空的，除非使用 ? 表示可选字段。
3. **默认值（Default Value）**： 在字段上添加 `@default(value)`，Prisma 将自动为该字段添加默认值。
4. **外键约束（Foreign Key Constraint）**： 在字段上添加 `@relation`，Prisma 将自动为该字段添加外键约束。
5. **检查约束（Check Constraint）**（某些数据库支持，如 PostgreSQL）：  @@index 和 @@unique 可以用于简单的检查约束，但 Prisma 本身不直接支持复杂的 CHECK 约束。对于复杂的检查约束，可以使用数据库的原生 SQL。

+ 示例：在 `User` 模型中添加约束条件

假设你有一个 `User` 模型，并且你想进行以下修改：
- 新增一个 `age` 字段，并添加非空约束。
- 修改 `email` 字段，使其具有唯一约束。
- 新增一个 `role` 字段，并添加默认值为 `'user'`。
- 新增一个 `createdAt` 字段，并添加非空约束和默认值为当前时间。

#### 1. 修改 `schema.prisma` 文件

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique  // 增加唯一约束
  age       Int      @default(18) // 新增字段，非空约束，默认值为 18
  role      String   @default("user") // 新增字段，默认值为 'user'
  createdAt DateTime @default(now()) // 新增字段，非空约束，默认值为当前时间
  posts     Post[]
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```


#### 2. 创建迁移

使用 Prisma 迁移工具创建新的迁移文件：

```bash
npx prisma migrate dev --name add_constraints
```


这将生成一个新的迁移文件，记录了你对 `schema.prisma` 文件所做的修改。

#### 3. 应用迁移

Prisma 迁移工具会自动将迁移应用到本地数据库。如果一切顺利，你会看到类似以下的输出：

```bash
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "mydb" at "localhost:5432"

Applying migration `20231011123456_add_constraints`

The following migration(s) have been created and applied from new schema changes:

migrations/
  └── 20231011123456_add_constraints/
    └── migration.sql

Your database is now in sync with your schema.

Running generate... (Use --skip-generate to skip the generators)

added 1 package, and audited 1 package in 1.2s

found 0 vulnerabilities

✔ Generated Prisma Client (4.11.0 | library) to ./node_modules/@prisma/client in 255ms
You can now start using Prisma Client in your code. Reference: https://pris.ly/d/client
```


#### 4. 应用迁移到远程数据库

要将迁移应用到远程数据库，你需要确保 `DATABASE_URL` 环境变量指向远程数据库。然后运行以下命令：

```bash
npx prisma migrate deploy
```


这将应用所有未应用的迁移文件到远程数据库。

#### 5. 验证迁移

你可以通过以下方式验证迁移是否成功：

- **使用数据库管理工具**：连接到你的数据库，检查 `User` 表是否包含 `age` 字段、`role` 字段和 `createdAt` 字段，并验证它们的约束条件。
- **使用 Prisma Studio**：Prisma 提供了一个图形化的数据库管理工具，可以方便地查看和管理数据库。

```bash
npx prisma studio
```


#### 6. 总结

通过以上步骤，你可以在 Prisma 中轻松地添加字段并设置各种约束条件。Prisma 的迁移工具确保了数据库模式的版本控制和一致性，使得数据库管理更加高效和可靠。

### Prisma 底层原理

Prisma 是一个现代的、类型安全的 ORM（对象关系映射）工具，旨在简化与数据库的交互。它提供了强大的查询构建器、数据迁移工具和类型安全的查询能力。以下是 Prisma 的底层原理和工作流程的详细解释。

#### 1. **架构概述**

Prisma 的架构可以分为以下几个主要部分：

- **Prisma Client**：生成的客户端库，用于与数据库进行交互。
- **Prisma Migrate**：用于管理数据库迁移的工具。
- **Prisma Schema**：定义数据模型和数据库连接的配置文件。
- **Query Engine**：负责生成和执行数据库查询的底层引擎。
- **Introspection Engine**：用于从现有数据库生成 Prisma Schema 的工具。

#### 2. **Prisma Schema**

`schema.prisma` 文件是 Prisma 的核心配置文件，定义了数据模型和数据库连接信息。它包括以下部分：

- **Generator**：指定生成 Prisma Client 的配置。
- **Datasource**：配置数据库连接字符串。
- **Model**：定义数据模型，包括字段、关系和约束。

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```


#### 3. **Prisma Client 生成**

Prisma Client 是通过 `npx prisma generate` 命令生成的 TypeScript/JavaScript 库。它提供了类型安全的查询构建器，使得数据库操作更加直观和安全。

```bash
npx prisma generate
```


生成的 Prisma Client 包含以下功能：

- **类型安全的查询构建器**：根据 `schema.prisma` 文件生成类型定义。
- **自动完成**：在编辑器中提供自动完成功能，帮助你编写正确的查询。
- **错误处理**：提供详细的错误信息，帮助你调试和解决问题。

#### 4. **Prisma Migrate**

Prisma Migrate 是用于管理数据库迁移的工具，确保数据库模式与 `schema.prisma` 文件保持一致。

- **创建迁移**：使用 `npx prisma migrate dev --name <migration-name>` 命令创建迁移文件。
- **应用迁移**：使用 `npx prisma migrate deploy` 命令将迁移应用到数据库。

```bash
npx prisma migrate dev --name add_age_field
npx prisma migrate deploy
```


迁移文件包含 SQL 语句，用于在数据库中创建、修改或删除表和字段。

#### 5. **Query Engine**

Query Engine 是 Prisma 的核心组件，负责生成和执行数据库查询。它与 Prisma Client 和数据库进行交互，确保查询的高效性和正确性。

- **查询生成**：根据 Prisma Client 的查询请求生成相应的 SQL 语句。
- **查询执行**：执行生成的 SQL 语句，并将结果返回给 Prisma Client。
- **结果处理**：将数据库返回的结果转换为 JavaScript/TypeScript 对象。

#### 6. **Introspection Engine**

Introspection Engine 是用于从现有数据库生成 Prisma Schema 的工具。它可以帮助你快速开始使用 Prisma，而不需要手动编写 `schema.prisma` 文件。

- **数据库连接**：连接到现有的数据库。
- **模式提取**：提取数据库的表结构、字段和关系。
- **Schema 生成**：生成相应的 `schema.prisma` 文件。

```bash
npx prisma db pull
```


#### 7. **工作流程**

以下是使用 Prisma 的典型工作流程：

1. **定义数据模型**：在 `schema.prisma` 文件中定义数据模型。
2. **生成 Prisma Client**：运行 `npx prisma generate` 生成 Prisma Client。
3. **创建迁移**：运行 `npx prisma migrate dev --name <migration-name>` 创建迁移文件。
4. **应用迁移**：运行 `npx prisma migrate deploy` 将迁移应用到数据库。
5. **编写查询**：使用 Prisma Client 进行数据库操作。
6. **验证迁移**：使用数据库管理工具或 Prisma Studio 验证数据库模式。

#### 8. **类型安全**

Prisma 提供了强大的类型推断功能，特别是在 TypeScript 环境下。Prisma Client 生成的代码与 `schema.prisma` 文件中的定义保持一致，确保所有查询都是类型安全的。

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { id: 1 }
  });

  if (user) {
    console.log(user.name); // 类型安全，编译时检查
  }
}

main().catch(e => console.error(e)).finally(async () => {
  await prisma.$disconnect();
});
```


#### 9. **总结**

Prisma 的底层原理涉及多个组件和工具，共同确保了数据库操作的高效性和安全性。通过 Prisma Schema 定义数据模型，Prisma Client 提供类型安全的查询构建器，Prisma Migrate 管理数据库迁移，而 Query Engine 负责生成和执行数据库查询。这些组件协同工作，使得 Prisma 成为一个强大且灵活的 ORM 工具。
