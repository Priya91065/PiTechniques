import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { siteSettingsInput } from "@/lib/validation/siteSettings";
import { getSiteSetting, upsertSiteSetting } from "@/server/services/siteSettings";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    return jsonOk({ item: await getSiteSetting() });
  } catch {
    return jsonError("Couldn't load settings. Is the database connected?", 503, "DB_UNAVAILABLE");
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = siteSettingsInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const item = await upsertSiteSetting(parsed.data);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "UPDATE",
      entityType: "SiteSetting",
      entityId: String(item.id),
      summary: "Updated site settings",
    },
  });

  revalidateTag("site-settings");
  revalidatePath("/", "layout");
  return jsonOk({ item });
}
