import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { parseSectionContent, sectionInput } from "@/lib/validation/section";
import { createSection, listSections } from "@/server/services/sections";

type Ctx = { params: Promise<{ id: string }> };

async function revalidatePage(pageId: string): Promise<void> {
  const page = await prisma.page.findUnique({ where: { id: pageId }, select: { slug: true } });
  revalidateTag("pages");
  if (page) revalidatePath(`/${page.slug}`);
}

export async function GET(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id }, select: { id: true } });
  if (!page) return jsonError("Page not found", 404);
  return jsonOk({ items: await listSections(id) });
}

export async function POST(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("CREATE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const page = await prisma.page.findUnique({ where: { id }, select: { id: true } });
  if (!page) return jsonError("Page not found", 404);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = sectionInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);
  const content = parseSectionContent(parsed.data.type, parsed.data.content);
  if (!content.ok) return jsonError(content.error, 422);

  const item = await createSection(id, {
    type: parsed.data.type,
    title: parsed.data.title ?? null,
    published: parsed.data.published,
    content: content.data,
  });
  await prisma.activityLog.create({
    data: { userId: g.user.sub, action: "CREATE", entityType: "Section", entityId: item.id, summary: `Added ${parsed.data.type} section` },
  });
  await revalidatePage(id);
  return jsonOk({ item }, 201);
}
