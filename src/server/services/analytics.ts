import { prisma } from "@/lib/db";

export interface DaySeriesPoint {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface AnalyticsSummary {
  content: {
    pages: number;
    services: number;
    caseStudies: number;
    testimonials: number;
    jobs: number;
    team: number;
    faqs: number;
    clients: number;
    media: number;
  };
  messages: { total: number; unread: number; contact: number; career: number };
  submissionsByDay: DaySeriesPoint[];
  activityByAction: { action: string; count: number }[];
  activityTotal: number;
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Aggregate metrics for the Analytics dashboard. */
export async function getAnalyticsSummary(days = 30): Promise<AnalyticsSummary> {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const [
    pages,
    services,
    caseStudies,
    testimonials,
    jobs,
    team,
    faqs,
    clients,
    media,
    total,
    unread,
    contact,
    career,
    recentSubs,
    byAction,
    activityTotal,
  ] = await Promise.all([
    prisma.page.count(),
    prisma.service.count(),
    prisma.caseStudy.count(),
    prisma.testimonial.count(),
    prisma.job.count(),
    prisma.teamMember.count(),
    prisma.faq.count(),
    prisma.client.count(),
    prisma.media.count(),
    prisma.contactSubmission.count(),
    prisma.contactSubmission.count({ where: { status: "UNREAD" } }),
    prisma.contactSubmission.count({ where: { source: "CONTACT" } }),
    prisma.contactSubmission.count({ where: { source: "CAREER" } }),
    prisma.contactSubmission.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.activityLog.groupBy({ by: ["action"], _count: { action: true } }),
    prisma.activityLog.count(),
  ]);

  // Build a zero-filled day series so the chart has a bar for every day.
  const counts = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    counts.set(dayKey(d), 0);
  }
  for (const s of recentSubs) {
    const k = dayKey(s.createdAt);
    if (counts.has(k)) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const submissionsByDay: DaySeriesPoint[] = Array.from(counts.entries()).map(([date, count]) => ({ date, count }));

  return {
    content: { pages, services, caseStudies, testimonials, jobs, team, faqs, clients, media },
    messages: { total, unread, contact, career },
    submissionsByDay,
    activityByAction: byAction.map((a) => ({ action: a.action, count: a._count.action })),
    activityTotal,
  };
}
