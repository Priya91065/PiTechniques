import type { HomeStat } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { BannerInput, HomeStatInput } from "@/lib/validation/banner";

function nz(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length > 0 ? t : null;
}

/** Seed defaults used when the HomeContent row doesn't exist yet (create path). */
export const SEED_DEFAULTS = {
  heroTitle: "Systems and platforms\nbuilt with care, and\ndesigned with purpose",
  heroSubtitle: "Every build is thought through, every design intentional.",
  heroCtaLabel: "Solutions offered",
  heroCtaHref: "/services",
  whoEyebrow: "who we are",
  whoTitle: "How we think & build",
  whoParagraphs: [],
  whoCtaLabel: "About us",
  whoCtaHref: "/about",
  statClients: 100,
  statProjects: 500,
  statIndustries: 15,
  servicesEyebrow: "OUR SERVICES",
  servicesTitle: "",
  workEyebrow: "our work",
  workTitle: "",
  clientsEyebrow: "OUR CLIENTS",
  clientsTitle: "",
  testimonialsEyebrow: "TESTIMONIALS",
  testimonialsTitle: "",
};

export interface BannerRow {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  heroCtaNewTab: boolean;
  bannerImage: string | null;
  bannerVideo: string | null;
  bannerAlt: string | null;
  bannerImageTitle: string | null;
  showBanner: boolean;
  showStats: boolean;
}

const SELECT = {
  heroTitle: true,
  heroSubtitle: true,
  heroCtaLabel: true,
  heroCtaHref: true,
  heroCtaNewTab: true,
  bannerImage: true,
  bannerVideo: true,
  bannerAlt: true,
  bannerImageTitle: true,
  showBanner: true,
  showStats: true,
} as const;

export function getBannerRow(): Promise<BannerRow | null> {
  return prisma.homeContent.findUnique({ where: { id: "home" }, select: SELECT });
}

/** Update (or create with seed defaults) the banner fields of the home singleton. */
export function upsertBanner(data: BannerInput): Promise<BannerRow> {
  const fields = {
    heroTitle: data.heroTitle,
    heroSubtitle: data.heroSubtitle,
    heroCtaLabel: data.heroCtaLabel,
    heroCtaHref: data.heroCtaHref,
    heroCtaNewTab: data.heroCtaNewTab ?? false,
    bannerImage: nz(data.bannerImage),
    bannerVideo: nz(data.bannerVideo),
    bannerAlt: nz(data.bannerAlt),
    bannerImageTitle: nz(data.bannerImageTitle),
    showBanner: data.showBanner ?? true,
    showStats: data.showStats ?? true,
  };
  return prisma.homeContent.upsert({
    where: { id: "home" },
    update: fields,
    create: { id: "home", ...SEED_DEFAULTS, ...fields },
    select: SELECT,
  });
}

// ---- Stats / counters --------------------------------------------------------
export function listStats(): Promise<HomeStat[]> {
  return prisma.homeStat.findMany({ orderBy: { order: "asc" } });
}

export async function createStat(data: HomeStatInput): Promise<HomeStat> {
  const max = await prisma.homeStat.aggregate({ _max: { order: true } });
  return prisma.homeStat.create({
    data: {
      value: data.value,
      label: data.label,
      suffix: data.suffix ?? "+",
      published: data.published ?? true,
      order: (max._max.order ?? -1) + 1,
    },
  });
}

export function updateStat(id: string, data: Partial<HomeStatInput>): Promise<HomeStat> {
  return prisma.homeStat.update({
    where: { id },
    data: {
      ...(data.value !== undefined ? { value: data.value } : {}),
      ...(data.label !== undefined ? { label: data.label } : {}),
      ...(data.suffix !== undefined ? { suffix: data.suffix } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
    },
  });
}

export function deleteStat(id: string): Promise<HomeStat> {
  return prisma.homeStat.delete({ where: { id } });
}

export async function reorderStats(ids: string[]): Promise<void> {
  await prisma.$transaction(ids.map((id, index) => prisma.homeStat.update({ where: { id }, data: { order: index } })));
}
