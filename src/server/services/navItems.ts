import type { NavItem, NavLocation } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { NavItemInput } from "@/lib/validation/navItem";

export function listNavItems(): Promise<NavItem[]> {
  return prisma.navItem.findMany({ orderBy: [{ location: "asc" }, { order: "asc" }] });
}

export async function createNavItem(data: NavItemInput): Promise<NavItem> {
  const location: NavLocation = data.location;
  const max = await prisma.navItem.aggregate({ where: { location }, _max: { order: true } });
  return prisma.navItem.create({
    data: {
      label: data.label,
      href: data.href,
      location,
      published: data.published ?? true,
      order: (max._max.order ?? -1) + 1,
    },
  });
}

export function updateNavItem(id: string, data: Partial<NavItemInput>): Promise<NavItem> {
  return prisma.navItem.update({
    where: { id },
    data: {
      ...(data.label !== undefined ? { label: data.label } : {}),
      ...(data.href !== undefined ? { href: data.href } : {}),
      ...(data.location !== undefined ? { location: data.location } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
    },
  });
}

export function deleteNavItem(id: string): Promise<NavItem> {
  return prisma.navItem.delete({ where: { id } });
}

export async function reorderNavItems(ids: string[]): Promise<void> {
  await prisma.$transaction(
    ids.map((id, index) => prisma.navItem.update({ where: { id }, data: { order: index } })),
  );
}
