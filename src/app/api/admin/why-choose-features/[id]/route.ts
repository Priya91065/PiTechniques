import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { whyChooseFeatureInput } from "@/lib/validation/aboutPage";
import { deleteWhyChooseFeature, updateWhyChooseFeature } from "@/server/services/aboutPage";

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
  const parsed = whyChooseFeatureInput.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const existing = await prisma.whyChooseFeature.findUnique({ where: { id } });
  if (!existing) return jsonError("Step not found", 404);

  const item = await updateWhyChooseFeature(id, parsed.data);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: parsed.data.published !== undefined ? "PUBLISH" : "UPDATE",
      entityType: "WhyChooseFeature",
      entityId: id,
      summary: `Updated agile process step "${item.title}"`,
    },
  });
  return jsonOk({ item });
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const existing = await prisma.whyChooseFeature.findUnique({ where: { id } });
  if (!existing) return jsonError("Step not found", 404);

  await deleteWhyChooseFeature(id);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "DELETE",
      entityType: "WhyChooseFeature",
      entityId: id,
      summary: `Deleted agile process step "${existing.title}"`,
    },
  });

  return jsonOk({ ok: true });
}
