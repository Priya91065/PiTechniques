import { Prisma, type Media } from "@prisma/client";
import { prisma } from "@/lib/db";

export interface MediaListParams {
  search?: string;
  skip?: number;
  take?: number;
}

/** Lists media (newest first) with an optional name/alt search + total count. */
export async function listMedia(params: MediaListParams): Promise<{ items: Media[]; total: number }> {
  const where: Prisma.MediaWhereInput = params.search
    ? {
        OR: [
          { originalName: { contains: params.search, mode: "insensitive" } },
          { alt: { contains: params.search, mode: "insensitive" } },
        ],
      }
    : {};

  const [items, total] = await prisma.$transaction([
    prisma.media.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: params.skip ?? 0,
      take: params.take ?? 60,
    }),
    prisma.media.count({ where }),
  ]);

  return { items, total };
}
