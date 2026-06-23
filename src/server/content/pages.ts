import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import type { SectionType } from "@/lib/validation/section";

export interface PublicSection {
  id: string;
  type: SectionType;
  content: unknown;
}

export interface PublicPage {
  title: string;
  slug: string;
  seoTitle: string | null;
  seoDescription: string | null;
  sections: PublicSection[];
}

const cached = unstable_cache(
  async (slug: string): Promise<PublicPage | null> => {
    try {
      const page = await prisma.page.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: { sections: { where: { published: true }, orderBy: { order: "asc" } } },
      });
      if (!page) return null;
      return {
        title: page.title,
        slug: page.slug,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        sections: page.sections.map((s) => ({ id: s.id, type: s.type as SectionType, content: s.content })),
      };
    } catch {
      return null;
    }
  },
  ["public-page"],
  { tags: ["pages"], revalidate: 3600 },
);

/** A published CMS page (with its published sections) by slug, or null. */
export async function getPublishedPage(slug: string): Promise<PublicPage | null> {
  return cached(slug);
}
