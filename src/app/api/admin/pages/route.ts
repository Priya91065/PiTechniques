import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { pageInput } from "@/lib/validation/page";
import { createPage, isSortable, listPages, type PageSortField } from "@/server/services/pages";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;

  const sp = req.nextUrl.searchParams;
  const search = sp.get("search")?.trim() || undefined;
  const page = Math.max(1, Number(sp.get("page") ?? "1") || 1);
  const pageSize = Math.min(100, Math.max(1, Number(sp.get("pageSize") ?? "10") || 10));
  const sortParam = sp.get("sort") ?? "updatedAt";
  const sort: PageSortField = isSortable(sortParam) ? sortParam : "updatedAt";
  const order = sp.get("order") === "asc" ? "asc" : "desc";

  try {
    const { items, total } = await listPages({ search, skip: (page - 1) * pageSize, take: pageSize, sort, order });
    return jsonOk({ items, total, page, pageSize });
  } catch {
    return jsonError("Couldn't load pages. Is the database connected?", 503, "DB_UNAVAILABLE");
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
  const parsed = pageInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  try {
    const item = await createPage(parsed.data);
    await prisma.activityLog.create({
      data: {
        userId: g.user.sub,
        action: "CREATE",
        entityType: "Page",
        entityId: item.id,
        summary: `Created page "${item.title}"`,
      },
    });
    revalidateTag("pages");
    return jsonOk({ item }, 201);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("A page with that slug already exists", 409);
    }
    throw err;
  }
}
