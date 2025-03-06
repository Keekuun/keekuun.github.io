---
title: nestjs快速入门
date: 2025-3-5
categories:
  - 后端
tags:
  - nestjs
  - node
---

# nestjs快速入门

## nest 简介

nestjs是一个基于nodejs的框架，用于快速开发web应用，它提供了一套完整的工具和框架，用于构建可扩展的web应用程序。

nestjs的核心概念是模块（module），模块是nestjs的核心构建块，用于组织应用程序的不同部分。每个模块都是一个独立的单元，它包含控制器（controllers）、服务（services）、实体（entities）、数据访问层（data
access layers）等。

> [nestjs官网](https://docs.nestjs.com/)

## 使用 @nestjs/cli

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