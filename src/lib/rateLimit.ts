/**
 * Minimal in-memory sliding-window rate limiter for public endpoints. Per
 * server instance (resets on restart, not shared across instances) — enough to
 * blunt casual abuse/spam of the public contact form. For multi-instance
 * deployments, back this with Redis/Upstash.
 */
const hits = new Map<string, number[]>();

export interface RateLimitResult {
  ok: boolean;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit: number, windowMs: number): RateLimitResult {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= limit) {
    const oldest = recent[0];
    hits.set(key, recent);
    return { ok: false, retryAfterSeconds: Math.ceil((windowMs - (now - oldest)) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  return { ok: true, retryAfterSeconds: 0 };
}
