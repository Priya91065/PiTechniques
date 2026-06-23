/**
 * Standalone, idempotent seed for the homepage statistic counters. Inserts the
 * original three if the table is empty. Run:  npx tsx prisma/seed-banner.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  try {
    const env = readFileSync(resolve(process.cwd(), ".env"), "utf8");
    for (const line of env.split("\n")) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    // rely on ambient env
  }
}

const prisma = new PrismaClient();

const STATS = [
  { value: 100, label: "NUMBER OF CLIENTS", suffix: "+", order: 0 },
  { value: 500, label: "PROJECTS DELIVERED", suffix: "+", order: 1 },
  { value: 15, label: "INDUSTRIES SERVED", suffix: "+", order: 2 },
];

async function main(): Promise<void> {
  const existing = await prisma.homeStat.count();
  if (existing > 0) {
    console.log(`✔ Home stats already seeded (${existing}) — skipping.`);
    return;
  }
  await prisma.homeStat.createMany({ data: STATS });
  console.log(`✔ Home stats: ${STATS.length} inserted.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
