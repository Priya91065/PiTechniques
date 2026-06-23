import type { JSX } from "react";
import { redirect } from "next/navigation";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { getCurrentUser } from "@/lib/auth/current-user";
import { getAnalyticsSummary } from "@/server/services/analytics";
import SubmissionsChart from "@/components/admin/analytics/SubmissionsChart";
import ActivityLogTable from "@/components/admin/analytics/ActivityLogTable";

function Metric({ label, value }: { label: string; value: number }): JSX.Element {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h4" fontWeight={800}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Paper>
  );
}

export default async function AnalyticsPage(): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  let summary: Awaited<ReturnType<typeof getAnalyticsSummary>> | null = null;
  try {
    summary = await getAnalyticsSummary(30);
  } catch {
    summary = null;
  }

  if (!summary) {
    return (
      <Box>
        <Typography variant="h4" fontWeight={800} gutterBottom>
          Analytics
        </Typography>
        <Paper sx={{ p: 4 }}>
          <Typography color="error" fontWeight={700} gutterBottom>
            Couldn’t load analytics
          </Typography>
          <Typography color="text.secondary">The database is unreachable. Check the connection and try again.</Typography>
        </Paper>
      </Box>
    );
  }

  const c = summary.content;
  const m = summary.messages;
  const contentMetrics = [
    { label: "Pages", value: c.pages },
    { label: "Services", value: c.services },
    { label: "Case Studies", value: c.caseStudies },
    { label: "Testimonials", value: c.testimonials },
    { label: "Jobs", value: c.jobs },
    { label: "Team", value: c.team },
    { label: "FAQs", value: c.faqs },
    { label: "Clients", value: c.clients },
    { label: "Media", value: c.media },
  ];

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        Analytics
      </Typography>

      <Typography variant="h6" fontWeight={700} sx={{ mt: 2, mb: 1 }}>
        Content
      </Typography>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", lg: "repeat(5, 1fr)" } }}>
        {contentMetrics.map((x) => (
          <Metric key={x.label} label={x.label} value={x.value} />
        ))}
      </Box>

      <Typography variant="h6" fontWeight={700} sx={{ mt: 4, mb: 1 }}>
        Messages
      </Typography>
      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(4, 1fr)" } }}>
        <Metric label="Total" value={m.total} />
        <Metric label="Unread" value={m.unread} />
        <Metric label="Contact" value={m.contact} />
        <Metric label="Career" value={m.career} />
      </Box>

      <Box sx={{ mt: 4 }}>
        <SubmissionsChart data={summary.submissionsByDay} />
      </Box>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Activity by action <Typography component="span" color="text.secondary">({summary.activityTotal} total)</Typography>
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {summary.activityByAction.length === 0 ? (
            <Typography color="text.secondary">No activity recorded yet.</Typography>
          ) : (
            summary.activityByAction.map((a) => <Chip key={a.action} label={`${a.action}: ${a.count}`} variant="outlined" />)
          )}
        </Stack>
      </Paper>

      <Box sx={{ mt: 4 }}>
        <ActivityLogTable />
      </Box>
    </Box>
  );
}
