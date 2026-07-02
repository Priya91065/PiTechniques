import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { pageInput } from "@/lib/validation/page";
import { isSystemSlug } from "@/lib/systemPages";
import { deletePage, updatePage } from "@/server/services/pages";

type Ctx = { params: Promise<{ id: string }> };

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
  const parsed = pageInput.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const existing = await prisma.page.findUnique({ where: { id } });
  if (!existing) return jsonError("Page not found", 404);

  // System pages are bound to fixed routes — their slug must not change.
  if (isSystemSlug(existing.slug) && parsed.data.slug !== undefined && parsed.data.slug !== existing.slug) {
    return jsonError("System page slugs cannot be changed", 422);
  }

  // Publish/unpublish requires the PUBLISH permission.
  if (parsed.data.status !== undefined && parsed.data.status !== existing.status) {
    const pub = await guard("PUBLISH");
    if ("response" in pub) return pub.response;
  }

  try {
    const item = await updatePage(id, parsed.data);
    await prisma.activityLog.create({
      data: {
        userId: g.user.sub,
        action: parsed.data.status !== undefined ? "PUBLISH" : "UPDATE",
        entityType: "Page",
        entityId: id,
        summary: `Updated page "${item.title}"`,
      },
    });
    revalidateTag("pages");
    return jsonOk({ item });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("A page with that slug already exists", 409);
    }
    throw err;
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const existing = await prisma.page.findUnique({ where: { id } });
  if (!existing) return jsonError("Page not found", 404);
  if (isSystemSlug(existing.slug)) return jsonError("System pages cannot be deleted", 422);

  await deletePage(id);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "DELETE",
      entityType: "Page",
      entityId: id,
      summary: `Deleted page "${existing.title}"`,
    },
  });
  revalidateTag("pages");
  return jsonOk({ ok: true });
}
