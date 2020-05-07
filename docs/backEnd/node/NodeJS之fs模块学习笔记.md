---
title: 【Node】NodeJS之fs模块学习笔记
date: 2019-8-28
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之fs模块学习笔记

![fs文件系统模块](E:\blog\images\node\fs.png)

## 1.fs简介

fs全称`file system`,文件系统，是NodeJS中最强大的API之一，提供了用于文件系统进行交互的各种API。

## 2.使用方式

```js
const fs = require('fs')
```

所有的文件系统操作都具有**同步**（一般以'Sync'结尾的API）和**异步**的形式。

异步的形式总是把完成回调作为其最后一个参数。 传给完成回调的参数取决于具体方法，但第一个参数总是预留给异常。 如果操作被成功地完成，则第一个参数会为 `null` 或 `undefined`。

```js
const fs = require('fs');

fs.unlink('文件', (err) => {
  if (err) throw err;
  console.log('已成功地删除文件');
});
```

当使用同步的操作时，发生的异常会被立即地抛出，可以使用 `try…catch` 处理，也可以冒泡。

```js
const fs = require('fs');

try {
  fs.unlinkSync('文件');
  console.log('已成功地删除文件');
} catch (err) {
  // 处理错误
}
```