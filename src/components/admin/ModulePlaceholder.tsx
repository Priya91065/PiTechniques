import type { JSX } from "react";
import { Box, Paper, Typography } from "@mui/material";
import ConstructionOutlinedIcon from "@mui/icons-material/ConstructionOutlined";

/** Lightweight placeholder for modules whose full UI ships in a later phase. */
export default function ModulePlaceholder({
  title,
  description,
}: {
  title: string;
  description?: string;
}): JSX.Element {
  return (
    <Box>
      <Typography variant="h4" fontWeight={800} gutterBottom>
        {title}
      </Typography>
      <Paper sx={{ p: 5, mt: 2, textAlign: "center" }}>
        <ConstructionOutlinedIcon sx={{ fontSize: 48, color: "primary.main", mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          Coming soon
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 520, mx: "auto" }}>
          {description ?? `The ${title} module is being built and will appear here.`}
        </Typography>
      </Paper>
    </Box>
  );
}
