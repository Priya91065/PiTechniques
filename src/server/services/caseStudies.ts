import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { CaseStudyInput } from "@/lib/validation/caseStudy";

export const caseStudyChildren = {
  solutions: { orderBy: { order: "asc" } },
  features: { orderBy: { order: "asc" } },
  impacts: { orderBy: { order: "asc" } },
} satisfies Prisma.CaseStudyInclude;

export type CaseStudyWithChildren = Prisma.CaseStudyGetPayload<{ include: typeof caseStudyChildren }>;

export function listCaseStudies(): Promise<CaseStudyWithChildren[]> {
  return prisma.caseStudy.findMany({ orderBy: { order: "asc" }, include: caseStudyChildren });
}

export function getCaseStudy(id: string): Promise<CaseStudyWithChildren | null> {
  return prisma.caseStudy.findUnique({ where: { id }, include: caseStudyChildren });
}

/** Maps the validated top-level fields (only those present) to a Prisma update payload. */
function topFields(data: Partial<CaseStudyInput>): Prisma.CaseStudyUpdateInput {
  return {
    ...(data.slug !== undefined ? { slug: data.slug } : {}),
    ...(data.name !== undefined ? { name: data.name } : {}),
    ...(data.title !== undefined ? { title: data.title } : {}),
    ...(data.shortDesc !== undefined ? { shortDesc: data.shortDesc } : {}),
    ...(data.tags !== undefined ? { tags: data.tags } : {}),
    ...(data.heroImage !== undefined ? { heroImage: data.heroImage } : {}),
    ...(data.logo !== undefined ? { logo: data.logo } : {}),
    ...(data.cardImage !== undefined ? { cardImage: data.cardImage } : {}),
    ...(data.cardImageMobile !== undefined ? { cardImageMobile: data.cardImageMobile } : {}),
    ...(data.cardClient !== undefined ? { cardClient: data.cardClient } : {}),
    ...(data.listImage !== undefined ? { listImage: data.listImage } : {}),
    ...(data.listHeading !== undefined ? { listHeading: data.listHeading } : {}),
    ...(data.industry !== undefined ? { industry: data.industry } : {}),
    ...(data.headquarters !== undefined ? { headquarters: data.headquarters } : {}),
    ...(data.website !== undefined ? { website: data.website ?? null } : {}),
    ...(data.challengeShortInfo !== undefined ? { challengeShortInfo: data.challengeShortInfo } : {}),
    ...(data.challengeLists !== undefined ? { challengeLists: data.challengeLists } : {}),
    ...(data.challengeBackground !== undefined ? { challengeBackground: data.challengeBackground } : {}),
    ...(data.solutionDetails !== undefined ? { solutionDetails: data.solutionDetails } : {}),
    ...(data.longTermImpactTitle !== undefined ? { longTermImpactTitle: data.longTermImpactTitle } : {}),
    ...(data.featureGridVariant !== undefined ? { featureGridVariant: data.featureGridVariant } : {}),
    ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle ?? null } : {}),
    ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription ?? null } : {}),
    ...(data.ogImage !== undefined ? { ogImage: data.ogImage ?? null } : {}),
    ...(data.published !== undefined ? { published: data.published } : {}),
  };
}

export async function createCaseStudy(data: CaseStudyInput): Promise<CaseStudyWithChildren> {
  const max = await prisma.caseStudy.aggregate({ _max: { order: true } });
  return prisma.caseStudy.create({
    data: {
      slug: data.slug,
      name: data.name,
      title: data.title,
      shortDesc: data.shortDesc,
      tags: data.tags,
      heroImage: data.heroImage,
      logo: data.logo,
      galleryImages: [],
      cardImage: data.cardImage,
      cardImageMobile: data.cardImageMobile,
      cardClient: data.cardClient,
      listImage: data.listImage,
      listHeading: data.listHeading,
      industry: data.industry,
      headquarters: data.headquarters,
      website: data.website ?? null,
      challengeShortInfo: data.challengeShortInfo,
      challengeLists: data.challengeLists,
      challengeBackground: data.challengeBackground,
      solutionDetails: data.solutionDetails,
      longTermImpactTitle: data.longTermImpactTitle,
      featureGridVariant: data.featureGridVariant,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
      ogImage: data.ogImage ?? null,
      published: data.published ?? true,
      order: (max._max.order ?? -1) + 1,
      solutions: { create: data.solutions.map((s, i) => ({ title: s.title, subTitle: s.subTitle, items: s.items, order: i })) },
      features: { create: data.features.map((f, i) => ({ image: f.image, feature: f.feature, order: i })) },
      impacts: { create: data.impacts.map((m, i) => ({ image: m.image, title: m.title, subTitle: m.subTitle, order: i })) },
    },
    include: caseStudyChildren,
  });
}

export async function updateCaseStudy(
  id: string,
  data: Partial<CaseStudyInput>,
): Promise<CaseStudyWithChildren | null> {
  return prisma.$transaction(async (tx) => {
    await tx.caseStudy.update({ where: { id }, data: topFields(data) });

    if (data.solutions !== undefined) {
      await tx.caseStudySolution.deleteMany({ where: { caseStudyId: id } });
      await tx.caseStudySolution.createMany({
        data: data.solutions.map((s, i) => ({ caseStudyId: id, title: s.title, subTitle: s.subTitle, items: s.items, order: i })),
      });
    }
    if (data.features !== undefined) {
      await tx.caseStudyFeature.deleteMany({ where: { caseStudyId: id } });
      await tx.caseStudyFeature.createMany({
        data: data.features.map((f, i) => ({ caseStudyId: id, image: f.image, feature: f.feature, order: i })),
      });
    }
    if (data.impacts !== undefined) {
      await tx.caseStudyImpact.deleteMany({ where: { caseStudyId: id } });
      await tx.caseStudyImpact.createMany({
        data: data.impacts.map((m, i) => ({ caseStudyId: id, image: m.image, title: m.title, subTitle: m.subTitle, order: i })),
      });
    }
    return tx.caseStudy.findUnique({ where: { id }, include: caseStudyChildren });
  });
}

export function deleteCaseStudy(id: string): Promise<{ id: string }> {
  return prisma.caseStudy.delete({ where: { id }, select: { id: true } });
}

export async function reorderCaseStudies(ids: string[]): Promise<void> {
  await prisma.$transaction(
    ids.map((id, index) => prisma.caseStudy.update({ where: { id }, data: { order: index } })),
  );
}
