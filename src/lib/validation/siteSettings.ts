import { z } from "zod";

export const siteSettingsInput = z.object({
  companyEmail: z.string().trim().email("A valid email is required"),
  companyPhone: z.string().trim().min(1, "Phone is required"),
  addressLines: z.array(z.string().trim().min(1)).min(1, "At least one address line is required"),
  linkedinUrl: z.string().trim().url("Must be a valid URL").nullable().optional().or(z.literal("")),
  footerNote: z.string().trim().nullable().optional().or(z.literal("")),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsInput>;
