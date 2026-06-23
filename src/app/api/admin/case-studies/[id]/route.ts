import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { revalidateCaseStudies } from "@/lib/api/revalidate";
import { caseStudyInput } from "@/lib/validation/caseStudy";
import { deleteCaseStudy, updateCaseStudy } from "@/server/services/caseStudies";

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
  const parsed = caseStudyInput.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const existing = await prisma.caseStudy.findUnique({ where: { id } });
  if (!existing) return jsonError("Case study not found", 404);

  try {
    const item = await updateCaseStudy(id, parsed.data);
    await prisma.activityLog.create({
      data: {
        userId: g.user.sub,
        action: parsed.data.published !== undefined ? "PUBLISH" : "UPDATE",
        entityType: "CaseStudy",
        entityId: id,
        summary: `Updated case study "${existing.name}"`,
      },
    });
    revalidateCaseStudies();
    return jsonOk({ item });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("A case study with that slug already exists", 409);
    }
    throw err;
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const existing = await prisma.caseStudy.findUnique({ where: { id } });
  if (!existing) return jsonError("Case study not found", 404);

  await deleteCaseStudy(id);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "DELETE",
      entityType: "CaseStudy",
      entityId: id,
      summary: `Deleted case study "${existing.name}"`,
    },
  });
  revalidateCaseStudies();
  return jsonOk({ ok: true });
}
