export function isPasswordGateEnabled(): boolean {
  return Boolean(process.env.KB_SEARCH_PASSWORD?.trim());
}

/** 未设密码时 -1（不限）；设密码后默认 3 次/天/IP；0 表示禁止无密码检索 */
export function getAnonymousDailyLimit(): number {
  if (!isPasswordGateEnabled()) return -1;
  const raw = process.env.KB_ANONYMOUS_DAILY_SEARCH_LIMIT?.trim();
  if (raw === undefined || raw === "") return 3;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : 3;
}

export function isChatRequiresPassword(): boolean {
  return isPasswordGateEnabled();
}

export function matchKbPassword(request: Request): boolean {
  const required = process.env.KB_SEARCH_PASSWORD?.trim();
  if (!required) return true;

  const header = request.headers.get("x-kb-password");
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

/** 已填写正确访问密码（可无限检索 + AI 总结） */
export function isSearchAuthorized(request: Request): boolean {
  return matchKbPassword(request);
}
