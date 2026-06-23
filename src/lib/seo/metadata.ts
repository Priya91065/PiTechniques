import type { Metadata } from "next";
import { getSeo } from "@/server/content/seo";

export interface SeoFallback {
  /** Short title (root layout adds the " - Pi Techniques" suffix via its template). */
  title: string;
  description?: string;
}

/**
 * Build Next.js Metadata for a route from the DB-managed SEO settings, falling
 * back to the page's own copy when no row exists. DB `metaTitle` is treated as
 * the full title (absolute) so the root template doesn't double the suffix.
 */
export async function buildMetadata(path: string, fallback: SeoFallback): Promise<Metadata> {
  const seo = await getSeo(path);
  if (!seo) {
    return { title: fallback.title, description: fallback.description };
  }

  const ogTitle = seo.ogTitle ?? seo.metaTitle;
  const ogDescription = seo.ogDescription ?? seo.metaDescription;

  const metadata: Metadata = {
    title: { absolute: seo.metaTitle },
    description: seo.metaDescription,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(seo.ogImage ? { images: [{ url: seo.ogImage }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: seo.twitterTitle ?? ogTitle,
      description: seo.twitterDescription ?? ogDescription,
      ...(seo.twitterImage ? { images: [seo.twitterImage] } : {}),
    },
  };
  if (seo.canonicalUrl) metadata.alternates = { canonical: seo.canonicalUrl };
  return metadata;
}
