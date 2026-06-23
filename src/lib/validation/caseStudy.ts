import { z } from "zod";

export const caseStudyInput = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
  name: z.string().trim().min(1, "Name is required"),
  title: z.string().trim().min(1, "Title is required"),
  shortDesc: z.string().trim().min(1, "Short description is required"),
  tags: z.array(z.string().trim().min(1)).default([]),
  heroImage: z.string().trim().min(1, "Hero image is required"),
  logo: z.string().trim().min(1, "Logo is required"),
  cardImage: z.string().trim().default(""),
  cardImageMobile: z.string().trim().default(""),
  cardClient: z.string().trim().default(""),
  listImage: z.string().trim().default(""),
  listHeading: z.string().trim().default(""),
  industry: z.string().trim().min(1, "Industry is required"),
  headquarters: z.string().trim().min(1, "Headquarters is required"),
  website: z.string().trim().nullable().optional(),
  challengeShortInfo: z.string().trim().default(""),
  challengeLists: z.array(z.string()).default([]),
  challengeBackground: z.string().trim().default(""),
  solutionDetails: z.string().trim().default(""),
  longTermImpactTitle: z.string().trim().default(""),
  featureGridVariant: z.string().trim().default(""),
  seoTitle: z.string().trim().nullable().optional(),
  seoDescription: z.string().trim().nullable().optional(),
  ogImage: z.string().trim().nullable().optional(),
  published: z.boolean().optional(),
  solutions: z
    .array(
      z.object({
        title: z.string().trim().default(""),
        subTitle: z.string().trim().default(""),
        items: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  features: z
    .array(z.object({ image: z.string().trim().default(""), feature: z.string().trim().default("") }))
    .default([]),
  impacts: z
    .array(
      z.object({
        image: z.string().trim().default(""),
        title: z.string().trim().default(""),
        subTitle: z.string().trim().default(""),
      }),
    )
    .default([]),
});

export type CaseStudyInput = z.infer<typeof caseStudyInput>;
