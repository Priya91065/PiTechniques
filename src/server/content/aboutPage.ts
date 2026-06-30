import { unstable_cache } from "next/cache";
import { getPublishedAboutData, type AboutPageData, type SnapshotWhyChooseFeature } from "@/server/services/aboutStaging";

const cached = unstable_cache(
  async (): Promise<AboutPageData | null> => {
    try {
      return await getPublishedAboutData();
    } catch {
      return null;
    }
  },
  ["about-page-published"],
  { tags: ["about-page"], revalidate: 3600 },
);

/** The published About-page snapshot (banner + intro + agile process + steps), or null pre-publish. */
async function getPublishedAboutSnapshot(): Promise<AboutPageData | null> {
  return cached();
}

export interface AboutPageView {
  bannerTitle: string;
  bannerSubtitle: string | null;
  bannerImage: string | null;
  showBanner: boolean;

  introEyebrow: string | null;
  introTitle: string;
  introParagraphs: string[];
  introImage: string | null;

  whyHeading: string | null;
  whyTitle: string | null;
  whyDescription: string | null;
  showWhySection: boolean;

  steps: SnapshotWhyChooseFeature[];
}

/** Defaults keep the About page pixel-perfect pre-DB / pre-publish — copied verbatim from the original markup. */
const FALLBACK: AboutPageView = {
  bannerTitle: "We keep it precise and\nsimple",
  bannerSubtitle: "Three decades of building with care and clarity.",
  bannerImage: null,
  showBanner: true,

  introEyebrow: "ABOUT US",
  introTitle: "Rooted in experience.\nDriven by innovation.",
  introParagraphs: [
    "At Pi Techniques, we've been solving problems with tech since 1992. Beginning as a small support firm for individuals and home offices, and growing into a trusted, full-spectrum technology partner for modern businesses.",
    "Over the years, we’ve expanded into software development, web technologies, and IT infrastructure services. We have been delivering solutions that are tailored, reliable, and future-ready. Many of our clients have been with us for decades, a testament to our clear, simple, and client-first approach. No jargon, just measurable results.",
    "Backed by decades of experience, we create technology shaped around your business needs — reliable, scalable, and future-ready. Solutions that help grow with your business and keep pace with a fast-moving tech world.",
  ],
  introImage: null,

  whyHeading: "our agile process",
  whyTitle: "Adapting agility for smarter outcomes",
  whyDescription:
    "At Pi Techniques, we’ve learned that agility isn’t just a methodology, it’s a mindset. As client needs evolve, we adapt. That’s why we’ve embraced Agile Project Management. A proven, flexible framework that helps us stay aligned, responsive, and focused on what matters most: delivering results, fast.",
  showWhySection: true,

  steps: [
    {
      title: "Discover & Define",
      description:
        "We start by understanding your goals, challenges, and vision — laying the foundation with clear scope and priorities.",
      icon: null,
      published: true,
      order: 0,
    },
    {
      title: "Plan & Prioritize",
      description:
        "With a product backlog in place, we break down work into sprints — short, focused cycles that help us move fast and stay focused.",
      icon: null,
      published: true,
      order: 1,
    },
    {
      title: "Design & Develop",
      description: "Our teams build iteratively, sharing progress frequently and refining the solution at every stage.",
      icon: null,
      published: true,
      order: 2,
    },
    {
      title: "Review & Collaborate",
      description:
        "At the end of each sprint, we present working features, gather feedback, and make sure we’re always aligned.",
      icon: null,
      published: true,
      order: 3,
    },
    {
      title: "Test & Enhance",
      description:
        "Continuous testing and integration ensures high quality products. We don’t just fix bugs — we improve with each cycle.",
      icon: null,
      published: true,
      order: 4,
    },
    {
      title: "Deliver & Support",
      description: "Once we go live, we’re still with you — providing support, enhancements, and a roadmap for what’s next.",
      icon: null,
      published: true,
      order: 5,
    },
  ],
};

/** About page content (banner/intro/agile-process + steps) from the PUBLISHED snapshot; falls back to the original copy. */
export async function getPublishedAboutPage(): Promise<AboutPageView> {
  const snap = await getPublishedAboutSnapshot();
  if (!snap) return FALLBACK;
  const { content, steps } = snap;
  const introParagraphs = content.introDescription
    .split("\n\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
  const visibleSteps = steps.filter((s) => s.published).sort((a, b) => a.order - b.order);
  return {
    bannerTitle: content.bannerTitle,
    bannerSubtitle: content.bannerSubtitle ?? FALLBACK.bannerSubtitle,
    bannerImage: content.bannerImage,
    showBanner: content.showBanner,

    introEyebrow: content.introEyebrow ?? FALLBACK.introEyebrow,
    introTitle: content.introTitle,
    introParagraphs: introParagraphs.length > 0 ? introParagraphs : FALLBACK.introParagraphs,
    introImage: content.introImage,

    whyHeading: content.whyHeading ?? FALLBACK.whyHeading,
    whyTitle: content.whyTitle ?? FALLBACK.whyTitle,
    whyDescription: content.whyDescription ?? FALLBACK.whyDescription,
    showWhySection: content.showWhySection,

    steps: visibleSteps.length > 0 ? visibleSteps : FALLBACK.steps,
  };
}
