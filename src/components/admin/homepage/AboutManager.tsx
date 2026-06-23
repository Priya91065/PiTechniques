"use client";

import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import { Box, Button, CircularProgress, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import { useNotify } from "@/components/admin/NotificationProvider";
import type { MediaPermissions } from "@/types/media";

interface AboutForm {
  whoEyebrow: string;
  whoTitle: string;
  paragraphsText: string; // one paragraph per line
  whoCtaLabel: string;
  whoCtaHref: string;
  aboutImage: string;
}

const EMPTY: AboutForm = { whoEyebrow: "", whoTitle: "", paragraphsText: "", whoCtaLabel: "", whoCtaHref: "", aboutImage: "" };

export default function AboutManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<AboutForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/about");
      const data: {
        item?: { whoEyebrow: string; whoTitle: string; whoParagraphs: string[]; whoCtaLabel: string; whoCtaHref: string; aboutImage: string | null } | null;
        error?: string;
      } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Failed to load", "error");
        return;
      }
      if (data.item) {
        setForm({
          whoEyebrow: data.item.whoEyebrow,
          whoTitle: data.item.whoTitle,
          paragraphsText: data.item.whoParagraphs.join("\n"),
          whoCtaLabel: data.item.whoCtaLabel,
          whoCtaHref: data.item.whoCtaHref,
          aboutImage: data.item.aboutImage ?? "",
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

  async function onUpload(file: File): Promise<void> {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("files", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data: { items?: { url: string }[]; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.items?.[0]) {
        notify(data.error ?? "Upload failed", "error");
        return;
      }
      setForm((f) => ({ ...f, aboutImage: data.items![0].url }));
      notify("Image uploaded");
    } catch {
      notify("Network error", "error");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function save(): Promise<void> {
    if (!form.whoTitle.trim()) {
      notify("Title is required", "warning");
      return;
    }
    setSaving(true);
    try {
      const whoParagraphs = form.paragraphsText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      const res = await fetch("/api/admin/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          whoEyebrow: form.whoEyebrow,
          whoTitle: form.whoTitle,
          whoParagraphs,
          whoCtaLabel: form.whoCtaLabel,
          whoCtaHref: form.whoCtaHref,
          aboutImage: form.aboutImage,
        }),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Save failed", "error");
        return;
      }
      notify("About section saved");
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
        About — “How we think &amp; build”
      </Typography>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Section label" value={form.whoEyebrow} onChange={(e) => setForm((f) => ({ ...f, whoEyebrow: e.target.value }))} fullWidth disabled={!perms.canEdit} placeholder="who we are" />
          <TextField label="Title" value={form.whoTitle} onChange={(e) => setForm((f) => ({ ...f, whoTitle: e.target.value }))} fullWidth required disabled={!perms.canEdit} />
        </Stack>
        <TextField label="Description" value={form.paragraphsText} onChange={(e) => setForm((f) => ({ ...f, paragraphsText: e.target.value }))} fullWidth multiline minRows={4} disabled={!perms.canEdit} helperText="One paragraph per line." />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <TextField label="Button text" value={form.whoCtaLabel} onChange={(e) => setForm((f) => ({ ...f, whoCtaLabel: e.target.value }))} fullWidth disabled={!perms.canEdit} />
          <TextField label="Button URL" value={form.whoCtaHref} onChange={(e) => setForm((f) => ({ ...f, whoCtaHref: e.target.value }))} fullWidth disabled={!perms.canEdit} />
        </Stack>
        <Divider textAlign="left">Image</Divider>
        <Stack direction="row" spacing={2} alignItems="center">
          {form.aboutImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={form.aboutImage} alt="" style={{ width: 120, height: 76, objectFit: "cover", borderRadius: 6 }} />
          ) : (
            <Box sx={{ width: 120, height: 76, borderRadius: 1, bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary", fontSize: 12 }}>None</Box>
          )}
          {perms.canEdit && (
            <Stack direction="row" spacing={1}>
              <Button size="small" variant="outlined" startIcon={<UploadOutlinedIcon />} onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? "Uploading…" : form.aboutImage ? "Replace" : "Upload"}
              </Button>
              {form.aboutImage && (
                <Button size="small" color="error" onClick={() => setForm((f) => ({ ...f, aboutImage: "" }))}>
                  Remove
                </Button>
              )}
            </Stack>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onUpload(file);
            }}
          />
        </Stack>
        {perms.canEdit && (
          <Box>
            <Button variant="contained" onClick={() => void save()} disabled={saving}>
              {saving ? "Saving…" : "Save About section"}
            </Button>
          </Box>
        )}
      </Stack>
    </Paper>
  );
}
