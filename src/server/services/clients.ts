import type { Client } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { ClientInput } from "@/lib/validation/client";

export function listClients(): Promise<Client[]> {
  return prisma.client.findMany({ orderBy: { order: "asc" } });
}

export async function createClient(data: ClientInput): Promise<Client> {
  const max = await prisma.client.aggregate({ _max: { order: true } });
  return prisma.client.create({
    data: {
      name: data.name,
      logo: data.logo,
      width: data.width ?? null,
      height: data.height ?? null,
      published: data.published ?? true,
      order: (max._max.order ?? -1) + 1,
    },
  });
}

export function updateClient(id: string, data: Partial<ClientInput>): Promise<Client> {
  return prisma.client.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.logo !== undefined ? { logo: data.logo } : {}),
      ...(data.width !== undefined ? { width: data.width ?? null } : {}),
      ...(data.height !== undefined ? { height: data.height ?? null } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
    },
  });
}

export function deleteClient(id: string): Promise<Client> {
  return prisma.client.delete({ where: { id } });
}

export async function reorderClients(ids: string[]): Promise<void> {
  await prisma.$transaction(
    ids.map((id, index) => prisma.client.update({ where: { id }, data: { order: index } })),
  );
}
