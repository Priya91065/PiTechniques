import { z } from "zod";

export const aboutContentInput = z.object({
  bannerTitle: z.string().trim().min(1, "Banner title is required").max(500),
  bannerSubtitle: z.string().trim().max(500).nullable().optional(),
  bannerImage: z.string().trim().max(500).nullable().optional(),
  breadcrumb: z.string().trim().max(200).nullable().optional(),
  ctaLabel: z.string().trim().max(120).nullable().optional(),
  ctaHref: z.string().trim().max(500).nullable().optional(),
  showBanner: z.boolean().optional(),

  introEyebrow: z.string().trim().max(120).nullable().optional(),
  introTitle: z.string().trim().min(1, "Intro title is required").max(500),
  introDescription: z.string().trim().min(1, "Intro description is required"),
  introImage: z.string().trim().max(500).nullable().optional(),
  introCtaLabel: z.string().trim().max(120).nullable().optional(),
  introCtaHref: z.string().trim().max(500).nullable().optional(),

  whyHeading: z.string().trim().max(120).nullable().optional(),
  whyTitle: z.string().trim().max(500).nullable().optional(),
  whyDescription: z.string().trim().nullable().optional(),
  whyImage: z.string().trim().max(500).nullable().optional(),
  showWhySection: z.boolean().optional(),

  seoTitle: z.string().trim().max(300).nullable().optional(),
  seoDescription: z.string().trim().max(1000).nullable().optional(),
  seoKeywords: z.string().trim().max(500).nullable().optional(),
  canonicalUrl: z.string().trim().max(500).nullable().optional(),
  ogImage: z.string().trim().max(500).nullable().optional(),
  twitterImage: z.string().trim().max(500).nullable().optional(),
  robotsMeta: z.string().trim().max(200).nullable().optional(),
});
export type AboutContentInput = z.infer<typeof aboutContentInput>;

export const whyChooseFeatureInput = z.object({
  icon: z.string().trim().max(500).nullable().optional(),
  title: z.string().trim().min(1, "Title is required").max(300),
  description: z.string().trim().min(1, "Description is required"),
  published: z.boolean().optional(),
});
export type WhyChooseFeatureInput = z.infer<typeof whyChooseFeatureInput>;
