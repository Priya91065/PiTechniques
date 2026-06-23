import type { JSX } from "react";
import NextLink from "next/link";
import { redirect } from "next/navigation";
import { Box, Button, Card, CardActionArea, CardContent, Chip, Stack, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getCurrentUser } from "@/lib/auth/current-user";
import { can } from "@/lib/auth/rbac";
import AboutManager from "@/components/admin/homepage/AboutManager";
import HomepagePublishBar from "@/components/admin/homepage/HomepagePublishBar";

interface SectionLink {
  title: string;
  description: string;
  href: string;
}

const SECTIONS: SectionLink[] = [
  { title: "Hero / Banner", description: "Heading, description, CTA, background media, visibility.", href: "/admin/banner" },
  { title: "Statistics / Counters", description: "Counter numbers, labels, order, visibility.", href: "/admin/banner" },
  { title: "Services", description: "Service cards: icon, title, description, tags, order, status.", href: "/admin/services" },
  { title: "Case Studies", description: "Project cards: image, title, description, link, order.", href: "/admin/case-studies" },
  { title: "Partners / Clients", description: "Client logos: name, website, logo, order.", href: "/admin/clients" },
  { title: "Testimonials", description: "Client name, role, company, quote, image, order.", href: "/admin/testimonials" },
  { title: "Footer", description: "Company info, contact, address, social links, copyright.", href: "/admin/settings" },
  { title: "SEO", description: "Meta title/description, Open Graph, canonical URL.", href: "/admin/seo" },
];

export default async function HomepageManagementPage(): Promise<JSX.Element> {
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
          Homepage Management
        </Typography>
        <Button component="a" href="/" target="_blank" rel="noreferrer" variant="outlined" endIcon={<OpenInNewIcon />}>
          Preview homepage
        </Button>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Every homepage section is content-managed. Edit a section below, then publish your changes.
      </Typography>

      <HomepagePublishBar canPublish={can(user.role, "PUBLISH")} canEdit={perms.canEdit} />

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(4, 1fr)" }, mb: 4 }}>
        {SECTIONS.map((s) => (
          <Card key={s.title} variant="outlined">
            <CardActionArea component={NextLink} href={s.href} sx={{ height: "100%" }}>
              <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 0.5 }}>
                  <Typography fontWeight={700}>{s.title}</Typography>
                  <ArrowForwardIcon fontSize="small" color="action" />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {s.description}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          About section
        </Typography>
        <Chip size="small" label="Edited here" />
      </Stack>
      <AboutManager perms={perms} />
    </Box>
  );
}
