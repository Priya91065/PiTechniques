import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { publishAboutPage } from "@/server/services/aboutStaging";

export async function POST(): Promise<NextResponse> {
  const g = await guard("PUBLISH");
  if ("response" in g) return g.response;
  try {
    await publishAboutPage();
    await prisma.activityLog.create({
      data: { userId: g.user.sub, action: "PUBLISH", entityType: "AboutPage", entityId: "about", summary: "Published About page changes" },
    });
    revalidateTag("about-page");
    revalidatePath("/about");
    return jsonOk({ ok: true });
  } catch {
    return jsonError("Couldn't publish. Please try again.", 500);
  }
}
