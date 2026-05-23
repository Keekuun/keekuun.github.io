import { NextResponse } from "next/server";
import {
  getAnonymousDailyLimit,
  isChatRequiresPassword,
  isPasswordGateEnabled,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const limit = getAnonymousDailyLimit();
  return NextResponse.json({
    passwordGate: isPasswordGateEnabled(),
    anonymousDailySearchLimit: limit,
    chatRequiresPassword: isChatRequiresPassword(),
    redisRateLimit: Boolean(
      process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ),
  });
}
