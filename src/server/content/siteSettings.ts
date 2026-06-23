import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

export interface PublicSiteSettings {
  companyEmail: string;
  companyPhone: string;
  addressLines: string[];
  linkedinUrl: string | null;
  footerNote: string | null;
}

/** Keeps the footer pixel-perfect when the DB row is missing. */
const FALLBACK: PublicSiteSettings = {
  companyEmail: "enquiry@pitechniques.com",
  companyPhone: "+91 22 6292 3333",
  addressLines: ["61/63C Mittal Tower,", "Nariman Point, Mumbai - 400021"],
  linkedinUrl: "https://in.linkedin.com/company/pi-techniques",
  footerNote: "Pi Techniques Pvt. Ltd. All rights reserved.",
};

const cached = unstable_cache(
  async (): Promise<PublicSiteSettings | null> => {
    try {
      const row = await prisma.siteSetting.findUnique({
        where: { id: 1 },
        select: { companyEmail: true, companyPhone: true, addressLines: true, linkedinUrl: true, footerNote: true },
      });
      return row;
    } catch {
      return null;
    }
  },
  ["public-site-settings"],
  { tags: ["site-settings"], revalidate: 3600 },
);

/** Site-wide settings for the footer; falls back to the original copy when unset. */
export async function getSiteSettings(): Promise<PublicSiteSettings> {
  return (await cached()) ?? FALLBACK;
}
