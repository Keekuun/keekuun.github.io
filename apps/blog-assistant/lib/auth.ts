export function getAccessPassword(): string | undefined {
  const fromAssistant = process.env.BLOG_ASSISTANT_PASSWORD?.trim();
  const fromKb = process.env.KB_SEARCH_PASSWORD?.trim();
  return fromAssistant || fromKb || undefined;
}

export function isPasswordGateEnabled(): boolean {
  return Boolean(getAccessPassword());
}

/** 未设密码时 -1（不限） */
export function getAnonymousDailyLimit(): number {
  if (!isPasswordGateEnabled()) return -1;
  const raw = process.env.BLOG_ASSISTANT_DAILY_LIMIT?.trim();
  if (raw === undefined || raw === "") return 20;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 20;
}

export function isChatAuthorized(request: Request): boolean {
  const required = getAccessPassword();
  if (!required) return true;

  const header =
    request.headers.get("x-blog-assistant-password") ||
    request.headers.get("x-kb-password");
  if (header === required) return true;

  try {
    const url = new URL(request.url);
    const queryPassword = url.searchParams.get("password");
    if (queryPassword === required) return true;
  } catch {
    /* ignore */
  }

  return false;
}
