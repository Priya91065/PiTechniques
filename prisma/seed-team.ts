/**
 * Standalone, idempotent seed for team members only — safe to run against the
 * live DB without touching other content. Imports the original About-page
 * constants and inserts them if the table is empty.
 *
 * Run:  npx tsx prisma/seed-team.ts
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaClient } from "@prisma/client";
import { leaders, executives, type TeamMember } from "../src/constants/aboutTeam";

// tsx does not auto-load .env; parse it manually so DATABASE_URL is set.
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

/** Pull the `col-xl-N` span out of the bootstrap column class string. */
function colSpanOf(col: string): number {
  const m = /col-xl-(\d+)/.exec(col);
  const n = m ? Number(m[1]) : 4;
  return n === 6 || n === 12 ? n : 4;
}

function rows(list: TeamMember[], group: "leadership" | "executive"): Array<{
  name: string;
  role: string;
  photo: string;
  photoMobile: string | null;
  colSpan: number;
  cardMb0: boolean;
  linkedin: string | null;
  group: string;
  order: number;
  published: boolean;
}> {
  return list.map((m, i) => ({
    name: m.name.trim(),
    role: m.role,
    photo: m.img ?? m.imgDesktop ?? "",
    photoMobile: m.imgMobile ?? null,
    colSpan: colSpanOf(m.col),
    cardMb0: m.cardMb0 ?? false,
    linkedin: m.linkedin ?? null,
    group,
    order: i,
    published: true,
  }));
}

async function main(): Promise<void> {
  const existing = await prisma.teamMember.count();
  if (existing > 0) {
    console.log(`✔ Team already seeded (${existing} members) — skipping.`);
    return;
  }
  const data = [...rows(leaders, "leadership"), ...rows(executives, "executive")];
  await prisma.teamMember.createMany({ data });
  console.log(`✔ Team: ${data.length} members inserted (${leaders.length} leadership, ${executives.length} executive).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
