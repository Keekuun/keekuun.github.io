---
title: NodeJS之zlib压缩模块
date: 2019-8-27
categories: 
- 后端
tags: 
- Node
- JS
---

### Node.js 中的 `zlib` 压缩模块

`zlib` 是 Node.js 内置的一个用于压缩和解压缩数据的模块。它支持多种压缩算法，如 Gzip、Deflate 和 Brotli，并提供了流式处理的能力，非常适合处理大文件或实时数据流。

#### 1. **常用方法**

##### 1.1 压缩方法
- **`zlib.deflate()`**：使用 Deflate 算法进行压缩。
- **`zlib.gzip()`**：使用 Gzip 算法进行压缩。
- **`zlib.brotliCompress()`**：使用 Brotli 算法进行压缩（Node.js 12+ 支持）。

##### 1.2 解压缩方法
- **`zlib.inflate()`**：解压 Deflate 格式的压缩数据。
- **`zlib.gunzip()`**：解压 Gzip 格式的压缩数据。
- **`zlib.brotliDecompress()`**：解压 Brotli 格式的压缩数据（Node.js 12+ 支持）。

#### 2. **同步与异步操作**

`zlib` 模块提供同步和异步两种方式来处理压缩和解压缩操作。

##### 2.1 异步操作
```javascript
const zlib = require('zlib');
const fs = require('fs');

// 异步压缩文件
fs.createReadStream('input.txt')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('input.txt.gz'))
  .on('finish', () => {
    console.log('文件已成功压缩为 input.txt.gz');
  });

// 异步解压缩文件
fs.createReadStream('input.txt.gz')
  .pipe(zlib.createGunzip())
  .pipe(fs.createWriteStream('output.txt'))
  .on('finish', () => {
    console.log('文件已成功解压缩为 output.txt');
  });
```


##### 2.2 同步操作
```javascript
const zlib = require('zlib');

// 同步压缩字符串
const input = '这是一个测试字符串';
const compressed = zlib.gzipSync(input);
console.log('压缩后的数据:', compressed.toString('base64'));

// 同步解压缩字符串
const decompressed = zlib.gunzipSync(compressed);
console.log('解压缩后的数据:', decompressed.toString());
```


#### 3. **流式处理**

`zlib` 模块特别适合处理大文件或实时数据流，因为它可以逐块处理数据，而不需要将整个文件加载到内存中。

##### 3.1 使用流进行压缩
```javascript
const zlib = require('zlib');
const fs = require('fs');

const gzip = zlib.createGzip();
const inputStream = fs.createReadStream('largefile.txt');
const outputStream = fs.createWriteStream('largefile.txt.gz');

inputStream.pipe(gzip).pipe(outputStream)
  .on('finish', () => {
    console.log('大文件已成功压缩');
  });
```


##### 3.2 使用流进行解压缩
```javascript
const zlib = require('zlib');
const fs = require('fs');

const gunzip = zlib.createGunzip();
const inputStream = fs.createReadStream('largefile.txt.gz');
const outputStream = fs.createWriteStream('largefile.txt');

inputStream.pipe(gunzip).pipe(outputStream)
  .on('finish', () => {
    console.log('大文件已成功解压缩');
  });
```


#### 4. **选项配置**

`zlib` 的压缩和解压缩方法接受一个可选的选项对象，用于调整压缩级别、窗口大小等参数。

```javascript
const options = {
  level: zlib.Z_BEST_SPEED, // 压缩级别，范围从 Z_NO_COMPRESSION 到 Z_BEST_COMPRESSION
  windowBits: 15,           // 窗口大小，默认为 15
  memLevel: 8,              // 内存使用级别，默认为 8
  strategy: zlib.Z_DEFAULT_STRATEGY // 压缩策略，默认为 Z_DEFAULT_STRATEGY
};

const compressed = zlib.gzipSync('测试字符串', options);
console.log('压缩后的数据:', compressed.toString('base64'));
```


#### 5. **常见用例**

##### 5.1 HTTP 响应压缩
在 Express 应用中，可以使用 `compression` 中间件来自动压缩响应内容：

```javascript
const express = require('express');
const compression = require('compression');

const app = express();
app.use(compression());

app.get('/', (req, res) => {
  res.send('这是一个被压缩的响应');
});

app.listen(3000, () => {
  console.log('服务器正在监听端口 3000');
});
```


##### 5.2 文件传输压缩
在文件传输过程中，使用 `zlib` 进行压缩可以显著减少传输时间和带宽消耗：

```javascript
const http = require('http');
const zlib = require('zlib');
const fs = require('fs');

const server = http.createServer((req, res) => {
  if (req.url === '/largefile') {
    const fileStream = fs.createReadStream('largefile.txt');
    const gzip = zlib.createGzip();

    res.writeHead(200, {
      'Content-Encoding': 'gzip',
      'Content-Type': 'text/plain'
    });

    fileStream.pipe(gzip).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(8080, () => {
  console.log('HTTP 服务器正在监听端口 8080');
});
```


#### 6. **总结**

`zlib` 模块是 Node.js 中非常强大的工具，提供了多种压缩和解压缩方法，支持流式处理，适用于各种场景。通过合理使用 `zlib`，你可以有效地减小文件大小、优化网络传输性能，并提升应用的整体效率。
