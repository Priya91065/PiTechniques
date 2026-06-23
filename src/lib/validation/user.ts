import { z } from "zod";

export const roleEnum = z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]);

export const createUserInput = z.object({
  email: z.string().trim().toLowerCase().email("A valid email is required"),
  name: z.string().trim().min(1, "Name is required"),
  role: roleEnum.default("EDITOR"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  isActive: z.boolean().optional(),
});

export const updateUserInput = z.object({
  email: z.string().trim().toLowerCase().email("A valid email is required").optional(),
  name: z.string().trim().min(1, "Name is required").optional(),
  role: roleEnum.optional(),
  // Empty string means "keep current password"; otherwise enforce min length.
  password: z.string().min(8, "Password must be at least 8 characters").optional().or(z.literal("")),
  isActive: z.boolean().optional(),
});

export type CreateUserInput = z.infer<typeof createUserInput>;
export type UpdateUserInput = z.infer<typeof updateUserInput>;
