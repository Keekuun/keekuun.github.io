import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const required = process.env.KB_SEARCH_PASSWORD?.trim();
  if (!required) return NextResponse.next();

  // 仅 AI 总结强制密码；语义检索走 /api/search 内的每日限额
  if (request.nextUrl.pathname.startsWith("/api/chat")) {
    const header = request.headers.get("x-kb-password");
    if (header === required) return NextResponse.next();
    return NextResponse.json(
      { error: "AI 总结需要访问密码，请在页面「高级」中填写" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
