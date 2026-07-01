import type { Citation } from "@/lib/citations";
import { classifyIntent, INTENT_LABELS } from "@/lib/agent/router";
import { suggestFollowUps } from "@/lib/agent/follow-ups";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function demoCitations(): Citation[] {
  const aiLab =
    process.env.NEXT_PUBLIC_AI_LAB_URL || "https://ai.zkkysqs.top";
  return [
    {
      index: 1,
      title: "RAG 进阶：生产级优化",
      url: `${aiLab}/11-advanced-rag-patterns`,
      path: "ai-lab/11-advanced-rag-patterns",
      heading: "",
      preview: "（演示）Agentic RAG、HyDE、重排序…",
    },
    {
      index: 2,
      title: "收官实战：博客 AI 助手",
      url: `${aiLab}/19-blog-ai-assistant-capstone`,
      path: "ai-lab/19-blog-ai-assistant-capstone",
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
        const intent = classifyIntent(message);
        send({ type: "meta", threadId, demo: true });
        send({
          type: "route",
          intent,
          label: INTENT_LABELS[intent],
        });
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
        send({
          type: "suggestions",
          items: suggestFollowUps(intent, message),
        });
        send({ type: "done" });
      } finally {
        controller.close();
      }
    },
  });
}

export function createDemoRagStream(
  query: string,
  options?: { regenerate?: boolean; multiTurn?: boolean }
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  const citations = demoCitations();
  const intent = classifyIntent(query);
  const reply =
    `【演示模式 · RAG${options?.regenerate ? " · 重新生成" : ""}】关于「${query}」：\n\n` +
    "这是固定检索链的模拟流式回答。配置 API Key 与向量库后将检索真实博客段落。";

  return new ReadableStream({
    async start(controller) {
      const send = (obj: Record<string, unknown>) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(obj)}\n\n`)
        );
      };
      try {
        send({ type: "route", intent, label: "固定检索链" });
        if (options?.regenerate) {
          send({ type: "meta", regenerate: true });
        }
        send({
          type: "retrieve",
          hitCount: citations.length,
          reranked: true,
          usedHyde: Boolean(options?.multiTurn),
          multiTurn: Boolean(options?.multiTurn),
        });
        send({ type: "citations", items: citations });
        await sleep(100);
        for (const content of reply) {
          send({ type: "token", content });
          await sleep(10);
        }
        send({
          type: "suggestions",
          items: suggestFollowUps(intent, query),
        });
        send({ type: "done" });
      } finally {
        controller.close();
      }
    },
  });
}
