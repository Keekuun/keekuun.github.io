---
title: nestjs快速入门
date: 2025-03-5
categories:
  - 后端
  - nestjs
tags:
  - nestjs
  - node
---

[[toc]]

# nestjs快速入门

## 一、nest 简介

Nest（NestJS）是一个用于构建高效、可扩展的 Node.js 服务器端应用的框架。它使用渐进式 JavaScript，用 TypeScript 构建并完全支持 TypeScript（同时仍允许开发者使用纯 JavaScript 进行编码）并结合了面向对象编程（OOP）、函数式编程（FP）和函数式响应式编程（FRP）的元素。

在底层，Nest 使用了强大的 HTTP 服务器框架，如 **Express**（默认）和可选的 **Fastify**！

Nest 提供了一种开箱即用的**应用程序架构**，允许开发者和团队创建高度可测试、可扩展、松耦合且易于维护的应用程序。该架构深受 Angular 启发。

> [nestjs官网](https://docs.nestjs.com/)

## 二、使用 @nestjs/cli

### 1.安装

安装nestjs的最简单方法是使用npm，通过运行以下命令来安装nestjs：

```bash
pnpm i -g @nestjs/cli

# 查看 nest cli 命令
nest -h 
```
@nestjs/cli 命令如下：

| name          | alias       | description|
| :----: | :----: | :----: |
| application   | application | Generate a new application workspace         |
| class         | cl          | Generate a new class                         |
| configuration | config      | Generate a CLI configuration file            |
| controller    | co          | Generate a controller declaration            |
| decorator     | d           | Generate a custom decorator                  |
| filter        | f           | Generate a filter declaration                |
| gateway       | ga          | Generate a gateway declaration               |
| guard         | gu          | Generate a guard declaration                 |
| interceptor   | itc         | Generate an interceptor declaration          |
| interface     | itf         | Generate an interface                        |
| library       | lib         | Generate a new library within a monorepo     |
| middleware    | mi          | Generate a middleware declaration            |
| module        | mo          | Generate a module declaration                |
| pipe          | pi          | Generate a pipe declaration                  |
| provider      | pr          | Generate a provider declaration              |
| resolver      | r           | Generate a GraphQL resolver declaration      |
| resource      | res         | Generate a new CRUD resource                 |
| service       | s           | Generate a service declaration               |
| sub-app       | app         | Generate a new application within a monorepo


### 2.创建项目

创建一个名为`my-app`的新项目，并使用`nest new`命令来创建一个新项目：

```bash
nest new my-app
cd my-app
pnpm run start
```

+ 目录结构

```
src
|-app.controller.spec.ts 控制器单元测试
|-app.controller.ts 一个具有单个路由的基本控制器
|-app.module.ts 应用程序的根模块
|-app.service.ts 一个具有单个方法的基本服务
|-main.ts 入口文件
```

`main.ts`内容：

```ts

import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

```

### 3.[创建控制器](https://docs.nestjs.com/controllers)

+ `nest g controller [name]`

创建一个名为`cats`的控制器，并使用`nest generate controller`命令来创建一个新控制器：

```bash
nest g co cats
```

```ts

import {Controller, Get} from '@nestjs/common';

@Controller('cats')
export class CatsController {
    @Get()
    findAll(): string {
        return 'This action returns all cats';
    }
}

```

### 4.创建服务

+ `nest g service [name]`

创建一个名为`cats`的服务，并使用`nest generate service`命令来创建一个新服务：

```bash
nest g s cats
```

### 5.创建实体

创建一个名为`cat`的实体，并使用`nest generate entity`命令来创建一个新实体：

```bash
nest generate entity cat
```

### 6.创建数据访问层

创建一个名为`cats`的数据访问层，并使用`nest generate module`命令来创建一个新模块：

```bash
nest g mo cats
```

### 7.快捷生成CRUD

创建一个名为`dogs`的完整CRUD模版，使用`nest generate resource dogs`:

```bash
nest g res dogs
```

生成的目录如下：
```
src
├── dogs
│ ├── dogs.controller.spec.ts
│ ├── dogs.controller.ts
│ ├── dogs.module.ts
│ ├── dogs.service.spec.ts
│ ├── dogs.service.ts
│ ├── dto
│ │ ├── create-dog.dto.ts
│ │ └── update-dog.dto.ts
│ └── entities
│     └── dog.entity.ts
└── main.ts

```

## 三、nest 核心概念
模块（Module）、控制器（Controller）、服务（Service）、提供者（Provider）、中间件（Middleware）、异常过滤器（Exception Filters）、管道（Pipes）、守卫（Guards）与拦截器（Interceptors）
### 1.[模块（module）](https://docs.nestjs.com/modules)
组织架构单元：使用 `@Module()` 装饰器声明，是应用程序的架构基础

生成命令：`nest g mo [name]`

典型用法示例：
```ts
  @Module({
    controllers: [CatsController],  // 注册控制器
    providers: [CatsService],       // 注册服务/提供者
    imports: [OtherModule],         // 导入依赖模块
    exports: [CatsService]          // 暴露服务供其他模块使用
  })
  
```

根据用途，可以分为：功能模块、共享模块、全局模块、动态模块

+ 功能模块: 使用 `@Module()` 装饰器，用于处理特定功能。SOLID 原则。
```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
    controllers: [CatsController],
    providers: [CatsService],
    exports: [CatsService]
})

export class CatsModule {}
```

+ 共享模块: **模块默认为单例**, 每个模块都是**自动共享模块**。一旦创建，它就可以被任何模块重用。

使用示例：
```ts
import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
    // 导入非 全局模块
    imports: [CatsModule],
})
export class AppModule {}

```

+ 全局模块: 使用 `@Global()` 装饰器将模块设置为全局, 在任何地方都可直接使用，不需要额外导入。
```ts

import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}

```

+ 动态模块: 动态模块允许在运行时动态创建模块。
```ts

import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
  providers: [Connection],
  exports: [Connection],
})
export class DatabaseModule {
  static forRoot(entities = [], options?): DynamicModule {
    const providers = createDatabaseProviders(options, entities);
    return {
      // global: true, // 全局动态模块
      module: DatabaseModule,
      providers: providers,
      exports: providers,
    };
  }
}

```

使用：
```ts

import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './users/entities/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule],
})
export class AppModule {}

```

### 2.[控制器（controller）](https://docs.nestjs.com/controllers)
控制器是应用程序的入口点，它定义了应用程序的 API 路由和请求处理逻辑。控制器使用 `@Controller()` 装饰器声明，并使用 `@Get()`、`@Post()`、`@Put()`、`@Delete()` 等装饰器定义路由。

生成命令：`nest g co [name]`

典型用法示例：
```ts

import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
    @Get()
    findAll(@Req() request: Request): string {
        return 'This action returns all cats';
    }
    
    @Get(':id')
    findOne(@Param() params: any): string {
        console.log(params.id);
        return `This action returns a #${params.id} cat`;
    }

    @Post()
    @HttpCode(201)
    create(@Body() createCatDto: CreateCatDto) {
        return 'This action adds a new cat';
    }
}


