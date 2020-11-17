---
title: 【Node】NodeJS之util实用工具模块学习笔记
date: 2019-8-27
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之util实用工具模块学习笔记

## 1.util（实用工具）简介

`util` 模块用于支持 Node.js 内部 API 的需求。 大部分实用工具也可用于应用程序与模块开发者。 使用方法如下：

```js
const util = require('util');
```

## 2.util函数工具

### 2.1 `util.callbackify(original)`

- `original` [function](http://nodejs.cn/s/ceTQa6) `async` 异步函数。
- 返回: [function](http://nodejs.cn/s/ceTQa6) 传统回调函数。

将 `async` 异步函数（或者一个返回值为 `Promise` 的函数）转换成遵循异常优先的回调风格的函数，例如将 `(err, value) = ...` 回调作为最后一个参数。 在回调函数中，第一个参数为拒绝的原因（如果 `Promise` 解决，则为 `null`），第二个参数则是解决的值。

```js
const util = require('util');

async function fn() {
  return 'hello world';
}
const callbackFunction = util.callbackify(fn);

callbackFunction((err, ret) => {
  if (err) throw err;
  console.log(ret); // hello world
});
```

### 2.2 `util.format(format[, ...args])`

- `format` [string](http://nodejs.cn/s/9Tw2bK) 一个类似 `printf` 的格式字符串。

`util.format()` 方法返回一个格式化后的字符串，使用第一个参数作为一个类似 `printf` 的格式的字符串，该字符串可以包含零个或多个格式占位符。 每个占位符会被对应参数转换后的值所替换。 支持的占位符有：

- `%s` - `String` 将用于转换除 `BigInt`、 `Object` 和 `-0` 外的所有值。`BigInt` 值将用 `n` 表示，而没有用户定义 `toString` 函数的对象使用带有选项 `{ depth: 0, colors: false, compact: 3 }` 的 `util.inspect()` 进行检查。
- `%d` - `Number` 将用于转换除 `BigInt` 和 `Symbol` 之外的所有值。
- `%i` - `parseInt(value, 10)` 用于除 `BigInt` 和 `Symbol` 之外的所有值。
- `%f` - `parseFloat(value)` 用于除 `BigInt` 和 `Symbol` 之外的所有值。
- `%j` - JSON。如果参数包含循环引用，则替换为字符串 `'[Circular]'`。
- `%o` - `Object`。具有通用 JavaScript 对象格式的对象的字符串表示形式。 类似于带有选项 `{ showHidden: true, showProxy: true }` 的 `util.inspect()`。 这将显示完整对象，包括非可枚举属性和代理。
- `%O` - `Object`。具有通用 JavaScript 对象格式的对象的字符串表示形式。 类似于 `util.inspect()` 但没有选项。 这将显示完整对象，不包括非可枚举属性和代理。
- `%c` - `CSS`。该说明符当前会被忽略，将会跳过任何传入的 CSS。
- `%%` - 单个百分号（`'%'`）。这不会消耗参数。
- 返回: [string](http://nodejs.cn/s/9Tw2bK) 格式化的字符串。

如果占位符没有对应的参数，则占位符不被替换。

```js
util.format('%s:%s', 'foo');
// 返回: 'foo:%s'
```

如果类型不是 `string`，则使用 `util.inspect()` 格式化不属于格式字符串的值。

如果传入 `util.format()` 方法的参数比占位符的数量多，则多出的参数会被强制转换为字符串，然后拼接到返回的字符串，参数之间用一个空格分隔。

```js
util.format('%s:%s', 'foo', 'bar', 'baz');
// 返回: 'foo:bar baz'
```

如果第一个参数不是一个字符串，则 `util.format()` 返回一个所有参数用空格分隔并连在一起的字符串。

```js
util.format(1, 2, 3);
// 返回: '1 2 3'
```

如果只有一个参数传给 `util.format()`，它将按原样返回，不带任何格式：

```js
util.format('%% %s');
// 返回: '%% %s'
```

`util.format()` 是一种用作调试工具的同步方法。 某些输入值可能会产生严重的性能开销，从而阻止事件循环。 请谨慎使用此功能，切勿在热代码路径中使用。

### 2.3 `util.promisify(original)`

- `original` [function](http://nodejs.cn/s/ceTQa6)
- 返回: [function](http://nodejs.cn/s/ceTQa6)

传入一个遵循常见的**错误优先**的回调风格的函数（即以 `(err, value) = ...` 回调作为最后一个参数），并返回一个返回 promise 的版本。

```js
const util = require('util');
const fs = require('fs');

const stat = util.promisify(fs.stat);
stat('.').then((stats) = {
  // 使用 `stats`。
}).catch((error) = {
  // 处理错误。
});
```

或者，等效地使用 `async function`:

```js
const util = require('util');
const fs = require('fs');

const stat = util.promisify(fs.stat);

async function callStat() {
  const stats = await stat('.');
  console.log(`该目录归 ${stats.uid} 拥有`);
}
```

如果存在 `original[util.promisify.custom]` 属性，则 `promisify` 将会返回其值，参见[自定义的 promise 化函数](http://nodejs.cn/s/ZBKu5J)。

`promisify()` 在所有情况下都会假定 `original` 是一个以回调作为其最后参数的函数。 如果 `original` 不是一个函数，则 `promisify()` 将会抛出错误。 如果 `original` 是一个函数但其最后一个参数不是一个错误优先的回调，则它将仍会传入一个错误优先的回调作为其最后一个参数。

除非特殊处理，否则在类方法或使用 `this` 的其他方法上使用 `promisify()` 可能无法正常工作：

```js
const util = require('util');

class Foo {
  constructor() {
    this.a = 42;
  }

  bar(callback) {
    callback(null, this.a);
  }
}

const foo = new Foo();

const naiveBar = util.promisify(foo.bar);
// TypeError: Cannot read property 'a' of undefined
// naiveBar().then(a = console.log(a));

naiveBar.call(foo).then((a) = console.log(a)); // '42'

const bindBar = naiveBar.bind(foo);
bindBar().then((a) = console.log(a)); // '42'
```

### 2.4 `util.types.isArrayBuffer(value)`判断`ArrayBuffer`实例

```js
util.types.isArrayBuffer(new ArrayBuffer());  // Returns true
util.types.isArrayBuffer(new SharedArrayBuffer());  // Returns false
```

### 2.5 `util.types.isAsyncFunction(value)`判断异步函数

```js
til.types.isAsyncFunction(function foo() {});  // Returns false
util.types.isAsyncFunction(async function foo() {});  // Returns true
```

### 2.6 `util.types.isDate(value)`判断`Date`实例

```js
util.types.isDate(new Date());  // Returns true
```

### 2.7 `util.types.isMap(value)`判断`Map`实例

```js
util.types.isMap(new Map());  // Returns true
```

### 2.8 `util.types.isPromise(value)`判断promise

```js
util.types.isPromise(Promise.resolve(42));  // Returns true
```

### 2.9 `util.types.isProxy(value)`判断proxy

```js
const target = {};
const proxy = new Proxy(target, {});
util.types.isProxy(target);  // Returns false
util.types.isProxy(proxy);  // Returns true
```

### 2.10 `util.types.isRegExp(value)`判断正则

```js
util.types.isRegExp(/abc/);  // Returns true
util.types.isRegExp(new RegExp('abc'));  // Returns true
```

### 2.11 `util.types.isSet(value)`判断是否是`Set`实例

```js
util.types.isSet(new Set());  // Returns true
```

### 2.12 `util.types.isWeakMap(value)判断是否是`WeakMap`实例`

```js
util.types.isWeakMap(new WeakMap());  // Returns true
```

### 2.13 `util.types.isWeakSet(value)判断是否是`WeakSet`实例``

```js
util.types.isWeakSet(new WeakSet());  // Returns true
```
