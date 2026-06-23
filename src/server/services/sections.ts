import { Prisma, type Section } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { SectionType } from "@/lib/validation/section";

export function listSections(pageId: string): Promise<Section[]> {
  return prisma.section.findMany({ where: { pageId }, orderBy: { order: "asc" } });
}

export function getSection(id: string): Promise<Section | null> {
  return prisma.section.findUnique({ where: { id } });
}

export async function createSection(
  pageId: string,
  data: { type: SectionType; title?: string | null; published?: boolean; content: unknown },
): Promise<Section> {
  const max = await prisma.section.aggregate({ where: { pageId }, _max: { order: true } });
  return prisma.section.create({
    data: {
      pageId,
      type: data.type,
      title: data.title ?? null,
      content: data.content as Prisma.InputJsonValue,
      published: data.published ?? true,
      order: (max._max.order ?? -1) + 1,
    },
  });
}

export function updateSection(
  id: string,
  data: { type?: SectionType; title?: string | null; published?: boolean; content?: unknown },
): Promise<Section> {
  return prisma.section.update({
    where: { id },
    data: {
      ...(data.type !== undefined ? { type: data.type } : {}),
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
      ...(data.content !== undefined ? { content: data.content as Prisma.InputJsonValue } : {}),
    },
  });
}

export function deleteSection(id: string): Promise<Section> {
  return prisma.section.delete({ where: { id } });
}

export async function reorderSections(pageId: string, ids: string[]): Promise<void> {
  await prisma.$transaction(
    ids.map((id, index) => prisma.section.updateMany({ where: { id, pageId }, data: { order: index } })),
  );
}
