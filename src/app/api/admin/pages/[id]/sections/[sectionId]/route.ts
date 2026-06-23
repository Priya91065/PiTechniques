import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { parseSectionContent, sectionInput } from "@/lib/validation/section";
import { deleteSection, getSection, updateSection } from "@/server/services/sections";

type Ctx = { params: Promise<{ id: string; sectionId: string }> };

async function revalidatePage(pageId: string): Promise<void> {
  const page = await prisma.page.findUnique({ where: { id: pageId }, select: { slug: true } });
  revalidateTag("pages");
  if (page) revalidatePath(`/${page.slug}`);
}

export async function PATCH(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;
  const { id, sectionId } = await params;

  const existing = await getSection(sectionId);
  if (!existing || existing.pageId !== id) return jsonError("Section not found", 404);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = sectionInput.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  // When content is provided, validate it against the (new or existing) type.
  let content: unknown;
  if (parsed.data.content !== undefined) {
    const type = parsed.data.type ?? (existing.type as Parameters<typeof parseSectionContent>[0]);
    const checked = parseSectionContent(type, parsed.data.content);
    if (!checked.ok) return jsonError(checked.error, 422);
    content = checked.data;
  }

  const item = await updateSection(sectionId, {
    type: parsed.data.type,
    title: parsed.data.title,
    published: parsed.data.published,
    content,
  });
  await prisma.activityLog.create({
    data: { userId: g.user.sub, action: "UPDATE", entityType: "Section", entityId: sectionId, summary: `Updated ${item.type} section` },
  });
  await revalidatePage(id);
  return jsonOk({ item });
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id, sectionId } = await params;

  const existing = await getSection(sectionId);
  if (!existing || existing.pageId !== id) return jsonError("Section not found", 404);

  await deleteSection(sectionId);
  await prisma.activityLog.create({
    data: { userId: g.user.sub, action: "DELETE", entityType: "Section", entityId: sectionId, summary: `Deleted ${existing.type} section` },
  });
  await revalidatePage(id);
  return jsonOk({ ok: true });
}
