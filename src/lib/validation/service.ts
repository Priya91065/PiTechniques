import { z } from "zod";

export const serviceInput = z.object({
  slug: z.string().trim().min(1, "Slug is required"),
  anchor: z.string().trim().min(1, "Anchor is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  iconDark: z.string().trim().min(1, "Dark icon is required"),
  iconLight: z.string().trim().min(1, "Light icon is required"),
  tags: z.array(z.string().trim().min(1)).default([]),
  published: z.boolean().optional(),
});

export type ServiceInput = z.infer<typeof serviceInput>;
