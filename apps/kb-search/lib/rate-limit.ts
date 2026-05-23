import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { getAnonymousDailyLimit, isPasswordGateEnabled } from "./auth";

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  limit: number;
  reset?: number;
};

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}

let ratelimit: Ratelimit | null | undefined;

function getUpstashRatelimit(): Ratelimit | null {
  if (ratelimit !== undefined) return ratelimit;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    ratelimit = null;
    return null;
  }

  const limit = getAnonymousDailyLimit();
  ratelimit = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.fixedWindow(limit, "1 d"),
    prefix: "kb-search-anon",
    analytics: true,
  });
  return ratelimit;
}

const memoryBuckets = new Map<string, { day: string; count: number }>();

function memoryRateLimit(ip: string, limit: number): RateLimitResult {
  const day = new Date().toISOString().slice(0, 10);
  const key = `${ip}:${day}`;
  const entry = memoryBuckets.get(key);
  const count = entry?.day === day ? entry.count : 0;

  if (count >= limit) {
    return { allowed: false, remaining: 0, limit };
  }

  memoryBuckets.set(key, { day, count: count + 1 });
  if (memoryBuckets.size > 5000) {
    const today = day;
    for (const [k] of memoryBuckets) {
      if (!k.endsWith(today)) memoryBuckets.delete(k);
    }
  }

  return { allowed: true, remaining: limit - count - 1, limit };
}

export async function checkAnonymousSearchLimit(
  request: Request
): Promise<RateLimitResult> {
  const limit = getAnonymousDailyLimit();
  if (!isPasswordGateEnabled() || limit < 0) {
    return { allowed: true, remaining: -1, limit: -1 };
  }
  if (limit === 0) {
    return { allowed: false, remaining: 0, limit: 0 };
  }

  const ip = getClientIp(request);
  const rl = getUpstashRatelimit();
  if (rl) {
    const { success, remaining, reset } = await rl.limit(ip);
    return {
      allowed: success,
      remaining: Math.max(0, remaining),
      limit,
      reset,
    };
  }

  return memoryRateLimit(ip, limit);
}

export function rateLimitHeaders(result: RateLimitResult): HeadersInit {
  if (result.limit < 0) return {};
  const headers: Record<string, string> = {
    "X-RateLimit-Limit": String(result.limit),
    "X-RateLimit-Remaining": String(Math.max(0, result.remaining)),
  };
  if (result.reset) {
    headers["X-RateLimit-Reset"] = String(result.reset);
  }
  return headers;
}
