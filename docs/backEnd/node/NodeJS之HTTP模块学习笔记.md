---
title: 【Node】NodeJS之HTTP模块学习笔记
date: 2019-8-27
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之HTTP模块学习笔记

![HTTP模块](../../../images/node/http-module.png)

## 1.简介

NodeJS 中的 HTTP 接口旨在支持传统上难以使用的协议的许多特性。 特别是，大块的、可能块编码的消息。 接口永远不会缓冲整个请求或响应，所以用户能够**流式传输**数据。--- 摘自官网[http（HTTP）](http://nodejs.cn/api/http.html)

## 1.使用方式

要使用 HTTP 服务器和客户端，必须 `require('http')`。

```js
const http = require('http');
// 不需要实例化,直接使用
http.createServer(function(req, res){...})
```

## 2.从module.exports说起

查看http模块源码：

```js
module.exports = {
  METHODS: methods.slice().sort(), // HTTP方法
  STATUS_CODES, // 标准 HTTP 响应状态码
  Agent: httpAgent.Agent, // 管理 HTTP 客户端的连接持久性和重用
  ClientRequest, // 请求类
  IncomingMessage, // 访问响应状态、消息头、以及数据
  OutgoingMessage,
  Server, // 服务
  ServerResponse, // 响应类
  createServer, // 创建服务 new Server
  get, // 创建get请求api
  request // 创建各种http请求api
};
```

这里可以看出，http模块默认将各种方法导出，它没有定义一个统一的构造方法，可以直接通过`http.createServer`这种方式调用。

## 3.http.METHODS

返回类型：`string[]`

解析器支持的 HTTP 方法列表，依赖于`_http_common`模块。

```js
const { methods } = require('_http_common');
module.exports = {
    ...
  METHODS: methods.slice().sort(),
    ...
}
```

这里`http.METHODS`对`_http_common`模块中的`methods`做了一个浅拷贝并排序。

## 4.http.STATUS_CODES

返回类型：`Object`

所有标准 HTTP 响应状态码的集合，以及每个状态码的简短描述。

```js
const STATUS_CODES = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',                 // RFC 2518, obsoleted by RFC 4918
  103: 'Early Hints',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',               // RFC 4918
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choices',           // RFC 7231
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',         // RFC 7238
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  418: 'I\'m a Teapot',              // RFC 7168
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',       // RFC 4918
  423: 'Locked',                     // RFC 4918
  424: 'Failed Dependency',          // RFC 4918
  425: 'Unordered Collection',       // RFC 4918
  426: 'Upgrade Required',           // RFC 2817
  428: 'Precondition Required',      // RFC 6585
  429: 'Too Many Requests',          // RFC 6585
  431: 'Request Header Fields Too Large', // RFC 6585
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',    // RFC 2295
  507: 'Insufficient Storage',       // RFC 4918
  508: 'Loop Detected',
  509: 'Bandwidth Limit Exceeded',
  510: 'Not Extended',               // RFC 2774
  511: 'Network Authentication Required' // RFC 6585
};
```



## 5.http.createServer方法

- `options` [Object](http://nodejs.cn/s/jzn6Ao)
  - `IncomingMessage` [http.IncomingMessage](http://nodejs.cn/s/2RqpEw) 指定要使用的 `IncomingMessage` 类。用于扩展原始的 `IncomingMessage`。**默认值:** `IncomingMessage`。
  - `ServerResponse` [http.ServerResponse](http://nodejs.cn/s/rMXoZ1) 指定要使用的 `ServerResponse` 类。用于扩展原始的 `ServerResponse`。**默认值:** `ServerResponse`。
  - `insecureHTTPParser` [boolean](http://nodejs.cn/s/jFbvuT) 使用不安全的 HTTP 解析器，当为 `true` 时接受无效的 HTTP 请求头。应避免使用不安全的解析器。有关更多信息，参见 [`--insecure-http-parser`](http://nodejs.cn/s/5Bnm43)。**默认值:** `false`。
  - `maxHeaderSize` [number](http://nodejs.cn/s/SXbo1v) 可选地，重写此服务器接收的请求的 [`--max-http-header-size`](http://nodejs.cn/s/HfsyuU) 值，即请求头的最大长度（以字节为单位）。 **默认值:** 16384（16KB）。
- `requestListener` [Function](http://nodejs.cn/s/ceTQa6)， 是一个自动添加到 [`'request'`](http://nodejs.cn/s/2qCn57) 事件的函数。参数(request, response)见后面的`http.clientRequest`和`http.ServerResponse`。
- 返回: [http.Server](http://nodejs.cn/s/jLiRTh)

源码解读：

```js
const {
    ...
  Server,
 	...
} = require('_http_server');

function createServer(opts, requestListener) {
  return new Server(opts, requestListener);
}
```

`Server`通过`http.createServer`来实例化，也就是说，我们也可以通过以下方式创建服务器：

```js
const http = require('http');
// 实例化
const server = new http.Server(function(req, res){...})
```

## 6.http.Agent类

简介：`Agent` 负责管理 HTTP 客户端的连接持久性和重用。当不再使用时最好 [`destroy()`](http://nodejs.cn/s/qZQu4q) `Agent` 实例，因为未使用的`Socket`会消耗操作系统资源。参见官网[http.Agent 类](http://nodejs.cn/api/http.html#http_class_http_agent)

### 6.1`new Agent([options])`构造方法

`options` [Object](http://nodejs.cn/s/jzn6Ao) 要在代理上设置的可配置选项集：

+ `keepAlive boolean`，**默认值:** `false`, true-开启长连接；

  不要与 `Connection` 请求头的 `keep-alive` 值混淆。 `Connection: keep-alive` 请求头始终在使用代理时发送，除非明确指定 `Connection` 请求头、或者 `keepAlive` 和 `maxSockets` 选项分别设置为 `false` 和 `Infinity`，在这种情况下将会使用 `Connection: close`。

 [NodeJS如何实现真正的长连接？](https://my.oschina.net/antianlu/blog/261105)

 [解决使用 KeepAlive Agent 遇到的 ECONNRESET](https://www.yuque.com/egg/nodejs/keep-alive-agent-econnreset)

+ `keepAliveMsecs` [number](http://nodejs.cn/s/SXbo1v) 当使用 `keepAlive` 选项时，指定用于 TCP Keep-Alive 数据包的[初始延迟](http://nodejs.cn/s/qqbgUD)。当 `keepAlive` 选项为 `false` 或 `undefined` 时则忽略。**默认值:** `1000`。

+ `maxSockets` [number](http://nodejs.cn/s/SXbo1v) 每个主机允许的`Socket`的最大数量。**默认值:** `Infinity`。
+ `maxFreeSockets` [number](http://nodejs.cn/s/SXbo1v) 在空闲状态下保持打开的`Socket`的最大数量。仅当 `keepAlive` 被设置为 `true` 时才相关。**默认值:** `256`。
+ `timeout` [number](http://nodejs.cn/s/SXbo1v) `Socket`的超时时间，以毫秒为单位。这会在`Socket`被连接之后设置超时时间。

要配置其中任何一个，则必须创建自定义的 [`http.Agent`](http://nodejs.cn/s/HRCnER) 实例:

```js
const http = require('http');
const keepAliveAgent = new http.Agent({ keepAlive: true });
options.agent = keepAliveAgent;
http.request(options, onResponseCallback);
```

### 6.2 `agent.createConnection(options[, callback])`

生成用于 HTTP 请求的`Socket`或流。默认情况下，此函数与 [`net.createConnection()`](http://nodejs.cn/s/xu7F69) 相同。

- `options` [Object](http://nodejs.cn/s/jzn6Ao) 包含连接详细信息的选项。 查看 [`net.createConnection()`](http://nodejs.cn/s/xu7F69) 以获取选项的格式。
- `callback` [Function](http://nodejs.cn/s/ceTQa6) 接收创建的`Socket`的回调函数。
- 返回: [stream.Duplex](http://nodejs.cn/s/2iRabr)

### 6.3 `agent.keepSocketAlive(socket)`

`socket` [stream.Duplex](http://nodejs.cn/s/2iRabr)

当 `socket` 与请求分离并且可以由 `Agent` 保留时调用。 默认行为是：

```js
socket.setKeepAlive(true, this.keepAliveMsecs);
socket.unref();
return true;
```

此方法可以由特定的 `Agent` 子类重写。

### 6.4 `agent.reuseSocket(socket, request)`

- `socket` [stream.Duplex](http://nodejs.cn/s/2iRabr)
- `request` [http.ClientRequest](http://nodejs.cn/s/2F5RHd)

由于 keep-alive 选项而在持久化后将 `socket` 附加到 `request` 时调用。 默认行为是：

```js
socket.ref();
```

此方法可以由特定的 `Agent` 子类重写。

### 6.5 `agent.destroy()`

销毁代理当前使用的所有`Socket`。

通常没有必要这样做。 但是，如果使用启用了 `keepAlive` 的代理，则最好在代理不再使用时显式关闭代理。 否则，在服务器终止`Socket`之前，`Socket`可能会挂起很长时间。

### 6.6 `agent.freeSockets`

[Object](http://nodejs.cn/s/jzn6Ao)

一个对象，其中包含当启用 `keepAlive` 时代理正在等待使用的`Socket`数组。 不要修改。

`freeSockets` 列表中的 socket 会在 `'timeout' 时自动被销毁并从数组中删除。

### 6.7  `agent.getName(options)`

- `options` [Object](http://nodejs.cn/s/jzn6Ao) 一组选项，为生成名称提供信息。
  - `host` [string](http://nodejs.cn/s/9Tw2bK) 请求发送至的服务器的域名或 IP 地址。
  - `port` [number](http://nodejs.cn/s/SXbo1v) 远程服务器的端口。
  - `localAddress` [string](http://nodejs.cn/s/9Tw2bK) 为网络连接绑定的本地接口。
  - `family` [integer](http://nodejs.cn/s/SXbo1v) 如果不等于 `undefined`，则必须为 4 或 6。
- 返回: [string](http://nodejs.cn/s/9Tw2bK)

获取一组请求选项的唯一名称，以判定一个连接是否可以被重用。 对于 HTTP 代理，这返回 `host:port:localAddress` 或 `host:port:localAddress:family`。 对于 HTTPS 代理，该名称包括 CA、证书、密码、以及其他可判定`Socket`可重用性的 HTTPS/TLS 特有的选项。

### 6.8 `agent.maxFreeSockets`

- [number](http://nodejs.cn/s/SXbo1v)

默认设置为 256。 对于启用了 `keepAlive` 的代理，这将设置在空闲状态下保持打开的最大`Socket`数。

### 6.9 `agent.requests`

- [Object](http://nodejs.cn/s/jzn6Ao)

一个对象，包含尚未分配给`Socket`的请求队列。 不要修改。

### 6.10 `agent.sockets`

- Object](http://nodejs.cn/s/jzn6Ao)

一个对象，包含尚未分配给`Socket`的请求队列。 不要修改。

## 7.http.ClientRequest类

继承自: [Stream](http://nodejs.cn/s/t73H94)

源码解读：

```js
function request(url, options, cb) {
  return new ClientRequest(url, options, cb);
}
```

此对象由 [`http.request()`](http://nodejs.cn/s/d1myoL) 内部创建并返回。 它代表正在进行中的请求，其请求头已进入队列。 请求头仍然可以使用 [`setHeader(name, value)`](http://nodejs.cn/s/ZBShBB)、[`getHeader(name)`](http://nodejs.cn/s/noVJNv) 或 [`removeHeader(name)`](http://nodejs.cn/s/vzuErq) API 进行改变。 实际的请求头将会与第一个数据块一起发送，或者当调用 [`request.end()`](http://nodejs.cn/s/GAdV2u) 时发送。

要获得响应，则为请求对象添加 [`'response'`](http://nodejs.cn/s/qwaiK8) 事件监听器。 当接收到响应头时，会从请求对象中触发 [`'response'`](http://nodejs.cn/s/qwaiK8) 事件。 [`'response'`](http://nodejs.cn/s/qwaiK8) 事件执行时具有一个参数，该参数是 [`http.IncomingMessage`](http://nodejs.cn/s/2RqpEw) 的实例。

在 [`'response'`](http://nodejs.cn/s/qwaiK8) 事件期间，可以添加监听器到响应对象，比如监听 `'data'` 事件。

如果没有添加 [`'response'`](http://nodejs.cn/s/qwaiK8) 事件处理函数，则响应将会被完全地丢弃。 如果添加了 [`'response'`](http://nodejs.cn/s/qwaiK8) 事件处理函数，则必须消费完响应对象中的数据，每当有 `'readable'` 事件时调用 `response.read()`、或添加 `'data'` 事件处理函数、或通过调用 `.resume()` 方法。 在消费完数据之前，不会触发 `'end'` 事件。 此外，在读取数据之前，它将会占用内存，这最终可能导致进程内存不足的错误。

与 `request` 对象不同，如果响应过早地关闭，则 `response` 对象不会触发 `'error'` 事件而是触发 `'aborted'` 事件。

Node.js 不会检查 Content-Length 和已传输的请求体的长度是否相等。

### 7.1 http.ClientRequest事件监听

#### 7.1.1 'abort' 事件

当请求被客户端中止时触发。 此事件仅在第一次调用 `abort()` 时触发。

#### 7.1.2 'connect' 事件

- `response` [httpIncomingMessage](http://nodejs.cn/s/2RqpEw)
- `socket` [stream.Duplex](http://nodejs.cn/s/2iRabr)
- `head` [Buffer](http://nodejs.cn/s/6x1hD3)

每次服务器使用 `CONNECT` 方法响应请求时都会触发。 如果未监听此事件，则接收 `CONNECT` 方法的客户端将关闭其连接。

此事件保证传入 [net.Socket](http://nodejs.cn/s/wsJ1o1) 类（[stream.Duplex](http://nodejs.cn/s/2iRabr) 的子类）的实例，除非用户指定了 [net.Socket](http://nodejs.cn/s/wsJ1o1) 以外的`Socket`类型。

客户端和服务器对演示了如何监听 `'connect'` 事件：

```js
const http = require('http');
const net = require('net');
const { URL } = require('url');

// 创建 HTTP 隧道代理。
const proxy = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('响应内容');
});
proxy.on('connect', (req, clientSocket, head) => {
  // 连接到原始服务器。
  const { port, hostname } = new URL(`http://${req.url}`);
  const serverSocket = net.connect(port || 80, hostname, () = {
    clientSocket.write('HTTP/1.1 200 Connection Established\r\n' +
                    'Proxy-agent: Node.js-Proxy\r\n' +
                    '\r\n');
    serverSocket.write(head);
    serverSocket.pipe(clientSocket);
    clientSocket.pipe(serverSocket);
  });
});

// 代理正在运行。
proxy.listen(1337, '127.0.0.1', () => {

  // 向隧道代理发出请求。
  const options = {
    port: 1337,
    host: '127.0.0.1',
    method: 'CONNECT',
    path: 'nodejs.cn:80'
  };

  const req = http.request(options);
  req.end();

  req.on('connect', (res, socket, head) => {
    console.log('已连接');

    // 通过 HTTP 隧道发出请求。
    socket.write('GET / HTTP/1.1\r\n' +
                 'Host: nodejs.cn:80\r\n' +
                 'Connection: close\r\n' +
                 '\r\n');
    socket.on('data', (chunk) => {
      console.log(chunk.toString());
    });
    socket.on('end', () => {
      proxy.close();
    });
  });
});
```

#### 7.1.3 'continue' 事件

当服务器发送 `100 Continue` HTTP 响应时触发，通常是因为请求包含 `Expect: 100-continue`。 这是客户端应发送请求主体的指令。

#### 7.1.4 'information' 事件

`info` [Object](http://nodejs.cn/s/jzn6Ao)

- `httpVersion` [string](http://nodejs.cn/s/9Tw2bK)
- `httpVersionMajor` [integer](http://nodejs.cn/s/SXbo1v)
- `httpVersionMinor` [integer](http://nodejs.cn/s/SXbo1v)
- `statusCode` [integer](http://nodejs.cn/s/SXbo1v)
- `statusMessage` [string](http://nodejs.cn/s/9Tw2bK)
- `headers` [Object](http://nodejs.cn/s/jzn6Ao)
- `rawHeaders` [string[]](http://nodejs.cn/s/9Tw2bK)

服务器发送 1xx 中间响应（不包括 101 Upgrade）时触发。 此事件的监听器将会接收一个对象，该对象包含 HTTP 版本，状态码，状态消息，键值对请求头对象、以及具有原始请求头名称和值的数组。

```js
const http = require('http');

const options = {
  host: '127.0.0.1',
  port: 8080,
  path: '/length_request'
};

// 发出请求。
const req = http.request(options);
req.end();

req.on('information', (info) => {
  console.log(`获得主响应之前的信息: ${info.statusCode}`);
});
```

`101 Upgrade` 状态不会触发此事件，因为它们与传统的 HTTP 请求/响应链断开，例如 Web `Socket`、现场 TLS 升级、或 HTTP 2.0。 要收到 `101 Upgrade` 的通知，请改为监听 [`'upgrade'`](http://nodejs.cn/s/xjUtig) 事件。

#### 7.1.5 'response' 事件

- `response` [http.IncomingMessage](http://nodejs.cn/s/2RqpEw)

当收到此请求的响应时触发。 此事件仅触发一次。

#### 7.1.6 'socket' 事件

- `socket` [stream.Duplex](http://nodejs.cn/s/2iRabr)

此事件保证传入 [net.Socket](http://nodejs.cn/s/wsJ1o1) 类（[stream.Duplex](http://nodejs.cn/s/2iRabr) 的子类）的实例，除非用户指定了 [net.Socket](http://nodejs.cn/s/wsJ1o1) 以外的`Socket`类型。

#### 7.1.7 'timeout' 事件

当底层`Socket`因不活动而超时时触发。 这只会通知`Socket`已空闲。 必须手动中止请求。

另请参见：[`request.setTimeout()`](http://nodejs.cn/s/qX7N7E)。

#### 7.1.8 'upgrade' 事件

- `response` [http.IncomingMessage](http://nodejs.cn/s/2RqpEw)
- `socket` [stream.Duplex](http://nodejs.cn/s/2iRabr)
- `head` [Buffer](http://nodejs.cn/s/6x1hD3)

每次服务器响应升级请求时发出。 如果未监听此事件且响应状态码为 `101 Switching Protocols`，则接收升级响应头的客户端将关闭其连接。

此事件保证传入[net.Socket](http://nodejs.cn/s/wsJ1o1)类（[stream.Duplex](http://nodejs.cn/s/2iRabr)的子类）的实例，除非用户指定了[net.Socket](http://nodejs.cn/s/wsJ1o1)以外的`Socket`类型。

客户端服务器对，演示如何监听 `'upgrade'` 事件。

```js
const http = require('http');

// 创建 HTTP 服务器。
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('响应内容');
});
server.on('upgrade', (req, socket, head) => {
  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               '\r\n');

  socket.pipe(socket); // 响应回去。
});

// 服务器正在运行。
server.listen(1337, '127.0.0.1', () => {

  // 发送请求。
  const options = {
    port: 1337,
    host: '127.0.0.1',
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket'
    }
  };

  const req = http.request(options);
  req.end();

  req.on('upgrade', (res, socket, upgradeHead) => {
    console.log('接收到响应');
    socket.end();
    process.exit(0);
  });
});
```

### 7.2 `request.aborted`

boolean

如果请求已中止，则 `request.aborted` 属性将会为 `true`。

### 7.3 `request.end([data[, encoding]][, callback])`

+ `data`: string | Buffer
+ `encoding`: string
+ `callback`: function
+ 返回：this --- request，即 可以链式调用

### 7.4 `request.destroy([error])`

+ `error`: Error
+ 返回： this

##### 7.5 `request.destroyed`

`boolean`

在`request.destroyed`调用之后变为`true`

### 7.6  `request.flushHeaders()`

刷新请求头。

出于效率原因，Node.js 通常会缓冲请求头，直到调用 `request.end()` 或写入第一个请求数据块。 然后，它尝试将请求头和数据打包到单个 TCP 数据包中。

这通常是期望的（它节省了 TCP 往返），但是可能很晚才发送第一个数据。 `request.flushHeaders()` 绕过优化并启动请求。

### 7.7 `request.getHeader(name)`

+ `name`: string

+ 返回：any

  

读取请求中的一个请求头。 该名称不区分大小写。 返回值的类型取决于提供给 [`request.setHeader()`](http://nodejs.cn/s/ZBShBB) 的参数。

```js
request.setHeader('content-type', 'text/html');
request.setHeader('Content-Length', Buffer.byteLength(body));
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
const contentType = request.getHeader('Content-Type');
// 'contentType' 是 'text/html'。
const contentLength = request.getHeader('Content-Length');
// 'contentLength' 的类型为数值。
const cookie = request.getHeader('Cookie');
// 'cookie' 的类型为字符串数组。
```

### 7.8 `request.maxHeadersCount`

- [number](http://nodejs.cn/s/SXbo1v) **默认值:** `2000`。

限制最大响应头数。 如果设置为 `0`，则不会应用任何限制。

### 7.9 `request.path`

- [string](http://nodejs.cn/s/9Tw2bK) 请求的路径。

### 7.10 `request.removeHeader(name)`

- `name` [string](http://nodejs.cn/s/9Tw2bK)

移除已定义到请求头对象中的请求头。

```js
request.removeHeader('Content-Type');
```

### 7.11 `request.setHeader(name, value)`

+ `name`: string
+ `value`: any

为请求头对象设置单个请求头的值。

如果此请求头已存在于待发送的请求头中，则其值将被替换。 这里可以使用字符串数组来发送具有相同名称的多个请求头。 非字符串值将被原样保存。 因此 [`request.getHeader()`](http://nodejs.cn/s/noVJNv) 可能会返回非字符串值。 但是非字符串值将转换为字符串以进行网络传输。

```js
request.setHeader('Content-Type', 'application/json');
// 或：
request.setHeader('Cookie', ['type=ninja', 'language=javascript']);
```

### 7.12 `request.setNoDelay([noDelay])`

- `noDelay` [boolean](http://nodejs.cn/s/jFbvuT)

一旦将`Socket`分配给此请求并且连接了`Socket`，就会调用 [`socket.setNoDelay()`](http://nodejs.cn/s/q9UswY)。

### 7.13 `request.setSocketKeepAlive([enable][, initialDelay])`

- `enable` [boolean](http://nodejs.cn/s/jFbvuT)
- `initialDelay` [number](http://nodejs.cn/s/SXbo1v)

一旦将`Socket`分配给此请求并连接了`Socket`，就会调用 [`socket.setKeepAlive()`](http://nodejs.cn/s/qqbgUD)。

### 7.14 `request.setTimeout(timeout[, callback])`

- `timeout` [number](http://nodejs.cn/s/SXbo1v) 请求超时前的毫秒数。
- `callback` [function](http://nodejs.cn/s/ceTQa6) 发生超时时要调用的可选函数。相当于绑定到 `'timeout'` 事件。
- 返回: [http.ClientRequest](http://nodejs.cn/s/2F5RHd)

一旦将`Socket`分配给此请求并且连接了`Socket`，就会调用 [`socket.setTimeout()`](http://nodejs.cn/s/XC4Yyj)。

### 7.15 `request.socket`

- [stream.Duplex](http://nodejs.cn/s/2iRabr)

指向底层`Socket`。 通常用户无需访问此属性。 特别是，由于协议解析器附加到`Socket`的方式，`Socket`将不会触发 `'readable'` 事件。 也可以通过 `request.connection` 访问 `socket`。

```js
const http = require('http');
const options = {
  host: 'nodejs.cn',
};
const req = http.get(options);
req.end();
req.once('response', (res) => {
  const ip = req.socket.localAddress;
  const port = req.socket.localPort;
  console.log(`您的 IP 地址是 ${ip}，源端口是 ${port}`);
  // 使用响应对象。
});
```

### 7.16 `request.writableFinished`

- [boolean](http://nodejs.cn/s/jFbvuT)

如果在触发 [`'finish'`](http://nodejs.cn/s/yLFDX9) 事件之前，所有数据都已刷新到底层系统，则为 `true`。

### 7.17 `request.write(chunk[, encoding][, callback])`

- `chunk` [string](http://nodejs.cn/s/9Tw2bK) | [](http://nodejs.cn/s/6x1hD3)
- `encoding` [string](http://nodejs.cn/s/9Tw2bK)
- `callback` [function](http://nodejs.cn/s/ceTQa6)
- 返回: [boolean](http://nodejs.cn/s/jFbvuT)

发送一个请求主体的数据块。 通过多次调用此方法，可以将请求主体发送到服务器。 在这种情况下，建议在创建请求时使用 `['Transfer-Encoding', 'chunked']` 请求头行。

`encoding` 参数是可选的，仅当 `chunk` 是字符串时才适用。 默认为 `'utf8'`。

`callback` 参数是可选的，当刷新此数据块时调用，但仅当数据块非空时才会调用。

如果将整个数据成功刷新到内核缓冲区，则返回 `true`。 如果全部或部分数据在用户内存中排队，则返回 `false`。 当缓冲区再次空闲时，则触发 `'drain'` 事件。

当使用空字符串或 buffer 调用 `write` 函数时，则什么也不做且等待更多输入。

### 7.17 `request.reusedSocket`

- boolean 

判断`request`是否是通过一个被拒绝的`socket`发送。

当通过启用保持`keep-alive` 的代理发送请求时，底层的`socket`可能會被拒絕。但是，如果服务器在不幸的时间关闭连接，则客户端可能会遇到“ ECONNRESET”错误。

```js
const http = require('http');

// Server has a 5 seconds keep-alive timeout by default
http
  .createServer((req, res) => {
    res.write('hello\n');
    res.end();
  })
  .listen(3000);

setInterval(() => {
  // Adapting a keep-alive agent
  http.get('http://localhost:3000', { agent }, (res) => {
    res.on('data', (data) = {
      // Do nothing
    });
  });
}, 5000); // Sending request on 5s interval so it's easy to hit idle timeout
```

通过判断`req.reusedSocket`的值，我们可以再次重新启用连接，从而避免这个错误：

```js
const http = require('http');
const agent = new http.Agent({ keepAlive: true });

function retriableRequest() {
  const req = http
    .get('http://localhost:3000', { agent }, (res) = {
      // ...
    })
    .on('error', (err) = {
      // Check if retry is needed
      if (req.reusedSocket && err.code === 'ECONNRESET') {
        retriableRequest();
      }
    });
}

retriableRequest();
```

## 8.http.ServerResponse 类

继承自: [Stream](http://nodejs.cn/s/t73H94)

源码解读：

```js
const {
    ...
  ServerResponse
    ...
} = require('_http_server');

module.exports = {
    ...
  ServerResponse,
    ...
};
```

`http.ServerResponse` 类直接将`_http_server`中的`ServerResponse`引入并导出。

此对象由 HTTP 服务器在内部创建，而不是由用户创建。 它作为第二个参数传给 [`'request'`](http://nodejs.cn/s/2qCn57) 事件。—— [官网](http://nodejs.cn/api/http.html#http_class_http_serverresponse)

### 8.1 http.ServerResponse 事件监听

#### 8.1.1 'close' 事件

表明底层的连接已被终止。

```js
res.on('close', function() {})
```



#### 8.1.2 'finish' 事件

响应发送后触发。 更具体地说，当响应头和主体的最后一段已经切换到操作系统以通过网络传输时，触发该事件。 这并不意味着客户端已收到任何信息。

```js
res.on('finish', function() {})
```

### 8.2 `response.cork()`

继承自stream.Writable 类,同 [`writable.cork()`](http://nodejs.cn/s/HbaGHW)

`writable.cork()` 方法强制把所有写入的数据都缓冲到内存中。 当调用 [`stream.uncork()`](http://nodejs.cn/s/2Bzt8L) 或 [`stream.end()`](http://nodejs.cn/s/nvArK4) 方法时，缓冲的数据才会被输出。

`writable.cork()` 的主要目的是为了适应将几个数据快速连续地写入流的情况。 `writable.cork()` 不会立即将它们转发到底层的目标，而是缓冲所有数据块，直到调用 `writable.uncork()`，这会将它们全部传给 `writable._writev()`（如果存在）。 这可以防止出现行头阻塞的情况，在这种情况下，正在等待第一个数据块被处理的同时对数据进行缓冲。 但是，使用 `writable.cork()` 而不实现 `writable._writev()` 可能会对吞吐量产生不利影响。

### 8.3 `response.end([data[, encoding]][, callback])`

- `data` [string](http://nodejs.cn/s/9Tw2bK) | [Buffer](http://nodejs.cn/s/6x1hD3)
- `encoding` [string](http://nodejs.cn/s/9Tw2bK)
- `callback` [Function](http://nodejs.cn/s/ceTQa6)
- 返回：this

此方法向服务器发出信号，表明已发送所有响应头和主体，该服务器应该视为此消息已完成。 必须在每个响应上调用此 `response.end()` 方法。

如果指定了 `data`，则相当于调用 [`response.write(data, encoding)`](http://nodejs.cn/s/gvWo3m) 之后再调用 `response.end(callback)`。

如果指定了 `callback`，则当响应流完成时将调用它。

### 8.4 `response.flushHeaders()`

刷新响应头。 另可参见：[`request.flushHeaders()`](http://nodejs.cn/s/JcwoXr)。

### 8.5 `response.getHeader(name)`

- `name` [string](http://nodejs.cn/s/9Tw2bK)
- 返回: [any](http://nodejs.cn/s/6sTGdS)

读出已排队但未发送到客户端的响应头。 该名称不区分大小写。 返回值的类型取决于提供给 [`response.setHeader()`](http://nodejs.cn/s/rqeM3J) 的参数。

```js
response.setHeader('Content-Type', 'text/html');
response.setHeader('Content-Length', Buffer.byteLength(body));
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
const contentType = response.getHeader('content-type');
// contentType 是 'text/html'。
const contentLength = response.getHeader('Content-Length');
// contentLength 的类型为数值。
const setCookie = response.getHeader('set-cookie');
// setCookie 的类型为字符串数组。
```

### 8.6 `response.getHeaderNames()`

- 返回: [string[]](http://nodejs.cn/s/9Tw2bK)

返回一个数组，其中包含当前传出的响应头的唯一名称。 所有响应头名称都是小写的。

```js
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headerNames = response.getHeaderNames();
// headerNames === ['foo', 'set-cookie']
```

### 8.7 `response.getHeaders()`

- 返回: [Object](http://nodejs.cn/s/jzn6Ao)

返回当前传出的响应头的浅拷贝。 由于使用浅拷贝，因此可以更改数组的值而无需额外调用各种与响应头相关的 http 模块方法。 返回对象的键是响应头名称，值是各自的响应头值。 所有响应头名称都是小写的。

**`response.getHeaders()` 方法返回的对象不是从 JavaScript `Object` 原型继承的**。 这意味着典型的 `Object` 方法，如 `obj.toString()`、 `obj.hasOwnProperty()` 等都没有定义并且不起作用。

```js
response.setHeader('Foo', 'bar');
response.setHeader('Set-Cookie', ['foo=bar', 'bar=baz']);

const headers = response.getHeaders();
// headers === { foo: 'bar', 'set-cookie': ['foo=bar', 'bar=baz'] }
```

源码解读：

```js
// Returns a shallow copy of the current outgoing headers.
OutgoingMessage.prototype.getHeaders = function getHeaders() {
  const headers = this[kOutHeaders];
  const ret = Object.create(null); // 对象不是从 JavaScript `Object` 原型继承的，生成一个纯粹的 {}
  if (headers) {
    const keys = Object.keys(headers);
    for (var i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const val = headers[key][1];
      ret[key] = val;
    }
  }
  return ret;
};

```

可以看出`response`是`OutgoingMessage`的实例化对象。

```js
...
new http.Server(function (req, res) {
    console.log(req.statusCode);
    console.log(res.getHeaders());
    console.log(res instanceof http.OutgoingMessage); // true
    ...
}.listen(7777);
```

### 8.8 `response.hasHeader(name)`

- `name` [string](http://nodejs.cn/s/9Tw2bK)
- 返回: [boolean](http://nodejs.cn/s/jFbvuT)

如果当前在传出的响应头中设置了由 `name` 标识的响应头，则返回 `true`。 响应头名称匹配不区分大小写。

```js
const hasContentType = response.hasHeader('content-type');
```

### 8.9 `response.removeHeader(name)`

- `name` [string](http://nodejs.cn/s/9Tw2bK)

移除排队等待中的隐式发送的响应头。

```js
response.removeHeader('Content-Encoding');
```

### 8.10 `response.setHeader(name, value)`

- `name` [string](http://nodejs.cn/s/9Tw2bK)
- `value` [any](http://nodejs.cn/s/6sTGdS)

为隐式响应头设置单个响应头的值。 如果此响应头已存在于待发送的响应头中，则其值将被替换。 在这里可以使用字符串数组来发送具有相同名称的多个响应头。 非字符串值将被原样保存。 因此 [`response.getHeader()`](http://nodejs.cn/s/pbE7VN) 可能返回非字符串值。 但是非字符串值将转换为字符串以进行网络传输。

```js
response.setHeader('Content-Type', 'text/html');
```

或：

```js
response.setHeader('Set-Cookie', ['type=ninja', 'language=javascript']);
```

尝试设置包含无效字符的响应头字段名称或值将导致抛出 [`TypeError`](http://nodejs.cn/s/Z7Lqyj)。

当使用 [`response.setHeader()`](http://nodejs.cn/s/rqeM3J) 设置响应头时，它们将与传给 [`response.writeHead()`](http://nodejs.cn/s/fnj9oM) 的任何响应头合并，其中 **[`response.writeHead()`](http://nodejs.cn/s/fnj9oM) 的响应头优先**。

```js
// 返回 content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

如果调用了 [`response.writeHead()`](http://nodejs.cn/s/fnj9oM) 方法并且尚未调用此方法，则它将直接将提供的响应头值写入网络通道而不在内部进行缓存，并且响应头上的 [`response.getHeader()`](http://nodejs.cn/s/pbE7VN) 将不会产生预期的结果。 如果需要渐进的响应头填充以及将来可能的检索和修改，则使用 [`response.setHeader()`](http://nodejs.cn/s/rqeM3J) 而不是 [`response.writeHead()`](http://nodejs.cn/s/fnj9oM)。

### 8.11 `response.setTimeout(msecs[, callback])`

- `msecs` [number](http://nodejs.cn/s/SXbo1v)
- `callback` [Function](http://nodejs.cn/s/ceTQa6)
- 返回: [http.ServerResponse](http://nodejs.cn/s/rMXoZ1)

将Socket的超时值设置为 `msecs`。 如果提供了回调，则会将其作为监听器添加到响应对象上的 `'timeout'` 事件中。

如果没有 `'timeout'` 监听器添加到请求、响应、或服务器，则`Socket`在超时时将被销毁。 如果有回调处理函数分配给请求、响应、或服务器的 `'timeout'` 事件，则必须显式处理超时的`Socket`。

### 8.12 `response.socket`

[stream.Duplex](http://nodejs.cn/s/2iRabr)

指向底层的`socket`。 通常用户不需要访问此属性。 特别是，由于协议解析器附加到`socket`的方式，`socket`将不会触发 `'readable'` 事件。 在调用 `response.end()` 之后，此属性将为空。 也可以通过 `response.connection` 访问 `socket`。

```js
const http = require('http');
const server = http.createServer((req, res) => {
  const ip = res.socket.remoteAddress;
  const port = res.socket.remotePort;
  res.end(`您的 IP 地址是 ${ip}，您的源端口是 ${port}`);
}).listen(3000);
```

此属性保证是 [net.Socket](http://nodejs.cn/s/wsJ1o1) 类（[stream.Duplex](http://nodejs.cn/s/2iRabr) 的子类）的实例，除非用户指定了 [net.Socket](http://nodejs.cn/s/wsJ1o1) 以外的`socket`类型。

### 8.13 `response.statusCode`

- [number](http://nodejs.cn/s/SXbo1v) **默认值:** `200`。

当使用隐式的响应头时（没有显式地调用 [`response.writeHead()`](http://nodejs.cn/s/fnj9oM)），此属性控制在刷新响应头时将发送到客户端的状态码。

```js
response.statusCode = 404;
```

响应头发送到客户端后，此属性表示已发送的状态码。

### 8.14 `response.statusMessage`

- [string](http://nodejs.cn/s/9Tw2bK)

当使用隐式的响应头时（没有显式地调用 [`response.writeHead()`](http://nodejs.cn/s/fnj9oM)），此属性控制在刷新响应头时将发送到客户端的状态消息。 如果保留为 `undefined`，则将使用状态码的标准消息。

```js
response.statusMessage = 'Not found';
```

响应头发送到客户端后，此属性表示已发送的状态消息。

### 8.15`response.write(chunk[, encoding][, callback])`

- `chunk` [string](http://nodejs.cn/s/9Tw2bK) | [Buffer](http://nodejs.cn/s/6x1hD3)
- `encoding` [string](http://nodejs.cn/s/9Tw2bK) **默认值:** `'utf8'`。
- `callback` [Function](http://nodejs.cn/s/ceTQa6)
- 返回: [boolean](http://nodejs.cn/s/jFbvuT)

`chunk` 可以是字符串或 buffer。 如果 `chunk` 是一个字符串，则第二个参数指定如何将其编码为字节流。 当刷新此数据块时将调用 `callback`。

第一次调用 [`response.write()`](http://nodejs.cn/s/gvWo3m) 时，它会将缓冲的响应头信息和主体的第一个数据块发送给客户端。 第二次调用 [`response.write()`](http://nodejs.cn/s/gvWo3m) 时，Node.js 假定数据将被流式传输，并分别发送新数据。 也就是说，响应被缓冲到主体的第一个数据块。

如果将整个数据成功刷新到内核缓冲区，则返回 `true`。 如果全部或部分数据在用户内存中排队，则返回 `false`。 当缓冲区再次空闲时，则触发 `'drain'` 事件。

### 8.16 `response.writeHead(statusCode[, statusMessage][, headers])`

- `statusCode` [number](http://nodejs.cn/s/SXbo1v)
- `statusMessage` [string](http://nodejs.cn/s/9Tw2bK)
- `headers`[Object](http://nodejs.cn/s/jzn6Ao)
- 返回: [http.ServerResponse](http://nodejs.cn/s/rMXoZ1)

向请求发送响应头。 状态码是一个 3 位的 HTTP 状态码，如 `404`。 最后一个参数 `headers` 是响应头。 可以可选地将用户可读的 `statusMessage` 作为第二个参数。

返回对 `ServerResponse` 的引用，以便可以链式调用。

```js
const body = 'hello world';
response
  .writeHead(200, {
    'Content-Length': Buffer.byteLength(body),
    'Content-Type': 'text/plain'
  })
  .end(body);
```

此方法只能在消息上调用一次，并且必须在调用 [`response.end()`](http://nodejs.cn/s/sqAtet) 之前调用。

当使用 [`response.setHeader()`](http://nodejs.cn/s/rqeM3J) 设置响应头时，则与传给 [`response.writeHead()`](http://nodejs.cn/s/fnj9oM) 的任何响应头合并，且 [`response.writeHead()`](http://nodejs.cn/s/fnj9oM) 的优先。

如果调用此方法并且尚未调用 [`response.setHeader()`](http://nodejs.cn/s/rqeM3J)，则直接将提供的响应头值写入网络通道而不在内部进行缓存，响应头上的 [`response.getHeader()`](http://nodejs.cn/s/pbE7VN) 将不会产生预期的结果。 如果需要渐进的响应头填充以及将来可能的检索和修改，则改用 [`response.setHeader()`](http://nodejs.cn/s/rqeM3J)。

```js
// 返回 content-type = text/plain
const server = http.createServer((req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('ok');
});
```

`Content-Length` 以字节而非字符为单位。 使用 `Buffer.byteLength()` 来判断主体的长度（以字节为单位）。 Node.js 不检查 `Content-Length` 和已传输的主体的长度是否相等。

尝试设置包含无效字符的响应头字段名称或值将导致抛出 [`TypeError`](http://nodejs.cn/s/Z7Lqyj)。

## 9.`http.get(options[, callback])`和`http.get(url[, options][, callback])`

- `url` [string](http://nodejs.cn/s/9Tw2bK) | [URL](http://nodejs.cn/s/5dwq7G)
- `options` [Object](http://nodejs.cn/s/jzn6Ao) 接受与 [`http.request()`](http://nodejs.cn/s/d1myoL) 相同的 `options`，且 `method` 始终设置为 `GET`。从原型继承的属性将被忽略。
- `callback` [Function](http://nodejs.cn/s/ceTQa6), `callback` 调用时只有一个参数，该参数是 [`http.IncomingMessage`](http://nodejs.cn/s/2RqpEw) 的实例。
- 返回: [http.ClientRequest](http://nodejs.cn/s/2F5RHd)

这个方法与 [`http.request()`](http://nodejs.cn/s/d1myoL) 的唯一区别是它将方法设置为 GET 并自动调用 `req.end()`

```js
http.get('http://nodejs.cn/index.json', (res) => {
  const { statusCode } = res;
  const contentType = res.headers['content-type'];

  let error;
  if (statusCode !== 200) {
    error = new Error('请求失败\n' +
                      `状态码: ${statusCode}`);
  } else if (!/^application\/json/.test(contentType)) {
    error = new Error('无效的 content-type.\n' +
                      `期望的是 application/json 但接收到的是 ${contentType}`);
  }
  if (error) {
    console.error(error.message);
    // 消费响应数据来释放内存。
    res.resume();
    return;
  }

  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      console.log(parsedData);
    } catch (e) {
      console.error(e.message);
    }
  });
}).on('error', (e) => {
  console.error(`出现错误: ${e.message}`);
});
```

## 10. `http.request(options[, callback])`和`http.request(url[, options][, callback])`

```js
const postData = querystring.stringify({
  'msg': '你好世界'
});

const options = {
  hostname: 'nodejs.cn',
  port: 80,
  path: '/upload',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) = {
    console.log(`响应主体: ${chunk}`);
  });
  res.on('end', () => {
    console.log('响应中已无数据');
  });
});

req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

// 将数据写入请求主体。
req.write(postData);
// 必须始终调用 req.end() 来表示请求的结束
req.end();
```

- `url` [string](http://nodejs.cn/s/9Tw2bK) | [URL](http://nodejs.cn/s/5dwq7G)
- `options` [Object](http://nodejs.cn/s/jzn6Ao)
  - `agent` [http.Agent](http://nodejs.cn/s/HRCnER) | [boolean](http://nodejs.cn/s/jFbvuT) 控制 [`Agent`](http://nodejs.cn/s/HRCnER) 的行为。可能的值有：
    - `undefined` (默认): 对此主机和端口使用 [`http.globalAgent`](http://nodejs.cn/s/g7BhW2)。
    - `Agent` 对象: 显式地使用传入的 `Agent`。
    - `false`: 使用新建的具有默认值的 `Agent`。
  - `auth` [string](http://nodejs.cn/s/9Tw2bK) 基本的身份验证，即 `'user:password'`，用于计算授权请求头。
  - `createConnection` [Function](http://nodejs.cn/s/ceTQa6) 当 `agent` 选项未被使用时，用来为请求生成套接字或流的函数。这可用于避免创建自定义的 `Agent` 类以覆盖默认的 `createConnection` 函数。详见 [`agent.createConnection()`](http://nodejs.cn/s/nH3X12)。任何[双工流](http://nodejs.cn/s/2iRabr)都是有效的返回值。
  - `defaultPort` [number](http://nodejs.cn/s/SXbo1v) 协议的默认端口。 如果使用 `Agent`，则默认值为 `agent.defaultPort`，否则为 `undefined`。
  - `family` [number](http://nodejs.cn/s/SXbo1v) 当解析 `host` 或 `hostname` 时使用的 IP 地址族。有效值为 `4` 或 `6`。如果没有指定，则同时使用 IP v4 和 v6。
  - `headers` [Object](http://nodejs.cn/s/jzn6Ao) 包含请求头的对象。
  - `host` [string](http://nodejs.cn/s/9Tw2bK) 请求发送至的服务器的域名或 IP 地址。**默认值:** `'localhost'`。
  - `hostname` [string](http://nodejs.cn/s/9Tw2bK) `host` 的别名。为了支持 [`url.parse()`](http://nodejs.cn/s/b28B2A)，如果同时指定 `host` 和 `hostname`，则使用 `hostname`。
  - `insecureHTTPParser` [boolean](http://nodejs.cn/s/jFbvuT) 使用不安全的 HTTP 解析器，当为 `true` 时接受无效的 HTTP 请求头。应避免使用不安全的解析器。有关更多信息，参见 [`--insecure-http-parser`](http://nodejs.cn/s/5Bnm43)。**默认值:** `false`。
  - `localAddress` [string](http://nodejs.cn/s/9Tw2bK) 为网络连接绑定的本地接口。
  - `lookup` [Function](http://nodejs.cn/s/ceTQa6) 自定义的查找函数。 **默认值:** [`dns.lookup()`](http://nodejs.cn/s/LJLsTL)。
  - `maxHeaderSize` [number](http://nodejs.cn/s/SXbo1v) 可选地，重写此服务器接收的请求的 [`--max-http-header-size`](http://nodejs.cn/s/HfsyuU) 值，即请求头的最大长度（以字节为单位）。 **默认值:** 16384（16KB）。
  - `method` [string](http://nodejs.cn/s/9Tw2bK) 一个字符串，指定 HTTP 请求的方法。**默认值:** `'GET'`。
  - `path` [string](http://nodejs.cn/s/9Tw2bK) 请求的路径。应包括查询字符串（如果有）。例如 `'/index.html?page=12'`。当请求的路径包含非法的字符时，则抛出异常。目前只有空格被拒绝，但未来可能会有所变化。**默认值:** `'/'`。
  - `port` [number](http://nodejs.cn/s/SXbo1v) 远程服务器的端口。**默认值:** `defaultPort`（如果有设置）或 `80`。
  - `protocol` [string](http://nodejs.cn/s/9Tw2bK) 使用的协议。**默认值:** `'http:'`。
  - `setHost` [boolean](http://nodejs.cn/s/jFbvuT): 指定是否自动添加 `Host` 请求头。**默认值:** `true`。
  - `socketPath` [string](http://nodejs.cn/s/9Tw2bK) Unix 域套接字。如果指定了 `host` 或 `port` 之一（它们指定了 TCP 套接字），则不能使用此选项。
  - `timeout` [number](http://nodejs.cn/s/SXbo1v): 指定套接字超时的数值，以毫秒为单位。这会在套接字被连接之前设置超时。
- `callback` [Function](http://nodejs.cn/s/ceTQa6),可选的 `callback` 参数会作为单次监听器被添加到 [`'response'`](http://nodejs.cn/s/qwaiK8) 事件。
- 返回: [http.ClientRequest](http://nodejs.cn/s/2F5RHd)

## 11. 小结

+ 导入http模块

  ```js
  const http = require('http');
  ```

+ 创建服务并监听端口

  ```js
  http.createServer((res, req) => {
      // res: http.ServerResponse类
      // req: http.ClientRequest类
      response.setHeader('Content-Type', 'text/html');
      // 优先于setHeader
      res.writeHead(200, { 'Content-type': 'text/html;charset=UTF-8' }); 
      // 必须调用end()方法
      res.end()
  }).listen(3000);
  ```

+ 创建get请求

  ```js
  http.get('http://nodejs.cn/index.json', (res) => {
      // do what you want
  }
  ```

  `http.get`是创建http请求GET方法快捷方式。

+ 创建post请求

  ```js
  http.request({method: 'POST'}, (res) => {})
  ```

  `http.request`是创建http请求万能方法。

 本文学习笔记大部分是查看官网API，部分是查看nodejs源码，只供参考，不喜勿喷 (#^.^#)。
