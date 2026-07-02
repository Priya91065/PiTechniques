import type { JSX } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BodyClass from "@/components/home/BodyClass";
import PageScripts from "@/components/home/PageScripts";
import CmsSections from "@/components/cms/CmsSections";
import { getPublishedPage } from "@/server/content/pages";
import { isSystemSlug } from "@/lib/systemPages";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (isSystemSlug(slug)) return { title: "Not found" };
  const page = await getPublishedPage(slug);
  if (!page) return { title: "Not found" };
  return {
    title: page.seoTitle ? { absolute: page.seoTitle } : page.title,
    description: page.seoDescription ?? undefined,
  };
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }): Promise<JSX.Element> {
  const { slug } = await params;
  // System pages (home, about, contact…) are served by their dedicated routes.
  if (isSystemSlug(slug)) notFound();

  const page = await getPublishedPage(slug);
  if (!page) notFound();

  const hasContactForm = page.sections.some((s) => s.type === "contactForm");

  return (
    <>
      <BodyClass name="cms-page" />
      {/* bg-black wrapper: section spacing must not expose the white body between blocks */}
      <div className="bg-black">
        <CmsSections sections={page.sections} />
      </div>
      <PageScripts extra={hasContactForm ? ["/js/contact.js"] : undefined} />
    </>
  );
}
