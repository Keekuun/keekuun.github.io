---
title: 【Node】NodeJS之events模块学习笔记
date: 2019-8-27
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之events模块学习笔记

## 1.简介

所有能触发事件的对象都是 `EventEmitter` 类的实例。 这些对象有一个 `eventEmitter.on()` 函数，用于将一个或多个函数绑定到命名事件上。 事件的命名通常是驼峰式的字符串，但也可以使用任何有效的 JavaScript 属性键。。

当 `EventEmitter` 对象触发一个事件时，所有绑定在该事件上的函数都会被同步地调用。 被调用的监听器返回的任何值都将会被忽略并丢弃。

例子，一个简单的 `EventEmitter` 实例，绑定了一个监听器。 `eventEmitter.on()` 用于注册监听器， `eventEmitter.emit()` 用于触发事件。

```js
const EventEmitter = require('events');

class MyEmitter extends EventEmitter {}

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('触发事件');
});
myEmitter.emit('event');
```

`EventEmitter` 以注册的顺序**同步**地调用所有监听器。 这样可以确保事件的正确排序，并有助于避免竞态条件和逻辑错误。 当适当时，监听器函数可以使用 `setImmediate()` 和 `process.nextTick()` 方法切换到**异步**的操作模式：

```js
const myEmitter = new MyEmitter();
myEmitter.on('event', (a, b) => {
  setImmediate(() => {
    console.log('异步地发生');
  });
});
myEmitter.emit('event', 'a', 'b');
```

## 2. EventEmitter 类

`EventEmitter` 类由 `events` 模块定义和公开：

```js
const EventEmitter = require('events');
```

当添加新的监听器时，所有 `EventEmitter` 都会触发 `'newListener'` 事件；当移除现有的监听器时，则触发 `'removeListener'` 事件。

```js
const myEmitter = new MyEmitter();
// 只处理一次，避免无限循环。
myEmitter.once('newListener', (event, listener) => {
  if (event === 'event') {
    // 在前面插入一个新的监听器。
    myEmitter.on('event', () => {
      console.log('B');
    });
  }
});
myEmitter.on('event', () => {
  console.log('A');
});
myEmitter.emit('event');
// 打印:
//   B
//   A
```

## 3.EventEmitter 实例属性

### 3.1 `EventEmitter.defaultMaxListeners`监听器个数

