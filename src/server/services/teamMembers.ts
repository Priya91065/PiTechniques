import type { TeamMember } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { TeamMemberInput } from "@/lib/validation/teamMember";

/** Normalise an optional string to a non-empty value or null. */
function nz(v: string | null | undefined): string | null {
  const t = (v ?? "").trim();
  return t.length > 0 ? t : null;
}

export function listTeamMembers(): Promise<TeamMember[]> {
  return prisma.teamMember.findMany({ orderBy: [{ group: "asc" }, { order: "asc" }] });
}

export async function createTeamMember(data: TeamMemberInput): Promise<TeamMember> {
  const max = await prisma.teamMember.aggregate({
    where: { group: data.group },
    _max: { order: true },
  });
  return prisma.teamMember.create({
    data: {
      name: data.name,
      role: data.role,
      photo: data.photo,
      photoMobile: nz(data.photoMobile),
      colSpan: data.colSpan,
      cardMb0: data.cardMb0 ?? false,
      linkedin: nz(data.linkedin),
      group: data.group,
      published: data.published ?? true,
      order: (max._max.order ?? -1) + 1,
    },
  });
}

export function updateTeamMember(id: string, data: Partial<TeamMemberInput>): Promise<TeamMember> {
  return prisma.teamMember.update({
    where: { id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.role !== undefined ? { role: data.role } : {}),
      ...(data.photo !== undefined ? { photo: data.photo } : {}),
      ...(data.photoMobile !== undefined ? { photoMobile: nz(data.photoMobile) } : {}),
      ...(data.colSpan !== undefined ? { colSpan: data.colSpan } : {}),
      ...(data.cardMb0 !== undefined ? { cardMb0: data.cardMb0 } : {}),
      ...(data.linkedin !== undefined ? { linkedin: nz(data.linkedin) } : {}),
      ...(data.group !== undefined ? { group: data.group } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
    },
  });
}

export function deleteTeamMember(id: string): Promise<TeamMember> {
  return prisma.teamMember.delete({ where: { id } });
}

export async function reorderTeamMembers(ids: string[]): Promise<void> {
  await prisma.$transaction(
    ids.map((id, index) => prisma.teamMember.update({ where: { id }, data: { order: index } })),
  );
}
