import type { ActivityAction, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

export interface ActivityRow {
  id: string;
  action: ActivityAction;
  entityType: string;
  summary: string;
  createdAt: Date;
  user: { name: string } | null;
}

export interface ListActivityParams {
  action?: ActivityAction;
  entityType?: string;
  search?: string;
  skip?: number;
  take?: number;
}

export async function listActivity(params: ListActivityParams = {}): Promise<{ items: ActivityRow[]; total: number }> {
  const { action, entityType, search, skip = 0, take = 25 } = params;
  const where: Prisma.ActivityLogWhereInput = {
    ...(action ? { action } : {}),
    ...(entityType ? { entityType } : {}),
    ...(search ? { summary: { contains: search, mode: "insensitive" } } : {}),
  };
  const [items, total] = await prisma.$transaction([
    prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      select: { id: true, action: true, entityType: true, summary: true, createdAt: true, user: { select: { name: true } } },
    }),
    prisma.activityLog.count({ where }),
  ]);
  return { items, total };
}

/** Distinct entity types present in the log — for the filter dropdown. */
export async function listActivityEntityTypes(): Promise<string[]> {
  const rows = await prisma.activityLog.findMany({ select: { entityType: true }, distinct: ["entityType"], orderBy: { entityType: "asc" } });
  return rows.map((r) => r.entityType);
}
