import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 *
 * In dev, Next.js hot-reload re-imports modules frequently; without caching on
 * `globalThis` you'd exhaust DB connections by creating a new client each time.
 * In production a single instance is created per server instance.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

/**
 * Resolve the connection string at runtime. Primary is DATABASE_URL (what the
 * Prisma schema and migrations use). As a safety net we also accept the names
 * Vercel Postgres injects automatically (POSTGRES_PRISMA_URL / POSTGRES_URL),
 * so a Vercel-managed database works even if a DATABASE_URL var wasn't added by
 * hand. Local dev and a normally-configured DATABASE_URL are unaffected.
 */
const connectionUrl =
  process.env.DATABASE_URL ?? process.env.POSTGRES_PRISMA_URL ?? process.env.POSTGRES_URL;

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(connectionUrl ? { datasources: { db: { url: connectionUrl } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
