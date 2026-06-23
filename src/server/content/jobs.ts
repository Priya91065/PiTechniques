import { unstable_cache } from "next/cache";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { faithfulJobs } from "@/constants/faithfulJobs";

export type Responsibilities = string[] | Record<string, string[]>;

export interface PublicJobListItem {
  slug: string;
  title: string;
  experience: string;
  shortDescription: string | null;
}

export interface PublicJob {
  slug: string;
  title: string;
  experience: string;
  qualifications: string[];
  skills?: string[];
  responsibilities?: Responsibilities;
  department: string | null;
  location: string | null;
  employmentType: string | null;
  shortDescription: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
}

/** Convert the stored JSON (flat string[] or grouped [{heading,items}]) to the render shape. */
function parseResponsibilities(value: Prisma.JsonValue | null | undefined): Responsibilities | undefined {
  if (!Array.isArray(value) || value.length === 0) return undefined;
  if (typeof value[0] === "string") return value.filter((v): v is string => typeof v === "string");
  const map: Record<string, string[]> = {};
  for (const group of value) {
    if (group && typeof group === "object" && !Array.isArray(group)) {
      const g = group as { heading?: unknown; items?: unknown };
      if (typeof g.heading === "string" && Array.isArray(g.items)) {
        map[g.heading] = g.items.filter((i): i is string => typeof i === "string");
      }
    }
  }
  return Object.keys(map).length > 0 ? map : undefined;
}

// ---- Fallbacks (original hardcoded jobs) keep the page working pre-seed ----
const FALLBACK_LIST: PublicJobListItem[] = faithfulJobs.map((j) => ({
  slug: j.slug,
  title: j.title,
  experience: j.experience,
  shortDescription: null,
}));

function fallbackJob(slug: string): PublicJob | null {
  const j = faithfulJobs.find((x) => x.slug === slug);
  if (!j) return null;
  return {
    slug: j.slug,
    title: j.title,
    experience: j.experience,
    qualifications: j.qualifications,
    skills: j.skills,
    responsibilities: j.responsibilities,
    department: null,
    location: null,
    employmentType: null,
    shortDescription: null,
    seoTitle: null,
    seoDescription: null,
  };
}

const cachedActive = unstable_cache(
  async (): Promise<PublicJobListItem[] | null> => {
    try {
      const rows = await prisma.job.findMany({
        where: { status: "ACTIVE" },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
        select: { slug: true, jobTitle: true, experience: true, shortDescription: true },
      });
      if (rows.length === 0) return null;
      return rows.map((r) => ({ slug: r.slug, title: r.jobTitle, experience: r.experience, shortDescription: r.shortDescription }));
    } catch {
      return null;
    }
  },
  ["public-jobs-list"],
  { tags: ["jobs"], revalidate: 3600 },
);

const cachedBySlug = unstable_cache(
  async (slug: string): Promise<PublicJob | null> => {
    try {
      const r = await prisma.job.findFirst({ where: { slug, status: "ACTIVE" } });
      if (!r) return null;
      return {
        slug: r.slug,
        title: r.jobTitle,
        experience: r.experience,
        qualifications: r.qualifications,
        skills: r.skills.length > 0 ? r.skills : undefined,
        responsibilities: parseResponsibilities(r.responsibilities),
        department: r.department,
        location: r.location,
        employmentType: r.employmentType,
        shortDescription: r.shortDescription,
        seoTitle: r.seoTitle,
        seoDescription: r.seoDescription,
      };
    } catch {
      return null;
    }
  },
  ["public-job-by-slug"],
  { tags: ["jobs"], revalidate: 3600 },
);

/** Active job openings for the careers list; falls back to the original set. */
export async function getActiveJobs(): Promise<PublicJobListItem[]> {
  return (await cachedActive()) ?? FALLBACK_LIST;
}

/** A single active job by slug for the details page; falls back to the original set. */
export async function getJobBySlug(slug: string): Promise<PublicJob | null> {
  const db = await cachedBySlug(slug);
  if (db) return db;
  return fallbackJob(slug);
}
