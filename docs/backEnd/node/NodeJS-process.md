---
title: NodeJS之process模块
date: 2019-8-28
categories: 
- 后端
tags: 
- Node
- JS
---

### `process` 模块详解

`process` 是 Node.js 中的一个全局对象，提供了与当前进程相关的属性和方法。它允许你访问系统信息、环境变量、标准输入输出流等，并且可以控制进程的行为（如退出、捕获信号等）。虽然 `process` 是一个全局对象，但你可以通过 `require('process')` 显式引入它。

#### 1. **常用属性**

##### 1.1 系统信息
- **`process.arch`**：返回操作系统的 CPU 架构（例如 `'x64'`、`'arm'`）。
- **`process.platform`**：返回操作系统平台（例如 `'win32'`、`'linux'`、`'darwin'`）。
- **`process.version`**：返回 Node.js 的版本号。
- **`process.versions`**：返回一个包含 Node.js 及其依赖库版本的对象。
- **`process.memoryUsage()`**：返回一个包含当前进程内存使用情况的对象（单位为字节），包括 `rss`（常驻集大小）、`heapTotal`（堆的总大小）、`heapUsed`（已使用的堆大小）等。

##### 1.2 环境变量
- **`process.env`**：返回一个包含环境变量的对象。可以通过它读取或设置环境变量。
  ```javascript
  console.log(process.env.NODE_ENV); // 读取环境变量
  process.env.MY_VAR = 'value';      // 设置环境变量
  ```


##### 1.3 进程 ID 和父进程 ID
- **`process.pid`**：返回当前进程的 PID（进程标识符）。
- **`process.ppid`**：返回父进程的 PID。

##### 1.4 文件路径
- **`process.cwd()`**：返回当前工作目录。
- **`process.chdir(directory)`**：更改当前工作目录。
- **`__dirname`** 和 **`__filename`**：分别返回当前模块所在的目录名和文件名（全局变量）。

#### 2. **常用方法**

##### 2.1 标准输入输出流
- **`process.stdin`**：标准输入流（可读流）。
- **`process.stdout`**：标准输出流（可写流）。
- **`process.stderr`**：标准错误流（可写流）。

```javascript
process.stdin.on('data', (chunk) => {
  console.log(`收到输入: ${chunk.toString()}`);
});

process.stdout.write('你好，世界\n');
process.stderr.write('这是一个错误消息\n');
```


##### 2.2 退出进程
- **`process.exit([code])`**：立即退出进程，可选参数 `code` 表示退出状态码，默认为 0（成功）。
  ```javascript
  if (someCondition) {
    console.error('发生错误，退出');
    process.exit(1);
  }
  ```


##### 2.3 捕获信号
- **`process.on('SIGINT', callback)`**：监听中断信号（通常由 Ctrl+C 触发）。
- **`process.on('SIGTERM', callback)`**：监听终止信号（通常由 `kill` 命令触发）。
- **`process.on('uncaughtException', callback)`**：监听未捕获的异常。

```javascript
process.on('SIGINT', () => {
  console.log('收到 SIGINT 信号，正在退出...');
  process.exit();
});

process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err.message);
  process.exit(1);
});
```


#### 3. **事件**

`process` 对象是一个事件发射器（EventEmitter），可以监听多种事件：

- **`exit`**：当进程即将退出时触发。
- **`beforeExit`**：在 Node.js 空闲并准备退出之前触发，但不一定是因为正常退出。
- **`uncaughtException`**：当抛出未捕获的异常时触发。
- **`unhandledRejection`**：当 Promise 被拒绝且没有处理时触发。
- **`warning`**：当发出警告时触发。

```javascript
process.on('exit', (code) => {
  console.log(`进程即将退出，退出码: ${code}`);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的拒绝:', reason);
});
```


#### 4. **示例代码**

##### 4.1 获取系统信息
```javascript
console.log('CPU架构:', process.arch);
console.log('操作系统平台:', process.platform);
console.log('Node.js 版本:', process.version);
console.log('内存使用情况:', process.memoryUsage());
```


##### 4.2 处理命令行参数
```javascript
const args = process.argv.slice(2); // 忽略前两个默认参数（node 和脚本路径）

if (args.length > 0) {
  console.log('命令行参数:', args.join(' '));
} else {
  console.log('没有提供命令行参数');
}
```


##### 4.3 捕获键盘输入
```javascript
process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  const chunk = process.stdin.read();
  if (chunk !== null) {
    console.log(`收到输入: ${chunk}`);
  }
});

process.stdin.on('end', () => {
  console.log('输入结束');
});
```


#### 5. **总结**

`process` 模块是 Node.js 中非常重要的工具，提供了丰富的功能来管理和控制当前进程。通过掌握 `process` 的属性和方法，你可以更好地理解应用程序的运行环境，处理各种进程级别的任务（如读取环境变量、捕获信号、管理内存等），并确保应用的健壮性和可靠性。
