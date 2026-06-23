import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/cookies";
import { revokeSessionByToken } from "@/lib/auth/session";

export async function POST(): Promise<NextResponse> {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;
  if (refreshToken) {
    try {
      await revokeSessionByToken(refreshToken);
    } catch {
      // Best-effort revoke; clearing the cookies below still logs the user out.
    }
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ACCESS_COOKIE, "", { path: "/", maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
