import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  ABOUT_PAGE_SEED_DEFAULTS,
  getAboutContentRow,
  listWhyChooseFeatures,
  upsertAboutContent,
} from "@/server/services/aboutPage";

export interface AboutPageContentData {
  bannerTitle: string;
  bannerSubtitle: string | null;
  bannerImage: string | null;
  breadcrumb: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  showBanner: boolean;

  introEyebrow: string | null;
  introTitle: string;
  introDescription: string;
  introImage: string | null;
  introCtaLabel: string | null;
  introCtaHref: string | null;

  whyHeading: string | null;
  whyTitle: string | null;
  whyDescription: string | null;
  whyImage: string | null;
  showWhySection: boolean;

  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  twitterImage: string | null;
  robotsMeta: string | null;
}

export interface SnapshotWhyChooseFeature {
  title: string;
  description: string;
  icon: string | null;
  published: boolean;
  order: number;
}

export interface AboutPageData {
  content: AboutPageContentData;
  steps: SnapshotWhyChooseFeature[];
}

const DEFAULT_CONTENT: AboutPageContentData = { ...ABOUT_PAGE_SEED_DEFAULTS };

/** Snapshot the current live (draft) state of the About-page-owned sections. */
export async function serializeLiveAbout(): Promise<AboutPageData> {
  const [content, steps] = await Promise.all([getAboutContentRow(), listWhyChooseFeatures()]);
  return {
    content: content ?? DEFAULT_CONTENT,
    steps: steps.map((s) => ({
      title: s.title,
      description: s.description,
      icon: s.icon,
      published: s.published,
      order: s.order,
    })),
  };
}

export async function getPublishedAboutData(): Promise<AboutPageData | null> {
  const row = await prisma.aboutSnapshot.findUnique({ where: { id: "published" } });
  return row ? (row.data as unknown as AboutPageData) : null;
}

/** Copy the current draft (live tables) into the published snapshot. */
export async function publishAboutPage(): Promise<void> {
  const data = await serializeLiveAbout();
  await prisma.aboutSnapshot.upsert({
    where: { id: "published" },
    update: { data: data as unknown as Prisma.InputJsonValue },
    create: { id: "published", data: data as unknown as Prisma.InputJsonValue },
  });
}

/** Revert the draft (live tables) back to the last published snapshot. */
export async function discardAboutDraft(): Promise<boolean> {
  const published = await getPublishedAboutData();
  if (!published) return false;
  await upsertAboutContent({ ...published.content });
  await prisma.$transaction([
    prisma.whyChooseFeature.deleteMany({}),
    prisma.whyChooseFeature.createMany({
      data: published.steps.map((s) => ({
        title: s.title,
        description: s.description,
        icon: s.icon,
        published: s.published,
        order: s.order,
      })),
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
export async function hasUnpublishedAboutChanges(): Promise<boolean> {
  const [live, published] = await Promise.all([serializeLiveAbout(), getPublishedAboutData()]);
  if (!published) return true;
  return stableStringify(live) !== stableStringify(published);
}
