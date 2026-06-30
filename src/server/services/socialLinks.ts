import type { SocialLink } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { SocialLinkInput } from "@/lib/validation/contactPage";

export function listSocialLinks(): Promise<SocialLink[]> {
  return prisma.socialLink.findMany({ orderBy: { order: "asc" } });
}

export async function createSocialLink(data: SocialLinkInput): Promise<SocialLink> {
  const max = await prisma.socialLink.aggregate({ _max: { order: true } });
  return prisma.socialLink.create({
    data: {
      platform: data.platform,
      url: data.url,
      icon: data.icon ?? null,
      published: data.published ?? true,
      order: (max._max.order ?? -1) + 1,
    },
  });
}

export function updateSocialLink(id: string, data: Partial<SocialLinkInput>): Promise<SocialLink> {
  return prisma.socialLink.update({
    where: { id },
    data: {
      ...(data.platform !== undefined ? { platform: data.platform } : {}),
      ...(data.url !== undefined ? { url: data.url } : {}),
      ...(data.icon !== undefined ? { icon: data.icon } : {}),
      ...(data.published !== undefined ? { published: data.published } : {}),
    },
  });
}

export function deleteSocialLink(id: string): Promise<SocialLink> {
  return prisma.socialLink.delete({ where: { id } });
}

export async function reorderSocialLinks(ids: string[]): Promise<void> {
  await prisma.$transaction(ids.map((id, index) => prisma.socialLink.update({ where: { id }, data: { order: index } })));
}
