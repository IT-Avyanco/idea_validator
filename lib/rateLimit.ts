/**
 * lib/rateLimit.ts
 * Server-side IP rate-limiting utility.
 * Keeps track of request timestamps per IP in an in-memory Map attached to globalThis.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const globalForRateLimit = globalThis as unknown as {
  rateLimitMap?: Map<string, RateLimitRecord>;
};

export const rateLimitMap =
  globalForRateLimit.rateLimitMap ?? new Map<string, RateLimitRecord>();

if (process.env.NODE_ENV !== "production") {
  globalForRateLimit.rateLimitMap = rateLimitMap;
}

// 24 hours in milliseconds
const DEFAULT_WINDOW_MS = 24 * 60 * 60 * 1000;
const DEFAULT_LIMIT = 3;

interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetTime: number; // timestamp when the oldest request expires and frees up a slot
}

/**
 * Checks if a given IP is allowed to perform a validation based on the 24-hour rate limit.
 * Filters out expired timestamps in the process.
 */
export function checkRateLimit(
  ip: string,
  limit: number = DEFAULT_LIMIT,
  windowMs: number = DEFAULT_WINDOW_MS
): RateLimitStatus {
  const now = Date.now();
  let record = rateLimitMap.get(ip);

  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(ip, record);
  }

  // Filter out timestamps that are older than the sliding window
  record.timestamps = record.timestamps.filter((time) => now - time < windowMs);

  const count = record.timestamps.length;
  const allowed = count < limit;
  const remaining = Math.max(0, limit - count);

  // Calculate when a slot will free up (reset time)
  let resetTime = now + windowMs;
  if (record.timestamps.length > 0) {
    resetTime = record.timestamps[0] + windowMs;
  }

  return {
    allowed,
    remaining,
    resetTime,
  };
}

/**
 * Records a successful request timestamp for the given IP.
 */
export function recordRequest(ip: string): void {
  let record = rateLimitMap.get(ip);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(ip, record);
  }
  record.timestamps.push(Date.now());
  console.log(`[Rate Limit] Logged request for IP: ${ip}. Count in last 24h: ${record.timestamps.length}`);
}
