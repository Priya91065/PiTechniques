import { z } from "zod";

/**
 * Component registry for the CMS Page Builder. Adding a new block = add a
 * type here + a content schema + a public renderer case (CmsSections) + a
 * form (PageEditor). No per-page code.
 *
 * "Global module" sections store no copy of the data — they reference the
 * shared collections (Services, Testimonials, Team Members, Clients, FAQs)
 * and the renderer fetches live records at request time.
 */
export const SECTION_TYPES = [
  // Content blocks
  "hero",
  "richText",
  "imageText",
  "image",
  "cards",
  "statistics",
  "timeline",
  "cta",
  "contactForm",
  "customHtml",
  // Global module references
  "services",
  "testimonials",
  "team",
  "clients",
  "faq",
] as const;
export type SectionType = (typeof SECTION_TYPES)[number];
export const sectionTypeEnum = z.enum(SECTION_TYPES);

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero Banner",
  richText: "Text Block",
  imageText: "Image + Text",
  image: "Gallery",
  cards: "Cards",
  statistics: "Statistics",
  timeline: "Timeline",
  cta: "Call to Action",
  contactForm: "Contact Form",
  customHtml: "Custom HTML",
  services: "Services",
  testimonials: "Testimonials",
  team: "Team",
  clients: "Clients",
  faq: "FAQ",
};

export const SECTION_DESCRIPTIONS: Record<SectionType, string> = {
  hero: "Large heading with optional subheading and background image.",
  richText: "Heading plus one or more paragraphs of text.",
  imageText: "Image beside a block of text, image left or right.",
  image: "A single image or a multi-image gallery with caption.",
  cards: "A grid of cards with icon, title, description and link.",
  statistics: "A row of counter numbers with labels.",
  timeline: "Milestones listed by year.",
  cta: "Banner with a button linking anywhere.",
  contactForm: "The site contact form (submissions land in Messages).",
  customHtml: "Raw HTML for anything the other blocks can't do.",
  services: "Live cards from the global Services collection.",
  testimonials: "Live quotes from the global Testimonials collection.",
  team: "Live members from the global Team Members collection.",
  clients: "Live logos from the global Clients collection.",
  faq: "Live questions from the global FAQs collection.",
};

/** Picker groups: plain content blocks vs sections that reference global modules. */
export const SECTION_GROUPS: { heading: string; types: SectionType[] }[] = [
  {
    heading: "Content blocks",
    types: ["hero", "richText", "imageText", "image", "cards", "statistics", "timeline", "cta", "contactForm", "customHtml"],
  },
  {
    heading: "Global modules",
    types: ["services", "testimonials", "team", "clients", "faq"],
  },
];

// ---- Per-type content schemas -------------------------------------------------
const eyebrow = z.string().trim().max(120).optional().default("");
const heading = z.string().trim().max(200).optional().default("");

const heroContent = z.object({
  heading: z.string().trim().min(1, "Heading is required").max(200),
  subheading: z.string().trim().max(400).optional().default(""),
  backgroundImage: z.string().trim().max(500).optional().default(""),
});

const richTextContent = z.object({
  heading,
  body: z.string().trim().min(1, "Body text is required").max(20000),
});

const imageTextContent = z.object({
  heading,
  body: z.string().trim().min(1, "Body text is required").max(20000),
  image: z.string().trim().min(1, "Image URL is required").max(500),
  imageAlt: z.string().trim().max(200).optional().default(""),
  imagePosition: z.enum(["left", "right"]).optional().default("right"),
});

const imageItem = z.object({
  url: z.string().trim().min(1, "Image URL is required").max(500),
  alt: z.string().trim().max(200).optional().default(""),
});
const imageContent = z.object({
  images: z.array(imageItem).min(1, "Add at least one image"),
  caption: z.string().trim().max(400).optional().default(""),
});

