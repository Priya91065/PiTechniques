/**
 * Standalone, idempotent seed for navigation items only — safe to run against
 * the live DB without touching other content. Inserts the original four header
 * links if (and only if) no HEADER nav items exist yet.
 *
 * Run:  npx tsx prisma/seed-nav.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

// tsx does not auto-load .env; parse it manually so DATABASE_URL is set.
if (!process.env.DATABASE_URL) {
  try {
    const env = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of env.split("\n")) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    // .env not found — rely on the ambient environment.
  }
}

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const existing = await prisma.navItem.count({ where: { location: "HEADER" } });
  if (existing > 0) {
    console.log(`✔ Navigation already seeded (${existing} header items) — skipping.`);
    return;
  }
  await prisma.navItem.createMany({
    data: [
      { label: "About us", href: "/about", location: "HEADER", order: 0, published: true },
      { label: "Services", href: "/services", location: "HEADER", order: 1, published: true },
      { label: "Case studies", href: "/case-studies", location: "HEADER", order: 2, published: true },
      { label: "Careers", href: "/careers", location: "HEADER", order: 3, published: true },
    ],
  });
  console.log("✔ Navigation: 4 header items inserted.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
