import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

export interface PublicNavItem {
  label: string;
  href: string;
}

const HEADER_FALLBACK: PublicNavItem[] = [
  { label: "About us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Case studies", href: "/case-studies" },
  { label: "Careers", href: "/careers" },
];

const cached = unstable_cache(
  async (location: "HEADER" | "FOOTER"): Promise<PublicNavItem[]> => {
    try {
      const rows = await prisma.navItem.findMany({
        where: { location, published: true },
        orderBy: { order: "asc" },
        select: { label: true, href: true },
      });
      return rows;
    } catch {
      return [];
    }
  },
  ["public-nav"],
  { tags: ["navigation"], revalidate: 3600 },
);

/** Published nav items for a location, falling back to the original header set. */
export async function getNavItems(location: "HEADER" | "FOOTER"): Promise<PublicNavItem[]> {
  const rows = await cached(location);
  if (rows.length > 0) return rows;
  return location === "HEADER" ? HEADER_FALLBACK : [];
}
