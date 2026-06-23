import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { faqInput } from "@/lib/validation/faq";
import { deleteFaq, updateFaq } from "@/server/services/faqs";

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
  const parsed = faqInput.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const existing = await prisma.faq.findUnique({ where: { id } });
  if (!existing) return jsonError("FAQ not found", 404);

  const item = await updateFaq(id, parsed.data);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: parsed.data.published !== undefined ? "PUBLISH" : "UPDATE",
      entityType: "Faq",
      entityId: id,
      summary: `Updated FAQ "${item.question}"`,
    },
  });
  revalidateTag("faqs");
  return jsonOk({ item });
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const existing = await prisma.faq.findUnique({ where: { id } });
  if (!existing) return jsonError("FAQ not found", 404);

  await deleteFaq(id);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "DELETE",
      entityType: "Faq",
      entityId: id,
      summary: `Deleted FAQ "${existing.question}"`,
    },
  });
  revalidateTag("faqs");
  return jsonOk({ ok: true });
}
