import { NextResponse, type NextRequest } from "next/server";
import { Prisma, type JobStatus } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { jobInput } from "@/lib/validation/job";
import { createJob, listDepartments, listJobs } from "@/server/services/jobs";

const STATUSES = ["ACTIVE", "INACTIVE"] as const;

/**
 * GET /api/jobs
 *  - default: public list of ACTIVE jobs (slug/title/experience/shortDescription), by displayOrder.
 *  - ?admin=1 (authenticated): full list with optional status/department/search filters + departments.
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  const sp = req.nextUrl.searchParams;

  if (sp.get("admin") === "1") {
    const g = await guard();
    if ("response" in g) return g.response;
    const statusParam = sp.get("status");
    const status = STATUSES.includes(statusParam as JobStatus) ? (statusParam as JobStatus) : undefined;
    const department = sp.get("department")?.trim() || undefined;
    const search = sp.get("search")?.trim() || undefined;
    try {
      const [items, departments] = await Promise.all([listJobs({ status, department, search }), listDepartments()]);
      return jsonOk({ items, departments });
    } catch {
      return jsonError("Couldn't load jobs. Is the database connected?", 503, "DB_UNAVAILABLE");
    }
  }

  try {
    const items = await prisma.job.findMany({
      where: { status: "ACTIVE" },
      orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
      select: { slug: true, jobTitle: true, experience: true, shortDescription: true },
    });
    return jsonOk({ items: items.map((i) => ({ slug: i.slug, title: i.jobTitle, experience: i.experience, shortDescription: i.shortDescription })) });
  } catch {
    return jsonError("Couldn't load jobs.", 503, "DB_UNAVAILABLE");
  }
}

function revalidateJobs(): void {
  revalidateTag("jobs");
  revalidatePath("/careers");
  revalidatePath("/career-details");
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
  const parsed = jobInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  try {
    const item = await createJob(parsed.data);
    await prisma.activityLog.create({
      data: { userId: g.user.sub, action: "CREATE", entityType: "Job", entityId: item.id, summary: `Created job "${item.jobTitle}"` },
    });
    revalidateJobs();
    return jsonOk({ item }, 201);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("A job with that slug already exists", 409);
    }
    return jsonError("Couldn't create job", 500);
  }
}
