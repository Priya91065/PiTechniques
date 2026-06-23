import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { aboutInput } from "@/lib/validation/about";
import { getAboutRow, upsertAbout } from "@/server/services/about";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    return jsonOk({ item: await getAboutRow() });
  } catch {
    return jsonError("Couldn't load the About section. Is the database connected?", 503, "DB_UNAVAILABLE");
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
  const parsed = aboutInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const item = await upsertAbout(parsed.data);
  await prisma.activityLog.create({
    data: { userId: g.user.sub, action: "UPDATE", entityType: "AboutSection", entityId: "home", summary: "Updated About section" },
  });
  revalidateTag("banner");
  revalidatePath("/");
  return jsonOk({ item });
}
