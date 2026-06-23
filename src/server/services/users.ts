import type { Role } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import type { CreateUserInput, UpdateUserInput } from "@/lib/validation/user";

/** Public-safe user shape (never exposes passwordHash). */
export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  lastLoginAt: Date | null;
  createdAt: Date;
}

const SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  isActive: true,
  lastLoginAt: true,
  createdAt: true,
} as const;

export function listUsers(): Promise<SafeUser[]> {
  return prisma.user.findMany({ orderBy: { createdAt: "asc" }, select: SELECT });
}

export function createUser(data: CreateUserInput, passwordHash: string): Promise<SafeUser> {
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      role: data.role,
      passwordHash,
      isActive: data.isActive ?? true,
    },
    select: SELECT,
  });
}

export async function updateUser(id: string, data: UpdateUserInput): Promise<SafeUser> {
  const password = data.password && data.password.length > 0 ? await hashPassword(data.password) : undefined;
  return prisma.user.update({
    where: { id },
    data: {
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.role !== undefined ? { role: data.role } : {}),
      ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      ...(password ? { passwordHash: password } : {}),
    },
    select: SELECT,
  });
}

export function deleteUser(id: string): Promise<SafeUser> {
  return prisma.user.delete({ where: { id }, select: SELECT });
}

/** Count of active Super Admins — used to prevent locking out the last one. */
export function countActiveSuperAdmins(): Promise<number> {
  return prisma.user.count({ where: { role: "SUPER_ADMIN", isActive: true } });
}
