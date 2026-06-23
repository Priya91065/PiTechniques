import { z } from "zod";

export const jobStatusEnum = z.enum(["ACTIVE", "INACTIVE"]);

const respGroup = z.object({
  heading: z.string().trim().min(1, "Group heading is required"),
  items: z.array(z.string().trim().min(1)).min(1, "Add at least one responsibility"),
});

/** Responsibilities are either a flat list of strings or grouped sections. */
export const responsibilitiesSchema = z
  .union([z.array(z.string().trim().min(1)), z.array(respGroup)])
  .nullable()
  .optional();

export const jobInput = z.object({
  jobTitle: z.string().trim().min(1, "Job title is required").max(200),
  slug: z.string().trim().max(120).optional(), // auto-generated from title when blank
  jobCode: z.string().trim().max(50).nullable().optional(),
  department: z.string().trim().max(120).nullable().optional(),
  experience: z.string().trim().min(1, "Experience is required").max(120),
  location: z.string().trim().max(120).nullable().optional(),
  employmentType: z.string().trim().max(120).nullable().optional(),
  shortDescription: z.string().trim().max(2000).nullable().optional(),
  qualifications: z.array(z.string().trim().min(1)).default([]),
  responsibilities: responsibilitiesSchema,
  skills: z.array(z.string().trim().min(1)).default([]),
  seoTitle: z.string().trim().max(200).nullable().optional(),
  seoDescription: z.string().trim().max(400).nullable().optional(),
  status: jobStatusEnum.default("ACTIVE"),
  displayOrder: z.number().int().optional(),
});

export type JobInput = z.infer<typeof jobInput>;
export type ResponsibilitiesValue = z.infer<typeof responsibilitiesSchema>;
