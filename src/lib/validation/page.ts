import { z } from "zod";

export const pageStatusEnum = z.enum(["DRAFT", "PUBLISHED"]);

export const pageInput = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug may contain lowercase letters, numbers and hyphens only"),
  status: pageStatusEnum.default("DRAFT"),
  seoTitle: z.string().trim().max(200).nullable().optional(),
  seoDescription: z.string().trim().max(500).nullable().optional(),
});

export type PageInput = z.infer<typeof pageInput>;
