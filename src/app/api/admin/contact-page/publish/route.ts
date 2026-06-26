import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { publishContactPage } from "@/server/services/contactStaging";

export async function POST(): Promise<NextResponse> {
  const g = await guard("PUBLISH");
  if ("response" in g) return g.response;
  try {
    await publishContactPage();
    await prisma.activityLog.create({
      data: { userId: g.user.sub, action: "PUBLISH", entityType: "ContactPage", entityId: "contact", summary: "Published Contact page changes" },
    });
    revalidateTag("contact-page");
    revalidatePath("/contact-us");
    return jsonOk({ ok: true });
  } catch {
    return jsonError("Couldn't publish. Please try again.", 500);
  }
}
