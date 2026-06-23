import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { jobInput } from "@/lib/validation/job";
import { deleteJob, getJobById, getJobBySlugRaw, updateJob } from "@/server/services/jobs";

type Ctx = { params: Promise<{ idOrSlug: string }> };

function revalidateJobs(): void {
  revalidateTag("jobs");
  revalidatePath("/careers");
  revalidatePath("/career-details");
}

/** GET /api/jobs/:slug — public single active job (param is a slug). */
export async function GET(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const { idOrSlug } = await params;
  const job = await getJobBySlugRaw(idOrSlug);
  if (!job || job.status !== "ACTIVE") return jsonError("Job not found", 404);
  return jsonOk({ item: job });
}

/** PUT /api/jobs/:id — guarded update (param is an id). */
export async function PUT(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;
  const { idOrSlug: id } = await params;

  const existing = await getJobById(id);
  if (!existing) return jsonError("Job not found", 404);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = jobInput.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  try {
    const item = await updateJob(id, parsed.data);
    await prisma.activityLog.create({
      data: { userId: g.user.sub, action: "UPDATE", entityType: "Job", entityId: id, summary: `Updated job "${item.jobTitle}"` },
    });
    revalidateJobs();
    return jsonOk({ item });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("A job with that slug already exists", 409);
    }
    return jsonError("Couldn't update job", 500);
  }
}

/** DELETE /api/jobs/:id — guarded delete (param is an id). */
export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { idOrSlug: id } = await params;

  const existing = await getJobById(id);
  if (!existing) return jsonError("Job not found", 404);

  await deleteJob(id);
  await prisma.activityLog.create({
    data: { userId: g.user.sub, action: "DELETE", entityType: "Job", entityId: id, summary: `Deleted job "${existing.jobTitle}"` },
  });
  revalidateJobs();
  return jsonOk({ ok: true });
}
