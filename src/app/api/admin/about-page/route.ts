import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { aboutContentInput } from "@/lib/validation/aboutPage";
import { getAboutContentRow, upsertAboutContent } from "@/server/services/aboutPage";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    return jsonOk({ item: await getAboutContentRow() });
  } catch {
    return jsonError("Couldn't load the About page content. Is the database connected?", 503, "DB_UNAVAILABLE");
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
  const parsed = aboutContentInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const item = await upsertAboutContent(parsed.data);
  await prisma.activityLog.create({
    data: { userId: g.user.sub, action: "UPDATE", entityType: "AboutPage", entityId: "about", summary: "Updated About page draft" },
  });
  return jsonOk({ item });
}
