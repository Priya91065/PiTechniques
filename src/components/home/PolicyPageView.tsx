import type { JSX } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StaticPage from "@/components/home/StaticPage";
import { getPolicyPage } from "@/server/content/policy";

/** Dynamic SEO metadata for a policy page (DB-driven, with built-in fallbacks). */
export async function policyMetadata(slug: string): Promise<Metadata> {
  const p = await getPolicyPage(slug);
  if (!p) return {};
  const meta: Metadata = {
    ...(p.seoTitle ? { title: { absolute: p.seoTitle } } : {}),
    ...(p.seoDescription ? { description: p.seoDescription } : {}),
    ...(p.seoKeywords ? { keywords: p.seoKeywords } : {}),
  };
  if (p.ogImage) meta.openGraph = { images: [{ url: p.ogImage }] };
  return meta;
}

/**
 * Renders a CMS-driven policy page through the shared faithful StaticPage shell.
 * The body is stored/served as HTML so the markup stays pixel-identical.
 */
export default async function PolicyPageView({ slug }: { slug: string }): Promise<JSX.Element> {
  const p = await getPolicyPage(slug);
  if (!p) notFound();
  return (
    <StaticPage
      pageClass={p.pageClass}
      contentClassName={p.contentClassName}
      heading={<span dangerouslySetInnerHTML={{ __html: p.heading }} />}
      html={p.contentHtml}
    />
  );
}
