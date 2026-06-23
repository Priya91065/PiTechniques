import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { updateUserInput } from "@/lib/validation/user";
import { countActiveSuperAdmins, deleteUser, updateUser } from "@/server/services/users";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  if (g.user.role !== "SUPER_ADMIN") return jsonError("Only a Super Admin can manage users", 403);
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = updateUserInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return jsonError("User not found", 404);

  // Guard against locking out the last active Super Admin.
  const wouldLoseSuper =
    existing.role === "SUPER_ADMIN" &&
    existing.isActive &&
    ((parsed.data.role !== undefined && parsed.data.role !== "SUPER_ADMIN") || parsed.data.isActive === false);
  if (wouldLoseSuper && (await countActiveSuperAdmins()) <= 1) {
    return jsonError("You can't remove the last active Super Admin", 409);
  }

  try {
    const item = await updateUser(id, parsed.data);
    await prisma.activityLog.create({
      data: {
        userId: g.user.sub,
        action: "UPDATE",
        entityType: "User",
        entityId: id,
        summary: `Updated user "${item.email}"`,
      },
    });
    return jsonOk({ item });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("A user with that email already exists", 409);
    }
    return jsonError("Couldn't update user", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  if (g.user.role !== "SUPER_ADMIN") return jsonError("Only a Super Admin can manage users", 403);
  const { id } = await params;

  if (id === g.user.sub) return jsonError("You can't delete your own account", 409);

  const existing = await prisma.user.findUnique({ where: { id } });
  if (!existing) return jsonError("User not found", 404);

  if (existing.role === "SUPER_ADMIN" && existing.isActive && (await countActiveSuperAdmins()) <= 1) {
    return jsonError("You can't delete the last active Super Admin", 409);
  }

  await deleteUser(id);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "DELETE",
      entityType: "User",
      entityId: id,
      summary: `Deleted user "${existing.email}"`,
    },
  });
  return jsonOk({ ok: true });
}
