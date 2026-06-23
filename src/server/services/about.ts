import { prisma } from "@/lib/db";
import type { AboutInput } from "@/lib/validation/about";
import { SEED_DEFAULTS } from "@/server/services/banner";

function nz(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length > 0 ? t : null;
}

export interface AboutRow {
  whoEyebrow: string;
  whoTitle: string;
  whoParagraphs: string[];
  whoCtaLabel: string;
  whoCtaHref: string;
  aboutImage: string | null;
}

const SELECT = {
  whoEyebrow: true,
  whoTitle: true,
  whoParagraphs: true,
  whoCtaLabel: true,
  whoCtaHref: true,
  aboutImage: true,
} as const;

export function getAboutRow(): Promise<AboutRow | null> {
  return prisma.homeContent.findUnique({ where: { id: "home" }, select: SELECT });
}

export function upsertAbout(data: AboutInput): Promise<AboutRow> {
  const fields = {
    whoEyebrow: data.whoEyebrow,
    whoTitle: data.whoTitle,
    whoParagraphs: data.whoParagraphs,
    whoCtaLabel: data.whoCtaLabel,
    whoCtaHref: data.whoCtaHref,
    aboutImage: nz(data.aboutImage),
  };
  return prisma.homeContent.upsert({
    where: { id: "home" },
    update: fields,
    create: { id: "home", ...SEED_DEFAULTS, ...fields },
    select: SELECT,
  });
}
