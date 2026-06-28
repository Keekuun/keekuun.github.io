import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAccessPassword, isChatAuthorized } from "@/lib/auth";

const PROTECTED_API_PREFIXES = [
  "/api/agent/chat",
  "/api/agent/threads",
  "/api/rag/chat",
];

export function middleware(request: NextRequest) {
  if (!getAccessPassword()) return NextResponse.next();

  if (!PROTECTED_API_PREFIXES.some((p) => request.nextUrl.pathname.startsWith(p))) {
    return NextResponse.next();
  }

  if (isChatAuthorized(request)) return NextResponse.next();

  return NextResponse.json(
    { error: "需要访问密码，请在页面「高级」中填写" },
    { status: 401 }
  );
}

export const config = {
  matcher: ["/api/:path*"],
};
