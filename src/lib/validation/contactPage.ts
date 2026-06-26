import { z } from "zod";

export const contactContentInput = z.object({
  locationHeading: z.string().trim().max(120).optional(),
  locationTitle: z.string().trim().max(300).optional(),
  officeName: z.string().trim().max(200).optional(),
  officeCity: z.string().trim().max(200).optional(),
  officeAddress: z.string().trim().max(2000).optional(),
  directionsUrl: z.string().trim().max(2000).optional(),
  mapEmbedUrl: z.string().trim().max(2000).optional(),

  phone: z.string().trim().max(50).optional(),
  email: z.string().trim().max(200).optional(),
  workingHours: z.string().trim().max(200).optional(),

  formHeading: z.string().trim().max(120).optional(),
  formTitle: z.string().trim().max(500).optional(),
  formIntro: z.string().trim().max(2000).optional(),
  formDescription: z.string().trim().max(2000).optional(),
  successMessage: z.string().trim().max(500).optional(),
  errorMessage: z.string().trim().max(500).optional(),

  seoTitle: z.string().trim().max(200).optional(),
  seoDescription: z.string().trim().max(2000).optional(),
  seoKeywords: z.string().trim().max(500).optional(),
  canonicalUrl: z.string().trim().max(500).optional(),
  ogImage: z.string().trim().max(500).optional(),
  twitterImage: z.string().trim().max(500).optional(),
  robotsMeta: z.string().trim().max(120).optional(),
});
export type ContactContentInput = z.infer<typeof contactContentInput>;

export const socialLinkInput = z.object({
  platform: z.string().trim().min(1, "Platform is required").max(100),
  url: z.string().trim().min(1, "URL is required").max(1000),
  icon: z.string().trim().max(500).nullable().optional(),
  published: z.boolean().optional(),
});
export type SocialLinkInput = z.infer<typeof socialLinkInput>;

export const officeLocationInput = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  address: z.string().trim().min(1, "Address is required").max(2000),
  phone: z.string().trim().max(50).nullable().optional(),
  email: z.string().trim().max(200).nullable().optional(),
  mapUrl: z.string().trim().max(2000).nullable().optional(),
  published: z.boolean().optional(),
});
export type OfficeLocationInput = z.infer<typeof officeLocationInput>;
