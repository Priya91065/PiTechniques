/** Admin sidebar navigation config. Icons are mapped by key in AdminShell. */
export type IconKey =
  | "dashboard"
  | "analytics"
  | "pages"
  | "services"
  | "caseStudies"
  | "testimonials"
  | "team"
  | "faqs"
  | "clients"
  | "careers"
  | "navigation"
  | "media"
  | "messages"
  | "seo"
  | "users"
  | "settings";

export interface NavItem {
  label: string;
  href: string;
  icon: IconKey;
  /** Only Super Admin sees items flagged superAdminOnly. */
  superAdminOnly?: boolean;
}

export interface NavGroup {
  heading: string;
  items: NavItem[];
}

/**
 * WordPress-like structure: page-specific content (Homepage, Banner, About,
 * Contact, Policy pages) lives inside the Pages module; only reusable global
 * collections keep their own sidebar entries.
 */
export const NAV_GROUPS: NavGroup[] = [
  {
    heading: "Overview",
    items: [
      { label: "Dashboard", href: "/admin", icon: "dashboard" },
      { label: "Analytics", href: "/admin/analytics", icon: "analytics" },
    ],
  },
  {
    heading: "Content",
    items: [
      { label: "Pages", href: "/admin/pages", icon: "pages" },
      { label: "Services", href: "/admin/services", icon: "services" },
      { label: "Case Studies", href: "/admin/case-studies", icon: "caseStudies" },
      { label: "Testimonials", href: "/admin/testimonials", icon: "testimonials" },
      { label: "Team Members", href: "/admin/team", icon: "team" },
      { label: "FAQs", href: "/admin/faqs", icon: "faqs" },
      { label: "Clients", href: "/admin/clients", icon: "clients" },
      { label: "Careers", href: "/admin/jobs", icon: "careers" },
      { label: "Navigation", href: "/admin/navigation", icon: "navigation" },
    ],
  },
  {
    heading: "Library",
    items: [{ label: "Media", href: "/admin/media", icon: "media" }],
  },
  {
    heading: "Communication",
    items: [{ label: "Messages", href: "/admin/contact", icon: "messages" }],
  },
  {
    heading: "Settings",
    items: [
      { label: "SEO", href: "/admin/seo", icon: "seo" },
      { label: "Users", href: "/admin/users", icon: "users", superAdminOnly: true },
      { label: "Site Settings", href: "/admin/settings", icon: "settings" },
    ],
  },
];
