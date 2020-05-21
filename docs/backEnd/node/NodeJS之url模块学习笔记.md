---
title: 【Node】NodeJS之url模块学习笔记
date: 2019-8-28
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之url模块学习笔记

## 1.URL模块简介

`url` 模块用于处理与解析 URL。 使用方法如下：

```js
//方式一： 引入url模块
const url = require('url');

// 方式二：使用URL类，直接使用构造函数
// 解析URL字符串
url.parse('http://localhost:11014/#/order-agreement-manager?key=reward-distribution#a');
new URL('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');

// 结果如下：
{
  protocol: 'https:', // 协议
  slashes: true, // 
  auth: 'user:pass',
  host: 'sub.host.com:8080', // 域名
  port: '8080', // 端口号
  hostname: 'sub.host.com',// 域名
  hash: '#hash', // 哈希
  search: '?query=string', 
  query: 'query=string',// 查询字符串（用querystring.parse解析）或url.searchParams解析
  pathname: '/p/a/t/h', // 路徑名
  path: '/p/a/t/h?query=string',
  href: 'https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash'
}
```

URL 字符串是结构化的字符串，包含多个含义不同的组成部分。 解析字符串后返回的 URL 对象，每个属性对应字符串的各个组成部分。

## 2.构造方法new URL(input[, base])

