export function isSearchAuthorized(request: Request): boolean {
  const required = process.env.KB_SEARCH_PASSWORD;
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
