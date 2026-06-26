import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { whyChooseFeatureInput } from "@/lib/validation/aboutPage";
import { createWhyChooseFeature, listWhyChooseFeatures } from "@/server/services/aboutPage";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    return jsonOk({ items: await listWhyChooseFeatures() });
  } catch {
    return jsonError("Couldn't load the agile process steps. Is the database connected?", 503, "DB_UNAVAILABLE");
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
  const parsed = whyChooseFeatureInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const item = await createWhyChooseFeature(parsed.data);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "CREATE",
      entityType: "WhyChooseFeature",
      entityId: item.id,
      summary: `Created agile process step "${item.title}"`,
    },
  });
  return jsonOk({ item }, 201);
}
