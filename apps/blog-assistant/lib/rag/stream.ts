import { classifyIntent, type QueryIntent } from "@/lib/agent/router";
import { suggestFollowUps } from "@/lib/agent/follow-ups";
import { retrieveBlogChunks } from "@/lib/rag/retriever";
import {
  trimRagHistory,
  type RagHistoryMessage,
} from "@/lib/rag/types";
import { streamAnswerWithContext } from "@/lib/vector";

export type RagStreamOptions = {
  regenerate?: boolean;
  topK?: number;
  history?: RagHistoryMessage[];
};

const RAG_ROUTE_LABEL = "固定检索链";

export async function streamRagPipeline(
  query: string,
  options?: RagStreamOptions
): Promise<ReadableStream<Uint8Array>> {
  const encoder = new TextEncoder();
  const intent: QueryIntent = classifyIntent(query);
  const temperature = options?.regenerate ? 0.45 : 0.2;
  const history = trimRagHistory(options?.history);

  const { hits, retrievalQuery, reranked, usedHyde, expanded } =
    await retrieveBlogChunks(query, {
      topK: options?.topK ?? 6,
      history,
    });

  if (hits.length === 0) {
    return new ReadableStream({
      start(controller) {
        const send = (obj: unknown) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(obj)}\n\n`)
          );
        };
        send({ type: "route", intent: "blog", label: RAG_ROUTE_LABEL });
        send({
          type: "retrieve",
          hitCount: 0,
          reranked,
          expanded: retrievalQuery !== query,
          usedHyde,
        });
        send({
          type: "token",
          content: "没有在知识库中找到相关内容。请先确认已运行索引脚本。",
        });
        send({
          type: "suggestions",
          items: suggestFollowUps("blog", query),
        });
        send({ type: "done" });
        controller.close();
      },
    });
  }

  const inner = await streamAnswerWithContext(query, hits, {
    temperature,
    sendDone: false,
    history,
  });

  return new ReadableStream({
    async start(controller) {
      const send = (obj: unknown) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(obj)}\n\n`)
        );
      };

      try {
        send({ type: "route", intent, label: RAG_ROUTE_LABEL });
        if (options?.regenerate) {
          send({ type: "meta", regenerate: true });
        }
        send({
          type: "retrieve",
          hitCount: hits.length,
          reranked,
          expanded: retrievalQuery !== query,
          multiTurn: history.length > 0,
          usedHyde,
        });

        const reader = inner.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          controller.enqueue(value);
        }

        send({
          type: "suggestions",
          items: suggestFollowUps(intent, query),
        });
        send({ type: "done" });
      } catch (err) {
        send({
          type: "error",
          message: err instanceof Error ? err.message : "RAG 流式失败",
        });
      } finally {
        controller.close();
      }
    },
  });
}
