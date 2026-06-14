// Lightweight in-memory token-bucket rate limiter for server functions.
// State is per Worker isolate — not perfect across edge regions, but
// effectively blocks single-source flooding from one client/script.

type Bucket = { tokens: number; updated: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  opts: { capacity: number; refillPerSec: number },
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const existing = buckets.get(key);
  const bucket: Bucket = existing ?? { tokens: opts.capacity, updated: now };
  const elapsed = (now - bucket.updated) / 1000;
  bucket.tokens = Math.min(opts.capacity, bucket.tokens + elapsed * opts.refillPerSec);
  bucket.updated = now;
  if (bucket.tokens < 1) {
    buckets.set(key, bucket);
    const retryAfter = Math.ceil((1 - bucket.tokens) / opts.refillPerSec);
    return { ok: false, retryAfter };
  }
  bucket.tokens -= 1;
  buckets.set(key, bucket);
  // Opportunistic cleanup so the Map doesn't grow unbounded.
  if (buckets.size > 5000) {
    const cutoff = now - 60_000;
    for (const [k, b] of buckets) if (b.updated < cutoff) buckets.delete(k);
  }
  return { ok: true, retryAfter: 0 };
}

export function getClientIp(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}