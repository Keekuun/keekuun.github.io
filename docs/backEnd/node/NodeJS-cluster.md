---
title: NodeJS之cluster
date: 2019-8-27
categories: 
- 后端
tags: 
- Node
- JS
---

## why
nodejs 无法 使用多核CPU，只能使用单核CPU，但是nodejs提供了cluster模块，可以创建多个子进程，实现多核CPU的利用，从而提高nodejs的性能。

## how
### `cluster` 模块的使用方法

`cluster` 模块是 Node.js 提供的一个内置模块，用于创建多进程应用程序，从而充分利用多核 CPU 的性能。通过 `cluster`，你可以创建多个工作进程（worker），这些工作进程可以共享同一个端口，处理网络请求等任务。

#### 1. **基本概念**

- **主进程（Master Process）**：负责管理和启动工作进程。
- **工作进程（Worker Process）**：实际处理客户端请求的工作单元。

#### 2. **为什么需要 `cluster`？**

- **充分利用多核 CPU**：Node.js 是单线程的，只能利用一个 CPU 核心。通过 `cluster`，可以在多核系统上启动多个工作进程，从而提高应用的性能和吞吐量。
- **负载均衡**：`cluster` 模块会自动将传入的连接分发给不同的工作进程，实现简单的负载均衡。

#### 3. **使用步骤**

##### 3.1 引入 `cluster` 模块
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
```


##### 3.2 判断是否为主进程
```javascript
if (cluster.isPrimary) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 叉出工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
    // 可以选择重新启动新的工作进程
    cluster.fork();
  });
} else {
  // 工作进程代码
  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`你好，我是工作进程 ${process.pid}\n`);
  });

  server.listen(3000);
  console.log(`工作进程 ${process.pid} 已启动`);
}
```


##### 3.3 完整示例
```javascript
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

if (cluster.isPrimary) {
  console.log(`主进程 ${process.pid} 正在运行`);

  // 叉出工作进程
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`工作进程 ${worker.process.pid} 已退出`);
    // 重新启动新的工作进程
    cluster.fork();
  });
} else {
  // 工作进程代码
  const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end(`你好，我是工作进程 ${process.pid}\n`);
  });

  server.listen(3000);
  console.log(`工作进程 ${process.pid} 已启动`);
}
```


#### 4. **关键方法和事件**

- **`cluster.fork()`**：创建并启动一个新的工作进程。
- **`cluster.isPrimary`**：判断当前进程是否为主进程。
- **`cluster.on('exit', callback)`**：监听工作进程退出事件，可以选择重启新的工作进程。
- **`worker.disconnect()`**：断开工作进程与主进程的连接。
- **`worker.kill()`**：强制终止工作进程。

#### 5. **注意事项**

- **资源共享**：所有工作进程共享同一份代码和配置文件，但它们有独立的内存空间。
- **负载均衡**：`cluster` 模块默认使用轮询算法来分配连接到不同的工作进程。
- **错误处理**：确保正确处理工作进程的退出事件，避免因某个工作进程崩溃而导致整个应用不可用。

#### 6. **高级用法**

##### 6.1 主进程与工作进程通信
可以通过消息传递机制在主进程和工作进程之间进行通信：

```javascript
// 主进程发送消息给所有工作进程
Object.keys(cluster.workers).forEach(id => {
  cluster.workers[id].send({ action: 'message', content: 'Hello from master' });
});

// 工作进程接收消息
process.on('message', msg => {
  console.log(`收到消息: ${msg.content}`);
});
```


##### 6.2 动态调整工作进程数量
可以根据服务器负载动态调整工作进程的数量：

```javascript
if (cluster.isPrimary) {
  let workerCount = numCPUs;

  setInterval(() => {
    // 根据某些条件调整 workerCount
    if (shouldIncreaseWorkers()) {
      cluster.fork();
      workerCount++;
    } else if (shouldDecreaseWorkers() && workerCount > 1) {
      Object.keys(cluster.workers)[0].kill();
      workerCount--;
    }
  }, 1000);
}
```


#### 7. **总结**

`cluster` 模块为 Node.js 应用提供了强大的多进程支持，能够有效利用多核 CPU 提高应用性能。通过合理使用 `cluster`，你可以构建更加高效、可靠的网络服务。
