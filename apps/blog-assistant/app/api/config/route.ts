import { NextResponse } from "next/server";
import { getCheckpointerKind } from "@/lib/agent/checkpointer";
import { isDatabaseEnabled } from "@/lib/db/pool";
import {
  getAnonymousDailyLimit,
  isPasswordGateEnabled,
} from "@/lib/auth";
import { isDemoMode, isProductionReady } from "@/lib/demo-mode";

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
    database: isDatabaseEnabled(),
    checkpointer: getCheckpointerKind(),
    langsmith: Boolean(
      process.env.LANGCHAIN_TRACING_V2 === "true" &&
        process.env.LANGCHAIN_API_KEY
    ),
    blogBaseUrl:
      process.env.NEXT_PUBLIC_BLOG_BASE_URL || "https://blog.zkkysqs.top",
  });
}
