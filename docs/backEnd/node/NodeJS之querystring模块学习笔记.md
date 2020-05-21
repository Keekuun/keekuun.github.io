---
title: 【Node】NodeJS之querystring模块学习笔记
date: 2019-8-30
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之querystring模块学习笔记

![querystring模块](E:\blog\images\node\QueryString.jpg)

## 1. querystring（查询字符串）简介及使用

`querystring` 模块提供用于**解析和格式化 URL 查询字符串**的实用工具。 它可以使用以下方式访问：

```js
const querystring = require('querystring');
```

## 2.querystring（查询字符串）API

### 2.1 `querystring.parse(str[, sep[, eq[, options]]]))`解析字符串获取URL对象

`querystring.decode()` 函数是 `querystring.parse()` 的别名。

- `str` [<string>](http://nodejs.cn/s/9Tw2bK) 要解析的 URL 查询字符串。
- `sep` [<string>](http://nodejs.cn/s/9Tw2bK) 用于在查询字符串中分隔键值对的子字符串。**默认值:** `'&'`。
- `eq` [<string>](http://nodejs.cn/s/9Tw2bK) 用于在查询字符串中分隔键和值的子字符串。**默认值:** `'='`。
- `options` [<Object>](http://nodejs.cn/s/jzn6Ao)
  - `decodeURIComponent` [<Function>](http://nodejs.cn/s/ceTQa6) 当解码查询字符串中的百分比编码字符时使用的函数。**默认值:** `querystring.unescape()`。
  - `maxKeys` [<number>](http://nodejs.cn/s/SXbo1v) 指定要解析的键的最大数量。指定 `0` 可移除键的计数限制。**默认值:** `1000`。

+ 返回：<Object>`querystring.parse()` 方法将 URL 查询字符串 `str` 解析为键值对的集合。

```js
querystring.parse('foo=bar&abc=xyz&abc=123');
// {
//  foo: 'bar',
//  abc: ['xyz', '123']
// }
```

源码解读：

```js
function parse(qs, sep, eq, options) {
    // obj不是原型地继承自 JavaScript 的 `Object`
  const obj = Object.create(null);

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }
    ...
}
```

`querystring.parse()` 方法返回的对象不是原型地继承自 JavaScript 的 `Object`。 这意味着典型的 `Object` 方法如 `obj.toString()`、 `obj.hasOwnProperty()` 等都没有被定义并且不起作用。

### 2.2  `querystring.stringify(obj[, sep[, eq[, options]]])` 获取URL对象对应的字符串

`querystring.encode()` 函数是 `querystring.stringify()` 的别名。

- `obj` [<Object>](http://nodejs.cn/s/jzn6Ao) 要序列化为 URL 查询字符串的对象。
- `sep` [<string>](http://nodejs.cn/s/9Tw2bK) 用于在查询字符串中分隔键值对的子字符串。**默认值:** `'&'`。
- `eq` [<string>](http://nodejs.cn/s/9Tw2bK) 用于在查询字符串中分隔键和值的子字符串。**默认值:** `'='`。
- `options`
  - `encodeURIComponent` [<Function>](http://nodejs.cn/s/ceTQa6) 当将查询字符串中不安全的 URL 字符转换为百分比编码时使用的函数。**默认值:** `querystring.escape()`。

+ 返回：<string>`querystring.stringify()` 方法通过遍历对象的自身属性从给定的 `obj` 生成 URL 查询字符串。

它会序列化传入的 `obj` 中以下类型的值：[](http://nodejs.cn/s/9Tw2bK) | [](http://nodejs.cn/s/SXbo1v) | [](http://nodejs.cn/s/jFbvuT) | [](http://nodejs.cn/s/9Tw2bK) | [](http://nodejs.cn/s/SXbo1v) | [](http://nodejs.cn/s/jFbvuT)。 任何其他的输入值都将会被强制转换为空字符串。

```js
querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
// 返回 'foo=bar&baz=qux&baz=quux&corge='

querystring.stringify({ foo: 'bar', baz: 'qux' }, ';', ':');
// 返回 'foo:bar;baz:qux'
```

默认情况下，查询字符串中需要进行百分比编码的字符将会被编码为 UTF-8。 如果需要其他的编码，则需要指定其他的 `encodeURIComponent` 选项：

```js
// 假设 gbkEncodeURIComponent 函数已存在。
querystring.stringify({ w: '中文', foo: 'bar' }, null, null,
                      { encodeURIComponent: gbkEncodeURIComponent });
```

### 2.3 `querystring.unescape(str)`解码URL 百分比编码字符

+ `str` [<string>](http://nodejs.cn/s/9Tw2bK)
+ 返回：<Object>

```js
querystring.unescape('%E6%9F%A5%E8%AF%A2%E5%AD%97%E7%AC%A6%E4%B8%B2')
// '查询字符串'
```

`querystring.unescape()` 方法在给定的 `str` 上执行 URL 百分比编码字符的解码。

`querystring.unescape()` 方法由 `querystring.parse()` 使用，通常不会被直接地使用。 它的导出主要是为了允许应用程序代码在需要时通过将 `querystring.unescape` 赋值给替代函数来提供替换的解码实现。

## 3.小结

+ 解析字符串获取URL对象

  ```js
  querystring.parse('https://www.baidu.com/s?ie=UTF-8&wd=%E6%9F%A5%E8%AF%A2%E5%AD%97%E7%AC%A6%E4%B8%B2');
  // 或者
  querystring.decode('https://www.baidu.com/s?ie=UTF-8&wd=%E6%9F%A5%E8%AF%A2%E5%AD%97%E7%AC%A6%E4%B8%B2');
  
  // 返回：{
  //  'https://www.baidu.com/s?ie': 'UTF-8',
  //  wd: '查询字符串'
  // }
  ```

+ 获取URL对象对应的字符串

  ```js
  querystring.stringify({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
  // 或者
  querystring.encode({ foo: 'bar', baz: ['qux', 'quux'], corge: '' });
  // 返回 'foo=bar&baz=qux&baz=quux&corge='
  ```

+ 解码URL 百分比编码字符

  ```JS
  querystring.unescape('%E6%9F%A5%E8%AF%A2%E5%AD%97%E7%AC%A6%E4%B8%B2')
  // '查询字符串'
  ```

  

