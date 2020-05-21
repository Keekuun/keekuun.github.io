---
title: 【Node】NodeJS之global全局变量学习笔记
date: 2019-8-27
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之global全局变量学习笔记

## 1.global（全局变量）简介

所谓global（全局变量），即在所有的模块中都可用。 以下的变量虽然看似全局的，但实际上不是。 它们仅存在于模块的作用域中，参见[模块系统的文档](http://nodejs.cn/s/TQHXpm)：

- [`__dirname`](http://nodejs.cn/s/etUQhi)
- [`__filename`](http://nodejs.cn/s/RH6qCV)
- [`exports`](http://nodejs.cn/s/JzVhDV)
- [`module`](http://nodejs.cn/s/2UCVu5)
- [`require()`](http://nodejs.cn/s/bVPMwV)

此处列出的对象特定于 Node.js。 有些[内置对象](http://nodejs.cn/s/GMhHSn)是 JavaScript 语言本身的一部分，它们也是全局可访问的。

## 2.全局变量

+ Buffer

+ ## `clearImmediate(immediateObject)`

+ ## `clearInterval(intervalObject)`

+ ## `clearTimeout(timeoutObject)`

+ `setImmediate(callback[, ...args])`

+ ## `setInterval(callback, delay[, ...args])`

+ ## `setTimeout(callback, delay[, ...args])`

+ ## `console`

+ ## `global`

+ ## `process`

+ ## `queueMicrotask(callback)`

+ ## `TextDecoder`

+ ## `TextEncoder`

+ ## `URL`

+ ## `URLSearchParams`

+ ## `WebAssembly`