import { NextResponse } from "next/server";
import { isChatAuthorized } from "@/lib/auth";
import {
  checkAnonymousChatLimit,
  rateLimitHeaders,
} from "@/lib/rate-limit";
import { searchBlog, streamAnswerWithContext } from "@/lib/vector";
import { isDemoMode } from "@/lib/demo-mode";
import { createDemoRagStream } from "@/lib/demo-stream";

export const runtime = "nodejs";
export const maxDuration = 60;

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

  let body: { query?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "无效 JSON" }, { status: 400 });
  }

  const query = body.query?.trim();
  if (!query) {
    return NextResponse.json({ error: "请提供 query" }, { status: 400 });
  }

  try {
    if (isDemoMode()) {
      const stream = createDemoRagStream(query);
      return new Response(stream, {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
          ...rateLimitHeaders(rate),
        },
      });
    }

    const hits = await searchBlog(query, 6);
    if (hits.length === 0) {
      return NextResponse.json({
        query,
        hits: [],
        answer: "没有在知识库中找到相关内容。请先确认已运行索引脚本。",
      });
    }

    const stream = await streamAnswerWithContext(query, hits);
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
