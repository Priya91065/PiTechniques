import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

export interface PublicSeo {
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
}

const cached = unstable_cache(
  async (path: string): Promise<PublicSeo | null> => {
    try {
      const row = await prisma.seoSetting.findUnique({
        where: { path },
        select: {
          metaTitle: true,
          metaDescription: true,
          canonicalUrl: true,
          ogTitle: true,
          ogDescription: true,
          ogImage: true,
          twitterTitle: true,
          twitterDescription: true,
          twitterImage: true,
        },
      });
      return row;
    } catch {
      return null;
    }
  },
  ["public-seo"],
  { tags: ["seo"], revalidate: 3600 },
);

/** SEO settings for a path, or null when none have been configured. */
export async function getSeo(path: string): Promise<PublicSeo | null> {
  return cached(path);
}
