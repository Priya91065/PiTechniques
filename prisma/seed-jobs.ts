/**
 * Standalone, idempotent seed for job openings — imports the original
 * faithfulJobs constants and inserts them if the table is empty. Preserves the
 * original slugs so existing /career-details?jobTitle=<slug> links keep working.
 *
 * Run:  npx tsx prisma/seed-jobs.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient, Prisma } from "@prisma/client";
import { faithfulJobs, type FaithfulJob } from "../src/constants/faithfulJobs";

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

/** Convert the constant's responsibilities to the DB JSON shape (flat array or grouped). */
function respToJson(r: FaithfulJob["responsibilities"]): Prisma.InputJsonValue | undefined {
  if (!r) return undefined;
  if (Array.isArray(r)) return r;
  return Object.entries(r).map(([heading, items]) => ({ heading, items }));
}

async function main(): Promise<void> {
  const existing = await prisma.job.count();
  if (existing > 0) {
    console.log(`✔ Jobs already seeded (${existing}) — skipping.`);
    return;
  }
  for (let i = 0; i < faithfulJobs.length; i++) {
    const j = faithfulJobs[i];
    const resp = respToJson(j.responsibilities);
    await prisma.job.create({
      data: {
        jobTitle: j.title,
        slug: j.slug,
        jobCode: j.jobcode ?? null,
        experience: j.experience,
        qualifications: j.qualifications,
        responsibilities: resp ?? Prisma.JsonNull,
        skills: j.skills ?? [],
        status: "ACTIVE",
        displayOrder: i,
      },
    });
  }
  console.log(`✔ Jobs: ${faithfulJobs.length} inserted.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
