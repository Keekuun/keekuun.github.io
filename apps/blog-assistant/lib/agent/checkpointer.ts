import { MemorySaver } from "@langchain/langgraph";
import { isDatabaseEnabled } from "@/lib/db/pool";

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

export async function resolveCheckpointer() {
  if (isDatabaseEnabled()) {
    return getPostgresCheckpointer();
  }
  return getMemoryCheckpointer();
}

export function getCheckpointerKind(): "postgres" | "memory" {
  return isDatabaseEnabled() ? "postgres" : "memory";
}
