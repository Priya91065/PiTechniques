import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { seoInput } from "@/lib/validation/seo";
import { deleteSeoSetting, getSeoById, updateSeoSetting } from "@/server/services/seoSettings";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;
  const { id } = await params;

  const existing = await getSeoById(id);
  if (!existing) return jsonError("SEO settings not found", 404);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = seoInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  try {
    const item = await updateSeoSetting(id, parsed.data);
    await prisma.activityLog.create({
      data: { userId: g.user.sub, action: "UPDATE", entityType: "SeoSetting", entityId: id, summary: `Updated SEO for ${item.path}` },
    });
    revalidateTag("seo");
    revalidatePath(existing.path);
    if (item.path !== existing.path) revalidatePath(item.path);
    return jsonOk({ item });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("SEO settings for that path already exist", 409);
    }
    return jsonError("Couldn't update SEO settings", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const existing = await getSeoById(id);
  if (!existing) return jsonError("SEO settings not found", 404);

  await deleteSeoSetting(id);
  await prisma.activityLog.create({
    data: { userId: g.user.sub, action: "DELETE", entityType: "SeoSetting", entityId: id, summary: `Deleted SEO for ${existing.path}` },
  });
  revalidateTag("seo");
  revalidatePath(existing.path);
  return jsonOk({ ok: true });
}
