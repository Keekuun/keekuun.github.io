import pg from "pg";

let pool: pg.Pool | undefined;

export function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("未配置 DATABASE_URL");
    }
    pool = new pg.Pool({
      connectionString,
      max: Number(process.env.DATABASE_POOL_MAX) || 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

/** @deprecated 使用 isDatabaseConfigured；是否写入 DB 还取决于请求头 */
export function isDatabaseEnabled(): boolean {
  return isDatabaseConfigured();
}
