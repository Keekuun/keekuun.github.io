const SESSION_COOKIE = "ba_uid";

export function parseSessionUserId(request: Request): string | undefined {
  const cookie = request.headers.get("cookie");
  if (!cookie) return undefined;
  const match = cookie.match(/(?:^|;\s*)ba_uid=([^;]+)/);
  return match?.[1];
}

export function createSessionCookie(userId: string): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `ba_uid=${userId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${secure}`;
}

export function getOrCreateUserId(request: Request): {
  userId: string;
  isNew: boolean;
} {
  const existing = parseSessionUserId(request);
  if (existing) {
    return { userId: existing, isNew: false };
  }
  return { userId: crypto.randomUUID(), isNew: true };
}

export function withSessionCookie(
  response: Response,
  userId: string,
  isNew: boolean
): Response {
  if (!isNew) return response;
  const headers = new Headers(response.headers);
  headers.append("Set-Cookie", createSessionCookie(userId));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
