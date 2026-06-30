import { z } from "zod";
import { pageStatusEnum } from "@/lib/validation/page";

export const policyPageInput = z.object({
  heading: z.string().trim().min(1, "Heading is required").max(300),
  bannerDescription: z.string().trim().nullable().optional(),
  contentClassName: z.string().trim().max(120).optional(),
  contentHtml: z.string().min(1, "Content is required"),
  seoTitle: z.string().trim().max(200).nullable().optional(),
  seoDescription: z.string().trim().max(400).nullable().optional(),
  seoKeywords: z.string().trim().max(400).nullable().optional(),
  ogImage: z.string().trim().max(500).nullable().optional(),
  status: pageStatusEnum.default("PUBLISHED"),
});

export type PolicyPageInput = z.infer<typeof policyPageInput>;
