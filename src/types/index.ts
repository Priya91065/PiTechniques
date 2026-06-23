/** Shared content types used across sections. */

export interface NavItem {
  label: string;
  href: string;
  /** pageClass(es) considered "active" for this item. */
  activeFor: string[];
}

export interface ServiceCard {
  /** Anchor on the services page this card links to. */
  anchor: string;
  icon: string;
  title: string;
  tags: string[];
}

export interface ServiceDetail {
  id: string;
  icon: string;
  title: string;
  paragraphs: string[];
  tags: string[];
}

export interface ServiceLottieLink {
  anchor: string;
  icon: string;
  title: string;
}

export interface CaseStudy {
  slug: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  /** Visual treatment of the card panel. */
  theme: "black" | "white";
  /** Source DOM ordering values for the alternating layout. */
  order: { base: number; lg: number };
}

export interface HomeCaseCard {
  slug: string;
  title: string;
  client: string;
  image: string;
}

export interface Testimonial {
  quote: string;
  company: string;
  attribution: string;
  role: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin?: string;
  /** Wider tile (2 cols) used for grouped photos. */
  span?: "third" | "half" | "full";
}

export interface Industry {
  icon: string;
  title: string;
}

export interface ProcessStep {
  title: string;
  description: string;
}

export interface JobOpening {
  slug: string;
  title: string;
  experience: string;
}

export type ResponsibilityGroups = Record<string, string[]>;

export interface JobDetail {
  slug: string;
  title: string;
  experience: string;
  jobcode: string;
  qualifications: string[];
  skills: string[];
  /** Either a flat list or grouped by heading. */
  responsibilities: string[] | ResponsibilityGroups;
}

export interface PolicyBlock {
  tag: "h1" | "h2" | "h3" | "h4" | "p" | "li";
  text: string;
}

export interface PolicyContent {
  title: string;
  blocks: PolicyBlock[];
}

export interface FooterLink {
  label: string;
  href: string;
  activeFor?: string[];
}

export interface CaseStudySolution {
  title: string;
  subTitle: string;
  list: string[];
}

export interface CaseStudyImpactItem {
  img: string;
  title: string;
  subTitle: string;
}

export interface CaseStudyKeyFeature {
  img: string;
  feature: string;
}

export interface CaseStudyNavLink {
  label: string;
  link: string;
}

export interface CaseStudyDetail {
  slug: string;
  name: string;
  logo: string;
  title: string;
  shortDesc: string;
  tags: string[];
  img: string;
  projectDetails: {
    industry: string;
    headquarters: string;
    website?: string;
  };
  challenges: {
    shortInfo: string;
    lists: string[];
    background: string;
  };
  piSolution: {
    details: string;
    solutions?: CaseStudySolution[];
  };
  keyFeature: CaseStudyKeyFeature[];
  longTermImpact: {
    title: string;
    impact: CaseStudyImpactItem[];
  };
  previous: CaseStudyNavLink;
  next: CaseStudyNavLink;
}
