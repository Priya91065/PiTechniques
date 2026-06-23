import type { JSX } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BodyClass from "@/components/home/BodyClass";
import PageScripts from "@/components/home/PageScripts";
import CmsSections from "@/components/cms/CmsSections";
import { getPublishedPage } from "@/server/content/pages";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) return { title: "Not found" };
  return {
    title: page.seoTitle ? { absolute: page.seoTitle } : page.title,
    description: page.seoDescription ?? undefined,
  };
}

export default async function CmsPage({ params }: { params: Promise<{ slug: string }> }): Promise<JSX.Element> {
  const { slug } = await params;
  const page = await getPublishedPage(slug);
  if (!page) notFound();

  return (
    <>
      <BodyClass name="cms-page" />
      <CmsSections sections={page.sections} />
      <PageScripts />
    </>
  );
}
