import type { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { can, type Permission } from "@/lib/auth/rbac";
import type { AccessPayload } from "@/lib/auth/jwt";
import { jsonError } from "@/lib/api/http";

type GuardResult = { user: AccessPayload } | { response: NextResponse };

/**
 * API auth + RBAC guard. The middleware already rejects unauthenticated
 * requests; this re-checks defensively and enforces a permission.
 *
 *   const g = await guard("CREATE");
 *   if ("response" in g) return g.response;
 *   const { user } = g;
 */
export async function guard(permission?: Permission): Promise<GuardResult> {
  const user = await getCurrentUser();
  if (!user) return { response: jsonError("Unauthorized", 401) };
  if (permission && !can(user.role, permission)) {
    return { response: jsonError("You don't have permission to do that", 403) };
  }
  return { user };
}
