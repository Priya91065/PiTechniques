import type { JSX } from "react";
import { Box, Paper, Stack, Tooltip, Typography } from "@mui/material";
import type { DaySeriesPoint } from "@/server/services/analytics";

/** Lightweight CSS bar chart (no chart dependency) of submissions per day. */
export default function SubmissionsChart({ data }: { data: DaySeriesPoint[] }): JSX.Element {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" alignItems="baseline" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Form submissions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {total} in the last {data.length} days
        </Typography>
      </Stack>
      <Box sx={{ display: "flex", alignItems: "flex-end", gap: "3px", height: 140 }}>
        {data.map((d) => (
          <Tooltip key={d.date} title={`${d.date}: ${d.count}`} arrow>
            <Box
              sx={{
                flex: 1,
                minWidth: 2,
                height: `${Math.max(2, (d.count / max) * 100)}%`,
                bgcolor: d.count > 0 ? "primary.main" : "action.hover",
                borderRadius: "3px 3px 0 0",
                transition: "opacity .2s",
                "&:hover": { opacity: 0.7 },
              }}
            />
          </Tooltip>
        ))}
      </Box>
      <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
        <Typography variant="caption" color="text.secondary">
          {data[0]?.date}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {data[data.length - 1]?.date}
        </Typography>
      </Stack>
    </Paper>
  );
}
