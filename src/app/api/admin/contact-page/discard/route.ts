import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { discardDraft } from "@/server/services/contactStaging";

export async function POST(): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;
  try {
    const ok = await discardDraft();
    if (!ok) return jsonError("Nothing has been published yet to revert to.", 400);
    await prisma.activityLog.create({
      data: { userId: g.user.sub, action: "UPDATE", entityType: "ContactPage", entityId: "contact", summary: "Discarded Contact page draft changes" },
    });
    // Draft (live tables) reverted — admin editors re-read on load.
    revalidateTag("contact-page");
    return jsonOk({ ok: true });
  } catch {
    return jsonError("Couldn't discard changes. Please try again.", 500);
  }
}