export class CreateCatDto {
    name: string;
    age: number;
    breed: string;
}
```

### 3.服务（service）
服务是应用程序的核心，它提供了应用程序的业务逻辑和数据访问功能。

生成命令：`nest g service [name]`

典型用法示例：
```ts

import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
    private readonly cats: Cat[] = [];

    create(cat: Cat) {
        this.cats.push(cat);
    }

    findAll(): Cat[] {
        return this.cats;
    }
}

```

### 4.[提供者（provider）](https://docs.nestjs.com/providers)
依赖注入核心：可以是 `services`, `values`, `factories` 等

通过构造函数注入：
```ts

import { Injectable, Optional, Inject } from '@nestjs/common';

@Injectable()
export class HttpService<T> {
    // 构造函数注入
    // @Optional() 表示该参数是可选的
    constructor(@Optional() @Inject('HTTP_OPTIONS') private httpClient: T) {}
}
```

### 5.[中间件（middleware）](https://docs.nestjs.com/middleware)
中间件是应用程序的扩展点，它允许在请求处理之前或之后执行自定义逻辑。

日志中间件示例：
```ts

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}

```

应用中间件示例：
```ts

import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('cats');
  }
}

```

### 6.[异常过滤器（exception filters）](https://docs.nestjs.com/exception-filters)
Nest 内置异常层，负责处理应用程序中所有未处理的异常。

自定义异常：
```ts

export class ForbiddenException extends HttpException {
    constructor() {
        super('Forbidden', HttpStatus.FORBIDDEN);
    }
}

```

### 7.[管道（pipes）](https://docs.nestjs.com/pipes)
管道是一个被 `@Injectable()` 装饰器注解的类，它实现了 `PipeTransform` 接口。

数据转换/验证：用于参数预处理和验证

内置管道示例：`ValidationPipe`, `ParseIntPipe`

自定义管道示例：
```ts

import { PipeTransform, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ZodSchema  } from 'zod';

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}

    transform(value: unknown, metadata: ArgumentMetadata) {
        try {
            const parsedValue = this.schema.parse(value);
            return parsedValue;
        } catch (error) {
            throw new BadRequestException('Validation failed');
        }
    }
}

```

### 8.[守卫（Guards）](https://docs.nestjs.com/guards)
守卫是一个被 @Injectable() 装饰器注解的类，它实现了 CanActivate 接口。

如：用户角色权限控制（`RolesGuard`）,用于检查用户是否具有访问权限

```ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get(Roles, context.getHandler());
        if (!roles) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        return matchRoles(roles, user.roles);
    }
}

```

### 9.拦截器（Interceptors）
拦截器是一个被 `@Injectable()` 装饰器注解的类，并实现了 `NestInterceptor` 接口。


如： `ExcludeNullInterceptor`，用于将返回值为 `null` 值转换为空字符串 ''。
```ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map(value => value === null ? '' : value ));
  }
}

```
