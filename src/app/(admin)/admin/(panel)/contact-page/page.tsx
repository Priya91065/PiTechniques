import type { JSX } from "react";
import { redirect } from "next/navigation";
import { Box, Button, Stack, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { getCurrentUser } from "@/lib/auth/current-user";
import { can } from "@/lib/auth/rbac";
import ContactPagePublishBar from "@/components/admin/contact-page/ContactPagePublishBar";
import ContactPageManager from "@/components/admin/contact-page/ContactPageManager";
import SocialLinksManager from "@/components/admin/contact-page/SocialLinksManager";
import OfficeLocationsManager from "@/components/admin/contact-page/OfficeLocationsManager";

export default async function ContactPageAdminPage(): Promise<JSX.Element> {
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
          Contact Page Management
        </Typography>
        <Button component="a" href="/contact-us" target="_blank" rel="noreferrer" variant="outlined" endIcon={<OpenInNewIcon />}>
          Preview Contact page
        </Button>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Edit the Contact page&apos;s location and get-in-touch copy, map embed, and manage social links and office locations, then publish your changes.
      </Typography>

      <ContactPagePublishBar canPublish={can(user.role, "PUBLISH")} canEdit={perms.canEdit} />

      <ContactPageManager perms={perms} />
      <SocialLinksManager perms={perms} />
      <OfficeLocationsManager perms={perms} />
    </Box>
  );
}
