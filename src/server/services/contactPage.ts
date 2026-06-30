import { prisma } from "@/lib/db";
import type { ContactContentInput } from "@/lib/validation/contactPage";

function nz(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length > 0 ? t : null;
}

export interface ContactContentRow {
  locationHeading: string | null;
  locationTitle: string | null;
  officeName: string | null;
  officeCity: string | null;
  officeAddress: string | null;
  directionsUrl: string | null;
  mapEmbedUrl: string | null;
  phone: string | null;
  email: string | null;
  workingHours: string | null;
  formHeading: string | null;
  formTitle: string | null;
  formIntro: string | null;
  formDescription: string | null;
  successMessage: string | null;
  errorMessage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  twitterImage: string | null;
  robotsMeta: string | null;
}

const SELECT = {
  locationHeading: true,
  locationTitle: true,
  officeName: true,
  officeCity: true,
  officeAddress: true,
  directionsUrl: true,
  mapEmbedUrl: true,
  phone: true,
  email: true,
  workingHours: true,
  formHeading: true,
  formTitle: true,
  formIntro: true,
  formDescription: true,
  successMessage: true,
  errorMessage: true,
  seoTitle: true,
  seoDescription: true,
  seoKeywords: true,
  canonicalUrl: true,
  ogImage: true,
  twitterImage: true,
  robotsMeta: true,
} as const;

export function getContactContentRow(): Promise<ContactContentRow | null> {
  return prisma.contactContent.findUnique({ where: { id: "contact" }, select: SELECT });
}

export function upsertContactContent(data: ContactContentInput): Promise<ContactContentRow> {
  const fields = {
    locationHeading: nz(data.locationHeading),
    locationTitle: nz(data.locationTitle),
    officeName: nz(data.officeName),
    officeCity: nz(data.officeCity),
    officeAddress: nz(data.officeAddress),
    directionsUrl: nz(data.directionsUrl),
    mapEmbedUrl: nz(data.mapEmbedUrl),
    phone: nz(data.phone),
    email: nz(data.email),
    workingHours: nz(data.workingHours),
    formHeading: nz(data.formHeading),
    formTitle: nz(data.formTitle),
    formIntro: nz(data.formIntro),
    formDescription: nz(data.formDescription),
    successMessage: nz(data.successMessage),
    errorMessage: nz(data.errorMessage),
    seoTitle: nz(data.seoTitle),
    seoDescription: nz(data.seoDescription),
    seoKeywords: nz(data.seoKeywords),
    canonicalUrl: nz(data.canonicalUrl),
    ogImage: nz(data.ogImage),
    twitterImage: nz(data.twitterImage),
    robotsMeta: nz(data.robotsMeta),
  };
  return prisma.contactContent.upsert({
    where: { id: "contact" },
    update: fields,
    create: { id: "contact", ...fields },
    select: SELECT,
  });
}
