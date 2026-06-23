import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { navItemInput } from "@/lib/validation/navItem";
import { deleteNavItem, updateNavItem } from "@/server/services/navItems";

type Ctx = { params: Promise<{ id: string }> };

function revalidate(): void {
  revalidateTag("navigation");
  revalidatePath("/", "layout");
}

export async function PATCH(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = navItemInput.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const existing = await prisma.navItem.findUnique({ where: { id } });
  if (!existing) return jsonError("Nav item not found", 404);

  const item = await updateNavItem(id, parsed.data);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: parsed.data.published !== undefined ? "PUBLISH" : "UPDATE",
      entityType: "NavItem",
      entityId: id,
      summary: `Updated nav item "${item.label}"`,
    },
  });
  revalidate();
  return jsonOk({ item });
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const existing = await prisma.navItem.findUnique({ where: { id } });
  if (!existing) return jsonError("Nav item not found", 404);

  await deleteNavItem(id);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "DELETE",
      entityType: "NavItem",
      entityId: id,
      summary: `Deleted nav item "${existing.label}"`,
    },
  });
  revalidate();
  return jsonOk({ ok: true });
}
