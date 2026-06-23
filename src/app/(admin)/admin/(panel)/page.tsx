import type { JSX, ReactNode } from "react";
import { Box, Card, CardContent, Chip, Paper, Stack, Typography } from "@mui/material";
import DesignServicesOutlinedIcon from "@mui/icons-material/DesignServicesOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import FormatQuoteOutlinedIcon from "@mui/icons-material/FormatQuoteOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import PermMediaOutlinedIcon from "@mui/icons-material/PermMediaOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import { prisma } from "@/lib/db";

interface DashboardStats {
  services: number;
  caseStudies: number;
  testimonials: number;
  clients: number;
  media: number;
  messages: number;
  unread: number;
  activity: { id: string; action: string; summary: string; createdAt: Date; user: { name: string } | null }[];
}

async function getStats(): Promise<DashboardStats | null> {
  try {
    const [services, caseStudies, testimonials, clients, media, messages, unread, activity] =
      await Promise.all([
        prisma.service.count(),
        prisma.caseStudy.count(),
        prisma.testimonial.count(),
        prisma.client.count(),
        prisma.media.count(),
        prisma.contactSubmission.count(),
        prisma.contactSubmission.count({ where: { status: "UNREAD" } }),
        prisma.activityLog.findMany({
          orderBy: { createdAt: "desc" },
          take: 8,
          include: { user: { select: { name: true } } },
        }),
      ]);
    return { services, caseStudies, testimonials, clients, media, messages, unread, activity };
  } catch {
    return null;
  }
}

function StatCard({
  label,
  value,
  icon,
  badge,
}: {
  label: string;
  value: number;
  icon: ReactNode;
  badge?: ReactNode;
}): JSX.Element {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box sx={{ color: "primary.main" }}>{icon}</Box>
          {badge}
        </Stack>
        <Typography variant="h3" fontWeight={800} sx={{ mt: 1 }}>
          {value}
        </Typography>
        <Typography color="text.secondary">{label}</Typography>
      </CardContent>
    </Card>
  );
}

export default async function DashboardPage(): Promise<JSX.Element> {
  const stats = await getStats();

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Dashboard
      </Typography>

      {!stats ? (
        <Paper sx={{ p: 4 }}>
          <Typography color="error" fontWeight={700} gutterBottom>
            Couldn’t load statistics
          </Typography>
          <Typography color="text.secondary">
            The database is unreachable. Check <code>DATABASE_URL</code> in <code>.env</code> and that
            migrations + seed have run.
          </Typography>
        </Paper>
      ) : (
        <>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", lg: "repeat(6, 1fr)" },
            }}
          >
            <StatCard label="Services" value={stats.services} icon={<DesignServicesOutlinedIcon />} />
            <StatCard label="Case Studies" value={stats.caseStudies} icon={<WorkOutlineOutlinedIcon />} />
            <StatCard label="Testimonials" value={stats.testimonials} icon={<FormatQuoteOutlinedIcon />} />
            <StatCard label="Clients" value={stats.clients} icon={<BusinessOutlinedIcon />} />
            <StatCard label="Media" value={stats.media} icon={<PermMediaOutlinedIcon />} />
            <StatCard
              label="Messages"
              value={stats.messages}
              icon={<MailOutlinedIcon />}
              badge={
                stats.unread > 0 ? <Chip size="small" color="warning" label={`${stats.unread} new`} /> : undefined
              }
            />
          </Box>

          <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 1 }}>
            Recent activity
          </Typography>
          <Paper>
            {stats.activity.length === 0 ? (
              <Box sx={{ p: 3 }}>
                <Typography color="text.secondary">No activity yet.</Typography>
              </Box>
            ) : (
              <Stack divider={<Box sx={{ borderBottom: 1, borderColor: "divider" }} />}>
                {stats.activity.map((a) => (
                  <Stack
                    key={a.id}
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ p: 2, gap: 2 }}
                  >
                    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                      <Chip size="small" label={a.action} variant="outlined" />
                      <Typography noWrap>{a.summary}</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                      {new Date(a.createdAt).toLocaleString()}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}
