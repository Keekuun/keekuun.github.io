---
title: NodeJS之web socket和Socket框架
date: 2019-8-28
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之web socket和Socket框架

### Node.js 中的 WebSocket 和 Socket 框架

在 Node.js 中，WebSocket 和 Socket 是两种不同的通信机制，分别用于不同的应用场景。以下是它们的详细介绍和使用方法。

#### 1. **WebSocket**

##### 1.1 简介
WebSocket 是一种基于 TCP 的协议，提供全双工通信通道，允许服务器和客户端之间进行实时双向通信。与传统的 HTTP 协议不同，WebSocket 连接一旦建立，就可以持续保持连接状态，直到显式关闭。

##### 1.2 使用场景
- 实时聊天应用
- 在线游戏
- 实时数据推送（如股票行情、体育赛事）
- 文件上传进度显示

##### 1.3 常用库
- **`ws`**：一个高性能的 WebSocket 库，广泛应用于生产环境。
- **`socket.io`**：不仅支持 WebSocket，还提供了多种传输方式（如轮询），具有更好的兼容性和更丰富的功能。

##### 1.4 示例代码

###### 使用 `ws` 库创建 WebSocket 服务器
```javascript
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('新客户端连接');

  ws.on('message', (message) => {
    console.log(`收到消息: ${message}`);
    ws.send(`服务器已收到: ${message}`);
  });

  ws.on('close', () => {
    console.log('客户端断开连接');
  });
});

console.log('WebSocket 服务器正在监听端口 8080');
```


###### 使用 `socket.io` 创建 WebSocket 服务器
```javascript
const io = require('socket.io')(3000);

io.on('connection', (socket) => {
  console.log('新客户端连接');

  socket.on('chat message', (msg) => {
    console.log(`收到消息: ${msg}`);
    io.emit('chat message', msg); // 广播给所有客户端
  });

  socket.on('disconnect', () => {
    console.log('客户端断开连接');
  });
});

console.log('Socket.IO 服务器正在监听端口 3000');
```


#### 2. **Socket（TCP/UDP）**

##### 2.1 简介
Node.js 提供了内置的 `net` 和 `dgram` 模块来处理 TCP 和 UDP 通信。这些模块允许你创建低级别的网络套接字（sockets），适用于需要更细粒度控制的场景。

##### 2.2 使用场景
- TCP：可靠的、面向连接的通信，适合需要确保数据完整性的场景（如文件传输、远程登录）。
- UDP：无连接、不可靠的通信，适合对延迟敏感但可以容忍丢包的场景（如视频流、在线游戏）。

##### 2.3 示例代码

###### 使用 `net` 模块创建 TCP 服务器
```javascript
const net = require('net');

const server = net.createServer((socket) => {
  console.log('新客户端连接');

  socket.write('欢迎连接到 TCP 服务器\n');

  socket.on('data', (data) => {
    console.log(`收到消息: ${data.toString()}`);
    socket.write(`服务器已收到: ${data.toString()}`);
  });

  socket.on('end', () => {
    console.log('客户端断开连接');
  });
});

server.listen(8080, () => {
  console.log('TCP 服务器正在监听端口 8080');
});
```


###### 使用 `dgram` 模块创建 UDP 服务器
```javascript
const dgram = require('dgram');
const server = dgram.createSocket('udp4');

server.on('listening', () => {
  const address = server.address();
  console.log(`UDP 服务器正在监听 ${address.address}:${address.port}`);
});

server.on('message', (msg, rinfo) => {
  console.log(`收到消息: ${msg} 来自 ${rinfo.address}:${rinfo.port}`);
  server.send('你好，UDP 客户端', rinfo.port, rinfo.address);
});

server.bind(41234);
```


#### 3. **WebSocket 与 Socket 的区别**

| 特性           | WebSocket                          | Socket (TCP/UDP)                   |
| -------------- | ---------------------------------- | ---------------------------------- |
| **协议类型**   | WebSocket 协议                     | TCP 或 UDP 协议                    |
| **通信方式**   | 全双工、持久连接                   | TCP：可靠、面向连接；UDP：不可靠、无连接 |
| **适用场景**   | 实时双向通信（如聊天、数据推送）   | TCP：可靠通信；UDP：低延迟通信     |
| **实现复杂度** | 较高（依赖库简化）                 | 较低（内置模块直接使用）           |
| **兼容性**     | 需要浏览器支持 WebSocket            | 内置模块，跨平台兼容性好           |

#### 4. **总结**

- **WebSocket** 是一种现代的、高效的双向通信协议，特别适合需要实时交互的应用场景。常用的库有 `ws` 和 `socket.io`，其中 `socket.io` 提供了更多的功能和更好的兼容性。
- **Socket（TCP/UDP）** 提供了更低级别的网络通信能力，适用于需要精细控制网络行为的场景。Node.js 内置的 `net` 和 `dgram` 模块可以直接用于创建 TCP 和 UDP 服务器。
