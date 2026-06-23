import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { duplicatePage } from "@/server/services/pages";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("CREATE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const item = await duplicatePage(id);
  if (!item) return jsonError("Page not found", 404);

  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "CREATE",
      entityType: "Page",
      entityId: item.id,
      summary: `Duplicated page "${item.title}"`,
    },
  });
  revalidateTag("pages");
  return jsonOk({ item }, 201);
}
