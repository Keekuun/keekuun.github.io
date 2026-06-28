import { isDatabaseConfigured } from "@/lib/db/pool";

export const PERSISTENCE_HEADER = "x-blog-assistant-persistence";

/** 服务端是否配置了 DATABASE_URL（可在页面主动开启） */
export function isPersistenceAvailable(): boolean {
  return isDatabaseConfigured();
}

/** 本次请求是否使用 Neon Postgres checkpoint / 会话表 */
export function isPersistenceRequested(request: Request): boolean {
  if (!isDatabaseConfigured()) return false;
  const value = request.headers.get(PERSISTENCE_HEADER)?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "yes";
}