默认情况下，每个事件可以注册最多 `10` 个监听器。 可以使用 [`emitter.setMaxListeners(n)`](http://nodejs.cn/s/VPJci1) 方法改变单个 `EventEmitter` 实例的限制。 可以使用 `EventEmitter.defaultMaxListeners` 属性改变所有 `EventEmitter` 实例的默认值。

```js
emitter.setMaxListeners(emitter.getMaxListeners() + 1);
emitter.once('event', () => {
  // 做些操作
  emitter.setMaxListeners(Math.max(emitter.getMaxListeners() - 1, 0));
});
```

设置 `EventEmitter.defaultMaxListeners` 要谨慎，因为会影响所有 `EventEmitter` 实例，包括之前创建的。 因而，优先使用 [`emitter.setMaxListeners(n)`](http://nodejs.cn/s/VPJci1) 而不是 `EventEmitter.defaultMaxListeners`。

### 3.2 `emitter.addListener(eventName, listener)`添加监听事件

- `eventName` [<string>](http://nodejs.cn/s/9Tw2bK) | [<symbol>](http://nodejs.cn/s/i5E1UH)
- `listener` [<Function>](http://nodejs.cn/s/ceTQa6)

`emitter.on(eventName, listener)` 的别名。

### 3.3`emitter.emit(eventName[, ...args])`触发监听事件

+ `eventName` [<string>](http://nodejs.cn/s/9Tw2bK) | [<symbol>](http://nodejs.cn/s/i5E1UH)

+ `...args` [<any>](http://nodejs.cn/s/6sTGdS)

按照监听器注册的顺序，同步地调用每个注册到名为 `eventName` 的事件的监听器，并传入提供的参数。

```js
const EventEmitter = require('events');
const myEmitter = new EventEmitter();

myEmitter.on('event', function firstListener() {
  console.log('第一个监听器');
});
myEmitter.emit('event', 1, 2, 3, 4, 5);
```

### 3.4 `emitter.eventNames()`监听事件名数组

- 返回: [《Array》](http://nodejs.cn/s/ZJSz23)

返回已注册监听器的事件名数组。 数组中的值为字符串或 `Symbol`。

```js
const EventEmitter = require('events');
const myEE = new EventEmitter();
myEE.on('foo', () => {});
myEE.on('bar', () => {});

const sym = Symbol('symbol');
myEE.on(sym, () => {});

console.log(myEE.eventNames());
// 打印: [ 'foo', 'bar', Symbol(symbol) ]
```

### 3.5`emitter.getMaxListeners()`监听器最大限制数的值

- 返回: [<integer>](http://nodejs.cn/s/SXbo1v)

返回 `EventEmitter` 当前的监听器最大限制数的值，该值可以使用 [`emitter.setMaxListeners(n)`](http://nodejs.cn/s/VPJci1) 设置或默认为 [`EventEmitter.defaultMaxListeners`](http://nodejs.cn/s/LwxMek)。

### 3.6 `emitter.off(eventName, listener)`移除事件监听

- `eventName` [<string>](http://nodejs.cn/s/9Tw2bK) | [<symbol>](http://nodejs.cn/s/i5E1UH)
- `listener` [<Function>](http://nodejs.cn/s/ceTQa6)
- 返回: [<EventEmitter>](http://nodejs.cn/s/pGAddE)

[`emitter.removeListener()`](http://nodejs.cn/s/wRaKrC) 的别名。

### 3.7 `emitter.on(eventName, listener)`添加监听事件

- `eventName` [<string>](http://nodejs.cn/s/9Tw2bK) | [<symbol>](http://nodejs.cn/s/i5E1UH)
- `listener` [<Function>](http://nodejs.cn/s/ceTQa6)
- 返回: [<EventEmitter>](http://nodejs.cn/s/pGAddE)

添加 `listener` 函数到名为 `eventName` 的事件的监听器数组的末尾。 不会检查 `listener` 是否已被添加。 多次调用并传入相同的 `eventName` 与 `listener` 会导致 `listener` 会被添加多次。

```js
server.on('connection', (stream) => {
  console.log('已连接');
});
```

返回对 `EventEmitter` 的引用，以便可以链式调用。

默认情况下，事件监听器会按照添加的顺序依次调用。 `emitter.prependListener()` 方法可用于将事件监听器添加到监听器数组的开头。

```js
const myEE = new EventEmitter();
myEE.on('foo', () => console.log('a'));
myEE.prependListener('foo', () => console.log('b'));
myEE.emit('foo');
// 打印:
//   b
//   a
```

### 3.8 `emitter.once(eventName, listener)`只掉一次

- `eventName` [<string>](http://nodejs.cn/s/9Tw2bK) | [<symbol>](http://nodejs.cn/s/i5E1UH)
- `listener` [<Function>](http://nodejs.cn/s/ceTQa6)
- 返回: [<EventEmitter>](http://nodejs.cn/s/pGAddE)

添加单次监听器 `listener` 到名为 `eventName` 的事件。 当 `eventName` 事件下次触发时，监听器会先被移除，然后再调用。

```js
server.once('connection', (stream) => {
  console.log('第一次调用');
});
```

返回对 `EventEmitter` 的引用，以便可以链式调用。

默认情况下，事件监听器会按照添加的顺序依次调用。 `emitter.prependOnceListener()` 方法可用于将事件监听器添加到监听器数组的开头。

```js
const myEE = new EventEmitter();
myEE.once('foo', () => console.log('a'));
myEE.prependOnceListener('foo', () => console.log('b'));
myEE.emit('foo');
// 打印:
//   b
//   a
```

### 3.9 `emitter.removeAllListeners([eventName])`移除所有监听器

- `eventName` [<string>](http://nodejs.cn/s/9Tw2bK) | [<symbol>](http://nodejs.cn/s/i5E1UH)
- 返回: [<EventEmitter>](http://nodejs.cn/s/pGAddE)

移除全部监听器或指定的 `eventName` 事件的监听器。

删除代码中其他位置添加的监听器是不好的做法，尤其是当 `EventEmitter` 实例是由某些其他组件或模块（例如套接字或文件流）创建时。

返回对 `EventEmitter` 的引用，以便可以链式调用。

### 3.10`emitter.removeListener(eventName, listener)`移除监听器

- `eventName` [<string>](http://nodejs.cn/s/9Tw2bK) | [<symbol>](http://nodejs.cn/s/i5E1UH)
- `listener` [<Function>](http://nodejs.cn/s/ceTQa6)
- 返回: [<EventEmitter>](http://nodejs.cn/s/pGAddE)

从名为 `eventName` 的事件的监听器数组中移除指定的 `listener`。

```js
const callback = (stream) => {
  console.log('已连接');
};
server.on('connection', callback);
// ...
server.removeListener('connection', callback);
```

## 3.11`events.once(emitter, name)`promise方式处理事件

- `eventName` [<string>](http://nodejs.cn/s/9Tw2bK) | [<symbol>](http://nodejs.cn/s/i5E1UH)
- `listener` [<Function>](http://nodejs.cn/s/ceTQa6)
- 返回: [<EventEmitter>](http://nodejs.cn/s/pGAddE)

创建一个 `Promise`，当 `EventEmitter` 触发给定的事件时则会被`resolve`，当 `EventEmitter` 触发 `'error'` 时则会被`reject`。 解决 `Promise` 时将会带上触发到给定事件的所有参数的数组。

此方法是有意通用的，并且可与 Web 平台的 [EventTarget](http://nodejs.cn/s/zSu9eM) 接口一起使用，该接口没有特殊的 `'error'` 事件语义且不监听 `'error'` 事件。

```js
const { once, EventEmitter } = require('events');

async function run() {
  const ee = new EventEmitter();

  process.nextTick(() => {
    ee.emit('myevent', 42);
  });

  const [value] = await once(ee, 'myevent');
  console.log(value);

  const err = new Error('错误信息');
  process.nextTick(() => {
    ee.emit('error', err);
  });

  try {
    await once(ee, 'myevent');
  } catch (err) {
    console.log('出错', err);
  }
}

run();
```

## 4.小结

+ 使用

  ```js
  const EventEmitter = require('events');
  cosnt eventEmitter = new EventEmitter();
  ```

+ 方法

  ```js
  // 监听
  eventEmitter.on('event', function() {})
  eventEmitter.addEventListener('event', function() {})
  
  eventEmitter.once('event', function() {})
  
  // 触发
  eventEmitter.emit('event', ...args)
  
  // 移除
  eventEmitter.off('event', function() {})
  eventEmitter.removeEventListener('event', function() {})
  
  // 其他属性
  eventEmitter.defaultMaxListener;
  eventEmitter.setMaxListeners(n);
  eventEmitter.eventNames();
  ```

  