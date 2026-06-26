import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getContactContentRow, upsertContactContent, type ContactContentRow } from "@/server/services/contactPage";
import type { ContactContentInput } from "@/lib/validation/contactPage";
import { listSocialLinks } from "@/server/services/socialLinks";
import { listOfficeLocations } from "@/server/services/officeLocations";

export interface SnapshotSocialLink {
  platform: string;
  url: string;
  icon: string | null;
  published: boolean;
  order: number;
}

export interface SnapshotOfficeLocation {
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  mapUrl: string | null;
  published: boolean;
  order: number;
}

export interface ContactData {
  content: ContactContentRow;
  socialLinks: SnapshotSocialLink[];
  officeLocations: SnapshotOfficeLocation[];
}

const EMPTY_CONTENT: ContactContentRow = {
  locationHeading: null,
  locationTitle: null,
  officeName: null,
  officeCity: null,
  officeAddress: null,
  directionsUrl: null,
  mapEmbedUrl: null,
  phone: null,
  email: null,
  workingHours: null,
  formHeading: null,
  formTitle: null,
  formIntro: null,
  formDescription: null,
  successMessage: null,
  errorMessage: null,
  seoTitle: null,
  seoDescription: null,
  seoKeywords: null,
  canonicalUrl: null,
  ogImage: null,
  twitterImage: null,
  robotsMeta: null,
};

/** Snapshot the current live (draft) state of the contact-page-owned tables. */
export async function serializeLive(): Promise<ContactData> {
  const [content, socialLinks, officeLocations] = await Promise.all([
    getContactContentRow(),
    listSocialLinks(),
    listOfficeLocations(),
  ]);
  return {
    content: content ?? EMPTY_CONTENT,
    socialLinks: socialLinks.map((s) => ({ platform: s.platform, url: s.url, icon: s.icon, published: s.published, order: s.order })),
    officeLocations: officeLocations.map((o) => ({
      name: o.name,
      address: o.address,
      phone: o.phone,
      email: o.email,
      mapUrl: o.mapUrl,
      published: o.published,
      order: o.order,
    })),
  };
}

export async function getPublishedData(): Promise<ContactData | null> {
  const row = await prisma.contactSnapshot.findUnique({ where: { id: "published" } });
  return row ? (row.data as unknown as ContactData) : null;
}

/** Copy the current draft (live tables) into the published snapshot. */
export async function publishContactPage(): Promise<void> {
  const data = await serializeLive();
  await prisma.contactSnapshot.upsert({
    where: { id: "published" },
    update: { data: data as unknown as Prisma.InputJsonValue },
    create: { id: "published", data: data as unknown as Prisma.InputJsonValue },
  });
}

function nullsToUndefined(row: ContactContentRow): ContactContentInput {
  const out: Record<string, string | undefined> = {};
  for (const key of Object.keys(row) as (keyof ContactContentRow)[]) {
    const v = row[key];
    out[key] = v === null ? undefined : v;
  }
  return out as unknown as ContactContentInput;
}

/** Revert the draft (live tables) back to the last published snapshot. */
export async function discardDraft(): Promise<boolean> {
  const published = await getPublishedData();
  if (!published) return false;
  await upsertContactContent(nullsToUndefined(published.content));
  await prisma.$transaction([
    prisma.socialLink.deleteMany({}),
    prisma.socialLink.createMany({
      data: published.socialLinks.map((s) => ({ platform: s.platform, url: s.url, icon: s.icon, published: s.published, order: s.order })),
    }),
    prisma.officeLocation.deleteMany({}),
    prisma.officeLocation.createMany({
      data: published.officeLocations.map((o) => ({
        name: o.name,
        address: o.address,
        phone: o.phone,
        email: o.email,
        mapUrl: o.mapUrl,
        published: o.published,
        order: o.order,
      })),
    }),
  ]);
  return true;
}

/** Deterministic JSON with sorted keys — Postgres jsonb doesn't preserve key order. */
function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") {
    const obj = value as Record<string, unknown>;
    return `{${Object.keys(obj)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
      .join(",")}}`;
  }
  return JSON.stringify(value ?? null);
}

/** True when the draft differs from the published snapshot. */
export async function hasUnpublishedChanges(): Promise<boolean> {
  const [live, published] = await Promise.all([serializeLive(), getPublishedData()]);
  if (!published) return true;
  return stableStringify(live) !== stableStringify(published);
}
