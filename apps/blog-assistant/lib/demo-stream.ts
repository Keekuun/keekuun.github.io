import type { Citation } from "@/lib/citations";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function demoCitations(): Citation[] {
  const base =
    process.env.NEXT_PUBLIC_BLOG_BASE_URL || "https://blog.zkkysqs.top";
  return [
    {
      index: 1,
      title: "RAG 进阶：生产级优化",
      url: `${base}/ai/11-advanced-rag-patterns.html`,
      path: "docs/ai/11-advanced-rag-patterns.md",
      heading: "",
      preview: "（演示）Agentic RAG、HyDE、重排序…",
    },
    {
      index: 2,
      title: "收官实战：博客 AI 助手",
      url: `${base}/ai/19-blog-ai-assistant-capstone.html`,
      path: "docs/ai/19-blog-ai-assistant-capstone.md",
      heading: "",
      preview: "（演示）LangGraph + RAG + SSE UI…",
    },
  ];
}

export function createDemoAgentStream(
  threadId: string,
  message: string
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const citations = demoCitations();
  const reply =
    `【演示模式】已收到：「${message}」\n\n` +
    "当前未配置 `DEEPSEEK_API_KEY`，这是本地 UI 预览用的模拟回复。" +
    "侧栏、引用卡片、Tool 步骤均为演示效果。\n\n" +
    "接入真实能力：复制 `.env.example` 为 `.env.local`，填写 DeepSeek + Upstash Vector + Embedding Key。";

  return new ReadableStream({
    async start(controller) {
      const send = (obj: Record<string, unknown>) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(obj)}\n\n`)
        );
      };
      try {
        send({ type: "meta", threadId, demo: true });
        await sleep(200);
        send({ type: "tool_start", name: "search_blog" });
        await sleep(300);
        send({ type: "citations", items: citations });
        send({ type: "tool_end", name: "search_blog" });
        await sleep(150);
        for (const content of reply) {
          send({ type: "token", content });
          await sleep(10);
        }
        send({ type: "done" });
      } finally {
        controller.close();
      }
    },
  });
}

export function createDemoRagStream(query: string): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const citations = demoCitations();
  const reply =
    `【演示模式 · RAG】关于「${query}」：\n\n` +
    "这是固定检索链的模拟流式回答。配置 API Key 与向量库后将检索真实博客段落。";

  return new ReadableStream({
    async start(controller) {
      const send = (obj: Record<string, unknown>) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(obj)}\n\n`)
        );
      };
      try {
        send({ type: "citations", items: citations });
        await sleep(100);
        for (const content of reply) {
          send({ type: "token", content });
          await sleep(10);
        }
        send({ type: "done" });
      } finally {
        controller.close();
      }
    },
  });
}
