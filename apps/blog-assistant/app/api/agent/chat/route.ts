import { HumanMessage } from "@langchain/core/messages";
import { getAgentGraph } from "@/lib/agent/graph";
import { serializeMessages } from "@/lib/agent/messages";
import { hitsToCitations } from "@/lib/citations";
import { assertThreadAccess, touchThread, upsertThread } from "@/lib/db/threads";
import { isChatAuthorized } from "@/lib/auth";
import { getCheckpointerKind } from "@/lib/agent/checkpointer";
import {
  checkAnonymousChatLimit,
  rateLimitHeaders,
} from "@/lib/rate-limit";
import { getOrCreateUserId, withSessionCookie } from "@/lib/session";
import { searchBlog } from "@/lib/vector";
import { isDemoMode } from "@/lib/demo-mode";
import { createDemoAgentStream } from "@/lib/demo-stream";

export const runtime = "nodejs";
export const maxDuration = 60;

function extractTokenContent(chunk: unknown): string {
  if (typeof chunk === "string") return chunk;
  if (Array.isArray(chunk)) {
    return chunk
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text?: string }).text ?? "");
        }
        return "";
      })
      .join("");
  }
  return "";
}

function extractToolQuery(data: unknown): string | undefined {
  if (!data || typeof data !== "object") return undefined;
  const input = (data as { input?: unknown }).input;
  if (!input || typeof input !== "object") return undefined;
  const query = (input as { query?: unknown }).query;
  return typeof query === "string" ? query : undefined;
}

export async function POST(request: Request) {
  const { userId, isNew } = getOrCreateUserId(request);

  if (!isChatAuthorized(request)) {
    return withSessionCookie(
      new Response(
        JSON.stringify({ error: "需要访问密码，请在页面「高级」中填写" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      ),
      userId,
      isNew
    );
  }

  const rate = await checkAnonymousChatLimit(request);
  if (!rate.allowed) {
    return withSessionCookie(
      new Response(
        JSON.stringify({
          error: "今日免费次数已用完，请填写访问密码或明日再试",
        }),
        { status: 429, headers: { "Content-Type": "application/json", ...rateLimitHeaders(rate) } }
      ),
      userId,
      isNew
    );
  }

  let body: { message?: string; threadId?: string };
  try {
    body = await request.json();
  } catch {
    return withSessionCookie(
      new Response(JSON.stringify({ error: "无效 JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
      userId,
      isNew
    );
  }

  const message = body.message?.trim();
  if (!message) {
    return withSessionCookie(
      new Response(JSON.stringify({ error: "请提供 message" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
      userId,
      isNew
    );
  }

  const threadId = body.threadId?.trim() || crypto.randomUUID();

  const allowed = await assertThreadAccess(userId, threadId);
  if (!allowed) {
    return withSessionCookie(
      new Response(JSON.stringify({ error: "无权访问该会话" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
      userId,
      isNew
    );
  }

  await upsertThread(userId, threadId, message);

  if (isDemoMode()) {
    const stream = createDemoAgentStream(threadId, message);
    return withSessionCookie(
      new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          ...rateLimitHeaders(rate),
        },
      }),
      userId,
      isNew
    );
  }

  const graph = await getAgentGraph();
  const encoder = new TextEncoder();
  const runName = process.env.LANGCHAIN_PROJECT || "blog-assistant";

  try {
    const stream = await graph.streamEvents(
      { messages: [new HumanMessage(message)] },
      {
        version: "v2",
        configurable: { thread_id: threadId, userId },
        runName,
        metadata: { userId, threadId },
        tags: ["blog-assistant", getCheckpointerKind()],
      }
    );

    const bodyStream = new ReadableStream({
      async start(controller) {
        const send = (obj: unknown) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
        };

        try {
          send({ type: "meta", threadId, userId });
          for await (const event of stream) {
            if (event.event === "on_chat_model_stream") {
              const chunk = event.data?.chunk?.content;
              const text = extractTokenContent(chunk);
              if (text) send({ type: "token", content: text });
            }
            if (event.event === "on_tool_start") {
              send({
                type: "tool_start",
                name: event.name ?? "tool",
              });
            }
            if (event.event === "on_tool_end") {
              const toolName = event.name ?? "tool";
              send({ type: "tool_end", name: toolName });

              if (toolName === "search_blog") {
                const query = extractToolQuery(event.data);
                if (query) {
                  try {
                    const hits = await searchBlog(query, 5);
                    if (hits.length > 0) {
                      send({ type: "citations", items: hitsToCitations(hits) });
                    }
                  } catch {
                    /* 引用失败不影响主流程 */
                  }
                }
              }
            }
          }
          await touchThread(threadId);
          send({ type: "done" });
        } catch (err) {
          send({
            type: "error",
            message: err instanceof Error ? err.message : "Agent 执行失败",
          });
        } finally {
          controller.close();
        }
      },
    });

    return withSessionCookie(
      new Response(bodyStream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          ...rateLimitHeaders(rate),
        },
      }),
      userId,
      isNew
    );
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : "Agent 启动失败";
    return withSessionCookie(
      new Response(JSON.stringify({ error: errMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
      userId,
      isNew
    );
  }
}

export async function GET(request: Request) {
  const { userId, isNew } = getOrCreateUserId(request);
  const url = new URL(request.url);
  const threadId = url.searchParams.get("threadId")?.trim();

  if (!threadId) {
    return withSessionCookie(
      new Response(JSON.stringify({ error: "缺少 threadId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }),
      userId,
      isNew
    );
  }

  const allowed = await assertThreadAccess(userId, threadId);
  if (!allowed) {
    return withSessionCookie(
      new Response(JSON.stringify({ error: "无权访问该会话" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }),
      userId,
      isNew
    );
  }

  try {
    if (isDemoMode()) {
      return withSessionCookie(
        new Response(JSON.stringify({ threadId, messages: [] }), {
          headers: { "Content-Type": "application/json" },
        }),
        userId,
        isNew
      );
    }

    const graph = await getAgentGraph();
    const snap = await graph.getState({
      configurable: { thread_id: threadId },
    });
    const messages = serializeMessages(snap.values.messages ?? []);

    return withSessionCookie(
      new Response(JSON.stringify({ threadId, messages }), {
        headers: { "Content-Type": "application/json" },
      }),
      userId,
      isNew
    );
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : "读取会话失败";
    return withSessionCookie(
      new Response(JSON.stringify({ error: errMessage }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }),
      userId,
      isNew
    );
  }
}
