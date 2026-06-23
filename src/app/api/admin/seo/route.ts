import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { seoInput } from "@/lib/validation/seo";
import { createSeoSetting, listSeoSettings } from "@/server/services/seoSettings";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    return jsonOk({ items: await listSeoSettings() });
  } catch {
    return jsonError("Couldn't load SEO settings. Is the database connected?", 503, "DB_UNAVAILABLE");
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
  const parsed = seoInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  try {
    const item = await createSeoSetting(parsed.data);
    await prisma.activityLog.create({
      data: { userId: g.user.sub, action: "CREATE", entityType: "SeoSetting", entityId: item.id, summary: `Created SEO for ${item.path}` },
    });
    revalidateTag("seo");
    revalidatePath(item.path);
    return jsonOk({ item }, 201);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("SEO settings for that path already exist", 409);
    }
    return jsonError("Couldn't create SEO settings", 500);
  }
}
