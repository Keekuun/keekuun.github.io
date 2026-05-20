import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const required = process.env.KB_SEARCH_PASSWORD;
  if (!required) return NextResponse.next();

  if (request.nextUrl.pathname.startsWith("/api/")) {
    const header = request.headers.get("x-kb-password");
    if (header === required) return NextResponse.next();
    return NextResponse.json({ error: "未授权" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
