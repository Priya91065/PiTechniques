import type { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { permissionsFor } from "@/lib/auth/rbac";
import { jsonError, jsonOk } from "@/lib/api/http";

export async function GET(): Promise<NextResponse> {
  const user = await getCurrentUser();
  if (!user) return jsonError("Unauthorized", 401);
  return jsonOk({
    user: {
      id: user.sub,
      email: user.email,
      name: user.name,
      role: user.role,
      permissions: permissionsFor(user.role),
    },
  });
}
