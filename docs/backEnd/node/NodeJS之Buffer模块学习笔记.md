---
title: 【Node】NodeJS之Buffer模块学习笔记
date: 2019-8-28
categories: 
- 后端
tags: 
- Node
- JS

---

# NodeJS之Buffer模块学习笔记

![Buffer](E:\blog\images\node\buffer.png)

> `Buffer` 类是NodeJS中的一个全局变量，用于直接处理二进制数据。 其API和js中的Array有很大的类似之处，可以对比学习。
>
> （本文中：buf.xx -代表 实例方法  Buffer.xx- 代表静态方法）

## 1. 简介

在 Node.js 中， `Buffer` 对象用于**以字节序列的形式来表示二进制数据**。 许多 Node.js 的 API（例如流stream和文件系统操作）都支持 `Buffer`，因为与操作系统或其他进程的交互通常总是以二进制数据的形式发生。

`Buffer` 类是 JavaScript 语言内置的 [`Uint8Array`](http://nodejs.cn/s/ZbDkpm) 类的子类。 支持许多涵盖其他用例的额外方法。 只要支持 `Buffer` 的地方，Node.js API 都可以接受普通的 [`Uint8Array`](http://nodejs.cn/s/ZbDkpm)。

`Buffer` 类的实例，以及通常的 [`Uint8Array`](http://nodejs.cn/s/ZbDkpm)，类似于从 `0` 到 `255` 之间的整数数组，但对应于固定大小的内存块，并且不能包含任何其他值。 **一个 `Buffer` 的大小在创建时确定，且无法更改**。

## 2. 使用方式

`Buffer` 类在全局作用域中，因此无需使用 `require('buffer').Buffer`，可以直接使用。

```js
// 创建一个包含字节 [1, 2, 3] 的 Buffer。
const buffer = Buffer.from([1, 2, 3]);
```

## 3. 创建Buffer

官方已经弃用`new Buffer`的形式创建，而是改用`Buffer.from`方法创建新的Buffer.

### 3.1`Buffer.from(xx)` 直接创建

+ `Buffer.from(array)`

  + `array <integer[]>`使用 `0` – `255` 范围内的**字节数组** `array` 来分配一个新的 `Buffer`。 超出该范围的数组条目会被截断以适合它。

  ```js
  // 创建一个包含字符串 'buffer' 的 UTF-8 字节的新 Buffer。
  const buf = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
  ```

+ `Buffer.from(arrayBuffer[, byteOffset[, length]])`

  + `arrayBuffer`: 一个 [`ArrayBuffer`](http://nodejs.cn/s/mUbfvF) 或 [`SharedArrayBuffer`](http://nodejs.cn/s/6J6LBy)，例如 [`TypedArray`](http://nodejs.cn/s/oh3CkV) 的 `.buffer` 属性。
  + `byteOffset` [<integer>](http://nodejs.cn/s/SXbo1v) 开始拷贝的索引。**默认值:** `0`。
  + `length` [<integer>](http://nodejs.cn/s/SXbo1v) 拷贝的字节数。**默认值:** `arrayBuffer.byteLength - byteOffset`。

  ```js
  const ab = new ArrayBuffer(10);
  const buf = Buffer.from(ab, 0, 2);
  
  console.log(buf.length); // 2
  ```

+ `Buffer.from(buffer)`:拷贝 `buffer` 的数据到新建的 `Buffer` 实例。

  + `buffer` [<Buffer>](http://nodejs.cn/s/6x1hD3) | [<Uint8Array>](http://nodejs.cn/s/ZbDkpm) 要拷贝数据的 `Buffer` 或 [`Uint8Array`](http://nodejs.cn/s/ZbDkpm)。

  ```js
  const buf1 = Buffer.from('buffer');
  const buf2 = Buffer.from(buf1);
  ```

+ `Buffer.from(object[, offsetOrEncoding[, length]])`

  + `object` [<Object>](http://nodejs.cn/s/jzn6Ao) 支持 `Symbol.toPrimitive` 或 `valueOf()` 的对象。
  + `offsetOrEncoding` [<integer>](http://nodejs.cn/s/SXbo1v) | [<string>](http://nodejs.cn/s/9Tw2bK) 字节偏移量或字符编码，取决于 `object.valueOf()` 或 `object[Symbol.toPrimitive]()` 返回的值。
  + `length` [<integer>](http://nodejs.cn/s/SXbo1v) 长度，取决于 `object.valueOf()` 或 `object[Symbol.toPrimitive]()` 的返回值。

  ```js
  const buf = Buffer.from(new String('this is a test'));
  // 打印: <Buffer 74 68 69 73 20 69 73 20 61 20 74 65 73 74>
  ```

+ `Buffer.from(string[, encoding])`: 创建一个包含 `string` 的新 `Buffer`。 `encoding` 参数指定用于将 `string` 转换为字节的字符编码。

  + `string` [<string>](http://nodejs.cn/s/9Tw2bK) 要编码的字符串。
  + `encoding` [<string>](http://nodejs.cn/s/9Tw2bK) `string` 的字符编码。**默认值:** `'utf8'`。

  ```JS
  const buf1 = Buffer.from('this is a tést');
  const buf2 = Buffer.from('7468697320697320612074c3a97374', 'hex');
  
  console.log(buf1.toString());
  // 打印: this is a tést
  console.log(buf2.toString());
  // 打印: this is a tést
  console.log(buf1.toString('latin1'));
  // 打印: this is a tÃ©st
  ```

### 3.2 Buffer.alloc(size[, fill[, encoding]]) 分配空间

- `size` [<integer>](http://nodejs.cn/s/SXbo1v) 新 `Buffer` 的所需长度。
- `fill` [<string>](http://nodejs.cn/s/9Tw2bK) | [<Buffer>](http://nodejs.cn/s/6x1hD3) | [<Uint8Array>](http://nodejs.cn/s/ZbDkpm) | [<integer>](http://nodejs.cn/s/SXbo1v) 用于预填充新 `Buffer` 的值。**默认值:** `0`。
- `encoding` [<string>](http://nodejs.cn/s/9Tw2bK) 如果 `fill` 是一个字符串，则这是它的字符编码。**默认值:** `'utf8'`。

分配一个大小为 `size` 字节的新 `Buffer`。 如果 `fill` 为 `undefined`，则用零填充 `Buffer`。

```js
const buf = Buffer.alloc(5);

console.log(buf);
// 打印: <Buffer 00 00 00 00 00>
```

如果 `size` 大于 [`buffer.constants.MAX_LENGTH`](http://nodejs.cn/s/aBiAe5) 或小于 0，则抛出 [`ERR_INVALID_OPT_VALUE`](http://nodejs.cn/s/ouMFyk)。

如果指定了 `fill`，则分配的 `Buffer` 通过调用 [`buf.fill(fill)`](http://nodejs.cn/s/2dLJk5) 进行初始化。

```js
const buf = Buffer.alloc(5, 'a');

console.log(buf);
// 打印: <Buffer 61 61 61 61 61>
```

如果同时指定了 `fill` 和 `encoding`，则分配的 `Buffer` 通过调用 [`buf.fill(fill, encoding)`](http://nodejs.cn/s/2dLJk5) 进行初始化 。

```js
const buf = Buffer.alloc(11, 'aGVsbG8gd29ybGQ=', 'base64');

console.log(buf);
// 打印: <Buffer 68 65 6c 6c 6f 20 77 6f 72 6c 64>
```

调用 [`Buffer.alloc()`](http://nodejs.cn/s/Du96og) 可能比替代的 [`Buffer.allocUnsafe()`](http://nodejs.cn/s/TWpeWk) 慢得多，但能确保新创建的 `Buffer` 实例的内容永远不会包含来自先前分配的敏感数据，包括可能尚未分配给 `Buffer` 的数据。

如果 `size` 不是一个数字，则抛出 `TypeError`。

### 3.3 `buf.fill(value[, offset[, end]][, encoding])` 填充buffer

- `value` [<string>](http://nodejs.cn/s/9Tw2bK) | [<Buffer>](http://nodejs.cn/s/6x1hD3) | [<Uint8Array>](http://nodejs.cn/s/ZbDkpm) | [<integer>](http://nodejs.cn/s/SXbo1v) 用来填充 `buf` 的值。
- `offset` [<integer>](http://nodejs.cn/s/SXbo1v) 开始填充 `buf` 的偏移量。**默认值:** `0`。
- `end` [<integer>](http://nodejs.cn/s/SXbo1v) 结束填充 `buf` 的偏移量（不包含）。**默认值:** [`buf.length`](http://nodejs.cn/s/hn6FjL)。
- `encoding` [<string>](http://nodejs.cn/s/9Tw2bK) 如果 `value` 是字符串，则指定 `value` 的字符编码。**默认值:** `'utf8'`。
- 返回: [<Buffer>](http://nodejs.cn/s/6x1hD3) `buf` 的引用。

用指定的 `value` 填充 `buf`。 如果没有指定 `offset` 与 `end`，则填充整个 `buf`：

````js
// 用 ASCII 字符 'h' 填充 `Buffer`。
const b = Buffer.allocUnsafe(50).fill('h');

console.log(b.toString());
// 打印: hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
````

如果 `value` 不是字符串、 `Buffer`、或整数，则会被转换为 `uint32` 值。 如果得到的整数大于 `255`（十进制），则 `buf` 将会使用 `value & 255` 填充。

如果 `fill()` 最后写入的是一个多字节字符，则只写入适合 `buf` 的字节：

```js
// 使用在 UTF-8 中占用两个字节的字符来填充 `Buffer`。

console.log(Buffer.allocUnsafe(5).fill('\u0222'));
// 打印: <Buffer c8 a2 c8 a2 c8>
```

如果 `value` 包含无效的字符，则截掉无效的字符。 如果截掉后没有数据，则不填充：

```js
const buf = Buffer.allocUnsafe(5);

console.log(buf.fill('a'));
// 打印: <Buffer 61 61 61 61 61>
console.log(buf.fill('aazz', 'hex'));
// 打印: <Buffer aa aa aa aa aa>
console.log(buf.fill('zz', 'hex'));
// 抛出异常。
```

### 3.4 `buf.write(string[, offset[, length]][, encoding])` 写入buffer

- `string` [<string>](http://nodejs.cn/s/9Tw2bK) 要写入 `buf` 的字符串。
- `offset` [<integer>](http://nodejs.cn/s/SXbo1v) 开始写入 `string` 之前要跳过的字节数。**默认值:** `0`。
- `length` [<integer>](http://nodejs.cn/s/SXbo1v) 要写入的最大字节数（写入的字节数不会超出 `buf.length - offset`）。**默认值:** `buf.length - offset`。
- `encoding` [<string>](http://nodejs.cn/s/9Tw2bK) `string` 的字符编码。**默认值:** `'utf8'`。
- 返回: [<integer>](http://nodejs.cn/s/SXbo1v) 已写入的字节数。

根据 `encoding` 指定的字符编码将 `string` 写入到 `buf` 中的 `offset` 位置。 `length` 参数是要写入的字节数。 如果 `buf` 没有足够的空间保存整个字符串，则只会写入 `string` 的一部分。 只编码了一部分的字符不会被写入。

```js
const buf = Buffer.alloc(256);

const len = buf.write('\u00bd + \u00bc = \u00be', 0);

console.log(`${len} 个字节: ${buf.toString('utf8', 0, len)}`);
// 打印: 12 个字节: ½ + ¼ = ¾

const buffer = Buffer.alloc(10);

const length = buffer.write('abcd', 8);

console.log(`${length} bytes: ${buffer.toString('utf8', 8, 10)}`);
// 打印: 2 个字节 : ab
```

## 4 判断Buffer

### 4.1 Buffer.isBuffer(obj)  判断是否是Buffer

- `obj` [<Object>](http://nodejs.cn/s/jzn6Ao)
- 返回: [<boolean>](http://nodejs.cn/s/jFbvuT)

如果 `obj` 是一个 `Buffer`，则返回 `true`，否则返回 `false`。

### 4.2 Buffer.isEncoding(encoding) 检查字符编码是否支持

- `encoding` [<string>](http://nodejs.cn/s/9Tw2bK) 要检查的字符编码名称。
- 返回: [<boolean>](http://nodejs.cn/s/jFbvuT)

如果 `encoding` 是支持的字符编码的名称，则返回 `true`，否则返回 `false`。

```js
console.log(Buffer.isEncoding('utf-8'));
// 打印: true

console.log(Buffer.isEncoding('hex'));
// 打印: true

console.log(Buffer.isEncoding('utf/8'));
// 打印: false

console.log(Buffer.isEncoding('utf8'));
// 打印: true
```

## 5. 访问Buffer

### 5.1 `buf.subarray([start[, end]])` 通过截取访问

- `start` [<integer>](http://nodejs.cn/s/SXbo1v) 新 `Buffer` 开始的位置。**默认值:** `0`。
- `end` [<integer>](http://nodejs.cn/s/SXbo1v) 新 `Buffer` 结束的位置（不包含）。**默认值:** [`buf.length`](http://nodejs.cn/s/hn6FjL)。指定大于 [`buf.length`](http://nodejs.cn/s/hn6FjL) 的 `end` 将会返回与 `end` 等于 [`buf.length`](http://nodejs.cn/s/hn6FjL) 时相同的结果。
- 返回: [<Buffer>](http://nodejs.cn/s/6x1hD3)

返回一个新的 `Buffer`，它引用与原始的 Buffer 相同的内存，但是由 `start` 和 `end` 索引进行偏移和裁剪。所以，修改新的 `Buffer` 切片将会修改原始 `Buffer` 中的内存，因为两个对象分配的内存是重叠的。

```js
// 使用 ASCII 字母创建一个 `Buffer`，然后进行切片，再修改原始 `Buffer` 中的一个字节。

const buf1 = Buffer.alloc(26);

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值。
  buf1[i] = i + 97;
}

const buf2 = buf1.subarray(0, 3);

console.log(buf2.toString('ascii', 0, buf2.length));
// 打印: abc

buf1[0] = 33;

console.log(buf2.toString('ascii', 0, buf2.length));
// 打印: !bc
```

指定负的索引会导致切片的生成是相对于 `buf` 的末尾而不是开头。

```js
const buf = Buffer.from('buffer');

console.log(buf.subarray(-6, -1).toString());
// 打印: buffe
// (相当于 buf.subarray(0, 5)。)

console.log(buf.subarray(-6, -2).toString());
// 打印: buff
// (相当于 buf.subarray(0, 4)。)

console.log(buf.subarray(-5, -2).toString());
// 打印: uff
// (相当于 buf.subarray(1, 4)。)
```

### 5.2 `buf.slice([start[, end]])`通过切片访问

- `start` [<integer>](http://nodejs.cn/s/SXbo1v) 新 `Buffer` 开始的位置。**默认值:** `0`。
- `end` [<integer>](http://nodejs.cn/s/SXbo1v) 新 `Buffer` 结束的位置（不包含）。**默认值:** [`buf.length`](http://nodejs.cn/s/hn6FjL)。指定大于 [`buf.length`](http://nodejs.cn/s/hn6FjL) 的 `end` 将会返回与 `end` 等于 [`buf.length`](http://nodejs.cn/s/hn6FjL) 时相同的结果。
- 返回: [<Buffer>](http://nodejs.cn/s/6x1hD3)

返回一个新的 `Buffer`，它引用与原始的 Buffer 相同的内存，但是由 `start` 和 `end` 索引进行偏移和裁剪。指定负的索引会导致切片的生成是相对于 `buf` 的末尾而不是开头。这些与 `buf.subarray()` 的行为相同。

此方法与 `Uint8Array.prototype.slice()` 不兼容，后者是 `Buffer` 的超类。 若要复制切片，则使用 `Uint8Array.prototype.slice()`。

```js
const buf = Buffer.from('buffer');

const copiedBuf = Uint8Array.prototype.slice.call(buf);
copiedBuf[0]++;
console.log(copiedBuf.toString());
// 打印: cuffer

console.log(buf.toString());
// 打印: buffer
```

### 5.3 `buf[index]` 通过索引访问

+ `index` [<integer>](http://nodejs.cn/s/SXbo1v)：0-255

索引操作符 `[index]` 可用于获取或设置 `buf` 中指定的 `index` 位置的八位字节。 该值指向单个字节，所以有效的值的范围是 `0x00` 至 `0xFF`（十六进制）、或 `0` 至 `255`（十进制）。

该操作符继承自 `Uint8Array`，所以对越界访问的行为与 `Uint8Array` 相同。 也就是说，当 `index` 为负数或 `>= buf.length` 时，则 `buf[index]` 返回 `undefined`，而如果 `index` 为负数或 `>= buf.length` 时，则 `buf[index] = value` 不会修改该 buffer。

```js
const str = 'http://nodejs.cn/';
const buf = Buffer.alloc(str.length);

for (let i = 0; i < str.length; i++) {
  buf[i] = str.charCodeAt(i);
}

console.log(buf.toString('utf8'));
// 打印: http://nodejs.cn/
```

### 5.4 `buf.indexOf(value[, byteOffset][, encoding])`查找索引

- `value` [<string>](http://nodejs.cn/s/9Tw2bK) | [<Buffer>](http://nodejs.cn/s/6x1hD3) | [<Uint8Array>](http://nodejs.cn/s/ZbDkpm) | [<integer>](http://nodejs.cn/s/SXbo1v) 要查找的值。

- `byteOffset` [<integer>](http://nodejs.cn/s/SXbo1v) `buf` 中开始查找的偏移量。**默认值:** `0`。

  如果 `byteOffset` 不是一个数值，则会被转换成数值。 如果转换后的值为 `NaN` 或 `0`, 则会查找整个 buffer。 这与 [`String#indexOf()`](http://nodejs.cn/s/Uqm5hr) 是一致的。

- `encoding` [<string>](http://nodejs.cn/s/9Tw2bK) 如果 `value` 是字符串，则指定 `value` 的字符编码。**默认值:** `'utf8'`。

- 返回: [<integer>](http://nodejs.cn/s/SXbo1v) `buf` 中**首次**出现 `value` 的索引，如果 `buf` 没包含 `value` 则返回 `-1`。

如果 `value` 是：

- 一个字符串，则 `value` 根据 `encoding` 的字符编码进行解析。
- 一个 `Buffer` 或 [`Uint8Array`](http://nodejs.cn/s/ZbDkpm)，则 `value` 会整个进行对比。如果要对比部分 `Buffer`，可使用 [`buf.slice()`](http://nodejs.cn/s/uQPgxt)。
- 一个数值, 则 `value` 会被解析成 `0` 至 `255` 之间的无符号八位整数值。

```js
const buf = Buffer.from('this is a buffer');

console.log(buf.indexOf('this'));
// 打印: 0
console.log(buf.indexOf('is'));
// 打印: 2
console.log(buf.indexOf(Buffer.from('a buffer')));
// 打印: 8
console.log(buf.indexOf(97));
// 打印: 8（97 是 'a' 的十进制 ASCII 值）
console.log(buf.indexOf(Buffer.from('a buffer example')));
// 打印: -1
console.log(buf.indexOf(Buffer.from('a buffer example').slice(0, 8)));
// 打印: 8

const utf16Buffer = Buffer.from('\u039a\u0391\u03a3\u03a3\u0395', 'utf16le');

console.log(utf16Buffer.indexOf('\u03a3', 0, 'utf16le'));
// 打印: 4
console.log(utf16Buffer.indexOf('\u03a3', -4, 'utf16le'));
// 打印: 6
```



### 5.5 `buf.lastIndexOf(value[, byteOffset][, encoding])`

同 [`buf.indexOf()`](http://nodejs.cn/s/eFR2KV)，与 [`buf.indexOf()`](http://nodejs.cn/s/eFR2KV) 的区别是，查找的是 `value` **最后一次**出现的索引，而不是首次出现。

### 5.6 `buf.includes(value[, byteOffset][, encoding])`查找包含

- `value` [<string>](http://nodejs.cn/s/9Tw2bK) | [<Buffer>](http://nodejs.cn/s/6x1hD3) | [<Uint8Array>](http://nodejs.cn/s/ZbDkpm) | [<integer>](http://nodejs.cn/s/SXbo1v) 要查找的值。
- `byteOffset` [<integer>](http://nodejs.cn/s/SXbo1v) `buf` 中开始查找的偏移量。**默认值:** `0`。
- `encoding` [<string>](http://nodejs.cn/s/9Tw2bK) 如果 `value` 是字符串，则指定 `value` 的字符编码。**默认值:** `'utf8'`。
- 返回: [<boolean>](http://nodejs.cn/s/jFbvuT) 如果 `buf` 查找到 `value`，则返回 `true`，否则返回 `false`。

相当于 [`buf.indexOf() !== -1`](http://nodejs.cn/s/eFR2KV)。

```js
const buf = Buffer.from('this is a buffer');

console.log(buf.includes('this'));
// 打印: true
console.log(buf.includes('is'));
// 打印: true
console.log(buf.includes(Buffer.from('a buffer')));
// 打印: true
console.log(buf.includes(97));
// 打印: true（97 是 'a' 的十进制 ASCII 值）
console.log(buf.includes(Buffer.from('a buffer example')));
// 打印: false
console.log(buf.includes(Buffer.from('a buffer example').slice(0, 8)));
// 打印: true
console.log(buf.includes('this', 4));
// 打印: false
```



### 5.6 `buf.keys()`、[`buf.values()`](http://nodejs.cn/s/DPvcum)、[`buf.entries()`](http://nodejs.cn/s/E1Z524)

+ 返回 [<terator>](http://nodejs.cn/s/Y2SE1q)

分别创建并返回 `buf` 键名[index]、[byte]、[index, byte]的[迭代器](http://nodejs.cn/s/KK7Xfc)。

```js
const buf = Buffer.from('buffer');

for (const key of buf.keys()) {
  console.log(key); // 0 1 2 3 4 5
}
```

[`buf.values()`](http://nodejs.cn/s/DPvcum)、[`buf.keys()`](http://nodejs.cn/s/fb89Qi)、和 [`buf.entries()`](http://nodejs.cn/s/E1Z524) 方法也可用于创建迭代器。

### 5.7 for ... of 循环遍历

`Buffer` 实例可以使用 `for..of` 语法进行迭代：

```js
const buf = Buffer.from([1, 2, 3]);

for (const b of buf) {
  console.log(b); // 1 2 3
}
```

## 6. Buffer之间的比较

### 6.1 Buffer.compare(buf1, buf2) 静态方法

- `buf1` [<Buffer>](http://nodejs.cn/s/6x1hD3) | [<Uint8Array>](http://nodejs.cn/s/ZbDkpm)

- `buf2` [<Buffer>](http://nodejs.cn/s/6x1hD3) | [<Uint8Array>](http://nodejs.cn/s/ZbDkpm)

- 返回: [<integer>](http://nodejs.cn/s/SXbo1v) `-1`、 `0` 或 `1`，取决于比较的结果。 有关详细信息，参见 [`buf.compare()`](http://nodejs.cn/s/3wddT3)。

  1.如果 `buf1`与 `buf2`相同，则返回 `0`。

  2.如果 `buf1`排在 `buf2` 前面，则返回 `1`。

  3.如果 `buf1` 排在 `buf2`后面，则返回 `-1`。

比较 `buf1` 与 `buf2`，主要用于 `Buffer` 实例数组的排序。 相当于调用 [`buf1.compare(buf2)`](http://nodejs.cn/s/3wddT3)。

```js
const buf1 = Buffer.from('1234');
const buf2 = Buffer.from('0123');
const arr = [buf1, buf2];

console.log(arr.sort(Buffer.compare));
// 打印: [ <Buffer 30 31 32 33>, <Buffer 31 32 33 34> ]
// (结果相当于: [buf2, buf1])
```

### 6.2 `buf.compare(target[, targetStart[, targetEnd[, sourceStart[, sourceEnd]]]])` 实例方法

- `target`  [<Buffer>](http://nodejs.cn/s/6x1hD3) | [<Uint8Array>](http://nodejs.cn/s/ZbDkpm)要与 `buf` 对比的 `Buffer` 或 [`Uint8Array`](http://nodejs.cn/s/ZbDkpm)。
- `targetStart` [<integer>](http://nodejs.cn/s/SXbo1v) `target` 中开始对比的偏移量。**默认值:** `0`。
- `targetEnd` [<integer>](http://nodejs.cn/s/SXbo1v) `target` 中结束对比的偏移量（不包含）。**默认值:** `target.length`。
- `sourceStart` [<integer>](http://nodejs.cn/s/SXbo1v) `buf` 中开始对比的偏移量。**默认值:** `0`。
- `sourceEnd` [<integer>](http://nodejs.cn/s/SXbo1v) `buf` 中结束对比的偏移量（不包含）。**默认值:** [`buf.length`](http://nodejs.cn/s/hn6FjL)。
- 返回: [<integer>](http://nodejs.cn/s/SXbo1v)

对比 `buf` 与 `target`，并返回一个数值，表明 `buf` 在排序上是否排在 `target` 前面、或后面、或相同。 对比是基于各自 `Buffer` 实际的字节序列。

- 如果 `target` 与 `buf` 相同，则返回 `0`。
- 如果 `target` 排在 `buf` 前面，则返回 `1`。
- 如果 `target` 排在 `buf` 后面，则返回 `-1`。

```js
const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('BCD');
const buf3 = Buffer.from('ABCD');

console.log(buf1.compare(buf1));
// 打印: 0
console.log(buf1.compare(buf2));
// 打印: -1
console.log(buf1.compare(buf3));
// 打印: -1
console.log(buf2.compare(buf1));
// 打印: 1
console.log(buf2.compare(buf3));
// 打印: 1
console.log([buf1, buf2, buf3].sort(Buffer.compare));
// 打印: [ <Buffer 41 42 43>, <Buffer 41 42 43 44>, <Buffer 42 43 44> ]
// (相当于: [buf1, buf3, buf2])
```

`targetStart`、 `targetEnd`、 `sourceStart` 与 `sourceEnd` 可用于指定 `target` 与 `buf` 中对比的范围。

```js
const buf1 = Buffer.from([1, 2, 3, 4, 5, 6, 7, 8, 9]);
const buf2 = Buffer.from([5, 6, 7, 8, 9, 1, 2, 3, 4]);

console.log(buf1.compare(buf2, 5, 9, 0, 4));
// 打印: 0
console.log(buf1.compare(buf2, 0, 6, 4));
// 打印: -1
console.log(buf1.compare(buf2, 5, 6, 5));
// 打印: 1
```

### 6.3 `buf.equals(otherBuffer)`

- `otherBuffer` [<Buffer>](http://nodejs.cn/s/6x1hD3) 要与 `bur` 对比的 `Buffer` 或 [`Uint8Array`](http://nodejs.cn/s/ZbDkpm)。
- 返回: [<boolean>](http://nodejs.cn/s/jFbvuT)

如果 `buf` 与 `otherBuffer` 具有完全相同的字节，则返回 `true`，否则返回 `false`。 相当于 [`buf.compare(otherBuffer) === 0`](http://nodejs.cn/s/3wddT3)。

```js
const buf1 = Buffer.from('ABC');
const buf2 = Buffer.from('414243', 'hex');
const buf3 = Buffer.from('ABCD');

console.log(buf1.equals(buf2));
// 打印: true
console.log(buf1.equals(buf3));
// 打印: false
```



## 7.Buffer其他方法

### 71 `Buffer.poolSize`缓冲池

- [<integer>](http://nodejs.cn/s/SXbo1v) **默认值:** `8192`。

这是用于缓冲池的预分配的内部 `Buffer` 实例的大小（以字节为单位）。 该值可以修改

### 7.2 `Buffer.byteLength(string[, encoding])`计算字节长度

- `string` [<string>](http://nodejs.cn/s/9Tw2bK) | [<Buffer>](http://nodejs.cn/s/6x1hD3) | [<TypedArray>](http://nodejs.cn/s/oh3CkV) | [<DataView>](http://nodejs.cn/s/yCdVkD) | [<ArrayBuffer>](http://nodejs.cn/s/mUbfvF) | [SharedArrayBuffer](http://nodejs.cn/s/6J6LBy) 要计算长度的值。
- `encoding` [<string>](http://nodejs.cn/s/9Tw2bK) 如果 `string` 是字符串，则这是它的字符编码。**默认值:** `'utf8'`。
- 返回: [<integer>](http://nodejs.cn/s/SXbo1v) `string` 中包含的字节数。

当使用 `encoding` 进行编码时，返回字符串的字节长度。 与 [`String.prototype.length`](http://nodejs.cn/s/TmnY1C) 不同，后者不会考虑用于将字符串转换为字节的编码。

对于 `'base64'` 和 `'hex'`，此函数会假定输入是有效的。 对于包含非 base64/hex 编码的数据（例如空格）的字符串，返回值可能是大于从字符串创建的 `Buffer` 的长度。

```js
const str = '\u00bd + \u00bc = \u00be';

console.log(`${str}: ${str.length} 个字符, ` +
            `${Buffer.byteLength(str, 'utf8')} 个字节`);
// 打印: ½ + ¼ = ¾: 9 个字符, 12 个字节
```

当 `string` 是一个 `Buffer`/[`DataView`](http://nodejs.cn/s/yCdVkD)/[`TypedArray`](http://nodejs.cn/s/oh3CkV)/[`ArrayBuffer`](http://nodejs.cn/s/mUbfvF)/[`SharedArrayBuffer`](http://nodejs.cn/s/6J6LBy) 时，返回 `.byteLength` 报告的字节长度。

### 7.3  `buf.toString([encoding[, start[, end]]])`转为string

- `encoding` [<string>](http://nodejs.cn/s/9Tw2bK) 使用的字符编码。**默认值:** `'utf8'`。
- `start` [<integer>](http://nodejs.cn/s/SXbo1v) 开始解码的字节偏移量。**默认值:** `0`。
- `end` [<integer>](http://nodejs.cn/s/SXbo1v) 结束解码的字节偏移量（不包含）。**默认值:** [`buf.length`](http://nodejs.cn/s/hn6FjL)。
- 返回: [<string>](http://nodejs.cn/s/9Tw2bK)

根据 `encoding` 指定的字符编码将 `buf` 解码成字符串。 传入 `start` 和 `end` 可以只解码 `buf` 的子集。

如果 `encoding` 为 `'utf8'`，并且输入中的字节序列不是有效的 UTF-8，则每个无效的字节都会由替换字符 `U+FFFD` 替换。

字符串的最大长度（以 UTF-16 为单位）可查看 [`buffer.constants.MAX_STRING_LENGTH`](http://nodejs.cn/s/fReXmD)。

```js
const buf1 = Buffer.allocUnsafe(26);

for (let i = 0; i < 26; i++) {
  // 97 是 'a' 的十进制 ASCII 值。
  buf1[i] = i + 97;
}

console.log(buf1.toString('utf8'));
// 打印: abcdefghijklmnopqrstuvwxyz
console.log(buf1.toString('utf8', 0, 5));
// 打印: abcde

const buf2 = Buffer.from('tést');

console.log(buf2.toString('hex'));
// 打印: 74c3a97374
console.log(buf2.toString('utf8', 0, 3));
// 打印: té
console.log(buf2.toString(undefined, 0, 3));
// 打印: té
```

### 7.4 `buf.toJSON()`

- 返回: [<Object>](http://nodejs.cn/s/jzn6Ao)

返回 `buf` 的 JSON 格式。 当字符串化 `Buffer` 实例时，[`JSON.stringify()`](http://nodejs.cn/s/bmLTNS) 会调用该函数。

`Buffer.from()` 接受此方法返回的格式的对象。 特别是， `Buffer.from(buf.toJSON())` 的工作方式类似于 `Buffer.from(buf)`。

```js
const buf = Buffer.from([0x1, 0x2, 0x3, 0x4, 0x5]);
const json = JSON.stringify(buf);

console.log(json);
// 打印: {"type":"Buffer","data":[1,2,3,4,5]}

const copy = JSON.parse(json, (key, value) => {
  return value && value.type === 'Buffer' ?
    Buffer.from(value) :
    value;
});

console.log(copy);
// 打印: <Buffer 01 02 03 04 05>
```

## 8. 小结

+ 使用方式

  Buffer在全局变量中，可以直接使用

+ 创建Buffer

  ```js
  const bf1 = Buffer.from('hello world');
  const bf2 = Buffer.alloc(11).fill('hello world');
  const length = Buffer.alloc(11).write('hello world');
  ```

+ 判断Buffer

  ```js
  Buffer.isBuffer('hello world!'); // false
  Buffer.isBuffer(Buffer.from('hello world!')); // true
  
  Buffer.isEncoding('utf8'); // true
  ```

+ 访问Buffer

  ```js
  const bf = Buffer.from('hello world');
  
  bf.subarray(0,5).toString(); // hello
  bf.slice(0,5).toString();// hello
  
  bf[1]; // 101
  bf.indexOf('e'); // 1
  bf.indexOf('l'); // 2
  bf.lastIndexOf('l'); // 9
  
  bf.includes('e'); // true
  
  bf.keys(); // Object [Array Iterator]
  ```

+ 比较Buffer

  ```js
  const bf1 = Buffer.from('AB');
  const bf2 = Buffer.from('CD');
  
  Buffer.compare(bf1, bf2); // -1
  bf1.compare(bf2); // -1
  
  bf1.equals(bf2); // false
  ```

+ 其他

  ```js
  const bf = Buffer.from('hello world');
  
  Buffer.poolSize; // 8192
  Buffer.byteLength(bf); // 11
  bf.length; // 11
  bf.toString(); // 'hello world'
  bf.toJSON(); // {type: 'Buffer',data: [104, 101, 108, 108,111,  32, 119, 111,114, 108, 100]}
  ```

  