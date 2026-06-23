import type { AboutRow } from "@/server/services/about";
import { getPublishedHomepage } from "@/server/content/homepage";

/** Defaults keep the "How we think & build" section pixel-perfect pre-DB. */
const FALLBACK: AboutRow = {
  whoEyebrow: "who we are",
  whoTitle: "How we think & build",
  whoParagraphs: [
    "For over two decades, Pi Techniques has been helping businesses unlock the full potential of technology.",
    "Driven by innovation, grounded in simplicity, and committed to client success, is how we’ve built lasting partnerships with a loyal and diverse client base.",
    "At Pi Techniques, “always keep it simple” isn’t just a line, it’s a discipline. We cut through complexity to design technology that works intuitively, scales seamlessly, and solves real business challenges.",
  ],
  whoCtaLabel: "About us",
  whoCtaHref: "/about",
  aboutImage: "/images/newoffice1.jpg",
};

/** "How we think & build" content from the PUBLISHED homepage snapshot; falls back to the original copy. */
export async function getAbout(): Promise<AboutRow> {
  const hp = await getPublishedHomepage();
  const row = hp?.about ?? null;
  if (!row) return FALLBACK;
  // Empty paragraphs/image fall back so the section never renders blank.
  return {
    ...row,
    whoParagraphs: row.whoParagraphs.length > 0 ? row.whoParagraphs : FALLBACK.whoParagraphs,
    aboutImage: row.aboutImage ?? FALLBACK.aboutImage,
  };
}
