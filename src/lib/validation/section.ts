import { z } from "zod";

/**
 * Section/block types for the CMS Page Builder. Adding a new block = add a
 * type here + a content schema + a public renderer case. No per-page code.
 */
export const SECTION_TYPES = ["hero", "richText", "image", "cta"] as const;
export type SectionType = (typeof SECTION_TYPES)[number];
export const sectionTypeEnum = z.enum(SECTION_TYPES);

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Hero / Banner",
  richText: "Rich text",
  image: "Image / Gallery",
  cta: "Call to action",
};

// ---- Per-type content schemas -------------------------------------------------
const heroContent = z.object({
  heading: z.string().trim().min(1, "Heading is required").max(200),
  subheading: z.string().trim().max(400).optional().default(""),
  backgroundImage: z.string().trim().max(500).optional().default(""),
});

const richTextContent = z.object({
  heading: z.string().trim().max(200).optional().default(""),
  body: z.string().trim().min(1, "Body text is required").max(20000),
});

const imageItem = z.object({
  url: z.string().trim().min(1, "Image URL is required").max(500),
  alt: z.string().trim().max(200).optional().default(""),
});
const imageContent = z.object({
  images: z.array(imageItem).min(1, "Add at least one image"),
  caption: z.string().trim().max(400).optional().default(""),
});

const ctaContent = z.object({
  heading: z.string().trim().max(200).optional().default(""),
  text: z.string().trim().max(600).optional().default(""),
  buttonLabel: z.string().trim().min(1, "Button label is required").max(80),
  buttonHref: z.string().trim().min(1, "Button link is required").max(500),
});

export const SECTION_CONTENT_SCHEMAS: Record<SectionType, z.ZodTypeAny> = {
  hero: heroContent,
  richText: richTextContent,
  image: imageContent,
  cta: ctaContent,
};

export type HeroContent = z.infer<typeof heroContent>;
export type RichTextContent = z.infer<typeof richTextContent>;
export type ImageContent = z.infer<typeof imageContent>;
export type CtaContent = z.infer<typeof ctaContent>;

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
