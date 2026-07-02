import type { JSX } from "react";
import NextLink from "next/link";
import { notFound, redirect } from "next/navigation";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getCurrentUser } from "@/lib/auth/current-user";
import { can } from "@/lib/auth/rbac";
import { ensureSystemPages, getPage, getPageBySlug } from "@/server/services/pages";
import { listSections } from "@/server/services/sections";
import { getSystemPage, type SystemPageDef } from "@/lib/systemPages";
import PageEditor, { type EditorPage, type EditorSection } from "@/components/admin/pages/PageEditor";
import BannerManager from "@/components/admin/banner/BannerManager";
import HomepagePublishBar from "@/components/admin/homepage/HomepagePublishBar";
import AboutManager from "@/components/admin/homepage/AboutManager";
import AboutPublishBar from "@/components/admin/about/AboutPublishBar";
import AboutPageManager from "@/components/admin/about/AboutPageManager";
import WhyChooseFeaturesManager from "@/components/admin/about/WhyChooseFeaturesManager";
import ContactPagePublishBar from "@/components/admin/contact-page/ContactPagePublishBar";
import ContactPageManager from "@/components/admin/contact-page/ContactPageManager";
import SocialLinksManager from "@/components/admin/contact-page/SocialLinksManager";
import OfficeLocationsManager from "@/components/admin/contact-page/OfficeLocationsManager";
import PolicyPageEditor from "@/components/admin/policy/PolicyPageEditor";

interface Perms {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPublish: boolean;
}

function SystemPageHeader({ def }: { def: SystemPageDef }): JSX.Element {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Button component={NextLink} href="/admin/pages" size="small">
          ← Pages
        </Button>
        <Typography variant="h4" fontWeight={800}>
          {def.title}
        </Typography>
        <Chip size="small" label="System page" variant="outlined" />
      </Stack>
      <Button component="a" href={def.viewPath} target="_blank" rel="noreferrer" size="small" endIcon={<OpenInNewIcon />}>
        View page
      </Button>
    </Stack>
  );
}

/** Editors for the fixed site pages — the same managers, now living inside Pages. */
function SystemPageEditor({ def, perms }: { def: SystemPageDef; perms: Perms }): JSX.Element {
  const managerPerms = { canCreate: perms.canCreate, canEdit: perms.canEdit, canDelete: perms.canDelete };

  switch (def.kind) {
    case "home":
      return (
        <Box>
          <SystemPageHeader def={def} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Edit the hero banner, statistics counters and About section below, then publish your changes. Services, Case
            Studies, Clients and Testimonials on the homepage come from their global modules.
          </Typography>
          <HomepagePublishBar canPublish={perms.canPublish} canEdit={perms.canEdit} />
          <Box sx={{ mb: 4 }}>
            <BannerManager perms={managerPerms} />
          </Box>
          <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
            About section
          </Typography>
          <AboutManager perms={managerPerms} />
        </Box>
      );
    case "about":
      return (
        <Box>
          <SystemPageHeader def={def} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Edit the Banner, Intro and Agile process sections below, then publish your changes. Team members come from
            the global Team Members module.
          </Typography>
          <AboutPublishBar canPublish={perms.canPublish} canEdit={perms.canEdit} />
          <Box sx={{ mb: 4 }}>
            <AboutPageManager perms={managerPerms} />
          </Box>
          <WhyChooseFeaturesManager perms={managerPerms} />
        </Box>
      );
    case "contact":
      return (
        <Box>
          <SystemPageHeader def={def} />
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Edit the Contact page&apos;s location and get-in-touch copy, map embed, social links and office locations,
            then publish your changes.
          </Typography>
          <ContactPagePublishBar canPublish={perms.canPublish} canEdit={perms.canEdit} />
          <ContactPageManager perms={managerPerms} />
          <SocialLinksManager perms={managerPerms} />
          <OfficeLocationsManager perms={managerPerms} />
        </Box>
      );
    case "policy":
      return <PolicyPageEditor slug={def.slug} perms={perms} />;
    case "module":
      return (
        <Box>
          <SystemPageHeader def={def} />
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography sx={{ mb: 2 }} color="text.secondary">
              This page is rendered from the global <strong>{def.moduleLabel}</strong> collection — its content is
              managed there.
            </Typography>
            <Button component={NextLink} href={def.moduleHref ?? "/admin"} variant="contained" endIcon={<ArrowForwardIcon />}>
              Open {def.moduleLabel}
            </Button>
          </Paper>
        </Box>
      );
  }
}

export default async function EditPageContent({ params }: { params: Promise<{ id: string }> }): Promise<JSX.Element> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  const { id } = await params;

  // Resolve by id, then by slug (old module routes redirect here as /admin/pages/<slug>).
  let page = await getPage(id);
  if (!page) page = await getPageBySlug(id);
  if (!page && getSystemPage(id)) {
    await ensureSystemPages();
    page = await getPageBySlug(id);
  }
  if (!page) notFound();

  const perms: Perms = {
    canCreate: can(user.role, "CREATE"),
    canEdit: can(user.role, "EDIT"),
    canDelete: can(user.role, "DELETE"),
    canPublish: can(user.role, "PUBLISH"),
  };

  const systemDef = getSystemPage(page.slug);
  if (systemDef) return <SystemPageEditor def={systemDef} perms={perms} />;

  const sections = await listSections(page.id);
  const editorPage: EditorPage = {
    id: page.id,
    title: page.title,
    slug: page.slug,
    status: page.status,
    seoTitle: page.seoTitle,
    seoDescription: page.seoDescription,
  };
  const editorSections: EditorSection[] = sections.map((s) => ({
    id: s.id,
    type: s.type,
    title: s.title,
    published: s.published,
    content: s.content,
    order: s.order,
  }));

  return <PageEditor page={editorPage} initialSections={editorSections} perms={perms} />;
}
