import { Prisma, type Page, type PageStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { PageInput } from "@/lib/validation/page";
import { slugify } from "@/lib/slug";
import { SYSTEM_PAGES } from "@/lib/systemPages";

const SORTABLE = ["title", "slug", "status", "createdAt", "updatedAt"] as const;
export type PageSortField = (typeof SORTABLE)[number];

export function isSortable(value: string): value is PageSortField {
  return (SORTABLE as readonly string[]).includes(value);
}

export interface ListPagesParams {
  search?: string;
  skip: number;
  take: number;
  sort: PageSortField;
  order: "asc" | "desc";
}

export async function listPages(params: ListPagesParams): Promise<{ items: Page[]; total: number }> {
  const where: Prisma.PageWhereInput = params.search
    ? {
        OR: [
          { title: { contains: params.search, mode: "insensitive" } },
          { slug: { contains: params.search, mode: "insensitive" } },
        ],
      }
    : {};

  const orderBy = { [params.sort]: params.order } as Prisma.PageOrderByWithRelationInput;
  const [items, total] = await prisma.$transaction([
    prisma.page.findMany({ where, orderBy, skip: params.skip, take: params.take }),
    prisma.page.count({ where }),
  ]);
  return { items, total };
}

export function getPage(id: string): Promise<Page | null> {
  return prisma.page.findUnique({ where: { id } });
}

export function getPageBySlug(slug: string): Promise<Page | null> {
  return prisma.page.findUnique({ where: { slug } });
}

/** Seed missing system pages (Home, About, Contact, policies…) — idempotent. */
export async function ensureSystemPages(): Promise<void> {
  await prisma.page.createMany({
    data: SYSTEM_PAGES.map((p) => ({ slug: p.slug, title: p.title, status: "PUBLISHED" as PageStatus })),
    skipDuplicates: true,
  });
}

export function createPage(data: PageInput): Promise<Page> {
  return prisma.page.create({
    data: {
      title: data.title,
      slug: data.slug,
      status: data.status,
      seoTitle: data.seoTitle ?? null,
      seoDescription: data.seoDescription ?? null,
    },
  });
}

export function updatePage(id: string, data: Partial<PageInput>): Promise<Page> {
  return prisma.page.update({
    where: { id },
    data: {
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.seoTitle !== undefined ? { seoTitle: data.seoTitle ?? null } : {}),
      ...(data.seoDescription !== undefined ? { seoDescription: data.seoDescription ?? null } : {}),
    },
  });
}

/** Permanent delete — the Page model has no soft-delete column. */
export function deletePage(id: string): Promise<Page> {
  return prisma.page.delete({ where: { id } });
}

export function setPageStatus(id: string, status: PageStatus): Promise<Page> {
  return prisma.page.update({ where: { id }, data: { status } });
}

/** Find a unique slug derived from `base` (appends -2, -3, … on collision). */
export async function uniqueSlug(base: string): Promise<string> {
  const root = slugify(base);
  let candidate = root;
  let n = 1;
  // eslint-disable-next-line no-await-in-loop
  while (await prisma.page.findUnique({ where: { slug: candidate } })) {
    n += 1;
    candidate = `${root}-${n}`;
  }
  return candidate;
}

export async function duplicatePage(id: string): Promise<Page | null> {
  const src = await prisma.page.findUnique({ where: { id }, include: { sections: true } });
  if (!src) return null;
  const slug = await uniqueSlug(`${src.slug}-copy`);
  return prisma.page.create({
    data: {
      title: `${src.title} (Copy)`,
      slug,
      status: "DRAFT",
      seoTitle: src.seoTitle,
      seoDescription: src.seoDescription,
      sections: {
        create: src.sections.map((s) => ({
          type: s.type,
          title: s.title,
          content: s.content as Prisma.InputJsonValue,
          order: s.order,
          published: s.published,
        })),
      },
    },
  });
}
