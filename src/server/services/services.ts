import type { Service } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { ServiceInput } from "@/lib/validation/service";

export function listServices(): Promise<Service[]> {
  return prisma.service.findMany({ orderBy: { order: "asc" } });
}

export async function createService(data: ServiceInput): Promise<Service> {
  const max = await prisma.service.aggregate({ _max: { order: true } });
  return prisma.service.create({
    data: {
      slug: data.slug,
      anchor: data.anchor,
      title: data.title,
      description: data.description,
      iconDark: data.iconDark,
      iconLight: data.iconLight,
      tags: data.tags,
      published: data.published ?? true,
      order: (max._max.order ?? -1) + 1,
    },
  });
}

export function updateService(id: string, data: Partial<ServiceInput>): Promise<Service> {
  return prisma.service.update({
    where: { id },
    data: {
      ...(data.slug !== undefined ? { slug: data.slug } : {}),
      ...(data.anchor !== undefined ? { anchor: data.anchor } : {}),
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.description !== undefined ? { description: data.description } : {}),
      ...(data.iconDark !== undefined ? { iconDark: data.iconDark } : {}),
      ...(data.iconLight !== undefined ? { iconLight: data.iconLight } : {}),
      ...(data.tags !== undefined ? { tags: data.tags } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
    },
  });
}

export function deleteService(id: string): Promise<Service> {
  return prisma.service.delete({ where: { id } });
}

export async function reorderServices(ids: string[]): Promise<void> {
  await prisma.$transaction(
    ids.map((id, index) => prisma.service.update({ where: { id }, data: { order: index } })),
  );
}
