import type { BannerRow } from "@/server/services/banner";
import { getPublishedHomepage } from "@/server/content/homepage";

export interface PublicStat {
  value: number;
  label: string;
  suffix: string;
}

/** Defaults keep the hero pixel-perfect before the DB row exists. */
const BANNER_FALLBACK: BannerRow = {
  heroTitle: "Systems and platforms\nbuilt with care, and\ndesigned with purpose",
  heroSubtitle: "Every build is thought through, every design intentional.",
  heroCtaLabel: "Solutions offered",
  heroCtaHref: "/services",
  heroCtaNewTab: false,
  bannerImage: null,
  bannerVideo: null,
  bannerAlt: null,
  bannerImageTitle: null,
  showBanner: true,
  showStats: true,
};

const STATS_FALLBACK: PublicStat[] = [
  { value: 100, label: "NUMBER OF CLIENTS", suffix: "+" },
  { value: 500, label: "PROJECTS DELIVERED", suffix: "+" },
  { value: 15, label: "INDUSTRIES SERVED", suffix: "+" },
];

/** Banner/hero content from the PUBLISHED homepage snapshot; falls back to the original copy. */
export async function getBanner(): Promise<BannerRow> {
  const hp = await getPublishedHomepage();
  return hp?.banner ?? BANNER_FALLBACK;
}

/** Published statistic counters from the snapshot (published + ordered); falls back to the original three. */
export async function getHomeStats(): Promise<PublicStat[]> {
  const hp = await getPublishedHomepage();
  if (!hp) return STATS_FALLBACK;
  const visible = hp.stats
    .filter((s) => s.published)
    .sort((a, b) => a.order - b.order)
    .map((s) => ({ value: s.value, label: s.label, suffix: s.suffix }));
  return visible.length > 0 ? visible : STATS_FALLBACK;
}
