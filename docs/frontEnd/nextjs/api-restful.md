---
title: Next.js 实践 Restful API
sidebar: auto
date: 2025-07-1
categories: 
- Next.js
- 前端
tags: 
- Next.js
---


本文将结合使用 **Prisma** (数据库 ORM), **Zod** (数据校验) 和 Next.js 的内置功能，打造一个**类型安全、结构清晰、错误处理健壮、易于维护**的 API 开发流程。

---

### Restful API 开发实践

#### 1. 结构化：清晰的文件和路由组织

Next.js App Router 的基于文件夹的路由是构建 RESTful API 的天然优势。

*   **集合路由 (Collection routes)**: `GET /api/posts`, `POST /api/posts`
    *   文件路径: `app/api/posts/route.ts`
*   **单个实体路由 (Single entity routes)**: `GET /api/posts/[postId]`, `PUT /api/posts/[postId]`, `DELETE /api/posts/[postId]`
    *   文件路径: `app/api/posts/[postId]/route.ts`

在 `route.ts` 文件中，通过导出以 HTTP 方法命名的函数来创建端点：

```typescript
// app/api/posts/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // ...获取文章列表的逻辑
  return NextResponse.json({ message: "List of posts" });
}

export async function POST(request: Request) {
  // ...创建新文章的逻辑
  return NextResponse.json({ message: "Post created" }, { status: 201 });
}
```

#### 2. 端到端类型安全：Prisma + Zod

这是现代 Web 开发的“黄金搭档”，可以消除大量潜在的 bug。

*   **Prisma**: 从数据库层面保证类型安全。在你运行 `npx prisma generate`后，它会为你生成所有模型的 TypeScript 类型（如 `Post`, `User`）。
*   **Zod**: 在 API 的入口处进行**运行时**数据校验，并自动推断出 TypeScript 类型。这弥补了 TypeScript 类型在编译后会消失的不足。

**实践示例：创建一个 Post**

1.  **定义校验 Schema**：在你的 API 路由文件中，首先用 Zod 定义期望的请求体结构。

    ```typescript
    // app/api/posts/route.ts
    import { z } from 'zod';

    const postCreateSchema = z.object({
      title: z.string().min(3, "标题至少需要3个字符").max(100),
      content: z.string().min(10, "内容至少需要10个字符"),
      authorId: z.string().cuid(), // 假设 authorId 是 cuid 格式
    });
    ```

2.  **在 `POST` 函数中使用**：

    ```typescript
    import { NextResponse } from 'next/server';
    import prisma from '@/lib/prisma'; // 你的 Prisma 实例
    import { z } from 'zod';
  
    // ... Zod schema 定义 ...

    export async function POST(request: Request) {
      try {
        const reqBody = await request.json();

        // 1. 数据校验
        const validatedData = postCreateSchema.parse(reqBody);
      
        // 如果上面这行代码没有抛出错误，validatedData 就是类型安全的数据
        // 它的类型是: { title: string; content: string; authorId: string; }
        // 你可以享受完美的自动补全和类型检查

        // 2. 调用数据库逻辑
        const newPost = await prisma.post.create({
          data: validatedData
        });

        // 3. 返回成功的响应
        return NextResponse.json(newPost, { status: 201 });

      } catch (error) {
        // ... 查看下面的错误处理部分 ...
      }
    }
    ```

#### 3. 健壮的错误处理

永远不要让未处理的错误泄露到客户端。为你的 API 设计一套统一的错误响应格式。

**实践示例：扩展上面的 `POST` 函数**

```typescript
// ...接着上面的代码

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();
    const validatedData = postCreateSchema.parse(reqBody);
  
    const newPost = await prisma.post.create({
      data: validatedData,
    });

    return NextResponse.json(newPost, { status: 201 });

  } catch (error) {
    // 专门处理 Zod 校验错误
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: "输入数据无效", 
          errors: error.flatten().fieldErrors // 提供详细的字段错误信息
        },
        { status: 400 } // 400 Bad Request
      );
    }
  
    // 处理 Prisma 已知的错误，例如唯一约束失败
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') { // Unique constraint failed
        return NextResponse.json({ message: "标题或唯一标识已存在" }, { status: 409 }); // 409 Conflict
      }
    }

    // 处理其他未知错误
    console.error("An unexpected error occurred:", error);
    return NextResponse.json(
      { message: "服务器内部错误" }, 
      { status: 500 }
    );
  }
}
```

