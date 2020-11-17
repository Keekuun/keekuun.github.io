---
title: 【Node】NodeJS之console模块学习笔记
date: 2019-8-27
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之console模块学习笔记

## 1.console（控制台）简介

`console` 模块提供了一个简单的调试控制台，类似于 Web 浏览器提供的 JavaScript 控制台。

该模块导出两个特定组件：

- `Console` 类，包含 `console.log()`、 `console.error()` 和 `console.warn()` 等方法，可用于写入任何 Node.js 流。
- 全局的 `console` 实例，配置为写入 [`process.stdout`](http://nodejs.cn/s/tQWUzG) 和 [`process.stderr`](http://nodejs.cn/s/wPv5zY)。 使用时无需调用 `require('console')`。

注意：全局的 `console` 对象的方法既不像浏览器中的 API 那样总是同步的，也不像其他 Node.js 流那样总是异步的。 详见[进程 I/O](http://nodejs.cn/s/u5R9ap)。

使用全局 `console` 的示例：

```js
console.log('你好世界');
// 打印到 stdout: 你好世界
console.log('你好%s', '世界');
// 打印到 stdout: 你好世界
console.error(new Error('错误信息'));
// 打印到 stderr: [Error: 错误信息]

const name = '描述';
console.warn(`警告${name}`);
// 打印到 stderr: 警告描述
```

使用 `Console` 类的示例：

```js
const out = getStreamSomehow();
const err = getStreamSomehow();
const myConsole = new console.Console(out, err);

myConsole.log('你好世界');
// 打印到 out: 你好世界
myConsole.log('你好%s', '世界');
// 打印到 out: 你好世界
myConsole.error(new Error('错误信息'));
// 打印到 err: [Error: 错误信息]

const name = '描述';
myConsole.warn(`警告${name}`);
// 打印到 err: 警告描述
```

## 2.Console 类

### 2.1 `new Console(options)`构造函数

- `options` [Object](http://nodejs.cn/s/jzn6Ao)
  - `stdout` [stream.Writable](http://nodejs.cn/s/9JUnJ8)
  - `stderr` [stream.Writable](http://nodejs.cn/s/9JUnJ8)
  - `ignoreErrors` [boolean](http://nodejs.cn/s/jFbvuT) 在写入底层流时忽略错误。**默认值:** `true`。
  - `colorMode` [boolean](http://nodejs.cn/s/jFbvuT) | [string](http://nodejs.cn/s/9Tw2bK) 此 `Console` 实例设置颜色支持。 设置为 `true` 会在检查值时启用着色。 设置为 `false` 会在检查值时禁用着色。 设置为 `'auto'` 会使颜色支持取决 `isTTY` 属性的值和 `getColorDepth()` 在相应流上返回的值。 如果设置了 `inspectOptions.colors`，则不能使用此选项。 **默认值:** `'auto'`。
  - `inspectOptions` [Object](http://nodejs.cn/s/jzn6Ao) 指定传给 [`util.inspect()`](http://nodejs.cn/s/fHaJzA) 的选项。
  - `groupIndentation` [number](http://nodejs.cn/s/SXbo1v) 设置缩进. **Default:** `2`.

创建具有一个或两个可写流实例的新 `Console`。 `stdout` 是一个可写流，用于打印日志或信息输出。 `stderr` 用于警告或错误输出。 如果未提供 `stderr`，则 `stdout` 用于 `stderr`。

```js
const output = fs.createWriteStream('./stdout.log');
const errorOutput = fs.createWriteStream('./stderr.log');
// 自定义的简单记录器。
const logger = new Console({ stdout: output, stderr: errorOutput });
// 像控制台一样使用它。
const count = 5;
logger.log('count: %d', count);
// 在 stdout.log 中: count 5
```

全局的 `console` 是一个特殊的 `Console`，其输出发送到 [`process.stdout`](http://nodejs.cn/s/tQWUzG) 和 [`process.stderr`](http://nodejs.cn/s/wPv5zY)。 相当于调用：

```js
new Console({ stdout: process.stdout, stderr: process.stderr });
```

### 2.2 `console.assert(value[, ...message])`断言测试

- `value` [any](http://nodejs.cn/s/6sTGdS) 测试是否为真的值。
- `...message` [any](http://nodejs.cn/s/6sTGdS) 除 `value` 之外的所有参数都用作错误消息。

一个简单的断言测试，用于验证 `value` 是否为真。 如果不是，则记录 `Assertion failed`。 如果提供 `message`，则通过传入所有消息参数来使用 [`util.format()`](http://nodejs.cn/s/cyHBok) 格式化错误消息。 输出用作错误消息。

```js
console.assert(true, '什么都不做');
// OK
console.assert(false, '%s 工作', '无法');
// Assertion failed: 无法工作
```

### 2.3 `console.clear()`清空控制台

`console.clear()` 的具体操作可能因操作系统和终端类型而异。 对于大多数 Linux 操作系统， `console.clear()` 的操作与 `clear` 的 shell 命令类似。 在 Windows 上， `console.clear()` 将仅清除当前终端视图中 Node.js 二进制文件的输出。

### 2.4`console.count([label])`计数器 `console.countReset([label])`重置

- `label` [string](http://nodejs.cn/s/9Tw2bK) 计数器的显示标签。**默认值:** `'default'`。

维护一个特定于 `label` 的内部计数器，并将用给定 `label` 调用 `console.count()` 的次数输出到 `stdout`。

```sh
 console.count()
default: 1
undefined
 console.count('default')
default: 2
undefined
 console.count('abc')
abc: 1
undefined
 console.count('xyz')
xyz: 1
undefined
 console.count('abc')
abc: 2

 console.countReset('abc')
undefined
 console.count('abc')
abc: 1
undefined
```

### 2.5 `console.debug(data[, ...args])`和`console.log(data[, ...args])`

- `data` [any](http://nodejs.cn/s/6sTGdS)
- `...args` [any](http://nodejs.cn/s/6sTGdS)

`console.debug()` 函数是 [`console.log()`](http://nodejs.cn/s/sUaBgC) 的别名。

打印到 `stdout`，并加上换行符。 可以传入多个参数，第一个参数作为主要信息，其他参数作为类似于 [`printf(3)`](http://nodejs.cn/s/E2r4iW) 中的代替值（参数都会传给 [`util.format()`](http://nodejs.cn/s/cyHBok)）。

```js
const count = 5;
console.log('计数: %d', count);
// 打印到 stdout: 计数: 5 
console.log('计数:', count);
// 打印到 stdout: 计数: 5 
```

### 2.6 `console.dir(obj[, options])`

### 2.7 `console.error([data][, ...args])` 和`console.warn([data][, ...args])`

- `data` [any](http://nodejs.cn/s/6sTGdS)
- `...args` [any](http://nodejs.cn/s/6sTGdS)

`console.warn()` 函数是 [`console.error()`](http://nodejs.cn/s/Xcs7Ni) 的别名。

```js
const code = 5;
console.error('error #%d', code);
// 打印到 stderr: error #5
console.error('error', code);
// 打印到 stderr: error 5
```

### 2.8 `console.group([...label])`和`console.groupCollapsed()`

### `console.groupCollapsed()`是[`console.group()`](http://nodejs.cn/s/8nEUQK) 的别名。

### 2.9 `console.info([data][, ...args])`

`console.info()` 函数是 [`console.log()`](http://nodejs.cn/s/sUaBgC) 的别名。

### 2.10 `console.table(tabularData[, properties])`

- `tabularData` [any](http://nodejs.cn/s/6sTGdS)
- `properties` [string[]](http://nodejs.cn/s/9Tw2bK) 构造表的备用属性。

```js
console.table([{ a: 1, b: 'Y' }, { a: 'Z', b: 2 }]);
// ┌─────────┬─────┬─────┐
// │ (index) │  a  │  b  │
// ├─────────┼─────┼─────┤
// │    0    │  1  │ 'Y' │
// │    1    │ 'Z' │  2  │
// └─────────┴─────┴─────┘
```

### 2.11 `console.time([label])`和`console.timeEnd([label])`

- `label` [string](http://nodejs.cn/s/9Tw2bK) **默认值:** `'default'`。

`console.time`启动一个计时器，用以计算一个操作的持续时间。 计时器由一个唯一的 `label` 标识。 当调用 [`console.timeEnd()`](http://nodejs.cn/s/WJdWSV) 时，可以使用相同的 `label` 来停止计时器，并以毫秒为单位将持续时间输出到 `stdout`。 计时器持续时间精确到亚毫秒。

`console.timeEnd`停止先前通过调用 [`console.time()`](http://nodejs.cn/s/boWJXg) 启动的计时器，并打印结果到 `stdout`：

```js
console.time('100-elements');
for (let i = 0; i < 100; i++) {}
console.timeEnd('100-elements');
// 打印 100-elements: 225.438ms
```

### 2.12 `console.timeLog([label][, ...data])`

- `label` [string](http://nodejs.cn/s/9Tw2bK) **默认值:** `'default'`。
- `...data` [any](http://nodejs.cn/s/6sTGdS)

对于先前通过调用 [`console.time()`](http://nodejs.cn/s/boWJXg) 启动的计时器，将经过时间和其他 `data` 参数打印到 `stdout`：

```js
console.time('process');
const value = expensiveProcess1(); // 返回 42
console.timeLog('process', value);
// 打印 "process: 365.227ms 42"。
doExpensiveProcess2(value);
console.timeEnd('process');
```

## 3. 小结

```js
// 普通打印
console.log('hello');
console.info('hello');
console.debug('hello');

// 警告错误
console.error('error');
console.warn('error');

// 时间
console.time('label');
console.timeEnd('label');

// 表格
console.table([{a:1},{b:2}]);
// 对象属性
console.dir({a: 1});

// 断言
console.assert(32, '错了');
```

