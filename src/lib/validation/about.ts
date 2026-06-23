import { z } from "zod";

export const aboutInput = z.object({
  whoEyebrow: z.string().trim().max(120),
  whoTitle: z.string().trim().min(1, "Title is required").max(300),
  whoParagraphs: z.array(z.string().trim().min(1)).default([]),
  whoCtaLabel: z.string().trim().max(120),
  whoCtaHref: z.string().trim().max(500),
  aboutImage: z.string().trim().max(500).nullable().optional(),
});
export type AboutInput = z.infer<typeof aboutInput>;
