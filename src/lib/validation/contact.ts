import { z } from "zod";

export const contactSourceEnum = z.enum(["CONTACT", "CAREER"]);
export const contactStatusEnum = z.enum(["UNREAD", "READ", "ARCHIVED"]);

/** Public submission payload (contact + career forms). Server stays lenient;
 *  the client form enforces its own stricter required-field rules. */
export const contactSubmissionInput = z.object({
  source: contactSourceEnum.default("CONTACT"),
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().max(100).nullable().optional(),
  email: z.string().trim().toLowerCase().email("A valid email is required").max(200),
  phone: z.string().trim().max(30).nullable().optional(),
  message: z.string().trim().max(5000).nullable().optional(),
  position: z.string().trim().max(200).nullable().optional(),
  resumeUrl: z.string().trim().max(500).nullable().optional(),
});

export const contactStatusUpdate = z.object({
  status: contactStatusEnum,
});

export type ContactSubmissionInput = z.infer<typeof contactSubmissionInput>;
