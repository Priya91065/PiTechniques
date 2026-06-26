import { NextResponse } from "next/server";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { hasUnpublishedChanges } from "@/server/services/contactStaging";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    return jsonOk({ hasChanges: await hasUnpublishedChanges() });
  } catch {
    return jsonError("Couldn't load Contact page status.", 503, "DB_UNAVAILABLE");
  }
}
