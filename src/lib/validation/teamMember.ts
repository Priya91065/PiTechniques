import { z } from "zod";

export const teamGroupEnum = z.enum(["leadership", "executive"]);

export const teamMemberInput = z.object({
  name: z.string().trim().min(1, "Name is required"),
  role: z.string().trim().min(1, "Role is required"),
  photo: z.string().trim().min(1, "Photo URL is required"),
  photoMobile: z.string().trim().nullable().optional(),
  colSpan: z.union([z.literal(4), z.literal(6), z.literal(12)]).default(4),
  cardMb0: z.boolean().optional(),
  linkedin: z.string().trim().url("Must be a valid URL").nullable().optional().or(z.literal("")),
  group: teamGroupEnum.default("leadership"),
  published: z.boolean().optional(),
});

export type TeamMemberInput = z.infer<typeof teamMemberInput>;
