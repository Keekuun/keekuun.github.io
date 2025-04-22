---
title: nestjs Restful Api路由参数
date: 2025-4-21
categories:
  - 后端
  - nestjs
tags:
  - nestjs
  - node
---

在 nestjs 中，路由参数的装饰器有：
+ `@body` 请求体参数
+ `@Query` 查询参数
+ `@param`  路径参数
+ `@header` 请求头参数
+ `@UploadedFile` 文件参数
+ `@Req` 请求参数
+ `@Res` 响应参数

## `@body`
`@body`: 通常用于Post、Put等请求，用于获取请求体参数。常常使用json数据格式传递。
```ts
import { Controller, Post, Body } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() createUserDto: any) {
    return `Creating user with data: ${JSON.stringify(createUserDto)}`;
  }
}
```

## `@Query`
`@Query`: 用于获取URL中的查询参数。在 URL 问号之后以键值对形式存在的，通常用于传递可选参数或者用于过滤、排序数据等

比如： `http://localhost:3000/users?page=1&limit=10`
```ts
import { Controller, Get, Query } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return `Fetching users from page ${page} with limit ${limit}`;
  }
}
```


## `@param`
`@param`: 路径参数是 URL 的一部分，用于标识特定资源。

如：`http://localhost:3000/users/123`
```ts
import { Controller, Get, Param } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get(':id')
  findOne(@Param('id') id: string) {
    return `Fetching user with id ${id}`;
  }
}
```

## `@header`
`@header`：Header 参数用于在请求中传递额外的元数据，例如认证信息、内容类型等。

比如：传递 token 进行认证
```ts
import { Controller, Get, Headers } from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll(@Headers('authorization') authHeader: string) {
    return `Fetching users with authorization header: ${authHeader}`;
  }
}
```

## `@UploadedFile`
`@UploadedFile`: 用于处理文件上传，通常用于处理 POST 请求中的文件。
```ts
import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return `File uploaded: ${file.originalname}`;
  }
}
```

## `@Req`
`@Req()`: 用于获取整个请求对象，通常用于获取请求头、请求体、URL 参数等。
```ts
import { Controller, Get, Req } from '@nestjs/common';
export class AppController {
  constructor() {
    console.log('AppController created');
  }
  
  @Get()
  getHello(@Req() req: Request): string {
    console.log('req', req.headers);
    return req.url;
  }
}
```

## `Res`
`@Res()`: 用于获取整个响应对象，通常用于设置响应头、响应体、状态码等。

结合 `Express` 来使用， 设置响应头、响应体、状态码等。
```ts
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res({ passthrough: true }) res: Response) {
    res.status(HttpStatus.OK);
    return {
      message: this.appService.getHello(),
    };
    
    // 或者直接这样
    res.status(HttpStatus.OK).send({
      message: this.appService.getHello(),
    });
  }
}

```

> `@Res({ passthrough: true })` 的作用是 禁用 NestJS 的自动响应处理机制，使开发者能够完全手动控制 HTTP 响应对象（如 Express 的 Response 对象）

## cookie 传参
Cookie 参数用于在客户端和服务器之间传递少量数据。在 NestJS 中，cookie 参数并没有对应的装饰器，需要安装 `cookie-parser` 中间件，然后使用 `@Req()` 装饰器结合 `request.cookies` 来获取这些参数。

+ 安装 `cookie-parser` 中间件
```bash
pnpm add cookie-parser
pnpm add -D @types/cookie-parser
```

+ 注入中间件
```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 解析cookie
  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();

```

+ 使用 `@Req()` 和 `@Res({ passthrough: true })` 来获取和设置 cookie
```ts
import {Controller, Get, Req, Res} from '@nestjs/common';
import {AppService} from './app.service';
import {Request, Response} from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {
  }

  @Get()
  getHello(
    @Req() req: Request,
    @Res({passthrough: true}) res: Response,
  ): string {
    // 1.从req中获取客户端请求的cookie
    console.log('get cookies:', req.cookies,);

    // 2.给客户端设置cookie
    const expiryDate = new Date(Date.now() + 10000); // 设置过期时间为当前时间往后 10 秒
    res.cookie('foo', 'bar', {expires: expiryDate});

    return this.appService.getHello();
  }
}

```

> [官方案例](https://docs.nestjs.com/controllers#full-resource-sample)
