import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { socialLinkInput } from "@/lib/validation/contactPage";
import { createSocialLink, listSocialLinks } from "@/server/services/socialLinks";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    return jsonOk({ items: await listSocialLinks() });
  } catch {
    return jsonError("Couldn't load social links. Is the database connected?", 503, "DB_UNAVAILABLE");
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
  const parsed = socialLinkInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const item = await createSocialLink(parsed.data);
  await prisma.activityLog.create({
    data: { userId: g.user.sub, action: "CREATE", entityType: "SocialLink", entityId: item.id, summary: `Created social link "${item.platform}"` },
  });
  revalidateTag("contact-page");
  revalidatePath("/contact-us");
  return jsonOk({ item }, 201);
}
