---
title: 【Node】NodeJS之timer模块学习笔记
date: 2019-8-27
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之timer模块学习笔记

## 1.timer（定时器）简介

`timer` 模块开放了一个**全局**的 API，用于安排函数在未来某个时间点被调用。 因为定时器函数是全局的，所以使用 API 不需要调用 `require('timers')`。

Node.js 中的定时器函数实现了与 Web 浏览器提供的定时器 API 类似的 API，但是使用了不同的内部实现（构建于 Node.js [事件循环](http://nodejs.cn/s/eeiBdr)）。

## 2.设置定时器

> [[由setTimeout和setImmediate执行顺序的随机性窥探Node的事件循环机制](https://segmentfault.com/a/1190000013102056)](https://segmentfault.com/a/1190000013102056)

### 2.1 `setImmediate(callback[, ...args])`事件轮询的末尾处执行

- `callback` [<Function>](http://nodejs.cn/s/ceTQa6) Node.js [事件循环](http://nodejs.cn/s/eeiBdr)的此回合结束时要调用的函数。
- `...args` [<any>](http://nodejs.cn/s/6sTGdS) 当调用 `callback` 时传入的可选的参数。
- 返回: [<Immediate>](http://nodejs.cn/s/SvSBDC) 用于 [`clearImmediate()`](http://nodejs.cn/s/tn26EY)。

安排在 I/O 事件的回调之后立即执行的 `callback`。

当多次调用 `setImmediate()` 时， `callback` 函数会按它们被创建的顺序放入排队等待执行。 每轮的事件循环迭代都会处理整个回调队列。 如果一个 immediate 定时器是从一个正在执行中的回调内部被放入队列，则该定时器将不会被触发，直到下一轮的事件循环迭代。

```js
console.log('before immediate');

setImmediate((arg) => {
    console.log(`executing immediate: ${arg}`);
}, 'so immediate');

console.log('after immediate');

// 输出结果
before immediate
after immediate
executing immediate: so immediate
```

此方法有一个定制的用于 promise 的变体，使用 [`util.promisify()`](http://nodejs.cn/s/DGMNHh) 创建：

```js
const util = require('util');
const setImmediatePromise = util.promisify(setImmediate);

setImmediatePromise('foobar').then((value) => {
  // value === 'foobar' （传值是可选的）
  // 这会在所有的 I/O 回调之后执行。
});

// 或使用异步函数。
async function timerExample() {
  console.log('在 I/O 回调之前');
  await setImmediatePromise();
  console.log('在 I/O 回调之后');
}
timerExample();
```

### 2.2 `setInterval(callback, delay[, ...args])`永远的轮询执行

- `callback` [<function>](http://nodejs.cn/s/ceTQa6) 当定时器到点时调用的函数。
- `delay` [<number>](http://nodejs.cn/s/SXbo1v) 调用 `callback` 之前等待的毫秒数。
- `...args` [<any>](http://nodejs.cn/s/6sTGdS) 当调用 `callback` 时传入的可选参数。
- 返回: [<Timeout>](http://nodejs.cn/s/ezS7LR) 用于 [`clearInterval()`](http://nodejs.cn/s/zRW98q)。

安排每隔 `delay` 毫秒重复执行 `callback`。

当 `delay` 大于 `2147483647` 或小于 `1` 时，则 `delay` 将会被设置为 `1`。 非整数的 delay 会被截断为整数。

### 2.3 `setTimeout(callback, delay[, ...args])`指定时间之后执行

- `callback` [<function>](http://nodejs.cn/s/ceTQa6) 当定时器到点时调用的函数。
- `delay` [<number>](http://nodejs.cn/s/SXbo1v) 调用 `callback` 之前等待的毫秒数。
- `...args` [<any>](http://nodejs.cn/s/6sTGdS) 当调用 `callback` 时传入的可选参数。
- 返回: [<Timeout>](http://nodejs.cn/s/ezS7LR) 用于 [`clearInterval()`](http://nodejs.cn/s/zRW98q)。

安排在 `delay` 毫秒之后执行一次性的 `callback`。

`callback` 可能不会精确地在 `delay` 毫秒后被调用 。 Node.js 不保证回调被触发的确切时间，也不保证它们的顺序。 回调会在尽可能接近指定的时间被调用。

当 `delay` 大于 `2147483647` 或小于 `1` 时，则 `delay` 将会被设置为 `1`。 非整数的 delay 会被截断为整数。

如果 `callback` 不是函数，则抛出 [`TypeError`](http://nodejs.cn/s/Z7Lqyj)。

此方法有一个定制的用于 promise 的变体，使用 [`util.promisify()`](http://nodejs.cn/s/DGMNHh) 创建：

```js
const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);

setTimeoutPromise(40, 'foobar').then((value) => {
  // value === 'foobar' （传值是可选的）
  // 这会在大约 40 毫秒后执行。
});
```

## 3.取消定时器

[`setImmediate()`](http://nodejs.cn/s/Cjc23N)、[`setInterval()`](http://nodejs.cn/s/hWCq4X) 和 [`setTimeout()`](http://nodejs.cn/s/UxXb1y) 方法会各自返回表示安排的定时器的对象。 它们可用于取消定时器并阻止其触发。

使用 [`setImmediate()`](http://nodejs.cn/s/Cjc23N)、[`setTimeout()`](http://nodejs.cn/s/UxXb1y) 的 promise 化的变体创建的定时器则无法取消。

### 3.1`clearImmediate(immediate)`

- `immediate` [<Immediate>](http://nodejs.cn/s/SvSBDC) [`setImmediate()`](http://nodejs.cn/s/Cjc23N) 返回的 `Immediate` 对象。

取消由 [`setImmediate()`](http://nodejs.cn/s/Cjc23N) 创建的 `Immediate` 对象。

### 3.2`clearInterval(timeout)`

- `timeout` [<Timeout>](http://nodejs.cn/s/ezS7LR) [`setInterval()`](http://nodejs.cn/s/hWCq4X) 返回的 `Timeout` 对象。

取消由 [`setInterval()`](http://nodejs.cn/s/hWCq4X) 创建的 `Timeout` 对象。

### 3.3`clearTimeout(timeout)`

- `timeout` [<Timeout>](http://nodejs.cn/s/ezS7LR) [`setTimeout()`](http://nodejs.cn/s/UxXb1y) 返回的 `Timeout` 对象。

取消由 [`setTimeout()`](http://nodejs.cn/s/UxXb1y) 创建的 `Timeout` 对象。