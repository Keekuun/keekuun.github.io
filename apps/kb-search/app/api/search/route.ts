import { NextResponse } from "next/server";
import { isSearchAuthorized } from "@/lib/auth";
import { searchBlog } from "@/lib/vector";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!isSearchAuthorized(request)) {
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ error: "请提供参数 q" }, { status: 400 });
  }

  const topK = Math.min(Number(searchParams.get("topK") || 8), 12);

  try {
    const hits = await searchBlog(q, topK);
    return NextResponse.json({ query: q, hits });
  } catch (err) {
    const message = err instanceof Error ? err.message : "检索失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
