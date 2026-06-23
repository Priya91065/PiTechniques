import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton.
 *
 * In dev, Next.js hot-reload re-imports modules frequently; without caching on
 * `globalThis` you'd exhaust DB connections by creating a new client each time.
 * In production a single instance is created per server instance.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
