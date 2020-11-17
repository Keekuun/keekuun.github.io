---
title: 【Node】NodeJS之os模块学习笔记
date: 2019-8-28
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之os模块学习笔记

## 1.os（操作系统）模块简介

`os` 模块提供了与操作系统相关的实用方法和属性。 使用方法如下：

```js
const os = require('os');
```

## 2.os模块方法

### 2.1 `os.EOL`操作系统特定的行末标志

- [string](http://nodejs.cn/s/9Tw2bK)

操作系统特定的行末标志。

- 在 POSIX 上是 `\n`。
- 在 Windows 上是 `\r\n`。

### 2.2 `os.arch()操作系统的`CPU 架构

- 返回: [string](http://nodejs.cn/s/9Tw2bK)

返回为其编译 Node.js 二进制文件的操作系统的 CPU 架构。 可能的值有：`'arm'`、 `'arm64'`、 `'ia32'`、 `'mips'`、 `'mipsel'`、 `'ppc'`、 `'ppc64'`、 `'s390'`、 `'s390x'`、 `'x32'` 和 `'x64'`。

返回的值等价于 [`process.arch`](http://nodejs.cn/s/5Ez77R)。

### 2.3`os.cpus()` CPU 内核的信息

- 返回: [object](http://nodejs.cn/s/jzn6Ao)

返回一个对象数组，其中包含有关每个逻辑 CPU 内核的信息。

每个对象上包含的属性有：

- `model` [string](http://nodejs.cn/s/9Tw2bK)
- `speed` [number](http://nodejs.cn/s/SXbo1v) 以兆赫兹为单位。
- `times` [object](http://nodejs.cn/s/jzn6Ao)
  - `user` [number](http://nodejs.cn/s/SXbo1v)CPU 在用户模式下花费的毫秒数。
  - `nice` [number](http://nodejs.cn/s/SXbo1v) CPU 在良好模式下花费的毫秒数。
  - `sys`  [number](http://nodejs.cn/s/SXbo1v)CPU 在系统模式下花费的毫秒数。
  - `idle`  [number](http://nodejs.cn/s/SXbo1v)CPU 在空闲模式下花费的毫秒数。
  - `irq`  [number](http://nodejs.cn/s/SXbo1v) CPU 在中断请求模式下花费的毫秒数。

`nice` 的值仅适用于 POSIX。 在 Windows 上，所有处理器的 `nice` 值始终为 0。

### 2.4 `os.freemem()`空闲的系统内存量

- 返回: [integer](http://nodejs.cn/s/SXbo1v)

以整数的形式返回空闲的系统内存量（以字节为单位）。

### 2.5`os.getPriority([pid])`当前进程的优先级

- `pid` [integer](http://nodejs.cn/s/SXbo1v) 要为其获取调度优先级的进程 ID。**默认值** `0`。
- 返回: [integer](http://nodejs.cn/s/SXbo1v)

返回由 `pid` 指定的进程的调度优先级。 如果未提供 `pid` 或者为 `0`，则返回当前进程的优先级。

### 2.6`os.homedir()`用户的主目录的字符串路径

- 返回: [string](http://nodejs.cn/s/9Tw2bK)

返回当前用户的主目录的字符串路径。

在 POSIX 上，使用 `$HOME` 环境变量（如果有定义）。 否则，使用[有效的 UID](http://nodejs.cn/s/qnvwQK) 来查找用户的主目录。

在 Windows 上，使用 `USERPROFILE` 环境变量（如果有定义）。 否则，使用当前用户的配置文件目录的路径。

### 2.7`os.hostname()`操作系统的主机名

- 返回: [string](http://nodejs.cn/s/9Tw2bK)

以字符串的形式返回操作系统的主机名。

### 2.8 `os.networkInterfaces()`网络地址的网络接口

- 返回: [object](http://nodejs.cn/s/jzn6Ao)

返回一个对象，该对象包含已分配了网络地址的网络接口。

返回的对象上的每个键都标识了一个网络接口。 关联的值是一个对象数组，每个对象描述了一个分配的网络地址。

分配的网络地址的对象上可用的属性包括：

- `address` [string](http://nodejs.cn/s/9Tw2bK) 分配的 IPv4 或 IPv6 地址。
- `netmask` [string](http://nodejs.cn/s/9Tw2bK) IPv4 或 IPv6 的子网掩码。
- `family` [string](http://nodejs.cn/s/9Tw2bK) `IPv4` 或 `IPv6`。
- `mac` [string](http://nodejs.cn/s/9Tw2bK) 网络接口的 MAC 地址。
- `internal` [boolean](http://nodejs.cn/s/jFbvuT) 如果网络接口是不可远程访问的环回接口或类似接口，则为 `true`，否则为 `false`。
- `scopeid` [number](http://nodejs.cn/s/SXbo1v) 数值型的 IPv6 作用域 ID（仅当 `family` 为 `IPv6` 时指定）。
- `cidr` [string](http://nodejs.cn/s/9Tw2bK) 以 CIDR 表示法分配的带有路由前缀的 IPv4 或 IPv6 地址。如果 `netmask` 无效，则此属性会被设为 `null`。

### 2.9 `os.platform()`标识操作系统平台的字符串

- 返回: [string](http://nodejs.cn/s/9Tw2bK)

返回标识操作系统平台的字符串。 该值在编译时设置。 可能的值有 `'aix'`、 `'darwin'`、 `'freebsd'`、 `'linux'`、 `'openbsd'`、 `'sunos'` 和 `'win32'`。

返回的值等价于 [`process.platform`](http://nodejs.cn/s/wxcquH)。

如果 Node.js 在 Android 操作系统上构建，则也可能返回 `'android'` 值。 [Android 的支持是实验性的](http://nodejs.cn/s/4Wkt3D)。

```js
 os.platform()
'win32'
```

### 2.10 `os.setPriority([pid, ]priority)`设置进程调度优先级

- `pid` [integer](http://nodejs.cn/s/SXbo1v) 为其设置调度优先级的进程 ID。**默认值** `0`。
- `priority` [integer](http://nodejs.cn/s/SXbo1v) 分配给进程的调度优先级。-20 ~ 19

尝试为 `pid` 指定的进程设置调度优先级。 如果未提供 `pid` 或者为 `0`，则使用当前进程的进程 ID。

`priority` 输入必须是 `-20`（高优先级）到 `19`（低优先级）之间的整数。 由于 Unix 优先级和 Windows 优先级之间的差异， `priority` 会被映射到 `os.constants.priority` 中的六个优先级常量之一。 当检索进程的优先级时，此范围的映射可能导致 Windows 上的返回值略有不同。 为避免混淆，应将 `priority` 设置为优先级常量之一。

在 Windows 上，将优先级设置为 `PRIORITY_HIGHEST` 需要较高的用户权限。 否则，设置的优先级将会被静默地降低为 `PRIORITY_HIGH`。

### 2.11 `os.tmpdir()`临时文件目录

- 返回: [string](http://nodejs.cn/s/9Tw2bK)

以字符串的形式返回操作系统的默认临时文件目录。

```sh
os.tmpdir()
'C:\\Users\\zkk\\AppData\\Local\\Temp'
```

### 2.12 `os.totalmem()`系统的内存总量

- 返回: [string](http://nodejs.cn/s/SXbo1v)

以整数的形式返回系统的内存总量（以字节为单位）。

### 2.13 `os.type()`操作系统名字

- 返回: [string](http://nodejs.cn/s/SXbo1v)

返回与 [`uname(3)`](http://nodejs.cn/s/JL5KHm) 返回一样的操作系统名字。 例如，在 Linux 上返回 `'Linux'`，在 macOS 上返回 `'Darwin'`，在 Windows 上返回 `'Windows_NT'`。

有关在各种操作系统上运行 [`uname(3)`](http://nodejs.cn/s/JL5KHm) 的输出的更多信息，参见 https://en.wikipedia.org/wiki/Uname#Examples。

### 2.14`os.uptime()`系统的正常运行时间(s)

返回: [string](http://nodejs.cn/s/SXbo1v)

返回系统的正常运行时间（以秒为单位）。

### 2.15 `os.userInfo([options])`当前有效用户的信息

- `options` [object](http://nodejs.cn/s/jzn6Ao)
  - `encoding` [string](http://nodejs.cn/s/9Tw2bK) 用于解释结果字符串的字符编码。如果将 `encoding` 设置为 `'buffer'`，则 `username`、 `shell` 和 `homedir` 的值将会是 `Buffer` 实例。**默认值:** `'utf8'`。
- 返回: [object](http://nodejs.cn/s/jzn6Ao)

返回关于当前有效用户的信息。 在 POSIX 平台上，这通常是密码文件的子集。 返回的对象包含 `username`、 `uid`、 `gid`、 `shell` 和 `homedir`。 在 Windows 上，则 `uid` 和 `gid` 字段为 `-1`，且 `shell` 为 `null`。

`os.userInfo()` 返回的 `homedir` 的值由操作系统提供。 这与 `os.homedir()` 的结果不同，其是在返回操作系统的响应之前会先查询主目录的环境变量。

如果用户没有 `username` 或 `homedir`，则抛出 [`SystemError`](http://nodejs.cn/s/UDLUCx)。
