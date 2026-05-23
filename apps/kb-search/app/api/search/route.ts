import { NextResponse } from "next/server";
import {
  getAnonymousDailyLimit,
  isPasswordGateEnabled,
  isSearchAuthorized,
} from "@/lib/auth";
import { checkAnonymousSearchLimit, rateLimitHeaders } from "@/lib/rate-limit";
import { searchBlog } from "@/lib/vector";

export const runtime = "nodejs";

export async function GET(request: Request) {
  let rateHeaders: HeadersInit = {};

  if (!isSearchAuthorized(request)) {
    if (!isPasswordGateEnabled() || getAnonymousDailyLimit() === 0) {
      return NextResponse.json({ error: "未授权" }, { status: 401 });
    }

    const rate = await checkAnonymousSearchLimit(request);
    rateHeaders = rateLimitHeaders(rate);
    if (!rate.allowed) {
      return NextResponse.json(
        {
          error: "今日免费检索次数已用完，明日再来或在「高级」中填写访问密码",
          limit: rate.limit,
          remaining: 0,
        },
        { status: 429, headers: rateHeaders }
      );
    }
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim();
  if (!q) {
    return NextResponse.json({ error: "请提供参数 q" }, { status: 400 });
  }

  const topK = Math.min(Number(searchParams.get("topK") || 8), 12);

  try {
    const hits = await searchBlog(q, topK);
    return NextResponse.json({ query: q, hits }, { headers: rateHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : "检索失败";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
