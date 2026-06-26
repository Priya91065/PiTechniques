import { NextResponse } from "next/server";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { hasUnpublishedAboutChanges } from "@/server/services/aboutStaging";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    return jsonOk({ hasChanges: await hasUnpublishedAboutChanges() });
  } catch {
    return jsonError("Couldn't load About page status.", 503, "DB_UNAVAILABLE");
  }
}
