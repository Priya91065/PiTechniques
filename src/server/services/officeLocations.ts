import type { OfficeLocation } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { OfficeLocationInput } from "@/lib/validation/contactPage";

export function listOfficeLocations(): Promise<OfficeLocation[]> {
  return prisma.officeLocation.findMany({ orderBy: { order: "asc" } });
}

export async function createOfficeLocation(data: OfficeLocationInput): Promise<OfficeLocation> {
  const max = await prisma.officeLocation.aggregate({ _max: { order: true } });
  return prisma.officeLocation.create({
    data: {
      name: data.name,
      address: data.address,
      phone: data.phone ?? null,
      email: data.email ?? null,
      mapUrl: data.mapUrl ?? null,
      published: data.published ?? true,
      order: (max._max.order ?? -1) + 1,
    },
  });
}

export function updateOfficeLocation(id: string, data: Partial<OfficeLocationInput>): Promise<OfficeLocation> {
  return prisma.officeLocation.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.address !== undefined ? { address: data.address } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.mapUrl !== undefined ? { mapUrl: data.mapUrl } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
    },
  });
}

export function deleteOfficeLocation(id: string): Promise<OfficeLocation> {
  return prisma.officeLocation.delete({ where: { id } });
}

export async function reorderOfficeLocations(ids: string[]): Promise<void> {
  await prisma.$transaction(ids.map((id, index) => prisma.officeLocation.update({ where: { id }, data: { order: index } })));
}
