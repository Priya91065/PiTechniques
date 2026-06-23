import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { loginSchema } from "@/lib/validation/auth";
import { verifyPassword } from "@/lib/auth/password";
import { signAccessToken } from "@/lib/auth/jwt";
import { createSession, generateRefreshToken } from "@/lib/auth/session";
import { ACCESS_COOKIE, REFRESH_COOKIE, cookieBase, ttlToSeconds } from "@/lib/auth/cookies";
import { jsonError } from "@/lib/api/http";

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
  }
  const { email, password } = parsed.data;

  try {
    // Generic message on every failure path to avoid user enumeration.
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) return jsonError("Invalid email or password", 401);

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return jsonError("Invalid email or password", 401);

    const accessTtl = process.env.JWT_ACCESS_TTL || "15m";
    const refreshTtl = process.env.JWT_REFRESH_TTL || "7d";

    const accessToken = await signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });
    const refreshToken = generateRefreshToken();

    await createSession({
      userId: user.id,
      rawToken: refreshToken,
      ttlSeconds: ttlToSeconds(refreshTtl),
      userAgent: req.headers.get("user-agent"),
      ipAddress: req.headers.get("x-forwarded-for"),
    });

    await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "LOGIN",
        entityType: "User",
        entityId: user.id,
        summary: `${user.email} signed in`,
      },
    });

    const res = NextResponse.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
    res.cookies.set(ACCESS_COOKIE, accessToken, { ...cookieBase, maxAge: ttlToSeconds(accessTtl) });
    res.cookies.set(REFRESH_COOKIE, refreshToken, { ...cookieBase, maxAge: ttlToSeconds(refreshTtl) });
    return res;
  } catch (err) {
    // Database unreachable / not migrated / not seeded → clear, actionable message.
    if (
      err instanceof Prisma.PrismaClientInitializationError ||
      err instanceof Prisma.PrismaClientKnownRequestError
    ) {
      console.error("[login] database error:", err.message);
      return jsonError(
        "Can't reach the database. Set DATABASE_URL in .env to a running PostgreSQL, then run `npm run db:migrate` and `npm run db:seed`.",
        503,
        "DB_UNAVAILABLE",
      );
    }
    console.error("[login] unexpected error:", err);
    return jsonError("Something went wrong. Please try again.", 500, "INTERNAL");
  }
}
