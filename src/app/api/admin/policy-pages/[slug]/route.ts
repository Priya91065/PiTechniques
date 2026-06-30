import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { policyPageInput } from "@/lib/validation/policyPage";
import { getPolicyPageBySlug, upsertPolicyPage } from "@/server/services/policyPages";
import { POLICY_PAGES_HTML, POLICY_SLUGS, type PolicySlug } from "@/constants/policyPagesHtml";

type Ctx = { params: Promise<{ slug: string }> };

function isKnown(slug: string): slug is PolicySlug {
  return (POLICY_SLUGS as readonly string[]).includes(slug);
}

/** GET — the saved row, or the built-in default content for first-time editing. */
export async function GET(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  const { slug } = await params;
  if (!isKnown(slug)) return jsonError("Unknown policy page", 404);

  const row = await getPolicyPageBySlug(slug);
  if (row) return jsonOk({ item: row });

  const def = POLICY_PAGES_HTML[slug];
  return jsonOk({
    item: {
      slug,
      pageClass: def.pageClass,
      heading: def.heading,
      bannerDescription: def.bannerDescription,
      contentClassName: def.contentClassName,
      contentHtml: def.contentHtml,
      seoTitle: def.seoTitle,
      seoDescription: def.seoDescription,
      seoKeywords: null,
      ogImage: null,
      status: "PUBLISHED",
      inDb: false,
    },
  });
}

export async function PUT(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;
  const { slug } = await params;
  if (!isKnown(slug)) return jsonError("Unknown policy page", 404);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = policyPageInput.safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  // Publishing requires the PUBLISH permission.
  const existing = await getPolicyPageBySlug(slug);
  if (parsed.data.status === "PUBLISHED" && existing?.status !== "PUBLISHED") {
    const pub = await guard("PUBLISH");
    if ("response" in pub) return pub.response;
  }

  const item = await upsertPolicyPage(slug, parsed.data);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: parsed.data.status === "PUBLISHED" ? "PUBLISH" : "UPDATE",
      entityType: "PolicyPage",
      entityId: item.id,
      summary: `Updated policy page "${slug}"`,
    },
  });
  revalidateTag("policy");
  revalidatePath(`/${slug}`);
  return jsonOk({ item });
}
