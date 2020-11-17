---
title: 【Node】NodeJS之stream模块学习笔记
date: 2019-9-2
categories: 
- 后端
tags: 
- Node
- JS
---

# NodeJS之stream模块学习笔记

## 1.stream（流）模块简介

流（stream）是 Node.js 中处理流式数据的抽象接口。 `stream` 模块用于构建实现了流接口的对象。

Node.js 提供了多种流对象。 例如，[HTTP 服务器的请求](http://nodejs.cn/s/2RqpEw)和 [`process.stdout`](http://nodejs.cn/s/tQWUzG) 都是流的实例。

流可以是可读的、可写的、或者可读可写的。 所有的流都是 [`EventEmitter`](http://nodejs.cn/s/pGAddE) 的实例。

访问 `stream` 模块：

```js
const stream = require('stream');
```

尽管理解流的工作方式很重要，但是 `stream` 模块主要用于开发者创建新类型的流实例。 对于以消费流对象为主的开发者，极少需要直接使用 `stream` 模块。

## 2. 流的类型

Node.js 中有四种基本的流类型：

- [`Writable`](http://nodejs.cn/s/9JUnJ8) - 可写入数据的流（例如 [`fs.createWriteStream()`](http://nodejs.cn/s/VdSJQa)）。
- [`Readable`](http://nodejs.cn/s/YuDKX1) - 可读取数据的流（例如 [`fs.createReadStream()`](http://nodejs.cn/s/wiVPXD)）。
- [`Duplex`](http://nodejs.cn/s/2iRabr) - 可读又可写的流（例如 [`net.Socket`](http://nodejs.cn/s/wsJ1o1)）。
- [`Transform`](http://nodejs.cn/s/fhVJQM) - 在读写过程中可以修改或转换数据的 `Duplex` 流（例如 [`zlib.createDeflate()`](http://nodejs.cn/s/n6ED45)）。

此外，该模块还包括实用函数 [`stream.pipeline()`](http://nodejs.cn/s/kGvtzK)、[`stream.finished()`](http://nodejs.cn/s/DjDduq) 和 [`stream.Readable.from()`](http://nodejs.cn/s/bSCxhZ)。

## 3.可写流 `stream.Writable` 

可写流是对数据要被写入的目的地的一种抽象。

可写流的例子包括：

- [客户端的 HTTP 请求](http://nodejs.cn/s/2F5RHd)
- [服务器的 HTTP 响应](http://nodejs.cn/s/rMXoZ1)
- [fs 的写入流](http://nodejs.cn/s/2uZDVA)
- [zlib 流](http://nodejs.cn/s/duYbh2)
- [crypto 流](http://nodejs.cn/s/FuEfsg)
- [TCP socket](http://nodejs.cn/s/wsJ1o1)
- [子进程 stdin](http://nodejs.cn/s/Su8gEr)
- [`process.stdout`](http://nodejs.cn/s/tQWUzG)、[`process.stderr`](http://nodejs.cn/s/wPv5zY)

上面的一些例子事实上是实现了可写流接口的 [`Duplex`](http://nodejs.cn/s/2iRabr) 流。

所有可写流都实现了 `stream.Writable` 类定义的接口。

尽管可写流的具体实例可能略有差别，但所有的可写流都遵循同一基本的使用模式，如以下例子所示：

```js
const myStream = getWritableStreamSomehow();
myStream.write('一些数据');
myStream.write('更多数据');
myStream.end('完成写入数据');
```

### 3.1 `stream.Writable` 事件

| 事件名称 | 说明                                                         |
| -------- | ------------------------------------------------------------ |
| `close`  | 当流或其底层资源（比如文件描述符）被关闭时触发。 表明不会再触发其他事件，也不会再发生操作。如果使用 `emitClose` 选项创建[可写流](http://nodejs.cn/s/9JUnJ8)，则它将会始终发出 `'close'` 事件。 |
| `drain`  | 如果调用 [`stream.write(chunk)`](http://nodejs.cn/s/doppiK) 返回 `false`，则当可以继续写入数据到流时会触发 `'drain'` 事件。 |
| `error`  | 如果在写入或管道数据时发生错误，则会触发 `'error'` 事件。 当调用时，监听器回调会传入一个 `Error` 参数。除非在创建流时将 [`autoDestroy`](http://nodejs.cn/s/u7KYa2) 选项设置为 `false`，否则在触发 `'error'` 事件时流会被关闭。在 `'error'` 之后，除 `'close'` 事件外，不应再触发其他事件（包括 `'error'` 事件）。 |
| `finish` | 调用 [`stream.end()`](http://nodejs.cn/s/nvArK4) 且缓冲数据都已传给底层系统之后触发。 |
| `pipe`   | 当在可读流上调用 [`stream.pipe()`](http://nodejs.cn/s/Ea2ZNW) 方法时会发出 `'pipe'` 事件，并将此可写流添加到其目标集。 |
| `unpipe` | 在可读流上调用 [`stream.unpipe()`](http://nodejs.cn/s/35GqHX) 方法时会发出 `'unpipe'`事件，从其目标集中移除此可写流。当可读流通过管道流向可写流发生错误时，也会触发此事件。 |

### 3.2 `stream.Writable`方法

+ `writable.cork()`：强制把所有写入的数据都缓冲到内存中。 当调用 [`stream.uncork()`](http://nodejs.cn/s/2Bzt8L) 或 [`stream.end()`](http://nodejs.cn/s/nvArK4) 方法时，缓冲的数据才会被输出。

+ `writable.destroy([error])`：销毁流。 可选地触发 `error`，并且触发 `'close'` 事件（除非将 `emitClose` 设置为 `false`）。

  + `error` [Error](http://nodejs.cn/s/qZ873x) 可选，使用 `'error'` 事件触发的错误。
  + 返回: [this](http://nodejs.cn/s/v7Fsu2)

+ `writable.destroyed` : boolean 在调用了 [`writable.destroy()`](http://nodejs.cn/s/tLkQ7J) 之后为 `true`。

+ `writable.end([chunk[, encoding]][, callback])`:调用 `writable.end()` 表明已没有数据要被写入[可写流](http://nodejs.cn/s/9JUnJ8)。 可选的 `chunk` 和 `encoding` 参数可以在关闭流之前再写入一块数据。 如果传入了 `callback` 函数，则会做为监听器添加到 [`'finish'`](http://nodejs.cn/s/VBJRc8) 事件和 `'error'` 事件。

  + `chunk` [string](http://nodejs.cn/s/9Tw2bK) | [Buffer](http://nodejs.cn/s/6x1hD3) | [Uint8Array](http://nodejs.cn/s/ZbDkpm) | [any](http://nodejs.cn/s/6sTGdS) 要写入的数据。 对于非对象模式的流， `chunk` 必须是字符串、 `Buffer`、或 `Uint8Array`。 对于对象模式的流， `chunk` 可以是任何 JavaScript 值，除了 `null`。
  + `encoding` [string](http://nodejs.cn/s/9Tw2bK) 如果 `chunk` 是字符串，则指定字符编码。
  + `callback` [function](http://nodejs.cn/s/ceTQa6) 当流结束或报错时的回调函数。
  + 返回: [this](http://nodejs.cn/s/v7Fsu2)

  调用 [`stream.end()`](http://nodejs.cn/s/nvArK4) 之后再调用 [`stream.write()`](http://nodejs.cn/s/doppiK) 会导致错误。

  ```js
  // 先写入 'hello, '，结束前再写入 'world!'。
  const fs = require('fs');
  const file = fs.createWriteStream('例子.txt');
  file.write('hello, ');
  file.end('world!');
  // 后面不允许再写入数据！
  ```

+ `writable.setDefaultEncoding(encoding)`为[可写流](http://nodejs.cn/s/9JUnJ8)设置默认的 `encoding`。返回：this

+ `writable.uncork()`调用 [`stream.cork()`](http://nodejs.cn/s/HbaGHW) 后缓冲的所有数据输出到目标。

  当使用 [`writable.cork()`](http://nodejs.cn/s/HbaGHW) 和 `writable.uncork()` 来管理流的写入缓冲时，建议使用 `process.nextTick()` 来延迟调用 `writable.uncork()`。 通过这种方式，可以对单个 Node.js 事件循环中调用的所有 `writable.write()` 进行批处理。

  ```js
  stream.cork();
  stream.write('一些 ');
  stream.write('数据 ');
  process.nextTick(() => stream.uncork());
  ```

  如果一个流上多次调用 [`writable.cork()`](http://nodejs.cn/s/HbaGHW)，则必须调用同样次数的 `writable.uncork()` 才能输出缓冲的数据。

  ```js
  stream.cork();
  stream.write('一些 ');
  stream.cork();
  stream.write('数据 ');
  process.nextTick(() => {
    stream.uncork();
    // 数据不会被输出，直到第二次调用 uncork()。
    stream.uncork();
  });
  ```

+ `writable.write(chunk[, encoding][, callback])`

  - `chunk`  [string](http://nodejs.cn/s/9Tw2bK) | [Buffer](http://nodejs.cn/s/6x1hD3) | [Uint8Array](http://nodejs.cn/s/ZbDkpm) | [any](要写入的数据。  对于非对象模式的流， `chunk` 必须是字符串、 `Buffer` 或 `Uint8Array`。 对于对象模式的流， `chunk` 可以是任何 JavaScript 值，除了 `null`。
  - `encoding` [string](http://nodejs.cn/s/9Tw2bK) 如果 `chunk` 是字符串，则指定字符编码。
  - `callback` [function](http://nodejs.cn/s/ceTQa6) 当数据块被输出到目标后的回调函数。
  - 返回: [boolean](http://nodejs.cn/s/jFbvuT) 如果流需要等待 `'drain'` 事件触发才能继续写入更多数据，则返回 `false`，否则返回 `true`。

  `writable.write()` 写入数据到流，并在数据被完全处理之后调用 `callback`。 如果发生错误，则 `callback` 可能被调用也可能不被调用。 为了可靠地检测错误，可以为 `'error'` 事件添加监听器。 `callback` 会在触发 `'error'` 之前被异步地调用。

  在接收了 `chunk` 后，如果内部的缓冲小于创建流时配置的 `highWaterMark`，则返回 `true` 。 如果返回 `false` ，则应该停止向流写入数据，直到 [`'drain'`](http://nodejs.cn/s/gFdjtJ) 事件被触发。

  当流还未被排空时，调用 `write()` 会缓冲 `chunk`，并返回 `false`。 一旦所有当前缓冲的数据块都被排空了（被操作系统接收并传输），则触发 `'drain'` 事件。 建议一旦 `write()` 返回 false，则不再写入任何数据块，直到 `'drain'` 事件被触发。 当流还未被排空时，也是可以调用 `write()`，Node.js 会缓冲所有被写入的数据块，直到达到最大内存占用，这时它会无条件中止。 甚至在它中止之前， 高内存占用将会导致垃圾回收器的性能变差和 RSS 变高（即使内存不再需要，通常也不会被释放回系统）。 如果远程的另一端没有读取数据，TCP 的 socket 可能永远也不会排空，所以写入到一个不会排空的 socket 可能会导致远程可利用的漏洞。

  对于 [`Transform`](http://nodejs.cn/s/fhVJQM), 写入数据到一个不会排空的流尤其成问题，因为 `Transform` 流默认会被暂停，直到它们被 pipe 或者添加了 `'data'` 或 `'readable'` 事件句柄。

  如果要被写入的数据可以根据需要生成或者取得，建议将逻辑封装为一个[可读流](http://nodejs.cn/s/YuDKX1)并且使用 [`stream.pipe()`](http://nodejs.cn/s/Ea2ZNW)。 如果要优先调用 `write()`，则可以使用 [`'drain'`](http://nodejs.cn/s/gFdjtJ) 事件来防止背压与避免内存问题:

  ```js
  function write(data, cb) {
    if (!stream.write(data)) {
      stream.once('drain', cb);
    } else {
      process.nextTick(cb);
    }
  }
  
  // 在回调函数被执行后再进行其他的写入。
  write('hello', () => {
    console.log('完成写入，可以进行更多的写入');
  });
  ```

  对象模式下的可写流将会始终忽略 `encoding` 参数。

## 4.可读流 `stream.Readable`

可读流是对提供数据的来源的一种抽象。

可读流的例子包括：

- [客户端的 HTTP 响应](http://nodejs.cn/s/2RqpEw)
- [服务器的 HTTP 请求](http://nodejs.cn/s/2RqpEw)
- [fs 的读取流](http://nodejs.cn/s/C3Eioq)
- [zlib 流](http://nodejs.cn/s/duYbh2)
- [crypto 流](http://nodejs.cn/s/FuEfsg)
- [TCP socket](http://nodejs.cn/s/wsJ1o1)
- [子进程 stdout 与 stderr](http://nodejs.cn/s/F2vs59)
- [`process.stdin`](http://nodejs.cn/s/gagmJq)

所有[可读流](http://nodejs.cn/s/YuDKX1)都实现了 `stream.Readable` 类定义的接口。

### 4.1 两种读取模式

+ 流动模式（flowing）：数据自动从底层系统读取，并通过 [`EventEmitter`](http://nodejs.cn/s/pGAddE) 接口的事件尽可能快地被提供给应用程序。
+ 暂停模式（paused）：必须显式调用 [`stream.read()`](http://nodejs.cn/s/SpgRaa) 读取数据块。

所有[可读流](http://nodejs.cn/s/YuDKX1)都开始于暂停模式，可以通过以下方式切换到**流动模式**：

- 添加 [`'data'`](http://nodejs.cn/s/8CCPjN) 事件句柄。
- 调用 [`stream.resume()`](http://nodejs.cn/s/Zhf28N) 方法。
- 调用 [`stream.pipe()`](http://nodejs.cn/s/Ea2ZNW) 方法将数据发送到[可写流](http://nodejs.cn/s/9JUnJ8)。

可读流可以通过以下方式切换回**暂停模式**：

- 如果没有管道目标，则调用 [`stream.pause()`](http://nodejs.cn/s/jqytVw)。
- 如果有管道目标，则移除所有管道目标。调用 [`stream.unpipe()`](http://nodejs.cn/s/35GqHX) 可以移除多个管道目标。

### 4.2 三种状态

在任意时刻，可读流会处于以下三种状态之一：

- `readable.readableFlowing === null`
- `readable.readableFlowing === false`
- `readable.readableFlowing === true`

当 `readable.readableFlowing` 为 `null` 时，没有提供消费流数据的机制，所以流不会产生数据。 在这个状态下，监听 `'data'` 事件、调用 `readable.pipe()`、或调用 `readable.resume()` 都会使 `readable.readableFlowing` 切换到 `true`，可读流开始主动地产生数据并触发事件。

调用 `readable.pause()`、 `readable.unpipe()`、或接收到背压，则 `readable.readableFlowing` 会被设为 `false`，暂时停止事件流动但不会停止数据的生成。 在这个状态下，为 `'data'` 事件绑定监听器不会使 `readable.readableFlowing` 切换到 `true`。

```js
const { PassThrough, Writable } = require('stream');
const pass = new PassThrough();
const writable = new Writable();

pass.pipe(writable);
pass.unpipe(writable);
// readableFlowing 现在为 false。

pass.on('data', (chunk) => { console.log(chunk.toString()); });
pass.write('ok'); // 不会触发 'data' 事件。
pass.resume(); // 必须调用它才会触发 'data' 事件。
```

当 `readable.readableFlowing` 为 `false` 时，数据可能会堆积在流的内部缓冲中。

### 4.3 `stream.Readable`事件

| 事件名称   | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| `close`    | 流或其底层资源（比如文件描述符）被关闭时触发 `'close'` 事件。 该事件表明不会再触发其他事件，也不会再发生操作。如果使用 `emitClose` 选项创建[可读流](http://nodejs.cn/s/YuDKX1)，则它将会始终发出 `'close'` 事件。 |
| `data`     | 当流将数据块传送给消费者后触发。 当调用 `readable.pipe()`， `readable.resume()` 或绑定监听器到 `'data'` 事件时，流会转换到流动模式。 当调用 `readable.read()` 且有数据块返回时，也会触发 `'data'` 事件。将 `'data'` 事件监听器附加到尚未显式暂停的流将会使流切换为流动模式。 数据将会在可用时立即传递。 |
| `end`      | 当流中没有数据可供消费时触发。`'end'` 事件只有在数据被完全消费掉后才会触发。 要想触发该事件，可以将流转换到流动模式，或反复调用 [`stream.read()`](http://nodejs.cn/s/SpgRaa) 直到数据被消费完。 |
| `error`    | `'error'` 事件可能随时由 `Readable` 实现触发。 通常，如果底层的流由于底层内部的故障而无法生成数据，或者流的实现尝试推送无效的数据块，则可能会发生这种情况。监听器回调将会传入一个 `Error` 对象。 |
| `pause`    | 当调用 [`stream.pause()`](http://nodejs.cn/s/jqytVw) 并且 `readsFlowing` 不为 `false` 时，就会触发 `'pause'` 事件。 |
| `readable` | 当有数据可从流中读取时，就会触发 `'readable'` 事件。 在某些情况下，为 `'readable'` 事件附加监听器将会导致将一些数据读入内部缓冲区。 |
| `resume`   | 当调用 [`stream.resume()`](http://nodejs.cn/s/Zhf28N) 并且 `readsFlowing` 不为 `true` 时，将会触发 `'resume'` 事件。 |

```js
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`接收到 ${chunk.length} 个字节的数据`);
});
```

```js
const readable = getReadableStreamSomehow();
readable.on('data', (chunk) => {
  console.log(`接收到 ${chunk.length} 个字节的数据`);
});
readable.on('end', () => {
  console.log('已没有数据');
});
```

### 4.4 `stream.Readable`方法

+ `readable.destroy([error])`：销毁流。 可选地触发 `'error'` 事件，并触发 `'close'` 事件（除非将 `emitClose` 设置为 `false`）。 在此调用之后，可读流将会释放所有内部的资源，并且将会忽略对 `push()` 的后续调用。

  一旦调用 `destroy()`，则不会再执行任何其他操作，并且除了 `_destroy` 以外的其他错误都不会作为 `'error'` 触发。返回: [this](http://nodejs.cn/s/v7Fsu2)

+ `readable.destroyed`：在调用 [`readable.destroy()`](http://nodejs.cn/s/6VkV74) 之后为 `true`。返回: boolean

+ `readable.isPaused()`：`readable.isPaused()` 方法返回可读流当前的操作状态。 主要用于 `readable.pipe()` 底层的机制。返回: boolean

  ```js
  const readable = new stream.Readable();
  
  readable.isPaused(); // === false
  readable.pause();
  readable.isPaused(); // === true
  readable.resume();
  readable.isPaused(); // === false
  ```

+ `readable.pause()`：`readable.pause()` 方法使流动模式的流停止触发 [`'data'`](http://nodejs.cn/s/8CCPjN) 事件，并切换出流动模式。 任何可用的数据都会保留在内部缓存中。返回: [this](http://nodejs.cn/s/v7Fsu2)

  ```js
  const readable = getReadableStreamSomehow();
  readable.on('data', (chunk) => {
    console.log(`接收到 ${chunk.length} 字节的数据`);
    readable.pause();
    console.log('暂停一秒');
    setTimeout(() => {
      console.log('数据重新开始流动');
      readable.resume();
    }, 1000);
  });
  ```

  如果存在 `'readable'` 事件监听器，则 `readable.pause()` 方法不起作用。

+ `readable.pipe(destination[, options])`:

  - `destination` [stream.Writable](http://nodejs.cn/s/9JUnJ8) 数据写入的目标。
  - `options` [object](http://nodejs.cn/s/jzn6Ao) 管道选项。
    - `end` [boolean](http://nodejs.cn/s/jFbvuT) 当读取器结束时终止写入器。**默认值:** `true`。
  - 返回: [stream.Writable](http://nodejs.cn/s/9JUnJ8) 目标可写流，如果是 [`Duplex`](http://nodejs.cn/s/2iRabr) 流或 [`Transform`](http://nodejs.cn/s/fhVJQM) 流则可以形成管道链。

  `readable.pipe()` 方法绑定可写流到可读流，将可读流自动切换到流动模式，并将可读流的所有数据推送到绑定的可写流。 数据流会被自动管理，所以即使可读流更快，目标可写流也不会超负荷。

  `readable.pipe()` 会返回目标流的引用，这样就可以对流进行链式地管道操作：

  ```js
  const fs = require('fs');
  const r = fs.createReadStream('file.txt');
  const z = zlib.createGzip();
  const w = fs.createWriteStream('file.txt.gz');
  r.pipe(z).pipe(w);
  ```

  默认情况下，当来源可读流触发 [`'end'`](http://nodejs.cn/s/ZgviqU) 事件时，目标可写流也会调用 [`stream.end()`](http://nodejs.cn/s/nvArK4) 结束写入。 若要禁用这种默认行为， `end` 选项应设为 `false`，这样目标流就会保持打开：

  ```js
  reader.pipe(writer, { end: false });
  reader.on('end', () => {
    writer.end('结束');
  });
  ```

+ `readable.read([size])`:

  - `size` [number](http://nodejs.cn/s/SXbo1v) 要读取的数据的字节数。
  - 返回: [string](http://nodejs.cn/s/9Tw2bK) | [Buffer](http://nodejs.cn/s/6x1hD3) | [null](http://nodejs.cn/s/334hvC) | [any](http://nodejs.cn/s/6sTGdS)

  从内部缓冲拉取并返回数据。 如果没有可读的数据，则返回 `null`。 默认情况下， `readable.read()` 返回的数据是 `Buffer` 对象，除非使用 `readable.setEncoding()` 指定字符编码或流处于对象模式。

  可选的 `size` 参数指定要读取的特定字节数。 如果无法读取 `size` 个字节，则除非流已结束，否则将会返回 `null`，在这种情况下，将会返回内部 buffer 中剩余的所有数据。

  如果没有指定 `size` 参数，则返回内部缓冲中的所有数据。

  `size` 参数必须小于或等于 1 GB。

  `readable.read()` 应该只对处于暂停模式的可读流调用。 在流动模式中， `readable.read()` 会自动调用直到内部缓冲的数据完全耗尽。

  ```js
  const readable = getReadableStreamSomehow();
  readable.on('readable', () => {
    let chunk;
    while (null !== (chunk = readable.read())) {
      console.log(`接收到 ${chunk.length} 字节的数据`);
    }
  });
  ```

  使用 `readable.read()` 处理数据时， `while` 循环是必需的。 只有在 `readable.read()` 返回 `null` 之后，才会触发 [`'readable'`](http://nodejs.cn/s/J6CZGb)。

  对象模式下的可读流将会始终从调用 [`readable.read(size)`](http://nodejs.cn/s/SpgRaa) 返回单个子项，而不管 `size` 参数的值如何。

  如果 `readable.read()` 返回一个数据块，则 `'data'` 事件也会触发。

  在 [`'end'`](http://nodejs.cn/s/ZgviqU) 事件触发后再调用 [`stream.read([size\])`](http://nodejs.cn/s/SpgRaa) 会返回 `null`。 不会引发运行时错误。

+ `readable.readable`:如果可以安全地调用 [`readable.read()`](http://nodejs.cn/s/SpgRaa)（这意味着流没有被破坏或触发 `'error'` 或 `'end'`），则为 `true`。

+ `readable.readableEncoding`：获取用于给定可读流的 `encoding` 属性。 可以使用 [`readable.setEncoding()`](http://nodejs.cn/s/SjJGhm) 方法设置 `encoding` 属性。

+ `readable.readableEnded`： 当 [`'end'`](http://nodejs.cn/s/ZgviqU) 事件被触发时变为 `true`。

+ `readable.resume()`：返回[this](http://nodejs.cn/s/v7Fsu2)

  `readable.resume()` 方法将被暂停的可读流恢复触发 [`'data'`](http://nodejs.cn/s/8CCPjN) 事件，并将流切换到流动模式。

  `readable.resume()` 方法可以用来充分消耗流中的数据，但无需实际处理任何数据：

  ```js
  getReadableStreamSomehow()
    .resume()
    .on('end', () => {
      console.log('到达流的尽头，但无需读取任何数据');
    });
  ```

  当存在 `'readable'` 事件监听器时， `readable.resume()` 方法不起作用。

+ `readable.setEncoding(encoding)`:

  + `encoding` [string](http://nodejs.cn/s/9Tw2bK) 字符编码。
  + 返回: [this](http://nodejs.cn/s/v7Fsu2)

  `readable.setEncoding()` 方法为从可读流读取的数据设置字符编码。

  默认情况下没有设置字符编码，流数据返回的是 `Buffer` 对象。 如果设置了字符编码，则流数据返回指定编码的字符串。 例如，调用 `readable.setEncoding('utf-8')` 会将数据解析为 UTF-8 数据，并返回字符串，调用 `readable.setEncoding('hex')` 则会将数据编码成十六进制字符串。

  可读流将会正确地处理通过流传递的多字节字符，否则如果简单地从流中作为 `Buffer` 对象拉出，则会被不正确地解码。

  ```js
  const readable = getReadableStreamSomehow();
  readable.setEncoding('utf8');
  readable.on('data', (chunk) => {
    assert.equal(typeof chunk, 'string');
    console.log('读取到 %d 个字符的字符串数据', chunk.length);
  });
  ```

+ `readable.unpipe([destination])`:

  - `destination` [stream.Writable](http://nodejs.cn/s/9JUnJ8) 要移除管道的可写流。
  - 返回: [this](http://nodejs.cn/s/v7Fsu2)

  `readable.unpipe()` 方法解绑之前使用 [`stream.pipe()`](http://nodejs.cn/s/Ea2ZNW) 方法绑定的可写流。

  如果没有指定 `destination`, 则解绑所有管道.

  如果指定了 `destination`, 但它没有建立管道，则不起作用.

  ```js
  const fs = require('fs');
  const readable = getReadableStreamSomehow();
  const writable = fs.createWriteStream('file.txt');
  // 可读流的所有数据开始传输到 'file.txt'，但一秒后停止。
  readable.pipe(writable);
  setTimeout(() => {
    console.log('停止写入 file.txt');
    readable.unpipe(writable);
    console.log('手动关闭文件流');
    writable.end();
  }, 1000);
  ```

+ `readable.unshift(chunk[, encoding])`:`readable.unshift()` 方法将数据块推回内部缓冲。 

  ​	可用于以下情景：正被消费中的流需要将一些已经被拉出的数据重置为未消费状态，以便这些数据可以传给其他方。

  ​	触发 [`'end'`](http://nodejs.cn/s/ZgviqU) 事件或抛出运行时错误之后，不能再调用 `stream.unshift()` 方法。

  使用 `stream.unshift()` 的开发者可以考虑切换到 [`Transform`](http://nodejs.cn/s/fhVJQM) 流。 详见[用于实现流的API](http://nodejs.cn/s/d2EgSi)。

  ```js
  // 拉出由 \n\n 分隔的标题。
  // 如果获取太多，则使用 unshift()。
  // 使用 (error, header, stream) 调用回调。
  const { StringDecoder } = require('string_decoder');
  function parseHeader(stream, callback) {
    stream.on('error', callback);
    stream.on('readable', onReadable);
    const decoder = new StringDecoder('utf8');
    let header = '';
    function onReadable() {
      let chunk;
      while (null !== (chunk = stream.read())) {
        const str = decoder.write(chunk);
        if (str.match(/\n\n/)) {
          // 发现头部边界。
          const split = str.split(/\n\n/);
          header += split.shift();
          const remaining = split.join('\n\n');
          const buf = Buffer.from(remaining, 'utf8');
          stream.removeListener('error', callback);
          // 在调用 unshift() 前移除 'readable' 监听器。
          stream.removeListener('readable', onReadable);
          if (buf.length)
            stream.unshift(buf);
          // 现在可以从流中读取消息的主体。
          callback(null, header, stream);
        } else {
          // 继续读取头部。
          header += str;
        }
      }
    }
  }
  ```

  与 [`stream.push(chunk)`](http://nodejs.cn/s/8s3paZ) 不同， `stream.unshift(chunk)` 不会通过重置流的内部读取状态来结束读取过程。 如果在读取期间调用 `readable.unshift()`（即从自定义的流上的 [`stream._read()`](http://nodejs.cn/s/5hv4Rd) 实现中调用），则会导致意外结果。 在使用立即的 [`stream.push('')`](http://nodejs.cn/s/8s3paZ) 调用 `readable.unshift()` 之后，将适当地重置读取状态，但最好在执行读取的过程中避免调用 `readable.unshift()`。

## 5.双工流与转换流

### 5.1 `stream.Duplex` 双工流

双工流（Duplex）是同时实现了 [`Readable`](http://nodejs.cn/s/YuDKX1) 和 [`Writable`](http://nodejs.cn/s/9JUnJ8) 接口的流。

`Duplex` 流的例子包括：

- [TCP socket](http://nodejs.cn/s/wsJ1o1)
- [zlib 流](http://nodejs.cn/s/duYbh2)
- [crypto 流](http://nodejs.cn/s/FuEfsg)

### 5.2 `stream.Transform` 转换流

+ `transform.destroy([error])`：销毁流，并可选地触发 `'error'` 事件。

转换流（Transform）是一种 [`Duplex`](http://nodejs.cn/s/2iRabr) 流，但它的输出与输入是相关联的。 与 [`Duplex`](http://nodejs.cn/s/2iRabr) 流一样， `Transform` 流也同时实现了 [`Readable`](http://nodejs.cn/s/YuDKX1) 和 [`Writable`](http://nodejs.cn/s/9JUnJ8) 接口。

`Transform` 流的例子包括：

- [zlib 流](http://nodejs.cn/s/duYbh2)

- [crypto 流](http://nodejs.cn/s/FuEfsg)

  

## 6. 实现流

`stream` 模块 API 旨在为了更容易地使用 JavaScript 的原型继承模式来实现流。

首先，流的开发者声明一个新的 JavaScript 类，该类继承了四个基本流类之一（`stream.Writeable`、 `stream.Readable`、 `stream.Duplex` 或 `stream.Transform`），并确保调用了相应的父类构造函数:

```js
const { Writable } = require('stream');

class MyWritable extends Writable {
  constructor({ highWaterMark, ...options }) {
    super({ highWaterMark });
    // ...
  }
}
```

### 6.1 实现可写流

`stream.Writable` 类可用于实现 [`Writable`](http://nodejs.cn/s/9JUnJ8) 流。

自定义的 `Writable` 流必须调用 `new stream.Writable([options])` 构造函数并实现 `writable._write()` 和/或 `writable._writev()` 方法。

```js
const { Writable } = require('stream');

class MyWritable extends Writable {
  constructor(options) {
    // 调用 stream.Writable() 构造函数。
    super(options);
    // ...
  }
}


// ES6之前
const { Writable } = require('stream');
const util = require('util');

function MyWritable(options) {
  if (!(this instanceof MyWritable))
    return new MyWritable(options);
  Writable.call(this, options);
}
util.inherits(MyWritable, Writable);

// 使用简化的构造函数：
const { Writable } = require('stream');

const myWritable = new Writable({
  write(chunk, encoding, callback) {
    // ...
  },
  writev(chunks, callback) {
    // ...
  }
});
```

### 6.2 实现可读流

`stream.Readable` 类可用于实现可读流。

自定义的可读流必须调用 `new stream.Readable([options])` 构造函数并实现 `readable._read()` 方法。

```js
const { Readable } = require('stream');

class MyReadable extends Readable {
  constructor(options) {
    // 调用 stream.Readable(options) 构造函数。
    super(options);
    // ...
  }
}

// 使用 ES6 之前的语法：
const { Readable } = require('stream');
const util = require('util');

function MyReadable(options) {
  if (!(this instanceof MyReadable))
    return new MyReadable(options);
  Readable.call(this, options);
}
util.inherits(MyReadable, Readable);

// 使用简化的构造函数：
const { Readable } = require('stream');

const myReadable = new Readable({
  read(size) {
    // ...
  }
});
```

### 6.3 实现双工流

[双工流](http://nodejs.cn/s/2iRabr)同时实现了[可读流](http://nodejs.cn/s/YuDKX1)和[可写流](http://nodejs.cn/s/9JUnJ8)，例如 TCP socket 连接。

因为 JavaScript 不支持多重继承，所以使用 `stream.Duplex` 类实现[双工流](http://nodejs.cn/s/2iRabr)（而不是使用 `stream.Readable` 类和 `stream.Writable` 类）。

`stream.Duplex` 类的原型继承自 `stream.Readable` 和寄生自 `stream.Writable`，但是 `instanceof` 对这两个基础类都可用，因为重写了 `stream.Writable` 的 [`Symbol.hasInstance`](http://nodejs.cn/s/D1EDvM)。

自定义的双工流必须调用 `new stream.Duplex([options])` 构造函数并实现 `readable._read()` 和 `writable._write()` 方法。

```js
const { Duplex } = require('stream');

class MyDuplex extends Duplex {
  constructor(options) {
    super(options);
    // ...
  }
}

// 使用 ES6 之前的语法：
const { Duplex } = require('stream');
const util = require('util');

function MyDuplex(options) {
  if (!(this instanceof MyDuplex))
    return new MyDuplex(options);
  Duplex.call(this, options);
}
util.inherits(MyDuplex, Duplex);

// 使用简化的构造函数：
const { Duplex } = require('stream');

const myDuplex = new Duplex({
  read(size) {
    // ...
  },
  write(chunk, encoding, callback) {
    // ...
  }
});
```

### 6.4 实现转换流

[转换流](http://nodejs.cn/s/fhVJQM)是一种[双工流](http://nodejs.cn/s/2iRabr)，它会对输入做些计算然后输出。 例如 [zlib](http://nodejs.cn/s/duYbh2) 流和 [crypto](http://nodejs.cn/s/FuEfsg) 流会压缩、加密或解密数据。

输出流的大小、数据块的数量都不一定会和输入流的一致。 例如， `Hash` 流在输入结束时只会输出一个数据块，而 `zlib` 流的输出可能比输入大很多或小很多。

`stream.Transform` 类可用于实现了一个[转换流](http://nodejs.cn/s/fhVJQM)。

`stream.Transform` 类继承自 `stream.Duplex`，并且实现了自有的 `writable._write()` 和 `readable._read()` 方法。 自定义的转换流必须实现 [`transform._transform()`](http://nodejs.cn/s/N8nFbP) 方法，[`transform._flush()`](http://nodejs.cn/s/mErApk) 方法是可选的。

当使用转换流时，如果可读端的输出没有被消费，则写入流的数据可能会导致可写端被暂停。

```js
const { Transform } = require('stream');

class MyTransform extends Transform {
  constructor(options) {
    super(options);
    // ...
  }
}

// 使用 ES6 之前的语法：
const { Transform } = require('stream');
const util = require('util');

function MyTransform(options) {
  if (!(this instanceof MyTransform))
    return new MyTransform(options);
  Transform.call(this, options);
}
util.inherits(MyTransform, Transform);

// 使用简化的构造函数：
const { Transform } = require('stream');

const myTransform = new Transform({
  transform(chunk, encoding, callback) {
    // ...
  }
});

```