- `input` [<string>](http://nodejs.cn/s/9Tw2bK) 要解析的绝对或相对的 URL。如果 `input` 是相对路径，则需要 `base`。 如果 `input` 是绝对路径，则忽略 `base`。
- `base` [<string>](http://nodejs.cn/s/9Tw2bK) | [<URL>](http://nodejs.cn/s/5dwq7G) 如果 `input` 不是绝对路径，则为要解析的基本 URL。

通过将 `input` 相对于 `base` 进行解析，创建一个新的 `URL` 对象。 如果 `base` 是一个字符串，则解析方法与 `new URL(base)` 相同。

```js
const myURL = new URL('/foo', 'https://example.org/');
// https://example.org/foo
```

## 3.实例属性

### 3.1`url.hash`获取与设置哈希

+ 获取哈希

  ```js
  const myURL = new URL('https://example.org/foo#bar#zzz');
  console.log(myURL.hash); // #bar#zzz
  ```

+ 设置哈希

  ```js
  const myURL = new URL('https://example.org/foo#bar');
  myURL.hash = 'baz';
  console.log(myURL.href);
    // 打印 https://example.org/foo#baz
  ```

### 3.2`url.host`获取及设置主机部分

```js
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.host); // example.org:81

myURL.host = 'example.com:82';
console.log(myURL.href); // https://example.com:82/foo
```

### 3.3 `url.hostname`获取及设置 URL 的主机名部分

`url.host` 和 `url.hostname` 之间的区别是 `url.hostname` 不包含端口。

```js
const myURL = new URL('https://example.org:81/foo');
console.log(myURL.hostname);
  // 打印 example.org

myURL.hostname = 'example.com:82';
console.log(myURL.href);
  // 打印 https://example.com:81/foo
```

### 3.4 `url.href`获取及设置序列化的 URL

获取 `href` 属性的值等同于调用 [`url.toString()`](http://nodejs.cn/s/EXzgVB)。

将此属性的值设置为新值等同于使用 [`new URL(value)`](http://nodejs.cn/s/a19aPx) 创建新的`URL`对象。 `URL` 对象的每个属性都将被修改。

```js
const myURL = new URL('https://example.org/foo');
console.log(myURL.href);
  // 打印 https://example.org/foo

myURL.href = 'https://example.com/bar';
console.log(myURL.href);
  // 打印 https://example.com/bar
```

### 3.5 `url.origin`获取只读的序列化的 URL 的 origin

```js
const myURL = new URL('https://example.org/foo/bar?baz');
console.log(myURL.origin);
  // 打印 https://example.org
```

### 3.6 `url.password`获取及设置 URL 的密码部分

```js
const myURL = new URL('https://abc:xyz@example.com');
console.log(myURL.password);
  // 打印 xyz

myURL.password = '123';
console.log(myURL.href);
  // 打印 https://abc:123@example.com
```

### 3.7 `url.pathname`获取及设置 URL 的路径部分

```js
const myURL = new URL('https://example.org/abc/xyz?123');
console.log(myURL.pathname);
  // 打印 /abc/xyz

myURL.pathname = '/abcdef';
console.log(myURL.href);
  // 打印 https://example.org/abcdef?123
```

### 3.8`url.port`获取及设置 URL 的端口部分

端口值可以是数字或包含 `0` 到 `65535`（含）范围内的数字字符串。 将值设置为给定 `protocol` 的 `URL` 对象的**默认端口**将会导致 `port` 值变为空字符串（`''`）。

端口值可以是空字符串，在这种情况下，端口取决于协议/规范：

| 协议     | 端口 |
| :------- | :--- |
| "ftp"    | 21   |
| "file"   |      |
| "gopher" | 70   |
| "http"   | 80   |
| "https"  | 443  |
| "ws"     | 80   |
| "wss"    | 443  |

```js
const myURL = new URL('https://example.org:8888');
console.log(myURL.port);
// 打印 8888

// 默认端口将自动转换为空字符。
// (HTTPS 协议默认端口是 443)
myURL.port = '443';
console.log(myURL.port);
// 打印空字符
console.log(myURL.href);
// 打印 https://example.org/
```

### 3.9 `url.protocol`

获取及设置 URL 的协议部分。

```js
const myURL = new URL('https://example.org');
console.log(myURL.protocol);
// 打印 https:

myURL.protocol = 'ftp';
console.log(myURL.href);
// 打印 ftp://example.org/
```

分配给 `protocol` 属性的无效协议值将会被忽略。

### 3.10 `url.search`获取及设置 URL 的序列化查询部分

```js
const myURL = new URL('https://example.org/abc?123');
console.log(myURL.search);
// 打印 ?123

myURL.search = 'abc=xyz';
console.log(myURL.href);
// 打印 https://example.org/abc?abc=xyz
```

### 3.11 `url.searchParams`获取表示 URL 查询参数

获取表示 URL 查询参数的 [`URLSearchParams`](http://nodejs.cn/s/AUtfEw) 对象。 该属性是只读的。 使用 [`url.search`](http://nodejs.cn/s/EgNerx) 设置来替换 URL 的整个查询参数。 详见 [`URLSearchParams`](http://nodejs.cn/s/AUtfEw)。

```js
const myURL = new URL('https://example.org/abc?name=123&pwd=456');
// 1.获取
myURL.searchParams.get('name'); // 123
myURL.searchParams.get('pwd'); // 456

// 2.添加
myURL.searchParams.append('abc', 'xyz');
console.log(myURL.href);
// 打印 https://example.org/abc?name=123&pwd=456&abc=xyz

// 3.删除
myURL.searchParams.delete('abc');
// 4.更改（没有就添加）
myURL.searchParams.set('a', 'b');
console.log(myURL.href);
// 打印 https://example.org/?name=123&pwd=456&a=b
```

### 3.12 `url.username`获取及设置 URL 的用户名部分

```js
const myURL = new URL('https://abc:xyz@example.com');
console.log(myURL.username);
// 打印 abc

myURL.username = '123';
console.log(myURL.href);
// 打印 https://123:xyz@example.com/
```

### 3.13 `url.toString()`

在 `URL` 对象上调用 `toString()` 方法将返回序列化的 URL。 返回值与 [`url.href`](http://nodejs.cn/s/Feif9B) 和 [`url.toJSON()`](http://nodejs.cn/s/naUyEW) 的相同。

### 3.14 `url.toJSON()`序列化 URL

在 `URL` 对象上调用 `toJSON()` 方法将返回序列化的 URL。 返回值与 [`url.href`](http://nodejs.cn/s/Feif9B) 和 [`url.toString()`](http://nodejs.cn/s/EXzgVB) 的相同。

当 `URL` 对象使用 [`JSON.stringify()`](http://nodejs.cn/s/bmLTNS) 序列化时将自动调用该方法。

```js
const myURLs = [
  new URL('https://www.example.com'),
  new URL('https://test.example.org')
];
console.log(JSON.stringify(myURLs));
// 打印 ["https://www.example.com/","https://test.example.org/"]
```

## 4.小结

+ 使用

  ```js
  const url = require('url')
  // 或者
  const myURL = new URL('https://www.example.com')
  ```

+ 方法

  ```js
  url.protocol
  url.hostname 
  url.host
  url.port
  url.href
  url.pathname
  url.hash
  url.search
  url.searchParams
  ...
  ```

  

  