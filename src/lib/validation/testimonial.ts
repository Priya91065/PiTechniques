import { z } from "zod";

export const testimonialInput = z.object({
  quote: z.string().trim().min(1, "Quote is required"),
  company: z.string().trim().min(1, "Company is required"),
  authorName: z.string().trim().min(1, "Author name is required"),
  designation: z.string().trim().min(1, "Designation is required"),
  photo: z.string().trim().nullable().optional(),
  published: z.boolean().optional(),
});

export type TestimonialInput = z.infer<typeof testimonialInput>;

export const reorderInput = z.object({
  ids: z.array(z.string().min(1)).min(1),
});
