import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAccessPassword } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const required = getAccessPassword();
  if (!required) return NextResponse.next();

  const protectedPaths = ["/api/agent/chat", "/api/rag/chat"];
  if (!protectedPaths.some((p) => request.nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const header =
    request.headers.get("x-blog-assistant-password") ||
    request.headers.get("x-kb-password");
  if (header === required) return NextResponse.next();

  return NextResponse.json(
    { error: "需要访问密码，请在页面「高级」中填写" },
    { status: 401 }
  );
}

export const config = {
  matcher: ["/api/:path*"],
};
