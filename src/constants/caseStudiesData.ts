import type { CaseStudy } from "@/types";

/**
 * Four case-study panels laid out in a 2x2 grid that alternates black/white
 * treatments. DOM order vs. visual order differs on large screens, matching
 * the source's bootstrap `order-*` utilities.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "chanakya",
    category: "chanakya | Fashion & LIFESTYLE",
    title: "Threading technology into fashion",
    description:
      "Transforming a legacy fashion export house with a tailor-made ERP ecosystem across R&D, sampling, and production.",
    tags: ["Enterprise .NET + SQL", "Data & Messaging", "ETL & Data Pipelines", "Database Integration & API", "Xamarin"],
    image: "/images/case-studies/case-studies.png",
    theme: "black",
    order: { base: 1, lg: 1 },
  },
  {
    slug: "ibs",
    category: "IBS intelligence | Fintech",
    title: "Transforming fintech publishing",
    description:
      "Building a secure, scalable digital platform that centralizes premium fintech research, protects IP, and boosts subscription revenue.",
    tags: ["HTML5 & CSS3", "WordPress", "Woo Commerce", "SEO & Performance Optimization"],
    image: "/images/case-studies/case-studies1.png",
    theme: "white",
    order: { base: 2, lg: 2 },
  },
  {
    slug: "citiusTech",
    category: "citiustech | healthcare Technology",
    title: "The strong and steady ERP evolution",
    description:
      "Transforming a simple timesheet tracker into a decade-strong ERP that streamlines people, processes, projects, and payments for IT services.",
    tags: ["Enterprise .NET + SQL", "ETL & Data Pipelines", "Database Integration & API", "MVC", "HTML5 & CSS3"],
    image: "/images/case-studies/case-studies2.png",
    theme: "white",
    order: { base: 4, lg: 3 },
  },
  {
    slug: "tajGroupofHotels",
    category: "taj | hospitality",
    title: "A premium, car rental management system",
    description:
      "Powering 70+ Taj Hotels with a unified, luxury-grade car rental management system that streamlines bookings, fleet logistics, and guest service.",
    tags: ["Enterprise .NET + SQL", "Database Integration & API", "MVC", "HTML5 & CSS3"],
    image: "/images/case-studies/laptop-4.png",
    theme: "black",
    order: { base: 3, lg: 4 },
  },
];
