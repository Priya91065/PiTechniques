"use client";

import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import { Box, Button, CircularProgress, Divider, FormControlLabel, Paper, Stack, Switch, TextField, Typography } from "@mui/material";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import { useNotify } from "@/components/admin/NotificationProvider";
import SeoFieldsSection, { EMPTY_SEO_FIELDS, type SeoFieldsValue } from "@/components/admin/shared/SeoFieldsSection";
import type { MediaPermissions } from "@/types/media";

interface AboutPageItem {
  bannerTitle: string;
  bannerSubtitle: string | null;
  bannerImage: string | null;
  breadcrumb: string | null;
  ctaLabel: string | null;
  ctaHref: string | null;
  showBanner: boolean;

  introEyebrow: string | null;
  introTitle: string;
  introDescription: string;
  introImage: string | null;
  introCtaLabel: string | null;
  introCtaHref: string | null;

  whyHeading: string | null;
  whyTitle: string | null;
  whyDescription: string | null;
  whyImage: string | null;
  showWhySection: boolean;

  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  twitterImage: string | null;
  robotsMeta: string | null;
}

interface FormState {
  bannerTitle: string;
  bannerSubtitle: string;
  bannerImage: string;
  showBanner: boolean;

  introEyebrow: string;
  introTitle: string;
  introDescription: string;
  introImage: string;

  whyHeading: string;
  whyTitle: string;
  whyDescription: string;
  showWhySection: boolean;

  seo: SeoFieldsValue;
}

const EMPTY: FormState = {
  bannerTitle: "",
  bannerSubtitle: "",
  bannerImage: "",
  showBanner: true,

  introEyebrow: "",
  introTitle: "",
  introDescription: "",
  introImage: "",

  whyHeading: "",
  whyTitle: "",
  whyDescription: "",
  showWhySection: true,

  seo: EMPTY_SEO_FIELDS,
};

type ImageField = "bannerImage" | "introImage";

