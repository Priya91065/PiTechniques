/**
 * Standalone, idempotent seed for the policy pages. Inserts the 4 pages from the
 * HTML source of truth if the table is empty. Run: npx tsx prisma/seed-policy.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { POLICY_PAGES_HTML, POLICY_SLUGS } from "../src/constants/policyPagesHtml";

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

async function main(): Promise<void> {
  const existing = await prisma.policyPage.count();
  if (existing > 0) {
    console.log(`✔ Policy pages already seeded (${existing}) — skipping.`);
    return;
  }
  for (const slug of POLICY_SLUGS) {
    const p = POLICY_PAGES_HTML[slug];
    await prisma.policyPage.create({
      data: {
        slug: p.slug,
        pageClass: p.pageClass,
        heading: p.heading,
        bannerDescription: p.bannerDescription,
        contentClassName: p.contentClassName,
        contentHtml: p.contentHtml,
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        status: "PUBLISHED",
      },
    });
  }
  console.log(`✔ Policy pages: ${POLICY_SLUGS.length} inserted.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
