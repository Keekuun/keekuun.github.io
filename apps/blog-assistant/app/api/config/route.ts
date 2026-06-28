import { NextResponse } from "next/server";
import { getCheckpointerKind } from "@/lib/agent/checkpointer";
import { isPersistenceAvailable } from "@/lib/persistence";
import {
  getAnonymousDailyLimit,
  isPasswordGateEnabled,
} from "@/lib/auth";
import { isDemoMode, isProductionReady } from "@/lib/demo-mode";
import { getRouterModeLabel } from "@/lib/agent/llm-router";
import { isRerankEnabled } from "@/lib/rag/rerank";
import { getHydeMode } from "@/lib/rag/hyde";
import { RAG_MAX_HISTORY_TURNS } from "@/lib/rag/types";

export const runtime = "nodejs";

export async function GET() {
  const limit = getAnonymousDailyLimit();
  return NextResponse.json({
    passwordGate: isPasswordGateEnabled(),
    anonymousDailyLimit: limit,
    demo: isDemoMode(),
    productionReady: isProductionReady(),
    redisRateLimit: Boolean(
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ),
    database: isPersistenceAvailable(),
    persistenceAvailable: isPersistenceAvailable(),
    defaultPersistence: false,
    checkpointer: getCheckpointerKind("memory"),
    langsmith: Boolean(
      process.env.LANGCHAIN_TRACING_V2 === "true" &&
        process.env.LANGCHAIN_API_KEY
    ),
    blogBaseUrl:
      process.env.NEXT_PUBLIC_BLOG_BASE_URL || "https://blog.zkkysqs.top",
    routerMode: getRouterModeLabel(),
    ragRerank: isRerankEnabled(),
    ragMaxHistoryTurns: RAG_MAX_HISTORY_TURNS,
    ragHyde: getHydeMode(),
  });
}
