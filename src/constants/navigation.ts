import type { FooterLink, NavItem } from "@/types";

export const navItems: NavItem[] = [
  { label: "About us", href: "/about", activeFor: ["aboutpage"] },
  { label: "Services", href: "/services", activeFor: ["service-page"] },
  {
    label: "Case studies",
    href: "/case-studies",
    activeFor: ["case-studies-page", "case-studies-details"],
  },
  {
    label: "Careers",
    href: "/careers",
    activeFor: ["career-page", "career-details-page"],
  },
];

export const footerCompanyLinks: FooterLink[] = [
  { label: "About Us", href: "/about", activeFor: ["aboutpage"] },
  { label: "Services", href: "/services", activeFor: ["service-page"] },
  {
    label: "Case Studies",
    href: "/case-studies",
    activeFor: ["case-studies-page", "case-studies-details"],
  },
  {
    label: "Careers",
    href: "/careers",
    activeFor: ["career-page", "career-details-page"],
  },
];

export const footerPolicyLinks: FooterLink[] = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "CSR Statement", href: "/csr-policy" },
  { label: "Data Protection & Cookie Statement", href: "/data-protection" },
];

export const contactInfo = {
  email: "enquiry@pitechniques.com",
  phone: "+91 22 6292 3333",
  phoneHref: "tel:+912262923333",
  addressLine1: "61/63C Mittal Tower,",
  addressLine2: "Nariman Point, Mumbai - 400021",
  linkedin: "https://in.linkedin.com/company/pi-techniques",
} as const;
