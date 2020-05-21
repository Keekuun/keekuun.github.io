---
title: 【Node】NodeJS之net模块学习笔记
date: 2019-8-28
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之net模块学习笔记

## 1.net（网络）模块简介

`net` 模块用于创建基于流（stream-based）的 TCP 或 [IPC](http://nodejs.cn/s/rAdYjf) 的服务器（[`net.createServer()`](http://nodejs.cn/s/e8cikS)）与客户端（[`net.createConnection()`](http://nodejs.cn/s/RTNxdX)）。

使用方法如下:

```js
const net = require('net');
```

## 2.net.Server 类

- 继承自: [<EventEmitter>](http://nodejs.cn/s/pGAddE)

此类用于创建 TCP 或 [IPC](http://nodejs.cn/s/rAdYjf) 服务器。

### 2.1 `new net.Server([options][, connectionListener])`构造函数

- `options` [<Object>](http://nodejs.cn/s/jzn6Ao) 参见 [`net.createServer([options\][, connectionListener])`](http://nodejs.cn/s/e8cikS)。
- `connectionListener` [<function>](http://nodejs.cn/s/ceTQa6) 自动设置为 [`'connection'`](http://nodejs.cn/s/4qU2j9) 事件的监听器。
- 返回: [<net.Server>](http://nodejs.cn/s/gBYjux)

`net.Server` 是一个 [`EventEmitter`](http://nodejs.cn/s/pGAddE)，实现了以下事件:

| 事件名称     | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| `close`      | 当 server 关闭的时候触发。 如果有连接存在，直到所有的连接结束才会触发这个事件。 |
| `connection` | 当一个新的连接建立的时候触发。 `socket` 是一个 `net.Socket` 实例。 |
| `error`      | 当错误出现的时候触发。 不同于 [`net.Socket`](http://nodejs.cn/s/wsJ1o1)，[`'close'`](http://nodejs.cn/s/3c6jjk) 事件不会在这个事件触发后继续触发，除非 [`server.close()`](http://nodejs.cn/s/zZ874N) 是手动调用。 参见 [`server.listen()`](http://nodejs.cn/s/xGksiu) 中的例子。 |
| `listening`  | 当调用 [`server.listen()`](http://nodejs.cn/s/xGksiu) 绑定服务器之后触发。 |

### 2.2 `server.listen()`

启动一个服务器来监听连接。 `net.Server` 可以是 TCP 或 [IPC](http://nodejs.cn/s/rAdYjf) 服务器，具体取决于它监听的内容。

可能的参数：

- `server.listen(handle[, backlog][, callback])`
  - `handle` [<object>](http://nodejs.cn/s/jzn6Ao)
  - `backlog` [<number>](http://nodejs.cn/s/SXbo1v) [`server.listen()`](http://nodejs.cn/s/xGksiu) 函数的通用参数。
  - `callback` [<funtion>](http://nodejs.cn/s/ceTQa6)
  - 返回: [<net.server>](http://nodejs.cn/s/gBYjux)
- `server.listen(options[, callback])`option参数：
  - `port` [<number>](http://nodejs.cn/s/SXbo1v)
  - `host` [<host>](http://nodejs.cn/s/9Tw2bK)
  - `path` [<string>](http://nodejs.cn/s/9Tw2bK) 如果指定了 `port` 参数则会被忽略。查看[识别 IPC 连接的路径。](http://nodejs.cn/s/tNVQV4)。
  - `backlog` [<number>](http://nodejs.cn/s/SXbo1v) [`server.listen()`](http://nodejs.cn/s/xGksiu) 函数的通用参数。
  - `exclusive` [<boolean>](http://nodejs.cn/s/jFbvuT) **默认值:** `false`。
  - `readableAll` [<boolean>](http://nodejs.cn/s/jFbvuT) 对于 IPC 服务器，使管道对所有用户都可读。**默认值:** `false`。
  - `writableAll` [<boolean>](http://nodejs.cn/s/jFbvuT) 对于 IPC 服务器，使管道对所有用户都可写。**默认值:** `false`。
  - `ipv6Only` [<boolean>](http://nodejs.cn/s/jFbvuT) 对于 TCP 服务器，将 `ipv6Only` 设置为 `true` 将会禁用双栈支持，即绑定到主机 `::` 不会使 `0.0.0.0` 绑定。**默认值:** `false`。
- `server.listen(path[, backlog][, callback])`用于 [IPC](http://nodejs.cn/s/rAdYjf) 服务器。
  - `path` [<string>](http://nodejs.cn/s/9Tw2bK) 如果指定了 `port` 参数则会被忽略。查看[识别 IPC 连接的路径。](http://nodejs.cn/s/tNVQV4)。
  - `backlog` [<number>](http://nodejs.cn/s/SXbo1v) [`server.listen()`](http://nodejs.cn/s/xGksiu) 函数的通用参数。
- `server.listen([port[,host[,backlog]]][,callback])` 用于 TCP 服务器。最常用
  - `port` [<number>](http://nodejs.cn/s/SXbo1v)
  - `host` [<host>](http://nodejs.cn/s/9Tw2bK)
  - `backlog` [<number>](http://nodejs.cn/s/SXbo1v) [`server.listen()`](http://nodejs.cn/s/xGksiu) 函数的通用参数。

这个函数是异步的。当服务器开始监听时，会触发 [`'listening'`](http://nodejs.cn/s/gimdsR) 事件。 最后一个参数 `callback` 将被添加为 [`'listening'`](http://nodejs.cn/s/gimdsR) 事件的监听器。

所有的 `listen()` 方法都可以使用一个 `backlog` 参数来指定待连接队列的最大长度。 此参数的默认值是 511 (不是512）。

所有的 [`net.Socket`](http://nodejs.cn/s/wsJ1o1) 都被设置为 `SO_REUSEADDR` (详见 [`socket(7)`](http://nodejs.cn/s/6qFPUH))。

当且仅当上次调用 `server.listen()` 发生错误或已经调用 `server.close()` 时，才能再次调用 `server.listen()` 方法。否则将抛出 `ERR_SERVER_ALREADY_LISTEN` 错误。

监听时最常见的错误之一是 `EADDRINUSE`。 这是因为另一个服务器已正在监听请求的 `port`/`path`/`handle`。 处理此问题的一种方法是在一段时间后重试：

```js
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.log('地址正被使用，重试中...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, HOST);
    }, 1000);
  }
});
```

### 2.3 `server.address()`

- 返回: [<object>](http://nodejs.cn/s/jzn6Ao) | [<string>](http://nodejs.cn/s/9Tw2bK) | [<null>](http://nodejs.cn/s/334hvC)

如果在 IP socket 上监听，则返回操作系统报告的绑定的 `address`、地址 `family` 名称、以及服务器 `port`（用于查找在获取操作系统分配的地址时分配的端口）：`{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`。

对于在管道或 Unix 域套接字上监听的 server，该名称将返回为字符串。

```js
const server = net.createServer((socket) => {
  socket.end('再见\n');
}).on('error', (err) => {
  // 处理错误
  throw err;
});

// 获取任意未使用的端口。
server.listen(() => {
  console.log('打开服务器', server.address());
});
```

在 `'listening'` 事件被触发之前、或在调用 `server.close()` 之后， `server.address()` 返回 `null`。

### 2.4 `server.close([callback])`

- `callback` [<function>](http://nodejs.cn/s/ceTQa6) 当 server 被关闭时调用。
- 返回: [<net.Server>](http://nodejs.cn/s/gBYjux)

阻止 server 接受新的连接并保持现有的连接。 该函数是异步的，server 将在所有连接结束后关闭并触发 [`'close'`](http://nodejs.cn/s/3c6jjk) 事件。 可选的 `callback` 将在 `'close'` 事件发生时被调用。 与 `'close'` 事件不同的是，如果 server 在关闭时未打开，回调函数被调用时会传入一个 `Error` 对象作为唯一参数。

## 3.net.Socket 类

- 继承自: [<stream.Duplex>](http://nodejs.cn/s/2iRabr)

此类是 TCP 套接字或流式 [IPC](http://nodejs.cn/s/rAdYjf) 端点的抽象（在 Windows 上使用命名管道，否则使用 Unix 域套接字）。 它也是一个 [`EventEmitter`](http://nodejs.cn/s/pGAddE)。

`net.Socket` 可以由用户创建并且直接地与服务器进行交互。 例如，它由 [`net.createConnection()`](http://nodejs.cn/s/RTNxdX) 返回，因此用户可以使用它与服务器进行通信。

它也可以由 Node.js 创建，并在收到连接时传给用户。 例如，将它传给 [`net.Server`](http://nodejs.cn/s/gBYjux) 上触发的 [`'connection'`](http://nodejs.cn/s/4qU2j9) 事件的监听器，因此用户可以使用它与客户端进行交互。

### 3.1 `new net.Socket([options])`构造函数

- `options` [<object>](http://nodejs.cn/s/jzn6Ao) 可用选项有
  - `fd` [<number>](http://nodejs.cn/s/SXbo1v) 如果指定了该参数，则使用一个给定的文件描述符包装一个已存在的 socket，否则将创建一个新的 socket。
  - `allowHalfOpen` [<boolean>](http://nodejs.cn/s/jFbvuT) 指示是否允许半打开的 TCP 连接。详情查看 [`net.createServer()`](http://nodejs.cn/s/e8cikS) 和 [`'end'`](http://nodejs.cn/s/Hxzmh3) 事件。**默认值:** `false`。
  - `readable` [<boolean>](http://nodejs.cn/s/jFbvuT) 当传递了 `fd` 时允许读取 socket，否则忽略。**默认值:** `false`。
  - `writable` [<boolean>](http://nodejs.cn/s/jFbvuT) 当传递了 `fd` 时允许写入 socket，否则忽略。**默认值:** `false`。
- 返回: [<net.Socket>](http://nodejs.cn/s/wsJ1o1)

创建一个 socket 对象。 新创建的 socket 可以是 TCP socket 也可以是 [IPC](http://nodejs.cn/s/rAdYjf) 端点流，取决于它连接 [`connect()`](http://nodejs.cn/s/fGCDDg) 到什么。

### 3.2 socket事件

| 事件名称  | 描述                                                         |
| --------- | ------------------------------------------------------------ |
| `close`   | 一旦 socket 完全关闭就发出该事件。参数 `had_error` 是 boolean 类型，表明 socket 被关闭是否取决于传输错误。 |
| `connect` | 当一个 socket 连接成功建立的时候触发该事件。 查看 [`net.createConnection()`](http://nodejs.cn/s/RTNxdX)。 |
| `data`    | 当接收到数据的时触发该事件。`data` 参数是一个 `Buffer` 或 `String`。数据编码由 [`socket.setEncoding()`](http://nodejs.cn/s/2Vxp3Q) 设置。 |
| `drain`   | 当写入缓冲区变为空时触发。可以用来做上传节流。也可以查看：`socket.write()` 的返回值。 |
| `end`     | 当 socket 的另一端发送一个 FIN 包的时候触发，从而结束 socket 的可读端。 |
| `error`   | 当错误发生时触发。`'close'` 事件也会紧接着该事件被触发。     |
| `lookup`  | 在找到主机之后创建连接之前触发。                             |
| `timeout` | 当 socket 超时的时候触发。该事件只是用来通知 socket 已经闲置。用户必须手动关闭。也可以查看：[`socket.setTimeout()`](http://nodejs.cn/s/XC4Yyj)。 |
| `ready`   | `socket`准备好使用时触发，`'connect'` 后立即触发。           |

### 3.3 `socket.address()`

- 返回: [<object>](http://nodejs.cn/s/jzn6Ao)

返回操作系统报告的 socket 的 `address`、地址的 `family` 名称、以及 `port`： `{ port: 12346, family: 'IPv4', address: '127.0.0.1' }`。

### 3.4 `socket.connect()`

在给定的`socket`上启动一个连接。

- `socket.connect(options[, connectListener])`

  ​	对于 TCP 连接，可用的 `options` 有：

  - `port` [<number>](http://nodejs.cn/s/SXbo1v) 必须。`socket`要连接的端口。
  - `host` [<string>](http://nodejs.cn/s/9Tw2bK) `socket`要连接的主机。**默认值:** `'localhost'`。
  - `localAddress` [<string>](http://nodejs.cn/s/9Tw2bK) `socket`要连接的本地地址。
  - `localPort` [<number>](http://nodejs.cn/s/SXbo1v) `socket`要连接的本地端口。
  - `family` [<number>](http://nodejs.cn/s/SXbo1v) IP 栈的版本。必须为 `4`、 `6` 或 `0`。`0` 值表示允许 IPv4 和 IPv6 地址。**默认值:** `0`。
  - `hints` [<number>](http://nodejs.cn/s/SXbo1v) 可选的 [`dns.lookup()` 提示](http://nodejs.cn/s/WpjMXq)。
  - `lookup` [<function>](http://nodejs.cn/s/ceTQa6) 自定义的查找函数。**默认值:** [`dns.lookup()`](http://nodejs.cn/s/LJLsTL)。

- `socket.connect(path[, connectListener])` 用于 [IPC](http://nodejs.cn/s/rAdYjf) 连接。

- `socket.connect(port[, host\][, connectListener])` 用于 TCP 连接。

- 返回: [<net.Socket>](http://nodejs.cn/s/wsJ1o1) socket 自身。

该方法是异步的。当连接建立了的时候，[`'connect'`](http://nodejs.cn/s/BwGGNR) 事件将会被触发。如果连接过程中有问题，[`'error'`](http://nodejs.cn/s/v5sbt8) 事件将会代替 [`'connect'`](http://nodejs.cn/s/BwGGNR) 事件被触发，并将错误信息传递给 [`'error'`](http://nodejs.cn/s/v5sbt8) 监听器。 最后一个参数 `connectListener`，如果指定了，将会被添加为 [`'connect'`](http://nodejs.cn/s/BwGGNR) 事件的监听器。

```js
const net = require('net');
net.connect({
  port: 80,
  onread: {
    // 为套接字的每次读取复用 4KiB 的 Buffer。
    buffer: Buffer.alloc(4 * 1024),
    callback: function(nread, buf) {
      // 收到的数据在 `buf` 中可用，从 0 到 'nread`。
      console.log(buf.toString('utf8', 0, nread));
    }
  }
});
```

### 3.5`socket.destroy([error])`

- `error` [<Object>](http://nodejs.cn/s/jzn6Ao)
- 返回: [<net.Socket>](http://nodejs.cn/s/wsJ1o1)

确保在此 socket 上不再有 I/O 活动。 销毁流并关闭连接。有关更多详细信息，参见 [`writable.destroy()`](http://nodejs.cn/s/tLkQ7J)。

### 3.6  `socket.end([data[, encoding]][, callback])`

- `data` [<string>](http://nodejs.cn/s/9Tw2bK) | [<Buffer>](http://nodejs.cn/s/6x1hD3) | [<Unit8Array>](http://nodejs.cn/s/ZbDkpm)
- `encoding` [<string>](http://nodejs.cn/s/9Tw2bK) 仅当 `data` 是字符串时有效。**默认值:** `'utf8'`。
- `callback` [<function>](http://nodejs.cn/s/ceTQa6) 当 socket 完成时的回调函数。
- 返回: [<net.Socket>](http://nodejs.cn/s/wsJ1o1) socket 本身。

半关闭 socket。 例如发送一个 FIN 包。 服务端仍可以发送数据。

如果指定了 `data`，则相当于调用 `socket.write(data, encoding)` 之后再调用 [`socket.end()`](http://nodejs.cn/s/RyEJPD)。有关更多详细信息，参见 [`writable.end()`](http://nodejs.cn/s/nvArK4)。

### 3.7 `socket.setKeepAlive([enable][, initialDelay])`

- `enable` [<boolean>](http://nodejs.cn/s/jFbvuT) **默认值:** `false`。
- `initialDelay` [<number>](http://nodejs.cn/s/SXbo1v) **默认值:** `0`。
- 返回: [<net.Socket>](http://nodejs.cn/s/wsJ1o1) Socket 本身。

启用/禁用长连接功能， 并且在第一个长连接探针被发送到一个空闲的 socket 之前可选则配置初始延迟。

`initialDelay`（毫秒）用来设置接收到最后一个数据包和发送第一个长连接探针之间的延迟。将 `initialDelay` 设置为 `0`，则会保持默认值（或之前设置的值）不变。

### 3.8 `socket.write(data[, encoding][, callback])`

- `data` [<string>](http://nodejs.cn/s/9Tw2bK) | [<Buffer>](http://nodejs.cn/s/6x1hD3) | [<Unit8Array>](http://nodejs.cn/s/ZbDkpm)
- `encoding` [<string>](http://nodejs.cn/s/9Tw2bK) 仅当 `data` 是字符串时有效。**默认值:** `'utf8'`。
- `callback` [<function>](http://nodejs.cn/s/ceTQa6) 当 socket 完成时的回调函数。
- 返回: [<boolean>](http://nodejs.cn/s/jFbvuT)

在 socket 上发送数据。第二个参数制定了字符串的编码。 默认是 UTF8 编码。

如果全部数据都成功刷新到内核的缓冲则返回 `true`。如果全部或部分数据在用户内中排队，则返回 `false`。当缓冲再次空闲的时候将触发 [`'drain'`](http://nodejs.cn/s/GyDS4X) 事件。

当数据最终都被写出之后，可选的 `callback` 参数将会被执行（可能不会立即执行）。详见 `Writable` 流的 [`write()`](http://nodejs.cn/s/doppiK) 方法。

## 4.net其他方法

### 4.1 `net.connect()`和`net.createConnection()`

`net.connect()`是`net.createConnection()`的别名。

一个用于创建 [`net.Socket`](http://nodejs.cn/s/wsJ1o1) 的工厂函数，立即使用 [`socket.connect()`](http://nodejs.cn/s/fGCDDg) 初始化链接，然后返回启动连接的 `net.Socket`。

当连接建立之后，在返回的 socket 上将触发一个 [`'connect'`](http://nodejs.cn/s/BwGGNR) 事件。若制定了最后一个参数 `connectListener`，则它将会被添加到 [`'connect'`](http://nodejs.cn/s/BwGGNR) 事件作为一个监听器。

可能的参数：

- `net.connect(options[, connectListener])`
- `net.connect(path[, connectListener\])`用于 [IPC](http://nodejs.cn/s/rAdYjf) 连接
- `net.connect(port[, host\][, connectListener])` 用于 TCP 连接。

```js
const net = require('net');
const client = net.createConnection({ port: 8124 }, () => {
  // 'connect' 监听器
  console.log('已连接到服务器');
  client.write('你好世界!\r\n');
});
client.on('data', (data) => {
  console.log(data.toString());
  client.end();
});
client.on('end', () => {
  console.log('已从服务器断开');
});
```

如果要连接到 `/tmp/echo.sock`：

```js
const client = net.createConnection({ path: '/tmp/echo.sock' });
```

### 4.1 `net.isIP(input)`

- `input` [<string>](http://nodejs.cn/s/9Tw2bK)
- 返回: [<integer>](http://nodejs.cn/s/SXbo1v)

测试输入是否是 IP 地址。无效的字符串则返回 `0`，IPv4 地址则返回 `4`，IPv6 的地址则返回 `6`。

### 4.2 `net.isIPv4(input)`

- `input` [<string>](http://nodejs.cn/s/9Tw2bK)
- 返回: [<boolean>](http://nodejs.cn/s/jFbvuT)

如果输入是 IPv4 地址则返回 `true`，否则返回 `false`。

### 4.2 `net.isIPv6(input)`

- `input` [<string>](http://nodejs.cn/s/9Tw2bK)
- 返回: [<boolean>](http://nodejs.cn/s/jFbvuT)

如果输入是 IPv6 地址则返回 `true`，否则返回 `false`。