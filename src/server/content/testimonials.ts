import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

/** Shape the public homepage needs. */
export interface PublicTestimonial {
  id: string;
  quote: string;
  company: string;
  authorName: string;
  designation: string;
}

/** Hardcoded fallback — keeps the homepage pixel-perfect if the DB is empty/down. */
const FALLBACK: PublicTestimonial[] = [
  {
    id: "fallback-1",
    company: "Metro Shoes",
    authorName: "Aashish Mashruwala",
    designation: "Business Head of Metro Shoes",
    quote:
      "Integration was always a challenge for us until Pi Techniques stepped in. They simplified our infrastructure, ensured smooth connectivity across systems, and gave us the reliability and scalability we needed. Their solutions have saved us both time and costs.",
  },
  {
    id: "fallback-2",
    company: "Rabia Gupta Designs",
    authorName: "Rabia Gupta",
    designation: "Founder",
    quote:
      "As strategic branding consultants, the design and execution of websites for our clients are critical. Our design solutions are always a marriage between a signature brand language and a relevant UI UX. And in this mix - Pi Techniques always steps in with a near perfect understanding of the detailed execution we require, along with great support and domain knowledge.",
  },
  {
    id: "fallback-3",
    company: "The Willingdon Sports Club",
    authorName: "Gururaj Joshi",
    designation: "Dy Manager EDP",
    quote:
      "Our members expect premium experiences both offline and online. Pi Techniques designed and developed a web platform that makes everything — from logins to payments — effortless. Their team balanced design, security, and ease of use seamlessly.",
  },
  {
    id: "fallback-4",
    company: "The Nutcracker",
    authorName: "Annie Bafna",
    designation: "Founder",
    quote:
      "We wanted our website to reflect the warmth and uniqueness of our brand. Pi Techniques delivered exactly that. The site is elegant, easy to navigate, and truly captures who we are. Their team was creative, patient, and extremely supportive.",
  },
  {
    id: "fallback-5",
    company: "Chanakya",
    authorName: "Anisha Shetty",
    designation: "Chief of Atelier",
    quote:
      "Pi Techniques has been a true partner in our digital transformation journey. Their ability to understand our complex requirements and translate them into simple, scalable solutions has been invaluable. They don’t just deliver technology — they help us think ahead.",
  },
  {
    id: "fallback-6",
    company: "St. Jude India ChildCare Centres",
    authorName: "Anil Nair",
    designation: "CEO",
    quote:
      "Our website plays a crucial role in telling the stories of the cancer warriors and families we care for. With Pi Techniques leading our website redesign, we got not just a sleek design transformation but a meaningful enhancement in how we showcase our cause and its impact. They blended creativity with clarity, improving the user experience while staying true to our core values. We’re grateful for their support and expertise.",
  },
];

/**
 * Cached, published testimonials for the homepage. Tagged "testimonials" so an
 * admin save (revalidateTag) refreshes it instantly; ISR window is a safety net.
 * Falls back to the hardcoded set on empty DB or error → site stays pixel-perfect.
 */
export const getTestimonials = unstable_cache(
  async (): Promise<PublicTestimonial[]> => {
    try {
      const rows = await prisma.testimonial.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        select: { id: true, quote: true, company: true, authorName: true, designation: true },
      });
      return rows.length > 0 ? rows : FALLBACK;
    } catch {
      return FALLBACK;
    }
  },
  ["public-testimonials"],
  { tags: ["testimonials"], revalidate: 3600 },
);
