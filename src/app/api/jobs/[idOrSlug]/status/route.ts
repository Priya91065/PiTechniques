import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { jobStatusEnum } from "@/lib/validation/job";
import { getJobById, setJobStatus } from "@/server/services/jobs";

type Ctx = { params: Promise<{ idOrSlug: string }> };

/** PATCH /api/jobs/:id/status — guarded activate/deactivate. */
export async function PATCH(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;
  const { idOrSlug: id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = jobStatusEnum.safeParse((body as { status?: unknown })?.status);
  if (!parsed.success) return jsonError("Invalid status", 422);

  const existing = await getJobById(id);
  if (!existing) return jsonError("Job not found", 404);

  const item = await setJobStatus(id, parsed.data);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "PUBLISH",
      entityType: "Job",
      entityId: id,
      summary: `Set job "${item.jobTitle}" to ${parsed.data.toLowerCase()}`,
    },
  });
  revalidateTag("jobs");
  revalidatePath("/careers");
  revalidatePath("/career-details");
  return jsonOk({ item });
}
