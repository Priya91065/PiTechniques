import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { revalidateCaseStudies } from "@/lib/api/revalidate";
import { caseStudyInput } from "@/lib/validation/caseStudy";
import { createCaseStudy, listCaseStudies } from "@/server/services/caseStudies";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    return jsonOk({ items: await listCaseStudies() });
  } catch {
    return jsonError("Couldn't load case studies. Is the database connected?", 503, "DB_UNAVAILABLE");
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const g = await guard("CREATE");
  if ("response" in g) return g.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = caseStudyInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  try {
    const item = await createCaseStudy(parsed.data);
    await prisma.activityLog.create({
      data: {
        userId: g.user.sub,
        action: "CREATE",
        entityType: "CaseStudy",
        entityId: item.id,
        summary: `Created case study "${item.name}"`,
      },
    });
    revalidateCaseStudies();
    return jsonOk({ item }, 201);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("A case study with that slug already exists", 409);
    }
    throw err;
  }
}
