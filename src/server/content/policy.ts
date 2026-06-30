import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { POLICY_PAGES_HTML, type PolicySlug } from "@/constants/policyPagesHtml";

export interface PublicPolicyPage {
  slug: string;
  pageClass: string;
  heading: string;
  bannerDescription: string | null;
  contentClassName: string;
  contentHtml: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  ogImage: string | null;
}

function fromConstant(slug: string): PublicPolicyPage | null {
  const c = POLICY_PAGES_HTML[slug as PolicySlug];
  if (!c) return null;
  return {
    slug: c.slug,
    pageClass: c.pageClass,
    heading: c.heading,
    bannerDescription: c.bannerDescription,
    contentClassName: c.contentClassName,
    contentHtml: c.contentHtml,
    seoTitle: c.seoTitle,
    seoDescription: c.seoDescription,
    seoKeywords: null,
    ogImage: null,
  };
}

const cached = unstable_cache(
  async (slug: string): Promise<PublicPolicyPage | null> => {
    try {
      const row = await prisma.policyPage.findFirst({ where: { slug, status: "PUBLISHED" } });
      if (!row) return null;
      return {
        slug: row.slug,
        pageClass: row.pageClass,
        heading: row.heading,
        bannerDescription: row.bannerDescription,
        contentClassName: row.contentClassName,
        contentHtml: row.contentHtml,
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
        seoKeywords: row.seoKeywords,
        ogImage: row.ogImage,
      };
    } catch {
      return null;
    }
  },
  ["public-policy"],
  { tags: ["policy"], revalidate: 3600 },
);

/** A policy page by slug: the published DB row, else the original built-in content. */
export async function getPolicyPage(slug: string): Promise<PublicPolicyPage | null> {
  return (await cached(slug)) ?? fromConstant(slug);
}
