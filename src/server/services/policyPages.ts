import type { PolicyPage } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { PolicyPageInput } from "@/lib/validation/policyPage";
import { POLICY_PAGES_HTML, type PolicySlug } from "@/constants/policyPagesHtml";

function nz(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length > 0 ? t : null;
}

export function listPolicyPages(): Promise<PolicyPage[]> {
  return prisma.policyPage.findMany({ orderBy: { slug: "asc" } });
}

export function getPolicyPageBySlug(slug: string): Promise<PolicyPage | null> {
  return prisma.policyPage.findUnique({ where: { slug } });
}

/** Create-or-update the policy page for `slug`. pageClass/contentClassName seed
 *  from the known defaults on first create. */
export function upsertPolicyPage(slug: string, data: PolicyPageInput): Promise<PolicyPage> {
  const known = POLICY_PAGES_HTML[slug as PolicySlug];
  const values = {
    heading: data.heading,
    bannerDescription: nz(data.bannerDescription),
    contentClassName: data.contentClassName?.trim() || known?.contentClassName || "static-content",
    contentHtml: data.contentHtml,
    seoTitle: nz(data.seoTitle),
    seoDescription: nz(data.seoDescription),
    seoKeywords: nz(data.seoKeywords),
    ogImage: nz(data.ogImage),
    status: data.status,
  };
  return prisma.policyPage.upsert({
    where: { slug },
    update: values,
    create: { slug, pageClass: known?.pageClass ?? slug, ...values },
  });
}
