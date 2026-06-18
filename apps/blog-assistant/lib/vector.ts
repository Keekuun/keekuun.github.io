import { Index } from "@upstash/vector";
import {
  createChatClient,
  createEmbeddingClient,
  getChatModel,
  getEmbeddingModel,
} from "@/lib/ai";

import { hitsToCitations, type Citation } from "@/lib/citations";

export type SearchHit = {
  id: string;
  score: number;
  title: string;
  heading: string;
  url: string;
  path: string;
  category: string;
  preview: string;
};

function getIndex() {
  const url = process.env.UPSTASH_VECTOR_REST_URL;
  const token = process.env.UPSTASH_VECTOR_REST_TOKEN;
  if (!url || !token) {
    throw new Error("未配置 UPSTASH_VECTOR_REST_URL / UPSTASH_VECTOR_REST_TOKEN");
  }
  return new Index({ url, token });
}

export async function embedQuery(text: string): Promise<number[]> {
  const client = createEmbeddingClient();
  const model = getEmbeddingModel();
  const res = await client.embeddings.create({ model, input: text });
  return res.data[0].embedding;
}

export async function searchBlog(query: string, topK = 8): Promise<SearchHit[]> {
  const vector = await embedQuery(query);
  const index = getIndex();
  const result = await index.query({
    vector,
    topK,
    includeMetadata: true,
  });

  return (result ?? [])
    .map((item) => {
      const meta = (item.metadata ?? {}) as Record<string, unknown>;
      return {
        id: String(item.id),
        score: item.score ?? 0,
        title: String(meta.title ?? ""),
        heading: String(meta.heading ?? ""),
        url: String(meta.url ?? ""),
        path: String(meta.path ?? ""),
        category: String(meta.category ?? ""),
        preview: String(meta.preview ?? ""),
      };
    })
    .filter((h) => h.preview || h.url);
}

export function formatHitsForContext(hits: SearchHit[]): string {
  return hits
    .map(
      (h, i) =>
        `[${i + 1}] 标题: ${h.title}${h.heading ? ` / ${h.heading}` : ""}\n链接: ${h.url}\n摘录: ${h.preview}`
    )
    .join("\n\n");
}

export function formatHitsForTool(hits: SearchHit[]): string {
  return hits
    .map(
      (h, i) =>
        `[${i + 1}] ${h.url}\n${h.title}${h.heading ? ` · ${h.heading}` : ""}\n${h.preview.slice(0, 800)}`
    )
    .join("\n---\n");
}

const RAG_SYSTEM =
  "你是博客 AI 助手。只根据提供的博客摘录回答；若摘录不足以回答，明确说博客中未找到相关内容。回答使用中文，并在句末用 [1][2] 标注引用编号，不要编造链接。";

export async function answerWithContext(
  query: string,
  hits: SearchHit[]
): Promise<string> {
  const client = createChatClient();
  const model = getChatModel();
  const context = formatHitsForContext(hits);

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.2,
    messages: [
      { role: "system", content: RAG_SYSTEM },
      {
        role: "user",
        content: `问题：${query}\n\n--- 检索摘录 ---\n${context}`,
      },
    ],
  });

  return completion.choices[0]?.message?.content?.trim() || "未能生成回答。";
}

export async function streamAnswerWithContext(
  query: string,
  hits: SearchHit[]
): Promise<ReadableStream<Uint8Array>> {
  const client = createChatClient();
  const model = getChatModel();
  const context = formatHitsForContext(hits);
  const encoder = new TextEncoder();
  const citations: Citation[] = hitsToCitations(hits);

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.2,
    stream: true,
    messages: [
      { role: "system", content: RAG_SYSTEM },
      {
        role: "user",
        content: `问题：${query}\n\n--- 检索摘录 ---\n${context}`,
      },
    ],
  });

  return new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(obj)}\n\n`)
        );
      };
      try {
        send({ type: "citations", items: citations });
        for await (const chunk of completion) {
          const token = chunk.choices[0]?.delta?.content;
          if (token) send({ type: "token", content: token });
        }
        send({ type: "done" });
      } catch (err) {
        send({
          type: "error",
          message: err instanceof Error ? err.message : "流式生成失败",
        });
      } finally {
        controller.close();
      }
    },
  });
}
