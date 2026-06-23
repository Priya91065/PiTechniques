import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import { ACCESS_COOKIE, REFRESH_COOKIE, cookieBase, ttlToSeconds } from "@/lib/auth/cookies";
import { findValidSessionUserId } from "@/lib/auth/session";
import { signAccessToken } from "@/lib/auth/jwt";
import { jsonError } from "@/lib/api/http";

/** Issues a fresh access token from a valid refresh-token session. */
export async function POST(): Promise<NextResponse> {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return jsonError("Unauthorized", 401);

  const userId = await findValidSessionUserId(refreshToken);
  if (!userId) return jsonError("Unauthorized", 401);

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.isActive) return jsonError("Unauthorized", 401);

  const accessToken = await signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE, accessToken, {
    ...cookieBase,
    maxAge: ttlToSeconds(process.env.JWT_ACCESS_TTL || "15m"),
  });
  return res;
}
