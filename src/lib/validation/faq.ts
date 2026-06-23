import { z } from "zod";

export const faqInput = z.object({
  question: z.string().trim().min(1, "Question is required"),
  answer: z.string().trim().min(1, "Answer is required"),
  category: z.string().trim().nullable().optional(),
  published: z.boolean().optional(),
});

export type FaqInput = z.infer<typeof faqInput>;
