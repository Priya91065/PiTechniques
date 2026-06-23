import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";
import { verifyAccessToken, type AccessPayload } from "@/lib/auth/jwt";

/**
 * Reads + verifies the current admin user from the access-token cookie.
 * Server-only (uses next/headers). Returns null when unauthenticated.
 */
export async function getCurrentUser(): Promise<AccessPayload | null> {
  const store = await cookies();
  const token = store.get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  return verifyAccessToken(token);
}
