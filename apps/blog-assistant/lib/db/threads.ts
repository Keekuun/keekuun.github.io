import { ensureSchema } from "@/lib/db/schema";
import { getPool, isDatabaseEnabled } from "@/lib/db/pool";

export type ThreadRecord = {
  threadId: string;
  title: string;
  updatedAt: string;
};

function trimTitle(message: string, max = 48): string {
  const oneLine = message.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine || "新会话";
  return `${oneLine.slice(0, max)}…`;
}

export async function upsertThread(
  userId: string,
  threadId: string,
  firstMessage?: string
): Promise<void> {
  if (!isDatabaseEnabled()) return;
  await ensureSchema();
  const title = firstMessage ? trimTitle(firstMessage) : "新会话";
  await getPool().query(
    `INSERT INTO assistant_threads (thread_id, user_id, title, updated_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (thread_id) DO UPDATE SET
       updated_at = NOW(),
       title = CASE
         WHEN assistant_threads.title = '新会话' AND EXCLUDED.title <> '新会话'
         THEN EXCLUDED.title
         ELSE assistant_threads.title
       END`,
    [threadId, userId, title]
  );
}

export async function touchThread(threadId: string): Promise<void> {
  if (!isDatabaseEnabled()) return;
  await ensureSchema();
  await getPool().query(
    `UPDATE assistant_threads SET updated_at = NOW() WHERE thread_id = $1`,
    [threadId]
  );
}

export async function listThreads(userId: string): Promise<ThreadRecord[]> {
  if (!isDatabaseEnabled()) return [];
  await ensureSchema();
  const { rows } = await getPool().query<{
    thread_id: string;
    title: string;
    updated_at: Date;
  }>(
    `SELECT thread_id, title, updated_at
     FROM assistant_threads
     WHERE user_id = $1
     ORDER BY updated_at DESC
     LIMIT 50`,
    [userId]
  );
  return rows.map((row) => ({
    threadId: row.thread_id,
    title: row.title,
    updatedAt: row.updated_at.toISOString(),
  }));
}

export async function getThreadOwner(threadId: string): Promise<string | null> {
  if (!isDatabaseEnabled()) return null;
  await ensureSchema();
  const { rows } = await getPool().query<{ user_id: string }>(
    `SELECT user_id FROM assistant_threads WHERE thread_id = $1`,
    [threadId]
  );
  return rows[0]?.user_id ?? null;
}

export async function assertThreadAccess(
  userId: string,
  threadId: string
): Promise<boolean> {
  if (!isDatabaseEnabled()) return true;
  const owner = await getThreadOwner(threadId);
  if (!owner) return true;
  return owner === userId;
}

export async function deleteThread(
  userId: string,
  threadId: string
): Promise<boolean> {
  if (!isDatabaseEnabled()) return false;
  await ensureSchema();
  const { rowCount } = await getPool().query(
    `DELETE FROM assistant_threads WHERE thread_id = $1 AND user_id = $2`,
    [threadId, userId]
  );
  return (rowCount ?? 0) > 0;
}

export { trimTitle };
