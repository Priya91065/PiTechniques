import { z } from "zod";

export const navLocationEnum = z.enum(["HEADER", "FOOTER"]);

export const navItemInput = z.object({
  label: z.string().trim().min(1, "Label is required"),
  href: z.string().trim().min(1, "Link is required"),
  location: navLocationEnum.default("HEADER"),
  published: z.boolean().optional(),
});

export type NavItemInput = z.infer<typeof navItemInput>;
