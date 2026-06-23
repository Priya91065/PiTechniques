import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";
import { caseStudyProjects, type CaseStudyProject } from "@/constants/caseStudyProjects";

/** The detail page consumes the original `CaseStudyProject` shape + the grid variant. */
export type DetailCaseStudy = CaseStudyProject & { featureGridVariant: string };

function link(slug: string): string {
  return slug ? `detailed-project.php?project=${slug}` : "#";
}

function fallbackVariant(slug: string): string {
  if (slug === "tajGroupofHotels") return "taj-features";
  if (slug === "citiusTech") return "citius-features";
  return "";
}

/**
 * Returns a single case study in the shape `/detailed-project` renders, reading
 * from the DB first and falling back to the hardcoded constant (so the page
 * stays pixel-perfect if the DB is empty/unreachable). prev/next are derived
 * from published order (cyclic, matching the original).
 */
export const getCaseStudyBySlug = unstable_cache(
  async (slug: string): Promise<DetailCaseStudy | null> => {
    try {
      const cs = await prisma.caseStudy.findFirst({
        where: { slug, published: true },
        include: {
          solutions: { orderBy: { order: "asc" } },
          features: { orderBy: { order: "asc" } },
          impacts: { orderBy: { order: "asc" } },
        },
      });

      if (cs) {
        const all = await prisma.caseStudy.findMany({
          where: { published: true },
          orderBy: { order: "asc" },
          select: { slug: true },
        });
        const idx = all.findIndex((x) => x.slug === slug);
        const prevSlug = all.length > 1 ? all[(idx - 1 + all.length) % all.length].slug : "";
        const nextSlug = all.length > 1 ? all[(idx + 1) % all.length].slug : "";

        return {
          topSection: {
            title: cs.title,
            shortDesc: cs.shortDesc,
            tags: cs.tags,
            img: cs.heroImage,
            logo: cs.logo,
          },
          projectInfo: {
            name: cs.name,
            projectDetails: {
              industry: cs.industry,
              headquarters: cs.headquarters,
              website: cs.website ?? "",
            },
          },
          challenges: {
            shortInfo: cs.challengeShortInfo,
            lists: cs.challengeLists,
            background: cs.challengeBackground,
          },
          piSolution: {
            details: cs.solutionDetails,
            solutions: cs.solutions.map((s) => ({ title: s.title, subTitle: s.subTitle, list: s.items })),
          },
          keyFeature: cs.features.map((f) => ({ img: f.image, feature: f.feature })),
          longTermImpact: {
            title: cs.longTermImpactTitle,
            impact: cs.impacts.map((m) => ({ img: m.image, title: m.title, subTitle: m.subTitle })),
          },
          previous: { label: "Previous Case Study", link: link(prevSlug) },
          next: { label: "Next Case Study", link: link(nextSlug) },
          featureGridVariant: cs.featureGridVariant,
        };
      }
    } catch {
      // fall through to constant
    }

    const fb = caseStudyProjects[slug];
    if (!fb) return null;
    return { ...fb, featureGridVariant: fallbackVariant(slug) };
  },
  ["public-case-study"],
  { tags: ["case-studies"], revalidate: 3600 },
);

/** Card shape for the homepage "Our work" carousel + the /case-studies list. */
export interface CaseStudyCard {
  slug: string;
  title: string;
  shortDesc: string;
  tags: string[];
  cardImage: string;
  cardImageMobile: string;
  cardClient: string;
  listImage: string;
  listHeading: string;
}

const CARD_META: Record<
  string,
  { title: string; cardImage: string; cardImageMobile: string; cardClient: string; listImage: string; listHeading: string }
> = {
  chanakya: {
    title: "Threading technology into fashion",
    cardImage: "/images/chanakya.png",
    cardImageMobile: "/images/chanakya-mobile.jpg",
    cardClient: "Chanakya",
    listImage: "/images/case-studies/case-studies.png",
    listHeading: "chanakya | Fashion & LIFESTYLE",
  },
  ibs: {
    title: "Transforming fintech publishing",
    cardImage: "/images/ibs.png",
    cardImageMobile: "/images/ibs-mobile.jpg",
    cardClient: "IBSintelligence",
    listImage: "/images/case-studies/case-studies1.png",
    listHeading: "IBS intelligence | Fintech",
  },
  citiusTech: {
    title: "The strong and steady ERP evolution",
    cardImage: "/images/citius.png",
    cardImageMobile: "/images/citius-mobile.jpg",
    cardClient: "CitiusTech",
    listImage: "/images/case-studies/case-studies2.png",
    listHeading: "citiustech | healthcare Technology",
  },
  tajGroupofHotels: {
    title: "A premium car rental management system",
    cardImage: "/images/taj-ipad.png",
    cardImageMobile: "/images/taj-ipad-mobile.jpg",
    cardClient: "Taj Hotels",
    listImage: "/images/case-studies/laptop-4.png",
    listHeading: "taj | hospitality",
  },
};

const CARD_FALLBACK: CaseStudyCard[] = ["chanakya", "ibs", "citiusTech", "tajGroupofHotels"]
  .filter((slug) => caseStudyProjects[slug] && CARD_META[slug])
  .map((slug) => {
    const p = caseStudyProjects[slug];
    const m = CARD_META[slug];
    return {
      slug,
      title: m.title,
      shortDesc: p.topSection.shortDesc,
      tags: p.topSection.tags,
      cardImage: m.cardImage,
      cardImageMobile: m.cardImageMobile,
      cardClient: m.cardClient,
      listImage: m.listImage,
      listHeading: m.listHeading,
    };
  });

export const getCaseStudyCards = unstable_cache(
  async (): Promise<CaseStudyCard[]> => {
    try {
      const rows = await prisma.caseStudy.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        select: {
          slug: true,
          title: true,
          shortDesc: true,
          tags: true,
          cardImage: true,
          cardImageMobile: true,
          cardClient: true,
          listImage: true,
          listHeading: true,
        },
      });
      return rows.length > 0 ? rows : CARD_FALLBACK;
    } catch {
      return CARD_FALLBACK;
    }
  },
  ["public-case-study-cards"],
  { tags: ["case-studies"], revalidate: 3600 },
);
