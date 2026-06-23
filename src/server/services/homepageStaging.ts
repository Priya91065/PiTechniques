import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getBannerRow, listStats, upsertBanner, SEED_DEFAULTS } from "@/server/services/banner";
import { getAboutRow, upsertAbout } from "@/server/services/about";

export interface SnapshotStat {
  value: number;
  label: string;
  suffix: string;
  published: boolean;
  order: number;
}

export interface HomepageData {
  banner: {
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
  };
  about: {
    whoEyebrow: string;
    whoTitle: string;
    whoParagraphs: string[];
    whoCtaLabel: string;
    whoCtaHref: string;
    aboutImage: string | null;
  };
  stats: SnapshotStat[];
}

/** Snapshot the current live (draft) state of the homepage-owned sections. */
export async function serializeLive(): Promise<HomepageData> {
  const [banner, about, stats] = await Promise.all([getBannerRow(), getAboutRow(), listStats()]);
  return {
    banner: banner ?? {
      heroTitle: SEED_DEFAULTS.heroTitle,
      heroSubtitle: SEED_DEFAULTS.heroSubtitle,
      heroCtaLabel: SEED_DEFAULTS.heroCtaLabel,
      heroCtaHref: SEED_DEFAULTS.heroCtaHref,
      heroCtaNewTab: false,
      bannerImage: null,
      bannerVideo: null,
      bannerAlt: null,
      bannerImageTitle: null,
      showBanner: true,
      showStats: true,
    },
    about: about ?? {
      whoEyebrow: SEED_DEFAULTS.whoEyebrow,
      whoTitle: SEED_DEFAULTS.whoTitle,
      whoParagraphs: SEED_DEFAULTS.whoParagraphs,
      whoCtaLabel: SEED_DEFAULTS.whoCtaLabel,
      whoCtaHref: SEED_DEFAULTS.whoCtaHref,
      aboutImage: null,
    },
    stats: stats.map((s) => ({ value: s.value, label: s.label, suffix: s.suffix, published: s.published, order: s.order })),
  };
}

export async function getPublishedData(): Promise<HomepageData | null> {
  const row = await prisma.homepageSnapshot.findUnique({ where: { id: "published" } });
  return row ? (row.data as unknown as HomepageData) : null;
}

/** Copy the current draft (live tables) into the published snapshot. */
export async function publishHomepage(): Promise<void> {
  const data = await serializeLive();
  await prisma.homepageSnapshot.upsert({
    where: { id: "published" },
    update: { data: data as unknown as Prisma.InputJsonValue },
    create: { id: "published", data: data as unknown as Prisma.InputJsonValue },
  });
}

/** Revert the draft (live tables) back to the last published snapshot. */
export async function discardDraft(): Promise<boolean> {
  const published = await getPublishedData();
  if (!published) return false;
  await upsertBanner(published.banner);
  await upsertAbout({ ...published.about });
  await prisma.$transaction([
    prisma.homeStat.deleteMany({}),
    prisma.homeStat.createMany({
      data: published.stats.map((s) => ({ value: s.value, label: s.label, suffix: s.suffix, published: s.published, order: s.order })),
    }),
  ]);
  return true;
}

/** Deterministic JSON with sorted keys — Postgres jsonb doesn't preserve key order. */
function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return `{${Object.keys(obj)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value ?? null);
}

/** True when the draft differs from the published snapshot. */
export async function hasUnpublishedChanges(): Promise<boolean> {
  const [live, published] = await Promise.all([serializeLive(), getPublishedData()]);
  if (!published) return true;
  return stableStringify(live) !== stableStringify(published);
}
