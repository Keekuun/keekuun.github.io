---
title: NodeJS之child_process
date: 2019-8-28
categories:
  - 后端
tags:
  - Node
  - JS
---

## why

js语言单线程、非阻塞IO, 适合IO密集型应用，不适合计算密集型应用。

+ 单线程模型：

JavaScript 使用单线程模型来执行代码，这意味着同一时间只能执行一个任务。
这种设计简化了编程模型，避免了多线程编程中常见的复杂性和潜在的错误（如死锁、竞态条件等）。

+ 非阻塞 IO：

在 Node.js 中，I/O 操作（例如文件读写、网络请求等）是非阻塞的。这些操作不会阻塞主线程，而是通过事件循环机制在后台异步执行。
当 I/O 操作完成时，会触发相应的回调函数继续处理结果。

+ 适合 IO 密集型应用：

由于非阻塞 IO 的特性，Node.js 非常适合处理大量并发的 I/O 操作，如 Web 服务器、实时通信应用等。
在这些场景中，大部分时间都花在等待 I/O 操作完成上，而不是 CPU 计算，因此单线程模型不会成为瓶颈。

+ 不适合计算密集型应用：

对于需要大量 CPU 计算的任务（如图像处理、复杂的数学运算等），JavaScript 的单线程模型会导致性能问题。
计算密集型任务会占用大量 CPU 时间，导致其他任务无法及时响应，从而影响整体性能。

+ 不能完全占满 CPU：

由于 JavaScript 是单线程的，它在同一时间只能利用一个 CPU 核心。对于多核 CPU，JavaScript 程序无法充分利用所有核心的计算能力。
这意味着在多核系统上，JavaScript 程序可能无法达到最高的 CPU 利用率。

## how

如果你的应用中有计算密集型任务，可以考虑以下几种解决方案：

### 使用 Worker Threads：

Node.js 提供了 worker_threads 模块，允许你在同一个进程中创建多个线程来处理计算密集型任务。
这样可以充分利用多核 CPU，提高计算效率。

```js
  const {Worker, isMainThread, parentPort} = require('worker_threads');

if (isMainThread) {
    const worker = new Worker(__filename);
    worker.on('message', (result) => console.log(result));
} else {
    // 执行计算密集型任务
    const result = performExpensiveCalculation();
    parentPort.postMessage(result);
}

function performExpensiveCalculation() {
    let sum = 0;
    for (let i = 0; i < 1e9; i++) {
        sum += i;
    }
    return sum;
}

```

### 使用 Child Processes：

可以通过 child_process 模块创建子进程来处理计算密集型任务。
子进程可以在不同的进程中运行，从而充分利用多核 CPU。

```js
const {spawn, fork, exec, execFile} = require('child_process');
```

1. spawn
    + 用途：用于启动一个新的进程，并通过**流的方式**与该进程通信。
    + 特点：
      适合长时间运行的进程或需要实时处理输出的场景。

   可以逐行读取子进程的标准输出（`stdout`）和标准错误（`stderr`），因此非常适合处理大量数据。
   子进程的标准输入（`stdin`）、标准输出（`stdout`）和标准错误（`stderr`）可以通过流进行交互。
    + 示例：

```js
const {spawn} = require('child_process');
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
});

ls.on('close', (code) => {
    console.log(`子进程退出，退出码 ${code}`);
});

```

2. fork
    + 用途：专门用于创建新的 Node.js 进程，并且可以方便地与父进程通信。
    + 特点：
      创建的子进程也是一个 Node.js 进程，因此可以直接使用 Node.js API。
      提供了更高级别的通信机制，如消息传递（通过 `process.send` 和 `process.on('message')`）。
      适合需要与父进程频繁通信的场景。
    + 示例：

```js
  // 父进程
const {fork} = require('child_process');
const child = fork('./child.js');

child.send({hello: 'world'});

child.on('message', (msg) => {
    console.log('收到消息:', msg);
});

// child.js 文件内容
process.on('message', (msg) => {
    console.log('收到消息:', msg);
    process.send({response: 'acknowledged'});
});
```

3. exec
    + 用途：用于**执行命令行命令**，并将整个输出作为**字符串**返回。
    + 特点：
      适合简单的命令行操作，尤其是那些不需要实时处理输出的场景。
      将整个输出缓冲到内存中，因此不适合处理大量数据，可能会导致内存溢出。
      适用于一次性的命令执行，例如调用系统命令或脚本。
    + 示例：

```js
  const {exec} = require('child_process');

exec('ls -lh /usr', (error, stdout, stderr) => {
    if (error) {
        console.error(`执行出错: ${error.message}`);
        return;
    }

    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});

```

4. execFile
    + 用途
        - 直接执行文件：execFile 直接调用指定的可执行文件或脚本文件，而不是通过 shell 来解释命令。
        - 避免 shell 注入风险：由于不通过 shell，减少了潜在的安全风险，特别是当输入包含用户提供的数据时。
        - 更高效：不需要启动额外的 shell 进程，因此性能更高。
    + 特点
        - 参数传递：可以直接传递命令行参数给目标文件。
        - 回调函数：执行完成后会调用回调函数，并提供标准输出、标准错误和退出码。
        - 适用于一次性任务：适合执行一次性的命令或脚本，尤其是那些不需要实时处理输出的场景。
    + 示例：

```js
const {execFile} = require('child_process');

// 执行 node script.js 并传递参数
execFile('node', ['script.js', 'arg1', 'arg2'], (error, stdout, stderr) => {
    if (error) {
        console.error(`执行出错: ${error.message}`);
        return;
    }

    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }

    console.log(`stdout: ${stdout}`);
});

```

5. 总结

+ spawn：适合长时间运行的进程，支持流式处理输出，适合处理大量数据。
+ fork：专门用于创建 Node.js 子进程，提供高效的进程间通信机制。
+ exec：适合简单的命令行操作，输出作为字符串返回，不适合处理大量数据。
+ execFile：直接执行文件，避免 shell 注入风险，更高效。

> [Node.js 的进程管理](https://blog.shenfq.com/2018/node-js-%E7%9A%84%E8%BF%9B%E7%A8%8B%E7%AE%A1%E7%90%86/)
>
> [NodeJS多进程](https://geekdaxue.co/read/baiyueguang-rfnbu@tr4d0i/efoxkb)
