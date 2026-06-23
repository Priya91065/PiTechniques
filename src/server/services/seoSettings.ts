import type { SeoSetting } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { SeoInput } from "@/lib/validation/seo";

function nz(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length > 0 ? t : null;
}

export function listSeoSettings(): Promise<SeoSetting[]> {
  return prisma.seoSetting.findMany({ orderBy: { path: "asc" } });
}

export function getSeoById(id: string): Promise<SeoSetting | null> {
  return prisma.seoSetting.findUnique({ where: { id } });
}

function toData(data: SeoInput): Omit<SeoInput, "canonicalUrl"> & { canonicalUrl: string | null } {
  return {
    path: data.path,
    metaTitle: data.metaTitle,
    metaDescription: data.metaDescription,
    canonicalUrl: nz(data.canonicalUrl),
    ogTitle: nz(data.ogTitle),
    ogDescription: nz(data.ogDescription),
    ogImage: nz(data.ogImage),
    twitterTitle: nz(data.twitterTitle),
    twitterDescription: nz(data.twitterDescription),
    twitterImage: nz(data.twitterImage),
  };
}

export function createSeoSetting(data: SeoInput): Promise<SeoSetting> {
  return prisma.seoSetting.create({ data: toData(data) });
}

export function updateSeoSetting(id: string, data: SeoInput): Promise<SeoSetting> {
  return prisma.seoSetting.update({ where: { id }, data: toData(data) });
}

export function deleteSeoSetting(id: string): Promise<SeoSetting> {
  return prisma.seoSetting.delete({ where: { id } });
}
