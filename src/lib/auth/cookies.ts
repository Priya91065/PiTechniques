/** Cookie names + helpers shared by the API routes and middleware (edge-safe). */
export const ACCESS_COOKIE = "pi_at";
export const REFRESH_COOKIE = "pi_rt";

/** Convert a TTL string like "15m" / "7d" into seconds. */
export function ttlToSeconds(ttl: string): number {
  const match = ttl.match(/^(\d+)([smhd])$/);
  if (!match) return 0;
  const value = Number(match[1]);
  const unit = match[2] as "s" | "m" | "h" | "d";
  const multipliers: Record<"s" | "m" | "h" | "d", number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return value * multipliers[unit];
}

/** Shared cookie attributes (httpOnly, secure in prod, lax same-site). */
export const cookieBase = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