export default function AboutPageManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const introFileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<ImageField | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/about-page");
      const data: { item?: AboutPageItem | null; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Failed to load", "error");
        return;
      }
      if (data.item) {
        const item = data.item;
        setForm({
          bannerTitle: item.bannerTitle,
          bannerSubtitle: item.bannerSubtitle ?? "",
          bannerImage: item.bannerImage ?? "",
          showBanner: item.showBanner,

          introEyebrow: item.introEyebrow ?? "",
          introTitle: item.introTitle,
          introDescription: item.introDescription,
          introImage: item.introImage ?? "",

          whyHeading: item.whyHeading ?? "",
          whyTitle: item.whyTitle ?? "",
          whyDescription: item.whyDescription ?? "",
          showWhySection: item.showWhySection,

          seo: {
            seoTitle: item.seoTitle ?? "",
            seoDescription: item.seoDescription ?? "",
            seoKeywords: item.seoKeywords ?? "",
            canonicalUrl: item.canonicalUrl ?? "",
            ogImage: item.ogImage ?? "",
            twitterImage: item.twitterImage ?? "",
            robotsMeta: item.robotsMeta ?? "",
          },
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

  async function onUpload(field: ImageField, file: File): Promise<void> {
    setUploading(field);
    try {
      const fd = new FormData();
      fd.append("files", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data: { items?: { url: string }[]; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.items?.[0]) {
        notify(data.error ?? "Upload failed", "error");
        return;
      }
      setForm((f) => ({ ...f, [field]: data.items![0].url }));
      notify("Image uploaded");
    } catch {
      notify("Network error", "error");
    } finally {
      setUploading(null);
      if (bannerFileRef.current) bannerFileRef.current.value = "";
      if (introFileRef.current) introFileRef.current.value = "";
    }
  }

  async function save(): Promise<void> {
    if (!form.bannerTitle.trim() || !form.introTitle.trim() || !form.introDescription.trim()) {
      notify("Banner title, intro title and intro description are required", "warning");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about-page", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bannerTitle: form.bannerTitle,
          bannerSubtitle: form.bannerSubtitle,
          bannerImage: form.bannerImage,
          showBanner: form.showBanner,

          introEyebrow: form.introEyebrow,
          introTitle: form.introTitle,
          introDescription: form.introDescription,
          introImage: form.introImage,

          whyHeading: form.whyHeading,
          whyTitle: form.whyTitle,
          whyDescription: form.whyDescription,
          showWhySection: form.showWhySection,

          ...form.seo,
        }),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Save failed", "error");
        return;
      }
      notify("About page draft saved");
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
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
        About page — Banner, Intro &amp; Agile process
      </Typography>
      <Stack spacing={2}>
        <Divider textAlign="left">Banner</Divider>
        <TextField
          label="Banner title"
          value={form.bannerTitle}
          onChange={(e) => setForm((f) => ({ ...f, bannerTitle: e.target.value }))}
          fullWidth
          required
          multiline
          minRows={2}
          disabled={!perms.canEdit}
          helperText="Use a line break where the original heading wraps"
        />
        <TextField
          label="Banner subtitle"
          value={form.bannerSubtitle}
          onChange={(e) => setForm((f) => ({ ...f, bannerSubtitle: e.target.value }))}
          fullWidth
          disabled={!perms.canEdit}
        />
        <Stack direction="row" spacing={2} alignItems="center">
          {form.bannerImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.bannerImage} alt="" style={{ width: 120, height: 76, objectFit: "cover", borderRadius: 6 }} />
          ) : (
            <Box sx={{ width: 120, height: 76, borderRadius: 1, bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary", fontSize: 12 }}>None</Box>
          )}
          {perms.canEdit && (
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" startIcon={<UploadOutlinedIcon />} onClick={() => bannerFileRef.current?.click()} disabled={uploading === "bannerImage"}>
                {uploading === "bannerImage" ? "Uploading…" : form.bannerImage ? "Replace" : "Upload"}
              </Button>
              {form.bannerImage && (
                <Button size="small" color="error" onClick={() => setForm((f) => ({ ...f, bannerImage: "" }))}>
                  Remove
                </Button>
              )}
            </Stack>
          )}
          <input
            ref={bannerFileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onUpload("bannerImage", file);
            }}
          />
        </Stack>
        <FormControlLabel
          control={<Switch checked={form.showBanner} onChange={(e) => setForm((f) => ({ ...f, showBanner: e.target.checked }))} disabled={!perms.canEdit} />}
          label="Show banner"
        />

        <Divider textAlign="left">Intro — &quot;Rooted in experience&quot;</Divider>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Eyebrow" value={form.introEyebrow} onChange={(e) => setForm((f) => ({ ...f, introEyebrow: e.target.value }))} fullWidth disabled={!perms.canEdit} placeholder="ABOUT US" />
          <TextField
            label="Title"
            value={form.introTitle}
            onChange={(e) => setForm((f) => ({ ...f, introTitle: e.target.value }))}
            fullWidth
            required
            multiline
            minRows={2}
            disabled={!perms.canEdit}
            helperText="Use a line break where the original heading wraps"
          />
        </Stack>
        <TextField
          label="Description"
          value={form.introDescription}
          onChange={(e) => setForm((f) => ({ ...f, introDescription: e.target.value }))}
          fullWidth
          multiline
          minRows={6}
          required
          disabled={!perms.canEdit}
          helperText="Blank line separates paragraphs"
        />
        <Stack direction="row" spacing={2} alignItems="center">
          {form.introImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.introImage} alt="" style={{ width: 120, height: 76, objectFit: "cover", borderRadius: 6 }} />
          ) : (
            <Box sx={{ width: 120, height: 76, borderRadius: 1, bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary", fontSize: 12 }}>None</Box>
          )}
          {perms.canEdit && (
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" startIcon={<UploadOutlinedIcon />} onClick={() => introFileRef.current?.click()} disabled={uploading === "introImage"}>
                {uploading === "introImage" ? "Uploading…" : form.introImage ? "Replace" : "Upload"}
              </Button>
              {form.introImage && (
                <Button size="small" color="error" onClick={() => setForm((f) => ({ ...f, introImage: "" }))}>
                  Remove
                </Button>
              )}
            </Stack>
          )}
          <input
            ref={introFileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onUpload("introImage", file);
            }}
          />
        </Stack>

        <Divider textAlign="left">Agile process — &quot;Adapting agility for smarter outcomes&quot;</Divider>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Section label" value={form.whyHeading} onChange={(e) => setForm((f) => ({ ...f, whyHeading: e.target.value }))} fullWidth disabled={!perms.canEdit} placeholder="our agile process" />
          <TextField label="Title" value={form.whyTitle} onChange={(e) => setForm((f) => ({ ...f, whyTitle: e.target.value }))} fullWidth disabled={!perms.canEdit} />
        </Stack>
        <TextField
          label="Description"
          value={form.whyDescription}
          onChange={(e) => setForm((f) => ({ ...f, whyDescription: e.target.value }))}
          fullWidth
          multiline
          minRows={4}
          disabled={!perms.canEdit}
        />
        <FormControlLabel
          control={<Switch checked={form.showWhySection} onChange={(e) => setForm((f) => ({ ...f, showWhySection: e.target.checked }))} disabled={!perms.canEdit} />}
          label="Show agile process section"
        />

        <SeoFieldsSection value={form.seo} onChange={(seo) => setForm((f) => ({ ...f, seo }))} disabled={!perms.canEdit} />

        {perms.canEdit && (
          <Box>
            <Button variant="contained" onClick={() => void save()} disabled={saving}>
              {saving ? "Saving…" : "Save draft"}
            </Button>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
