import { z } from "zod";

export const bannerInput = z.object({
  heroTitle: z.string().trim().min(1, "Heading is required").max(500),
  heroSubtitle: z.string().trim().max(1000),
  heroCtaLabel: z.string().trim().max(100),
  heroCtaHref: z.string().trim().max(500),
  heroCtaNewTab: z.boolean().optional(),
  bannerImage: z.string().trim().max(500).nullable().optional(),
  bannerVideo: z.string().trim().max(500).nullable().optional(),
  bannerAlt: z.string().trim().max(300).nullable().optional(),
  bannerImageTitle: z.string().trim().max(300).nullable().optional(),
  showBanner: z.boolean().optional(),
  showStats: z.boolean().optional(),
});
export type BannerInput = z.infer<typeof bannerInput>;

export const homeStatInput = z.object({
  value: z.coerce.number().int().min(0, "Value must be 0 or more"),
  label: z.string().trim().min(1, "Label is required").max(120),
  suffix: z.string().trim().max(10).optional(),
  published: z.boolean().optional(),
});
export type HomeStatInput = z.infer<typeof homeStatInput>;
