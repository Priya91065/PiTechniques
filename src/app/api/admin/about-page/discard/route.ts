import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { discardAboutDraft } from "@/server/services/aboutStaging";

export async function POST(): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;
  try {
    const ok = await discardAboutDraft();
    if (!ok) return jsonError("Nothing has been published yet to revert to.", 400);
    await prisma.activityLog.create({
      data: { userId: g.user.sub, action: "UPDATE", entityType: "AboutPage", entityId: "about", summary: "Discarded About page draft changes" },
    });
    return jsonOk({ ok: true });
  } catch {
    return jsonError("Couldn't discard changes. Please try again.", 500);
  }
}