#### 4. 分离业务逻辑（关注点分离）

不要把所有的数据库查询和业务逻辑都堆在 `route.ts` 文件里。这会让路由文件变得臃肿且难以测试。

**实践：创建 Service 层**

1.  **创建 Service 文件**:
    ```typescript
    // lib/services/post.service.ts

    import prisma from '@/lib/prisma';
    import { Post } from '@prisma/client';

    // 定义创建文章所需的数据类型，可以从 Zod schema 推断
    // type PostCreateData = z.infer<typeof postCreateSchema>;

    type PostCreateData = {
        title: string;
        content: string;
        authorId: string;
    }

    export async function createPost(data: PostCreateData): Promise<Post> {
      // 这里的逻辑可以更复杂，比如处理标签、发送通知等
      const newPost = await prisma.post.create({
        data,
      });
      return newPost;
    }

    export async function getPostById(postId: string): Promise<Post | null> {
      return prisma.post.findUnique({
        where: { id: postId },
      });
    }

    // ... 其他服务函数，如 getAllPosts, updatePost 等
    ```

2.  **在路由文件中调用 Service**：
    `route.ts` 现在只负责处理 HTTP 请求、校验和响应，变得非常干净。

    ```typescript
    // app/api/posts/route.ts
    import * as postService from '@/lib/services/post.service';
    // ... 其他 import 和 Zod schema ...

    export async function POST(request: Request) {
      try {
        const reqBody = await request.json();
        const validatedData = postCreateSchema.parse(reqBody);

        // 调用 Service
        const newPost = await postService.createPost(validatedData);

        return NextResponse.json(newPost, { status: 201 });
      } catch (error) {
        // ... 统一的错误处理 ...
      }
    }
    ```

#### 5. 处理请求参数

*   **动态路由参数**: 从函数签名中获取。

    ```typescript
    // app/api/posts/[postId]/route.ts
    export async function GET(
      request: Request,
      { params }: { params: { postId: string } }
    ) {
      const { postId } = params;
      // ...
    }
    ```

*   **URL 查询参数**: 从 `request.nextUrl.searchParams` 获取。

    ```typescript
    // GET /api/posts?page=2&limit=10
    export async function GET(request: Request) {
      const { searchParams } = new URL(request.url);
      const page = searchParams.get('page') || '1';
      const limit = searchParams.get('limit') || '10';
      // ...
    }
    ```

#### 6. 认证与授权

使用 `NextAuth.js` 或 `Clerk` 等库来保护你的 API。通常是在路由处理函数的开头检查用户会话。

```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // 你的 NextAuth 配置

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  // 用户已登录，可以继续处理
  // session.user.id 可以用来关联作者
  // ...
}
```

#### 7. 控制缓存行为

Next.js 默认会积极缓存 `GET` 请求的结果。如果你的 API 数据是动态的，需要明确告知 Next.js 不要缓存。

```typescript
export const dynamic = 'force-dynamic'; // 强制每次请求都重新执行

// 或者使用 revalidate
// export const revalidate = 60; // 每 60 秒最多重新验证一次

export async function GET(request: Request) {
  // ...
}
```

### 总结：最佳实践清单

1.  ✅ **文件结构**：使用 `app/api/.../[slug]/route.ts` 组织路由。
2.  ✅ **类型安全**：`Prisma` + `Zod` 实现从数据库到客户端的端到端类型安全。
3.  ✅ **数据校验**：在处理逻辑开始前，使用 `Zod` 对所有外部输入（`body`, `params`, `query`）进行严格校验。
4.  ✅ **错误处理**：使用 `try...catch` 捕获所有错误，并为不同类型的错误（校验、数据库、未知）返回统一格式和正确的 HTTP状态码。
5.  ✅ **关注点分离**：将业务逻辑和数据库操作抽象到 `service` 层，保持 `route.ts` 文件整洁。
6.  ✅ **认证/授权**：在处理函数顶部检查用户会话，保护需要权限的端点。
7.  ✅ **缓存控制**：根据 API 的数据特性，明确设置缓存策略（如 `dynamic = 'force-dynamic'`）。

遵循这些实践，可以构建出健壮、可维护且易于扩展的 Restful API，充分发挥 Next.js 全栈框架的威力。
