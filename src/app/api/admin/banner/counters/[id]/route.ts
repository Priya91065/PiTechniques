import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { homeStatInput } from "@/lib/validation/banner";
import { deleteStat, updateStat } from "@/server/services/banner";

type Ctx = { params: Promise<{ id: string }> };

function revalidate(): void {
  revalidateTag("banner");
  revalidatePath("/");
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
  const parsed = homeStatInput.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const existing = await prisma.homeStat.findUnique({ where: { id } });
  if (!existing) return jsonError("Counter not found", 404);

  const item = await updateStat(id, parsed.data);
  await prisma.activityLog.create({
    data: { userId: g.user.sub, action: "UPDATE", entityType: "HomeStat", entityId: id, summary: `Updated counter "${item.label}"` },
  });
  revalidate();
  return jsonOk({ item });
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const existing = await prisma.homeStat.findUnique({ where: { id } });
  if (!existing) return jsonError("Counter not found", 404);

  await deleteStat(id);
  await prisma.activityLog.create({
    data: { userId: g.user.sub, action: "DELETE", entityType: "HomeStat", entityId: id, summary: `Deleted counter "${existing.label}"` },
  });
  revalidate();
  return jsonOk({ ok: true });
}
