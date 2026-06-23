import crypto from "node:crypto";
import { prisma } from "@/lib/db";

/**
 * Refresh-token sessions (Node only — uses crypto + Prisma). The raw refresh
 * token lives in an httpOnly cookie; only its SHA-256 hash is stored in the DB,
 * so a database leak can't be replayed.
 */
export function generateRefreshToken(): string {
  return crypto.randomBytes(48).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createSession(params: {
  userId: string;
  rawToken: string;
  ttlSeconds: number;
  userAgent?: string | null;
  ipAddress?: string | null;
}): Promise<void> {
  await prisma.session.create({
    data: {
      userId: params.userId,
      refreshTokenHash: hashRefreshToken(params.rawToken),
      expiresAt: new Date(Date.now() + params.ttlSeconds * 1000),
      userAgent: params.userAgent ?? null,
      ipAddress: params.ipAddress ?? null,
    },
  });
}

export async function revokeSessionByToken(rawToken: string): Promise<void> {
  await prisma.session.updateMany({
    where: { refreshTokenHash: hashRefreshToken(rawToken), revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

/** Returns the owning userId for a still-valid (unrevoked, unexpired) session. */
export async function findValidSessionUserId(rawToken: string): Promise<string | null> {
  const session = await prisma.session.findUnique({
    where: { refreshTokenHash: hashRefreshToken(rawToken) },
  });
  if (!session || session.revokedAt || session.expiresAt < new Date()) return null;
  return session.userId;
}
