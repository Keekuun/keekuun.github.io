---
title: WebAI 与边缘推理：在浏览器中运行大模型
date: 2026-05-28
isComment: true
categories: 
- AI
- Frontend
tags: 
- WebAI
- WebGPU
- Transformers.js
- Edge Inference
---

# WebAI 与边缘推理：在浏览器中运行大模型

> 前面几条线默认是 `fetch` 云端 API。作为前端，自然会问：**能不能在浏览器里跑一点 AI？** 可以，而且有几类任务很适合——这篇从「不阻塞主线程跑 Embedding」讲起，再到和云端怎么分工。

## 📚 目录

- [WebAI 解决的不是「替代 GPT-4」](#webai-解决的不是替代-gpt-4)
- [哪些放浏览器、哪些放云端](#哪些放浏览器哪些放云端)
- [第一课：Worker 里跑 Embedding](#第一课worker-里跑-embedding)
- [WebGPU 和 WASM 是什么关系](#webgpu-和-wasm-是什么关系)
- [聊天生成：WebLLM](#聊天生成webllm)
- [浏览器 + 云端混合 RAG](#浏览器--云端混合-rag)
- [Chrome 自带的 AI API](#chrome-自带的-ai-api)
- [常见坑](#常见坑)
- [系列导航](#系列导航)

---

## WebAI 解决的不是「替代 GPT-4」

**WebAI** = 在浏览器里加载模型、本地推理。

好处：

- 数据不出设备（隐私）
- 没网也能跑一部分能力（离线）
- 省掉一次网络往返（延迟）
- 不花云端 GPU 钱（算力在用户电脑上）

**不是** 用 1.5B 小模型替代 GPT-4 做复杂推理。更准确的说法是 **推理位置重新分配**——像 SSR 只渲染首屏，细节客户端补水，而不是整站 CSR。

---

## 哪些放浏览器、哪些放云端

| 任务 | 浏览器 | 云端 | 原因 |
|------|--------|------|------|
| 算 query 的 Embedding | ✅ 常见 | ✅ | 浏览器省一次 API；索引多在 CI |
| 意图分类（要不要搜文档） | ✅ | | 轻、频繁 |
| 敏感字段检测 | ✅ | | 数据不出设备 |
| 批量索引几千篇 PDF | | ✅ | 浏览器不适合批处理 |
| 多步 Agent + 长报告 | | ✅ | 上下文和 Tool 链复杂 |
| 要强推理的问答 | | ✅ | 小模型质量不够 |

Google Copilot、Apple Intelligence 的「端云协同」都是这个思路的产品化。

---

## 第一课：Worker 里跑 Embedding

在主线程跑模型会 **卡死 UI**——和把大 JSON `parse` 放主线程一样蠢。

### 原理

1. 主线程 `new Worker(...)`
2. Worker 里 `import` Transformers.js，加载模型
3. `postMessage` 传文本，Worker `postMessage` 回向量

### 代码

```javascript
// public/embedding-worker.js
import { pipeline, env } from '@huggingface/transformers';

env.useBrowserCache = true; // 第二次打开快很多
let extractor = null;

self.onmessage = async (e) => {
    const { type, text } = e.data;
    if (type === 'init') {
        extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        self.postMessage({ type: 'ready' });
        return;
    }
    if (type === 'embed' && extractor) {
        const out = await extractor(text, { pooling: 'mean', normalize: true });
        self.postMessage({ type: 'vector', data: Array.from(out.data) });
    }
};
```

React 里：

```typescript
const workerRef = useRef<Worker>();

useEffect(() => {
    workerRef.current = new Worker('/embedding-worker.js', { type: 'module' });
    workerRef.current.postMessage({ type: 'init' });
    workerRef.current.onmessage = (e) => {
        if (e.data.type === 'vector') setQueryVector(e.data.data);
    };
}, []);

async function handleSearch(q: string) {
    workerRef.current?.postMessage({ type: 'embed', text: q });
}
```

### 首次加载

模型从 CDN 拉，几十 MB。UI 上要提示「首次需下载模型」，别让用户以为坏了。

---

## WebGPU 和 WASM 是什么关系

- **WASM（WebAssembly）**：浏览器里跑接近原生速度的代码，**用 CPU**
- **WebGPU**：浏览器调 **GPU** 做矩阵运算，推理通常快很多

Transformers.js 会自动选；没有 WebGPU 就回退 WASM。

```typescript
async function hasWebGPU() {
    if (!('gpu' in navigator)) return false;
    const adapter = await navigator.gpu.requestAdapter();
    return !!adapter;
}
```

多线程 WASM 需要页面 `crossOriginIsolated`（配 COOP/COEP 响应头）。和配 CSP 一样，上线前要测第三方脚本是否冲突。

---

## 聊天生成：WebLLM

Embedding 用 [@huggingface/transformers](https://huggingface.co/docs/transformers.js) 够了；要在浏览器里 **流式聊天**，[@mlc-ai/web-llm](https://webllm.mlc.ai/) WebGPU 优化更好。

```typescript
import { CreateMLCEngine } from '@mlc-ai/web-llm';

const engine = await CreateMLCEngine('Qwen2.5-1.5B-Instruct-q4f16_1-MLC');

const chunks = await engine.chat.completions.create({
    messages: [{ role: 'user', content: '用一句话介绍 RAG' }],
    stream: true,
});

for await (const chunk of chunks) {
    process.stdout.write(chunk.choices[0]?.delta?.content ?? '');
}
```

同样放 Worker，主线程用 SSE 或 `ReadableStream` 推给 UI——和 [08 流式报告](./08-build-first-agent.md) 同一套。

**量化（q4）**：模型体积缩小、速度上去，1.5B 聊天在笔记本 Chrome 上勉强可用；**7B+ 别在浏览器默认跑**。

---

## 浏览器 + 云端混合 RAG

完整本地 RAG = 本地 Embedding + 本地索引（IndexedDB / Orama）+ 可选本地小 LLM。

生产更常见的是 **混合**：

| 阶段 | 放哪 |
|------|------|
| 文档索引 | 云端 CI 批处理 |
| 用户 query → 向量 | 浏览器 Worker |
| 向量检索 | 云端向量库 API |
| 生成回答 | 云端大模型 |

```typescript
// 浏览器算好 vector，服务端只负责检索
async function search(text: string) {
    const vector = await embedInWorker(text);
    return fetch('/api/search', {
        method: 'POST',
        body: JSON.stringify({ vector, topK: 10 }),
    }).then((r) => r.json());
}
```

服务端 `/api/search` 增加「直接收 vector」分支，跳过 Embedding API——降延迟、降费用。索引逻辑见 [RAG 进阶](./11-advanced-rag-patterns.md)。

---

## Chrome 自带的 AI API

实验特性 **Chrome Built-in AI**（Gemini Nano）可以不用自己拉模型权重：

```typescript
const caps = await window.ai?.languageModel?.capabilities?.();
if (caps?.available === 'readily') {
    const session = await window.ai.languageModel.create();
    await session.prompt('总结这段话…');
}
```

| | Chrome 内置 | 自托管 Transformers.js |
|--|-------------|------------------------|
| 可控性 | 低 | 高 |
| 跨浏览器 | 主要 Chromium | WASM 更广 |

建议：**内置作增强，Transformers.js 作兜底**，别绑死实验 API。

---

## 常见坑

**1. 主线程跑推理** → 页面冻结。必须 Worker。

**2. 移动端默认加载 1.5B 聊天模型** → 内存和发热。移动端可只做 Embedding 或纯云端。

**3. 用户继续输入没 abort** → 上一次推理还在跑。`worker.terminate()` 或 AbortController。

**4. 没提示首次下载体积** → 用户以为卡死。进度条 + 文案。

**5. 端侧失败没 fallback** → OOM 时自动走云端 API。

**不适合 WebAI 的：** 长上下文 [Multi-Agent](./12-multi-agent-systems.md)、要最新知识的问答、7B+ 质量写作——继续 `fetch` 云端。

---

## 系列导航

1. [RAG 进阶](./11-advanced-rag-patterns.md)
2. [多智能体](./12-multi-agent-systems.md)
3. [Memory 进阶](./13-advanced-memory.md)
4. **本文**
5. [LangChain.js 生态](./15-langchain-js-guide.md) · [专系列](./langchain/README.md)
6. [LangGraph.js 实战](./16-langgraphjs-practice.md) · [专系列](./langgraph/README.md)
7. [17 Chatbot UI](./17-build-production-chatbot-ui.md) · … · [24 传统 Web](./24-traditional-web-ai-integration.md)

基础链：[08 Agent](./08-build-first-agent.md) → [09 Tools](./09-tools-system-design.md) → [10 Memory](./10-memory-planning-agent.md)

**总索引：** [README](./README.md) · **参考：** [Transformers.js](https://huggingface.co/docs/transformers.js) · [WebLLM](https://webllm.mlc.ai/) · [Chrome AI](https://developer.chrome.com/docs/ai)
