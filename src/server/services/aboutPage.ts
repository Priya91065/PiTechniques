import type { AboutContent, WhyChooseFeature } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { AboutContentInput, WhyChooseFeatureInput } from "@/lib/validation/aboutPage";

function nz(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length > 0 ? t : null;
}

/** Seed defaults used when the AboutContent row doesn't exist yet (create path). */
export const ABOUT_PAGE_SEED_DEFAULTS = {
  bannerTitle: "We keep it precise and\nsimple",
  bannerSubtitle: "Three decades of building with care and clarity.",
  bannerImage: null,
  breadcrumb: null,
  ctaLabel: null,
  ctaHref: null,
  showBanner: true,

  introEyebrow: "ABOUT US",
  introTitle: "Rooted in experience.\nDriven by innovation.",
  introDescription:
    "At Pi Techniques, we've been solving problems with tech since 1992. Beginning as a small support firm for individuals and home offices, and growing into a trusted, full-spectrum technology partner for modern businesses.\n\nOver the years, we’ve expanded into software development, web technologies, and IT infrastructure services. We have been delivering solutions that are tailored, reliable, and future-ready. Many of our clients have been with us for decades, a testament to our clear, simple, and client-first approach. No jargon, just measurable results.\n\nBacked by decades of experience, we create technology shaped around your business needs — reliable, scalable, and future-ready. Solutions that help grow with your business and keep pace with a fast-moving tech world.",
  introImage: null,
  introCtaLabel: null,
  introCtaHref: null,

  whyHeading: "our agile process",
  whyTitle: "Adapting agility for smarter outcomes",
  whyDescription:
    "At Pi Techniques, we’ve learned that agility isn’t just a methodology, it’s a mindset. As client needs evolve, we adapt. That’s why we’ve embraced Agile Project Management. A proven, flexible framework that helps us stay aligned, responsive, and focused on what matters most: delivering results, fast.",
  whyImage: null,
  showWhySection: true,

  seoTitle: null,
  seoDescription: null,
  seoKeywords: null,
  canonicalUrl: null,
  ogImage: null,
  twitterImage: null,
  robotsMeta: null,
};

export function getAboutContentRow(): Promise<AboutContent | null> {
  return prisma.aboutContent.findUnique({ where: { id: "about" } });
}

export function upsertAboutContent(data: AboutContentInput): Promise<AboutContent> {
  const fields = {
    bannerTitle: data.bannerTitle,
    bannerSubtitle: nz(data.bannerSubtitle),
    bannerImage: nz(data.bannerImage),
    breadcrumb: nz(data.breadcrumb),
    ctaLabel: nz(data.ctaLabel),
    ctaHref: nz(data.ctaHref),
    showBanner: data.showBanner ?? true,

    introEyebrow: nz(data.introEyebrow),
    introTitle: data.introTitle,
    introDescription: data.introDescription,
    introImage: nz(data.introImage),
    introCtaLabel: nz(data.introCtaLabel),
    introCtaHref: nz(data.introCtaHref),

    whyHeading: nz(data.whyHeading),
    whyTitle: nz(data.whyTitle),
    whyDescription: nz(data.whyDescription),
    whyImage: nz(data.whyImage),
    showWhySection: data.showWhySection ?? true,

    seoTitle: nz(data.seoTitle),
    seoDescription: nz(data.seoDescription),
    seoKeywords: nz(data.seoKeywords),
    canonicalUrl: nz(data.canonicalUrl),
    ogImage: nz(data.ogImage),
    twitterImage: nz(data.twitterImage),
    robotsMeta: nz(data.robotsMeta),
  };
  return prisma.aboutContent.upsert({
    where: { id: "about" },
    update: fields,
    create: { id: "about", ...ABOUT_PAGE_SEED_DEFAULTS, ...fields },
  });
}

// ---- WhyChooseFeature ("our agile process" steps) ---------------------------

export function listWhyChooseFeatures(): Promise<WhyChooseFeature[]> {
  return prisma.whyChooseFeature.findMany({ orderBy: { order: "asc" } });
}

export async function createWhyChooseFeature(data: WhyChooseFeatureInput): Promise<WhyChooseFeature> {
  const max = await prisma.whyChooseFeature.aggregate({ _max: { order: true } });
  return prisma.whyChooseFeature.create({
    data: {
      icon: nz(data.icon),
      title: data.title,
      description: data.description,
      published: data.published ?? true,
      order: (max._max.order ?? -1) + 1,
    },
  });
}

export function updateWhyChooseFeature(id: string, data: Partial<WhyChooseFeatureInput>): Promise<WhyChooseFeature> {
  return prisma.whyChooseFeature.update({
    where: { id },
    data: {
      ...(data.icon !== undefined ? { icon: nz(data.icon) } : {}),
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
    },
  });
}

export function deleteWhyChooseFeature(id: string): Promise<WhyChooseFeature> {
  return prisma.whyChooseFeature.delete({ where: { id } });
}

export async function reorderWhyChooseFeatures(ids: string[]): Promise<void> {
  await prisma.$transaction(
    ids.map((id, index) => prisma.whyChooseFeature.update({ where: { id }, data: { order: index } })),
  );
}
