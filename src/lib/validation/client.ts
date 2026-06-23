import { z } from "zod";

export const clientInput = z.object({
  name: z.string().trim().min(1, "Name is required"),
  logo: z.string().trim().min(1, "Logo URL is required"),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  published: z.boolean().optional(),
});

export type ClientInput = z.infer<typeof clientInput>;
