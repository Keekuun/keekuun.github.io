---
title: 【Node】NodeJS之path模块学习笔记
date: 2019-8-29
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之path模块学习笔记

![path模块](E:\blog\images\node\path-module.png)

> 世上本没有路，走的人多了，便有了路，这就是path。—— 鲁迅·周作人

## 1.path模块简介

`path` 模块提供了一些用于处理文件与目录的路径的实用工具，可以让我们直通NodeJS源码(#^.^#)。

## 2.使用方式

```js
const path = require('path');
```

## 3.path模块API

### 3.1 `path.basename(path[, ext])`获取文件名

- `path` [<string>](http://nodejs.cn/s/9Tw2bK)
- `ext` [<string>](http://nodejs.cn/s/9Tw2bK) 可选的文件扩展名。如果传入正确的扩展名，则`path.basename()`返回文件名（不带扩展）
- 返回: [<string>](http://nodejs.cn/s/9Tw2bK)

`path.basename()` 方法返回 `path` 的最后一部分，类似于 Unix 的 `basename` 命令。 尾部的目录分隔符将被忽略，参见 [`path.sep`](http://nodejs.cn/s/io7vxJ)。

```js
path.basename('/foo/bar/baz/asdf/quux.html');
// 返回: 'quux.html'

path.basename('/foo/bar/baz/asdf/quux.html', '.html');
// 返回: 'quux'
```

### 3.2 `path.dirname(path)`获取目录名

- `path` [<string>](http://nodejs.cn/s/9Tw2bK)
- 返回: [<string>](http://nodejs.cn/s/9Tw2bK)

`path.dirname()` 方法返回 `path` 的目录名，类似于 Unix 的 `dirname` 命令。 尾部的目录分隔符将被忽略，参见 [`path.sep`](http://nodejs.cn/s/io7vxJ)。

```js
path.dirname('/foo/bar/baz/asdf/quux');
// 返回: '/foo/bar/baz/asdf'
```

如果 `path` 不是字符串，则抛出 [`TypeError`](http://nodejs.cn/s/Z7Lqyj)。

### 3.3 `path.extname(path)`获取扩展名

- `path` [<string>](http://nodejs.cn/s/9Tw2bK)
- 返回: [<string>](http://nodejs.cn/s/9Tw2bK)

`path.extname()` 方法返回 `path` 的扩展名，从最后一次出现 `.`（句点）字符到 `path` 最后一部分的字符串结束。 如果在 `path` 的最后一部分中没有 `.` ，或者如果 `path` 的基本名称（参见 `path.basename()`）除了第一个字符以外没有 `.`，则返回空字符串。

```js
path.extname('index.html');
// 返回: '.html'

path.extname('index.coffee.md');
// 返回: '.md'

path.extname('index.');
// 返回: '.'

path.extname('index');
// 返回: ''

path.extname('.index');
// 返回: ''

path.extname('.index.md');
// 返回: '.md'
```

### 3.4 `path.format(pathObject)`获取路径字符串

- `pathObject` [<Object>](http://nodejs.cn/s/jzn6Ao)
  - `dir` [<string>](http://nodejs.cn/s/9Tw2bK) 目录
  - `root` [<string>](http://nodejs.cn/s/9Tw2bK) 根路径
  - `base`[<string>](http://nodejs.cn/s/9Tw2bK) 文件名（带扩展）
  - `name`[<string>](http://nodejs.cn/s/9Tw2bK) 文件名（不带扩展）
  - `ext`[<string>](http://nodejs.cn/s/9Tw2bK) 文件扩展名
- 返回: [<string>](http://nodejs.cn/s/9Tw2bK) 完整的路径字符串

`path.format()` 方法从对象返回路径字符串。 与 [`path.parse()`](http://nodejs.cn/s/pqufSi) 相反。

当为 `pathObject` 提供属性时，注意以下组合，其中一些属性优先于另一些属性：

- 如果提供了 `pathObject.dir`，则忽略 `pathObject.root`。
- 如果 `pathObject.base` 存在，则忽略 `pathObject.ext` 和 `pathObject.name`。

```js
const pathObj = {
  root: '/',
  dir: '/home/user/dir',
  base: 'file.txt',
  ext: '.txt',
  name: 'file'
};
path.format(pathObj);
// '/home/user/dir\\file.txt' windows上
```

### 3.5 `path.parse(path)`获取路径对象

- `path` [<string>](http://nodejs.cn/s/9Tw2bK)
- 返回: [<Object>](http://nodejs.cn/s/jzn6Ao)
  - `dir` [<string>](http://nodejs.cn/s/9Tw2bK) 目录
  - `root` [<string>](http://nodejs.cn/s/9Tw2bK) 根路径
  - `base`[<string>](http://nodejs.cn/s/9Tw2bK) 文件名（带扩展）
  - `name`[<string>](http://nodejs.cn/s/9Tw2bK) 文件名（不带扩展）
  - `ext`[<string>](http://nodejs.cn/s/9Tw2bK) 文件扩展名

`path.parse()` 方法返回一个对象，其属性表示 `path` 的重要元素。 尾部的目录分隔符将被忽略，参见 [`path.sep`](http://nodejs.cn/s/io7vxJ)。

```js
path.parse('/home/user/dir/file.txt');
// 返回：{
//  root: '/',
//  dir: '/home/user/dir',
//  base: 'file.txt',
//  ext: '.txt',
//  name: 'file'
//}
```

### 3.6 `path.isAbsolute(path)`是否是绝对路径

- `path` [<string>](http://nodejs.cn/s/9Tw2bK)
- 返回: [<boolean>](http://nodejs.cn/s/jFbvuT)

`path.isAbsolute()` 方法检测 `path` 是否为绝对路径。

如果给定的 `path` 是零长度字符串，则返回 `false`。

```js
path.isAbsolute('/foo/bar'); // true
path.isAbsolute('./baz/..');  // false
path.isAbsolute('../qux/');     // false
path.isAbsolute('.');        // false

path.isAbsolute('C:/foo/..'); // true
```

### 3.7 `path.join([...paths])`路径拼接

- `...paths` [<string>](http://nodejs.cn/s/9Tw2bK) 路径片段的序列。
- 返回: [<string>](http://nodejs.cn/s/9Tw2bK)

`path.join()` 方法使用平台特定的分隔符作为定界符将所有给定的 `path` 片段连接在一起，然后规范化生成的路径。

```js
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');
// 返回: '/foo/bar/baz/asdf'

path.join('foo', {}, 'bar');
// 抛出 'TypeError: Path must be a string. Received {}'
```

### 3.8 `path.normalize(path)`标准化路径字符串

- `paths` [<string>](http://nodejs.cn/s/9Tw2bK) 。
- 返回: [<string>](http://nodejs.cn/s/9Tw2bK)

`path.normalize()` 方法规范化给定的 `path`，解析 `'..'` 和 `'.'` 片段。

```js
path.normalize('/foo/bar//baz/asdf/quux/..');
// windows '\\foo\\bar\\baz\\asdf'
```

### 3.9 `path.relative(from, to)`获取相对路径

- `from` [<sring>](http://nodejs.cn/s/9Tw2bK)
- `to` [<sring>](http://nodejs.cn/s/9Tw2bK)
- 返回: [<sring>](http://nodejs.cn/s/9Tw2bK)

`path.relative()` 方法根据当前工作目录返回 `from` 到 `to` 的相对路径。 如果 `from` 和 `to` 各自解析到相同的路径（分别调用 `path.resolve()` 之后），则返回空字符串。

如果将空字符串传入 `from` 或 `to`，则使用当前工作目录代替该空字符串。

```js
path.relative('a/b','a'); // '..'
path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb');
// '../../impl/bbb'
```

## 3.10`path.resolve([...paths])` 获取绝对路径

- `...paths` [<string>](http://nodejs.cn/s/9Tw2bK) 路径或路径片段的序列。
- 返回: [<string>](http://nodejs.cn/s/9Tw2bK)

`path.resolve()` 方法将路径或路径片段的序列解析为绝对路径。

如果没有传入 `path` 片段，则 `path.resolve()` 将返回当前工作目录的绝对路径。

```js
 path.resolve('a');
// 'E:\\study\\learn-nodejs\\demo3\\a'
path.resolve('/foo','/bar','./baz');
// 'E:\\bar\\baz'
path.resolve()
// 'E:\\study\\learn-nodejs\\demo3'
```

### 3.11 `path.sep`获取平台文件路径分隔符

- [<string>](http://nodejs.cn/s/9Tw2bK)

提供平台特定的路径片段分隔符：

- Windows 上是 `\`。
- POSIX上是 `/`。

> POSI可移植操作系统接口（英语：Portable Operating System Interface，缩写为*POSIX*）,unix、linux

在 Windows 上，正斜杠（`/`）和反斜杠（`\`）都被接受为路径片段分隔符。 但是， `path` 方法只添加反斜杠（`\`）。

```js
'foo\\bar\\baz'.split(path.sep);
// 返回: ['foo', 'bar', 'baz']
```

## 4.小结

+ 获取文件名

  ```js
  path.basename('./src/demo/hello.html'); // 'hello.html'
  path.basename('./src/demo/hello.html', '.html'); // 'hello'
  ```

+ 获取目录名

  ```js
  path.dirname('./src/demo/hello.html'); // './src/demo'
  ```

+ 获取扩展名

  ```js
  path.extname('./src/demo/hello.html'); // '.html'
  ```

+ 获取路径字符串

  ```js
  const pathObj = {
    root: '',
    dir: './src/demo',
    base: 'hello.html',
    ext: '.html',
    name: 'hello'
  };
  path.format(pathObj); // './src/demo\\hello.html'
  ```

+ 获取路径对象

  ```js
  path.parse('./src/demo\\hello.html')
  
  // {
  //  root: '',
  //  dir: './src/demo',
  //  base: 'hello.html',
  //  ext: '.html',
  //  name: 'hello'
  // }
  ```

+ 是否绝对路径

  ```js
  path.isAbsolute('./src/demo\\hello.html') // false
  ```

+ 路径拼接

  ```js
  path.join('./src', './demo', 'hello.html')
  // 'src\\demo\\hello.html'
  ```

+ 标准化路径字符串

  ```js
  const pathObj = {
    root: '',
    dir: './src/demo',
    base: 'hello.html',
    ext: '.html',
    name: 'hello'
  };
  path.format(pathObj); // './src/demo\\hello.html'
  
  path.normalize(path.format(pathObj)); // 'src\\demo\\hello.html'
  ```

+ 获取相对路径

  ```js
  path.relative('a', 'a/b'); 'b'
  path.relative('a/b', 'a'); '..'
  ```

+ 获取绝对路径

  ```js
  path.resolve(); // 'E:\\study\\learn-nodejs'
   path.resolve('src');
  'E:\\study\\learn-nodejs\\src'
  ```

+ 获取平台文件路径分隔符

  ```js
  path.sep; // '\\'
  ```

  