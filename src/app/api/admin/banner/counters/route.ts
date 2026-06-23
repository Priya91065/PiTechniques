import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { homeStatInput } from "@/lib/validation/banner";
import { createStat, listStats } from "@/server/services/banner";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    return jsonOk({ items: await listStats() });
  } catch {
    return jsonError("Couldn't load counters.", 503, "DB_UNAVAILABLE");
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
  const parsed = homeStatInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const item = await createStat(parsed.data);
  await prisma.activityLog.create({
    data: { userId: g.user.sub, action: "CREATE", entityType: "HomeStat", entityId: item.id, summary: `Added counter "${item.label}"` },
  });
  revalidateTag("banner");
  revalidatePath("/");
  return jsonOk({ item }, 201);
}
