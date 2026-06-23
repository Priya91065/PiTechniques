import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/db";

export interface PublicClient {
  id: string;
  name: string;
  logo: string;
  width: number | null;
  height: number | null;
}

const L = "/images/clients-logo";

/** Fallback marquee logos — keeps the homepage/services marquee pixel-perfect. */
const FALLBACK: PublicClient[] = [
  { id: "f1", name: "Chanakya", logo: `${L}/chanakya.svg`, width: 320, height: 80 },
  { id: "f2", name: "V-Group", logo: `${L}/v-group.svg`, width: 90, height: 67 },
  { id: "f3", name: "World Resources Institute", logo: `${L}/wri.svg`, width: null, height: 88 },
  { id: "f4", name: "SeaTec", logo: `${L}/sea-tec.svg`, width: 152, height: 56 },
  { id: "f5", name: "Taj", logo: `${L}/taj.svg`, width: 118, height: 104 },
  { id: "f6", name: "CitiusTech", logo: `${L}/citius.png`, width: null, height: null },
  { id: "f7", name: "Metro", logo: `${L}/metro.png`, width: null, height: null },
  { id: "f8", name: "BDL", logo: `${L}/bdl-logo.svg`, width: 132, height: 117 },
  { id: "f9", name: "Oceanic", logo: `${L}/oceanic.svg`, width: 225, height: 38 },
  { id: "f10", name: "Cotton World", logo: `${L}/cotton-world.svg`, width: null, height: 61 },
  { id: "f11", name: "Willingdon", logo: `${L}/willington.svg`, width: 66, height: 100 },
  { id: "f12", name: "The Nutcracker", logo: `${L}/nutcracker.svg`, width: null, height: 87 },
  { id: "f13", name: "Crownvet", logo: `${L}/crownvet.png`, width: null, height: null },
  { id: "f14", name: "Westwind", logo: `${L}/westwind.png`, width: null, height: null },
  { id: "f15", name: "Honey Bees", logo: `${L}/honey-bees.svg`, width: 128, height: 128 },
  { id: "f16", name: "Sohfit", logo: `${L}/sohfit.svg`, width: 222, height: 60 },
  { id: "f17", name: "Little Pplams School", logo: `${L}/littlepplamsschool.svg`, width: null, height: null },
  { id: "f18", name: "ADND", logo: `${L}/adnd-logo.svg`, width: null, height: null },
  { id: "f19", name: "Kizazi", logo: `${L}/kizazi.svg`, width: null, height: null },
  { id: "f20", name: "Chorus", logo: `${L}/chorus-logo-black.svg`, width: null, height: null },
  { id: "f21", name: "Jade", logo: `${L}/JadeLogoNew.svg`, width: null, height: null },
  { id: "f22", name: "Rabia Gupta Designs", logo: `${L}/rgd-logo.svg`, width: null, height: null },
  { id: "f23", name: "Zaka", logo: `${L}/zaka-logo.svg`, width: null, height: null },
  { id: "f24", name: "Amaya", logo: `${L}/amaya.svg`, width: null, height: null },
];

export const getClients = unstable_cache(
  async (): Promise<PublicClient[]> => {
    try {
      const rows = await prisma.client.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
        select: { id: true, name: true, logo: true, width: true, height: true },
      });
      return rows.length > 0 ? rows : FALLBACK;
    } catch {
      return FALLBACK;
    }
  },
  ["public-clients"],
  { tags: ["clients"], revalidate: 3600 },
);
