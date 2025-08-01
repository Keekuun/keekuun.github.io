---
title: Express 响应返回函数 `res.send` VS `res.end`
date: 2025-07-10
categories:
- 后端
tags:
- Express
- Node
---

> 在处理 express + puppeteer 生成 pdf 需求的时候，使用 `res.send(buffer)`给浏览器，发现下载的pdf文件显示已损坏无法打开，但是在服务端生成的pdf是正常的，但是使用 res.end(buffer) 就对了, 这是什么原因呢？


## 核心观点：`res.end()` 是基础，`res.send()` 是增强

*   [**`res.end()`**](https://expressjs.com/en/5x/api.html#res.end): 这是 Node.js 原生的 `http.ServerResponse` 模块中的方法。它非常底层，功能单一：**告诉服务器所有响应头和正文都已发送完毕，该响应被视为已完成。**
*   [**`res.send()`**](https://expressjs.com/en/5x/api.html#res.send): 这是 **Express.js 框架提供的高级方法**。它在内部封装了 `res.end()`，并在其之上增加了许多智能和便捷的功能，极大地简化了开发。

可以把 `res.end()` 看作是汽车的手动挡，你需要自己处理很多细节；而 `res.send()` 则是自动挡，它为你处理了大部分常规操作。

## 对比分析表格

为了更直观地比较，请看表格：

| 特性 | `res.end([data], [encoding])` | `res.send([body])` |
| :--- | :--- | :--- |
| **来源** | Node.js 原生 `http` 模块 | Express.js 框架 |
| **功能** | 基础、底层。主要用于结束响应。 | 高级、智能。封装了响应逻辑。 |
| **`Content-Type` 头** | **从不**自动设置。你必须手动 `res.setHeader()`。 | **自动**设置。根据内容推断（`application/json`, `text/html` 等）。 |
| **`ETag` 头** | **不**自动生成。 | **自动**生成（对于非流式响应），用于 HTTP 缓存。 |
| **处理对象/数组** | **会抛出错误**。它只接受 String 或 Buffer。 | **会自动**将对象/数组 `JSON.stringify`，并设置 `Content-Type: application/json`。 |
| **处理字符串** | 直接发送。 | 如果字符串包含 HTML 标签，会自动设置 `Content-Type: text/html`。 |
| **处理 `null`/`undefined`** | 抛出错误或行为不确定。 | 发送一个空的响应体。 |
| **链式调用** | 调用后，响应立即结束。 | 调用后，响应也立即结束。 |

---

## 深入剖析：`res.send()` 错在哪里？

当传递一个 `Buffer` 给 `res.send()` 时，Express 会执行一系列的智能判断和操作，其中一个关键步骤是：

**它会自动设置 `Content-Type` 响应头为 `application/octet-stream`。**

`application/octet-stream` 是一种通用的二进制数据MIME类型，它告诉浏览器：“这是一些二进制数据，我不知道它具体是什么，你自己看着办吧，通常是提示用户下载。”

虽然这听起来没问题，但对于 PDF 这种有明确类型的文件，它引发了两个问题：

1.  **类型信息丢失**: 浏览器没有接收到明确的 `Content-Type: application/pdf` 指令。虽然它仍然会尝试下载，但在处理文件时可能会因为缺少这个关键的类型提示而出错，导致某些浏览器或PDF阅读器认为文件结构损坏。
2.  **可能的额外处理**: `res.send` 的内部逻辑比 `res.end` 复杂得多。在某些 Express 版本或特定中间件环境下，它在识别到是 `Buffer` 并设置 `Content-Type` 的过程中，**可能**会进行一些微小的、不易察觉的编码转换或处理，而这些处理对于结构极其敏感的 PDF 文件来说是致命的，任何一个字节的改变都可能导致整个文件损坏。

### `res.end()` 为何能成功？

`res.end()` 是 Node.js 原生的、非常底层的方法。它的行为简单粗暴：

**你给我一个 `Buffer`，我就把这个 `Buffer` 的每一个原始字节原封不动地写入响应流，然后结束响应。**

它不会：

*   **不会**自动设置任何 `Content-Type`。
*   **不会**对 `Buffer` 内容进行任何检查或修改。

所以，当你在使用 `res.end(buffer)` 时，你可能在调用它之前已经手动设置了正确的 `Content-Type`，或者即使没有设置，浏览器在接收到这串纯净、未被篡改的二进制流时，也能更好地猜测和处理它（尽管这不推荐）。数据的**完整性**得到了 100% 的保证。

---

### 如何正确地发送PDF（或其他二进制文件）
正确的代码实现：
```typescript
import express, { Request, Response } from 'express';
import puppeteer from 'puppeteer';

const app = express();

app.get('/generate-pdf', async (req: Request, res: Response) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // 假设我们有一个HTML模板
    const htmlContent = '<h1>Invoice</h1><p>Details...</p>';
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
  
    // 生成PDF Buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });
  
    await browser.close();
    
    // 1. 设置正确的 Content-Type，明确告诉浏览器这是一个PDF文件
    res.setHeader('Content-Type', 'application/pdf');

    // 2. 设置 Content-Disposition，让浏览器弹出下载框，并指定文件名
    res.setHeader('Content-Disposition', 'attachment; filename=invoice.pdf');
  
    // 3. (可选但推荐) 设置 Content-Length，让浏览器知道文件大小，可以显示下载进度
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // 4.使用 res.end 发送 buffer数据
    res.end(pdfBuffer);
    
    // 或者可以将 pdf临时生成保存在服务器，然后使用 res.sendFile
    // res.sendFile(pdfFilePath)

  } catch (error) {
    console.error('Failed to generate PDF:', error);
    res.status(500).send('An error occurred while generating the PDF.');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
```

**`res.send()` 对 `Buffer` 类型进行了“自作聪明”的处理，而 `res.end()` 则忠实地、不加修改地发送了原始数据。**

## 实战对比
#### 场景 1: 发送一个简单的文本字符串

```typescript
import express, { Request, Response } from 'express';
const app = express();

// 使用 res.end()
app.get('/end-text', (req: Request, res: Response) => {
  // 手动设置 Content-Type
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello from res.end()');
});

// 使用 res.send()
app.get('/send-text', (req: Request, res: Response) => {
  // Express 自动设置 Content-Type: text/html; charset=utf-8 (即使是纯文本)
  res.send('Hello from res.send()');
});
```
**分析**: `res.send()` 更省事，你不需要关心 `Content-Type`。

#### 场景 2: 发送 JSON 数据 (最常见的场景)

```typescript
import express, { Request, Response } from 'express';
const app = express();

const user = { id: 1, name: 'Alex' };

// 使用 res.end()
app.get('/end-json', (req: Request, res: Response) => {
  try {
    // 1. 必须手动将对象转换为 JSON 字符串
    const jsonString = JSON.stringify(user);
    // 2. 必须手动设置正确的 Content-Type
    res.setHeader('Content-Type', 'application/json');
    // 3. 发送字符串
    res.end(jsonString);
  } catch (error) {
    res.status(500).end('Server error');
  }
});

// 使用 res.send()
app.get('/send-json', (req: Request, res: Response) => {
  // 一步到位！
  // Express 会自动:
  // 1. 调用 JSON.stringify(user)
  // 2. 设置 Content-Type: application/json; charset=utf-8
  // 3. 设置 ETag 头
  res.send(user); 
});
```
**分析**: 这个场景完美地展示了 `res.send()` 的强大之处。它将一个三步操作简化为一步，并且做得更完善（自动设置 ETag）。

#### 场景 3: 发送无内容的响应

```typescript
import express, { Request, Response } from 'express';
const app = express();

// 比如处理一个 DELETE 请求成功后
app.delete('/some-resource/:id', (req: Request, res: Response) => {
  // 两种方式都可以，但 res.send() 更符合 Express 的书写习惯

  // 方式一：使用 end
  // res.status(204).end();

  // 方式二：使用 send (更推荐)
  // .send() 会处理好一切，即使没有内容要发送
  res.status(204).send(); 
});
```
**分析**: 在这种情况下，`res.status(204).send()` 是更符合 Express 编码风格（idiomatic）的写法。

### 结论与最佳实践

使用 Express 处理响应，应该遵循以下准则：

1.  **始终优先使用 `res.send()`**：在 **99%** 的情况下，`res.send()` 都是你的正确选择。它更安全、更方便、功能更强大，并且充分利用了 Express 框架的优势。它是为日常应用开发而设计的。

2.  **什么时候会用到 `res.end()`？**：
    *   **极限性能优化**：在极少数需要压榨每一分性能的场景下，你可能想绕过 `res.send()` 的所有检查和处理逻辑，直接发送一个预先准备好的 Buffer。
    *   **不使用 Express 时**：如果你直接使用 Node.js 的原生 `http` 模块创建服务器，那你**只能**使用 `res.end()`。

3. 当然，如果是`express v4.8` 以上，推荐使用 [res.sendFile(path [, options] [, fn])](https://expressjs.com/en/5x/api.html#res.sendFile)来专门处理文件。

> 项目：[基于 Puppeteer 的 PDF 文档生成服务](https://github.com/Keekuun/puppeteer-pdf)
