---
title: 【Node】NodeJS之koa框架
date: 2020-12-10
categories: 
- 后端
tags: 
- Node
- JS
- koa
---

> [koa2 源码解析](https://blog.shenfq.com/2018/koa2-%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90/)

# Koa框架学习笔记

## 一、什么是Koa?

Koa是一个新的web框架，致力于成为web应用和API开发领域中一个更小、更富有表现力、更健壮的基石。

它利用async函数丢弃回调函数，并增强错误处理。Koa没有任何预置的中间件，可快速而愉快地编写服务端应用程序。



## 二、Koa核心概念

### 1.Koa Application(应用程序)

### 2.Context（上下文）

### 3.Request(请求)、Response(响应)

![](../../../images/node/koa-core.jpg)

```js
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World Koa !!'
})

app.listen(3333);
console.log('Server is listening at http://localhost:3333');
```

