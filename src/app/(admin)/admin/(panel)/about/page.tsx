import type { JSX } from "react";
import { redirect } from "next/navigation";
import { Box, Stack, Typography } from "@mui/material";
import { getCurrentUser } from "@/lib/auth/current-user";
import { can } from "@/lib/auth/rbac";
import AboutPublishBar from "@/components/admin/about/AboutPublishBar";
import AboutPageManager from "@/components/admin/about/AboutPageManager";
import WhyChooseFeaturesManager from "@/components/admin/about/WhyChooseFeaturesManager";

export default async function AboutAdminPage(): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const perms = {
    canCreate: can(user.role, "CREATE"),
    canEdit: can(user.role, "EDIT"),
    canDelete: can(user.role, "DELETE"),
  };

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1, flexWrap: "wrap", gap: 1 }}>
        <Typography variant="h4" fontWeight={800}>
          About Page Management
        </Typography>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Edit the Banner, Intro and Agile process sections below, then publish your changes. Team members and key
        industries are managed elsewhere.
      </Typography>

      <AboutPublishBar canPublish={can(user.role, "PUBLISH")} canEdit={perms.canEdit} />

      <Box sx={{ mb: 4 }}>
        <AboutPageManager perms={perms} />
      </Box>

      <WhyChooseFeaturesManager perms={perms} />
    </Box>
  );
}
