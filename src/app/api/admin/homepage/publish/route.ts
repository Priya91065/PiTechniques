import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { publishHomepage } from "@/server/services/homepageStaging";

export async function POST(): Promise<NextResponse> {
  const g = await guard("PUBLISH");
  if ("response" in g) return g.response;
  try {
    await publishHomepage();
    await prisma.activityLog.create({
      data: { userId: g.user.sub, action: "PUBLISH", entityType: "Homepage", entityId: "home", summary: "Published homepage changes" },
    });
    revalidateTag("homepage");
    revalidatePath("/");
    return jsonOk({ ok: true });
  } catch {
    return jsonError("Couldn't publish. Please try again.", 500);
  }
}
