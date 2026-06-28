import { NextResponse } from "next/server";
import { isChatAuthorized } from "@/lib/auth";
import {
  checkAnonymousChatLimit,
  rateLimitHeaders,
} from "@/lib/rate-limit";
import { isDemoMode } from "@/lib/demo-mode";
import { createDemoRagStream } from "@/lib/demo-stream";
import { streamRagPipeline } from "@/lib/rag/stream";
import {
  trimRagHistory,
  type RagHistoryMessage,
} from "@/lib/rag/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function parseHistory(raw: unknown): RagHistoryMessage[] {
  if (!Array.isArray(raw)) return [];
  const parsed: RagHistoryMessage[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const role = (item as { role?: unknown }).role;
    const content = (item as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string" || !content.trim()) continue;
    parsed.push({ role, content: content.trim() });
  }
  return trimRagHistory(parsed);
}

export async function POST(request: Request) {
  if (!isChatAuthorized(request)) {
    return NextResponse.json(
      { error: "需要访问密码，请在页面「高级」中填写" },
      { status: 401 }
    );
  }

  const rate = await checkAnonymousChatLimit(request);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "今日免费次数已用完，请填写访问密码或明日再试" },
      { status: 429, headers: rateLimitHeaders(rate) }
    );
  }

  let body: { query?: string; regenerate?: boolean; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "无效 JSON" }, { status: 400 });
  }

  const query = body.query?.trim();
  if (!query) {
    return NextResponse.json({ error: "请提供 query" }, { status: 400 });
  }

  const history = parseHistory(body.history);

  try {
    if (isDemoMode()) {
      const stream = createDemoRagStream(query, {
        regenerate: Boolean(body.regenerate),
        multiTurn: history.length > 0,
      });
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          ...rateLimitHeaders(rate),
        },
      });
    }

    const stream = await streamRagPipeline(query, {
      regenerate: Boolean(body.regenerate),
      history,
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        ...rateLimitHeaders(rate),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "问答失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
