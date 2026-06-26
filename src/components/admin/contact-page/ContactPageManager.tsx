"use client";

import { useCallback, useEffect, useState, type JSX } from "react";
import { Box, Button, CircularProgress, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { useNotify } from "@/components/admin/NotificationProvider";
import SeoFieldsSection, { EMPTY_SEO_FIELDS, type SeoFieldsValue } from "@/components/admin/shared/SeoFieldsSection";
import type { MediaPermissions } from "@/types/media";

interface ContactForm {
  locationHeading: string;
  locationTitle: string;
  officeName: string;
  officeCity: string;
  officeAddress: string;
  directionsUrl: string;
  mapEmbedUrl: string;
  phone: string;
  email: string;
  workingHours: string;
  formHeading: string;
  formTitle: string;
  formIntro: string;
  formDescription: string;
  successMessage: string;
  errorMessage: string;
}

const EMPTY: ContactForm = {
  locationHeading: "",
  locationTitle: "",
  officeName: "",
  officeCity: "",
  officeAddress: "",
  directionsUrl: "",
  mapEmbedUrl: "",
  phone: "",
  email: "",
  workingHours: "",
  formHeading: "",
  formTitle: "",
  formIntro: "",
  formDescription: "",
  successMessage: "",
  errorMessage: "",
};

type ApiItem = Record<keyof ContactForm | keyof SeoFieldsValue, string | null> | null;

export default function ContactPageManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const [form, setForm] = useState<ContactForm>(EMPTY);
  const [seo, setSeo] = useState<SeoFieldsValue>(EMPTY_SEO_FIELDS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/contact-page");
      const data: { item?: ApiItem; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Failed to load", "error");
        return;
      }
      const item = data.item;
      if (item) {
        setForm({
          locationHeading: item.locationHeading ?? "",
          locationTitle: item.locationTitle ?? "",
          officeName: item.officeName ?? "",
          officeCity: item.officeCity ?? "",
          officeAddress: item.officeAddress ?? "",
          directionsUrl: item.directionsUrl ?? "",
          mapEmbedUrl: item.mapEmbedUrl ?? "",
          phone: item.phone ?? "",
          email: item.email ?? "",
          workingHours: item.workingHours ?? "",
          formHeading: item.formHeading ?? "",
          formTitle: item.formTitle ?? "",
          formIntro: item.formIntro ?? "",
          formDescription: item.formDescription ?? "",
          successMessage: item.successMessage ?? "",
          errorMessage: item.errorMessage ?? "",
        });
        setSeo({
          seoTitle: item.seoTitle ?? "",
          seoDescription: item.seoDescription ?? "",
          seoKeywords: item.seoKeywords ?? "",
          canonicalUrl: item.canonicalUrl ?? "",
          ogImage: item.ogImage ?? "",
          twitterImage: item.twitterImage ?? "",
          robotsMeta: item.robotsMeta ?? "",
        });
      }
    } catch {
      notify("Network error", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(): Promise<void> {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/contact-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ...seo }),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Save failed", "error");
        return;
      }
      notify("Contact page content saved");
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        Contact page content
      </Typography>
      <Stack spacing={2}>
        <Divider textAlign="left">Location</Divider>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Section label" value={form.locationHeading} onChange={(e) => setForm((f) => ({ ...f, locationHeading: e.target.value }))} fullWidth disabled={!perms.canEdit} placeholder="LOCATION" />
          <TextField label="Title" value={form.locationTitle} onChange={(e) => setForm((f) => ({ ...f, locationTitle: e.target.value }))} fullWidth disabled={!perms.canEdit} placeholder="Our headquarters" />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Office name" value={form.officeName} onChange={(e) => setForm((f) => ({ ...f, officeName: e.target.value }))} fullWidth disabled={!perms.canEdit} placeholder="Nariman Point" />
          <TextField label="Office city" value={form.officeCity} onChange={(e) => setForm((f) => ({ ...f, officeCity: e.target.value }))} fullWidth disabled={!perms.canEdit} placeholder="Mumbai" />
        </Stack>
        <TextField
          label="Office address"
          value={form.officeAddress}
          onChange={(e) => setForm((f) => ({ ...f, officeAddress: e.target.value }))}
          fullWidth
          multiline
          minRows={2}
          disabled={!perms.canEdit}
          helperText="One line per address line."
        />
        <TextField label="Directions URL" value={form.directionsUrl} onChange={(e) => setForm((f) => ({ ...f, directionsUrl: e.target.value }))} fullWidth disabled={!perms.canEdit} helperText="Google Maps 'Get directions' link" />
        <TextField label="Map embed URL" value={form.mapEmbedUrl} onChange={(e) => setForm((f) => ({ ...f, mapEmbedUrl: e.target.value }))} fullWidth multiline minRows={2} disabled={!perms.canEdit} helperText="Google Maps embed (iframe src) URL" />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} fullWidth disabled={!perms.canEdit} />
          <TextField label="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} fullWidth disabled={!perms.canEdit} />
          <TextField label="Working hours" value={form.workingHours} onChange={(e) => setForm((f) => ({ ...f, workingHours: e.target.value }))} fullWidth disabled={!perms.canEdit} />
        </Stack>

        <Divider textAlign="left">Get in touch</Divider>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Section label" value={form.formHeading} onChange={(e) => setForm((f) => ({ ...f, formHeading: e.target.value }))} fullWidth disabled={!perms.canEdit} placeholder="Contact US" />
          <TextField label="Title" value={form.formTitle} onChange={(e) => setForm((f) => ({ ...f, formTitle: e.target.value }))} fullWidth disabled={!perms.canEdit} placeholder="Get in touch" />
        </Stack>
        <TextField
          label="Intro paragraph"
          value={form.formIntro}
          onChange={(e) => setForm((f) => ({ ...f, formIntro: e.target.value }))}
          fullWidth
          multiline
          minRows={2}
          disabled={!perms.canEdit}
        />
        <TextField
          label="Form description (future use)"
          value={form.formDescription}
          onChange={(e) => setForm((f) => ({ ...f, formDescription: e.target.value }))}
          fullWidth
          multiline
          minRows={2}
          disabled={!perms.canEdit}
        />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Success message" value={form.successMessage} onChange={(e) => setForm((f) => ({ ...f, successMessage: e.target.value }))} fullWidth disabled={!perms.canEdit} />
          <TextField label="Error message" value={form.errorMessage} onChange={(e) => setForm((f) => ({ ...f, errorMessage: e.target.value }))} fullWidth disabled={!perms.canEdit} />
        </Stack>

        <SeoFieldsSection value={seo} onChange={setSeo} disabled={!perms.canEdit} />

        {perms.canEdit && (
          <Box>
            <Button variant="contained" onClick={() => void save()} disabled={saving}>
              {saving ? "Saving…" : "Save Contact page content"}
            </Button>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
