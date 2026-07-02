/**
 * System pages — the site's fixed pages, surfaced in the Pages module
 * (WordPress-style) instead of having their own sidebar menus.
 *
 * They are seeded into the `pages` table so the Pages list shows the whole
 * site map, but each one keeps its pixel-perfect faithful route and is edited
 * through its dedicated manager (embedded in the page editor), not through the
 * generic section builder. Client-safe: plain data only.
 */

export type SystemPageKind =
  | "home" // Banner/hero + homepage sections
  | "about" // About page manager
  | "contact" // Contact page manager
  | "policy" // Rich-HTML policy editor
  | "module"; // Rendered from a global collection (link out to its module)

export interface SystemPageDef {
  slug: string;
  title: string;
  kind: SystemPageKind;
  /** Public URL of the page. */
  viewPath: string;
  /** For kind "module": the admin module that manages this page's content. */
  moduleHref?: string;
  moduleLabel?: string;
}

export const SYSTEM_PAGES: SystemPageDef[] = [
  { slug: "home", title: "Home", kind: "home", viewPath: "/" },
  { slug: "about", title: "About", kind: "about", viewPath: "/about" },
  { slug: "services", title: "Services", kind: "module", viewPath: "/services", moduleHref: "/admin/services", moduleLabel: "Services" },
  { slug: "case-studies", title: "Case Studies", kind: "module", viewPath: "/case-studies", moduleHref: "/admin/case-studies", moduleLabel: "Case Studies" },
  { slug: "careers", title: "Careers", kind: "module", viewPath: "/careers", moduleHref: "/admin/jobs", moduleLabel: "Careers" },
  { slug: "contact-us", title: "Contact", kind: "contact", viewPath: "/contact-us" },
  { slug: "privacy-policy", title: "Privacy Policy", kind: "policy", viewPath: "/privacy-policy" },
  { slug: "terms-of-use", title: "Terms of Use", kind: "policy", viewPath: "/terms-of-use" },
  { slug: "csr-policy", title: "CSR Policy", kind: "policy", viewPath: "/csr-policy" },
  { slug: "data-protection", title: "Data Protection", kind: "policy", viewPath: "/data-protection" },
];

const BY_SLUG = new Map(SYSTEM_PAGES.map((p) => [p.slug, p]));

export function getSystemPage(slug: string): SystemPageDef | undefined {
  return BY_SLUG.get(slug);
}

export function isSystemSlug(slug: string): boolean {
  return BY_SLUG.has(slug);
}
