import { MemorySaver } from "@langchain/langgraph";
import { isDatabaseConfigured } from "@/lib/db/pool";

export type CheckpointerMode = "memory" | "postgres";

let memorySaver: MemorySaver | undefined;
let postgresSaver: unknown;
let postgresInit: Promise<unknown> | undefined;

function getMemoryCheckpointer(): MemorySaver {
  if (!memorySaver) {
    memorySaver = new MemorySaver();
  }
  return memorySaver;
}

async function getPostgresCheckpointer() {
  if (postgresSaver) return postgresSaver;
  if (!postgresInit) {
    postgresInit = (async () => {
      const { PostgresSaver } = await import(
        "@langchain/langgraph-checkpoint-postgres"
      );
      const { getPool } = await import("@/lib/db/pool");
      const saver = new PostgresSaver(getPool());
      await saver.setup();
      postgresSaver = saver;
      return saver;
    })();
  }
  return postgresInit;
}

export async function resolveCheckpointer(mode: CheckpointerMode = "memory") {
  if (mode === "postgres" && isDatabaseConfigured()) {
    return getPostgresCheckpointer();
  }
  return getMemoryCheckpointer();
}

export function getCheckpointerKind(mode: CheckpointerMode = "memory"): CheckpointerMode {
  return mode === "postgres" && isDatabaseConfigured() ? "postgres" : "memory";
}

/** 删除 thread 的全部 checkpoint（配合会话删除，避免 Postgres 膨胀） */
export async function deleteThreadCheckpoint(threadId: string): Promise<void> {
  if (!isDatabaseConfigured()) return;
  const saver = (await getPostgresCheckpointer()) as {
    deleteThread?: (id: string) => Promise<void>;
  };
  if (typeof saver.deleteThread === "function") {
    await saver.deleteThread(threadId);
  }
}
