import { z } from "zod";

export const seoInput = z.object({
  path: z
    .string()
    .trim()
    .min(1, "Path is required")
    .regex(/^\//, "Path must start with /"),
  metaTitle: z.string().trim().min(1, "Meta title is required").max(200),
  metaDescription: z.string().trim().min(1, "Meta description is required").max(400),
  canonicalUrl: z.string().trim().url("Must be a valid URL").nullable().optional().or(z.literal("")),
  ogTitle: z.string().trim().max(200).nullable().optional(),
  ogDescription: z.string().trim().max(400).nullable().optional(),
  ogImage: z.string().trim().nullable().optional(),
  twitterTitle: z.string().trim().max(200).nullable().optional(),
  twitterDescription: z.string().trim().max(400).nullable().optional(),
  twitterImage: z.string().trim().nullable().optional(),
});

export type SeoInput = z.infer<typeof seoInput>;