const cardItem = z.object({
  icon: z.string().trim().max(500).optional().default(""),
  title: z.string().trim().min(1, "Card title is required").max(200),
  description: z.string().trim().max(2000).optional().default(""),
  linkLabel: z.string().trim().max(80).optional().default(""),
  linkHref: z.string().trim().max(500).optional().default(""),
});
const cardsContent = z.object({
  eyebrow,
  heading,
  columns: z.number().int().min(2).max(4).optional().default(3),
  items: z.array(cardItem).min(1, "Add at least one card"),
});

const statItem = z.object({
  value: z.number().int().min(0),
  suffix: z.string().trim().max(10).optional().default("+"),
  label: z.string().trim().min(1, "Label is required").max(120),
});
const statisticsContent = z.object({
  eyebrow,
  heading,
  items: z.array(statItem).min(1, "Add at least one statistic"),
});

const timelineItem = z.object({
  year: z.string().trim().min(1, "Year is required").max(20),
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(2000).optional().default(""),
});
const timelineContent = z.object({
  eyebrow,
  heading,
  items: z.array(timelineItem).min(1, "Add at least one milestone"),
});

const ctaContent = z.object({
  heading,
  text: z.string().trim().max(600).optional().default(""),
  buttonLabel: z.string().trim().min(1, "Button label is required").max(80),
  buttonHref: z.string().trim().min(1, "Button link is required").max(500),
});

const contactFormContent = z.object({
  eyebrow,
  heading,
  intro: z.string().trim().max(2000).optional().default(""),
});

const customHtmlContent = z.object({
  html: z.string().trim().min(1, "HTML is required").max(100000),
});

/** Shared shape for sections that pull from a global collection. */
const collectionRef = z.object({
  eyebrow,
  heading,
  limit: z.number().int().min(1).max(50).optional(),
});

const teamContent = collectionRef.extend({
  group: z.enum(["all", "leadership", "executive"]).optional().default("all"),
});

const faqContent = collectionRef.extend({
  category: z.string().trim().max(100).optional().default(""),
});

export const SECTION_CONTENT_SCHEMAS: Record<SectionType, z.ZodTypeAny> = {
  hero: heroContent,
  richText: richTextContent,
  imageText: imageTextContent,
  image: imageContent,
  cards: cardsContent,
  statistics: statisticsContent,
  timeline: timelineContent,
  cta: ctaContent,
  contactForm: contactFormContent,
  customHtml: customHtmlContent,
  services: collectionRef,
  testimonials: collectionRef,
  team: teamContent,
  clients: collectionRef,
  faq: faqContent,
};

export type HeroContent = z.infer<typeof heroContent>;
export type RichTextContent = z.infer<typeof richTextContent>;
export type ImageTextContent = z.infer<typeof imageTextContent>;
export type ImageContent = z.infer<typeof imageContent>;
export type CardsContent = z.infer<typeof cardsContent>;
export type StatisticsContent = z.infer<typeof statisticsContent>;
export type TimelineContent = z.infer<typeof timelineContent>;
export type CtaContent = z.infer<typeof ctaContent>;
export type ContactFormContent = z.infer<typeof contactFormContent>;
export type CustomHtmlContent = z.infer<typeof customHtmlContent>;
export type CollectionRefContent = z.infer<typeof collectionRef>;
export type TeamContent = z.infer<typeof teamContent>;
export type FaqContent = z.infer<typeof faqContent>;

/** Envelope for create/update — `content` is validated against the type's schema. */
export const sectionInput = z.object({
  type: sectionTypeEnum,
  title: z.string().trim().max(200).optional(),
  published: z.boolean().optional(),
  content: z.unknown(),
});
export type SectionInput = z.infer<typeof sectionInput>;

/** Validate a section's content for its type. Returns parsed content or an error message. */
export function parseSectionContent(type: SectionType, content: unknown): { ok: true; data: unknown } | { ok: false; error: string } {
  const result = SECTION_CONTENT_SCHEMAS[type].safeParse(content);
  if (!result.success) return { ok: false, error: result.error.issues[0]?.message ?? "Invalid section content" };
  return { ok: true, data: result.data };
}
