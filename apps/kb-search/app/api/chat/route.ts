import { NextResponse } from "next/server";
import { isSearchAuthorized } from "@/lib/auth";
import { answerWithContext, searchBlog } from "@/lib/vector";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isSearchAuthorized(request)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
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
    const hits = await searchBlog(query, 6);
    if (hits.length === 0) {
      return NextResponse.json({
        query,
        hits: [],
        answer: "没有在知识库中找到相关内容。请先确认已运行索引脚本。",
      });
    }

    const answer = await answerWithContext(query, hits);
    return NextResponse.json({ query, hits, answer });
  } catch (err) {
    const message = err instanceof Error ? err.message : "问答失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
