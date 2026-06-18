import { NextResponse } from "next/server";
import { deleteThread, listThreads } from "@/lib/db/threads";
import { isDatabaseEnabled } from "@/lib/db/pool";
import { isChatAuthorized } from "@/lib/auth";
import { getOrCreateUserId, withSessionCookie } from "@/lib/session";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { userId, isNew } = getOrCreateUserId(request);

  if (!isChatAuthorized(request)) {
    return withSessionCookie(
      NextResponse.json(
        { error: "需要访问密码" },
        { status: 401 }
      ),
      userId,
      isNew
    );
  }

  const threads = await listThreads(userId);

  return withSessionCookie(
    NextResponse.json({
      threads,
      persistence: isDatabaseEnabled() ? "postgres" : "local",
    }),
    userId,
    isNew
  );
}

export async function DELETE(request: Request) {
  const { userId, isNew } = getOrCreateUserId(request);

  if (!isChatAuthorized(request)) {
    return withSessionCookie(
      NextResponse.json({ error: "需要访问密码" }, { status: 401 }),
      userId,
      isNew
    );
  }

  let body: { threadId?: string };
  try {
    body = await request.json();
  } catch {
    return withSessionCookie(
      NextResponse.json({ error: "无效 JSON" }, { status: 400 }),
      userId,
      isNew
    );
  }

  const threadId = body.threadId?.trim();
  if (!threadId) {
    return withSessionCookie(
      NextResponse.json({ error: "缺少 threadId" }, { status: 400 }),
      userId,
      isNew
    );
  }

  const deleted = await deleteThread(userId, threadId);

  return withSessionCookie(
    NextResponse.json({ deleted }),
    userId,
    isNew
  );
}
