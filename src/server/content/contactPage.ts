import { unstable_cache } from "next/cache";
import { getPublishedData, type ContactData } from "@/server/services/contactStaging";

export interface PublicContactPage {
  locationHeading: string;
  locationTitle: string;
  officeName: string;
  officeCity: string;
  officeAddress: string[];
  directionsUrl: string;
  mapEmbedUrl: string;
  formHeading: string;
  formTitle: string;
  formIntro: string;
  officeLocations: {
    name: string;
    addressLines: string[];
    mapUrl: string | null;
  }[];
}

/** Defaults keep the Contact page pixel-perfect before the DB snapshot exists — copied verbatim from the original hardcoded markup. */
const FALLBACK: PublicContactPage = {
  locationHeading: "LOCATION",
  locationTitle: "Our headquarters",
  officeName: "Nariman Point",
  officeCity: "Mumbai",
  officeAddress: ["61/63C Mittal Tower,", "Nariman Point,", "Mumbai - 400021"],
  directionsUrl:
    "https://www.google.com/maps/place/Pi+Techniques+Pvt.+Ltd./@18.9251667,72.824424,17z/data=!3m1!4b1!4m6!3m5!1s0x3be7d1e97e031c0b:0x8a44b9ad6132d028!8m2!3d18.9251667!4d72.824424!16s%2Fg%2F1th5y83b?entry=ttu",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3774.140669523596!2d72.824424!3d18.9251667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7d1e97e031c0b%3A0x8a44b9ad6132d028!2sPi%20Techniques%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1762169535718!5m2!1sen!2sin",
  formHeading: "Contact US",
  formTitle: "Get in touch",
  formIntro: "We're here to help and answer any questions you might have. We look forward to hearing from you.",
  officeLocations: [],
};

function splitAddress(address: string | null | undefined): string[] | null {
  if (!address) return null;
  const lines = address
    .split(/\r?\n|,\s*/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  return lines.length > 0 ? lines : null;
}

const cached = unstable_cache(
  async (): Promise<ContactData | null> => {
    try {
      return await getPublishedData();
    } catch {
      return null;
    }
  },
  ["contact-page-published"],
  { tags: ["contact-page"], revalidate: 3600 },
);

/** The published Contact page content (location + form sections, map, social links, office locations), or hardcoded defaults pre-publish. */
export async function getPublishedContactPage(): Promise<PublicContactPage> {
  const data = await cached();
  if (!data) return FALLBACK;
  const c = data.content;

  const officeLocations = data.officeLocations
    .filter((o) => o.published)
    .sort((a, b) => a.order - b.order)
    .map((o) => ({
      name: o.name,
      addressLines: splitAddress(o.address) ?? [o.address],
      mapUrl: o.mapUrl,
    }));

  return {
    locationHeading: c.locationHeading ?? FALLBACK.locationHeading,
    locationTitle: c.locationTitle ?? FALLBACK.locationTitle,
    officeName: c.officeName ?? FALLBACK.officeName,
    officeCity: c.officeCity ?? FALLBACK.officeCity,
    officeAddress: splitAddress(c.officeAddress) ?? FALLBACK.officeAddress,
    directionsUrl: c.directionsUrl ?? FALLBACK.directionsUrl,
    mapEmbedUrl: c.mapEmbedUrl ?? FALLBACK.mapEmbedUrl,
    formHeading: c.formHeading ?? FALLBACK.formHeading,
    formTitle: c.formTitle ?? FALLBACK.formTitle,
    formIntro: c.formIntro ?? FALLBACK.formIntro,
    officeLocations,
  };
}
