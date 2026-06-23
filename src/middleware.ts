import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE } from "@/lib/auth/cookies";
import { verifyAccessToken } from "@/lib/auth/jwt";

/**
 * Protects the admin area. Runs on the Edge runtime, so it only verifies the
 * access-token JWT (via `jose`) — no DB access here. Unauthenticated requests
 * are redirected to the login page (for pages) or 401'd (for APIs).
 */
export async function middleware(req: NextRequest): Promise<NextResponse> {
  const { pathname } = req.nextUrl;

  // Public auth surfaces (login page + auth endpoints) bypass the guard.
  if (pathname.startsWith("/admin/login") || pathname.startsWith("/api/admin/auth")) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  const payload = token ? await verifyAccessToken(token) : null;
  if (payload) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
