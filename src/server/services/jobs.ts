import { Prisma, type Job, type JobStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { slugify } from "@/lib/slug";
import type { JobInput } from "@/lib/validation/job";

function nz(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length > 0 ? t : null;
}

/** A unique slug derived from `base`, ignoring `excludeId` (for updates). */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const root = slugify(base) || "job";
  let candidate = root;
  let n = 2;
  // Loop until no other row owns the candidate slug.
  for (;;) {
    const existing = await prisma.job.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${root}-${n++}`;
  }
}

function respToDb(v: JobInput["responsibilities"]): Prisma.InputJsonValue | typeof Prisma.JsonNull {
  if (v === null || v === undefined || (Array.isArray(v) && v.length === 0)) return Prisma.JsonNull;
  return v as Prisma.InputJsonValue;
}

export interface ListParams {
  status?: JobStatus;
  department?: string;
  search?: string;
}

export function listJobs(params: ListParams = {}): Promise<Job[]> {
  const { status, department, search } = params;
  const where: Prisma.JobWhereInput = {
    ...(status ? { status } : {}),
    ...(department ? { department } : {}),
    ...(search
      ? {
          OR: [
            { jobTitle: { contains: search, mode: "insensitive" } },
            { department: { contains: search, mode: "insensitive" } },
            { experience: { contains: search, mode: "insensitive" } },
          ],
        }
      : {}),
  };
  return prisma.job.findMany({ where, orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] });
}

export function getJobById(id: string): Promise<Job | null> {
  return prisma.job.findUnique({ where: { id } });
}

export function getJobBySlugRaw(slug: string): Promise<Job | null> {
  return prisma.job.findUnique({ where: { slug } });
}

/** Distinct, non-null departments — for the admin filter dropdown. */
export async function listDepartments(): Promise<string[]> {
  const rows = await prisma.job.findMany({
    where: { department: { not: null } },
    select: { department: true },
    distinct: ["department"],
    orderBy: { department: "asc" },
  });
  return rows.map((r) => r.department).filter((d): d is string => Boolean(d));
}

export async function createJob(data: JobInput): Promise<Job> {
  const slug = await uniqueSlug(data.slug && data.slug.trim().length > 0 ? data.slug : data.jobTitle);
  const max = await prisma.job.aggregate({ _max: { displayOrder: true } });
  return prisma.job.create({
    data: {
      jobTitle: data.jobTitle,
      slug,
      jobCode: nz(data.jobCode),
      department: nz(data.department),
      experience: data.experience,
      location: nz(data.location),
      employmentType: nz(data.employmentType),
      shortDescription: nz(data.shortDescription),
      qualifications: data.qualifications,
      responsibilities: respToDb(data.responsibilities),
      skills: data.skills,
      seoTitle: nz(data.seoTitle),
      seoDescription: nz(data.seoDescription),
      seoKeywords: nz(data.seoKeywords),
      canonicalUrl: nz(data.canonicalUrl),
      twitterImage: nz(data.twitterImage),
      robotsMeta: nz(data.robotsMeta),
      status: data.status,
      displayOrder: data.displayOrder ?? (max._max.displayOrder ?? -1) + 1,
    },
  });
}

export async function updateJob(id: string, data: Partial<JobInput>): Promise<Job> {
  const slug =
    data.slug !== undefined && data.slug.trim().length > 0 ? await uniqueSlug(data.slug, id) : undefined;
  return prisma.job.update({
    where: { id },
    data: {
      ...(data.jobTitle !== undefined ? { jobTitle: data.jobTitle } : {}),
      ...(slug !== undefined ? { slug } : {}),
      ...(data.jobCode !== undefined ? { jobCode: nz(data.jobCode) } : {}),
      ...(data.department !== undefined ? { department: nz(data.department) } : {}),
      ...(data.experience !== undefined ? { experience: data.experience } : {}),
      ...(data.location !== undefined ? { location: nz(data.location) } : {}),
      ...(data.employmentType !== undefined ? { employmentType: nz(data.employmentType) } : {}),
      ...(data.shortDescription !== undefined ? { shortDescription: nz(data.shortDescription) } : {}),
      ...(data.qualifications !== undefined ? { qualifications: data.qualifications } : {}),
      ...(data.responsibilities !== undefined ? { responsibilities: respToDb(data.responsibilities) } : {}),
      ...(data.skills !== undefined ? { skills: data.skills } : {}),
      ...(data.seoTitle !== undefined ? { seoTitle: nz(data.seoTitle) } : {}),
      ...(data.seoDescription !== undefined ? { seoDescription: nz(data.seoDescription) } : {}),
      ...(data.seoKeywords !== undefined ? { seoKeywords: nz(data.seoKeywords) } : {}),
      ...(data.canonicalUrl !== undefined ? { canonicalUrl: nz(data.canonicalUrl) } : {}),
      ...(data.twitterImage !== undefined ? { twitterImage: nz(data.twitterImage) } : {}),
      ...(data.robotsMeta !== undefined ? { robotsMeta: nz(data.robotsMeta) } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.displayOrder !== undefined ? { displayOrder: data.displayOrder } : {}),
    },
  });
}

export function setJobStatus(id: string, status: JobStatus): Promise<Job> {
  return prisma.job.update({ where: { id }, data: { status } });
}

export function deleteJob(id: string): Promise<Job> {
  return prisma.job.delete({ where: { id } });
}

export async function reorderJobs(ids: string[]): Promise<void> {
  await prisma.$transaction(ids.map((id, index) => prisma.job.update({ where: { id }, data: { displayOrder: index } })));
}
