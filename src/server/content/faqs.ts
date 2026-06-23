import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

export interface PublicFaq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
}

const cached = unstable_cache(
  async (category?: string): Promise<PublicFaq[]> => {
    try {
      return await prisma.faq.findMany({
        where: { published: true, ...(category ? { category } : {}) },
        orderBy: { order: "asc" },
        select: { id: true, question: true, answer: true, category: true },
      });
    } catch {
      return [];
    }
  },
  ["public-faqs"],
  { tags: ["faqs"], revalidate: 3600 },
);

/** Published FAQs, optionally filtered by category. Empty when none exist. */
export async function getFaqs(category?: string): Promise<PublicFaq[]> {
  return cached(category);
}
