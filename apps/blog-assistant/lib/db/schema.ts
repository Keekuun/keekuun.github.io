import { getPool, isDatabaseEnabled } from "@/lib/db/pool";

const THREADS_DDL = `
CREATE TABLE IF NOT EXISTS assistant_threads (
  thread_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '新会话',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_assistant_threads_user
  ON assistant_threads (user_id, updated_at DESC);
`;

let schemaReady: Promise<void> | undefined;

export async function ensureSchema(): Promise<void> {
  if (!isDatabaseEnabled()) return;
  if (!schemaReady) {
    schemaReady = (async () => {
      const pool = getPool();
      await pool.query(THREADS_DDL);
    })();
  }
  await schemaReady;
}
