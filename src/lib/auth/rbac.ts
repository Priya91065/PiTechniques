/**
 * Role-Based Access Control matrix.
 * Roles are stored on the User row; permissions are derived here in code.
 */
export type Permission = "CREATE" | "EDIT" | "DELETE" | "PUBLISH";
export type RoleName = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

const MATRIX: Record<RoleName, Permission[]> = {
  SUPER_ADMIN: ["CREATE", "EDIT", "DELETE", "PUBLISH"],
  ADMIN: ["CREATE", "EDIT", "DELETE", "PUBLISH"],
  EDITOR: ["CREATE", "EDIT"],
};

/** Only Super Admin may manage other users. */
export function canManageUsers(role: string): boolean {
  return role === "SUPER_ADMIN";
}

export function permissionsFor(role: string): Permission[] {
  return MATRIX[role as RoleName] ?? [];
}

export function can(role: string, permission: Permission): boolean {
  return permissionsFor(role).includes(permission);
}
