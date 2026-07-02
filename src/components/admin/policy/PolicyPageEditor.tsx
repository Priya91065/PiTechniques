"use client";

import { useCallback, useEffect, useState, type JSX } from "react";
import NextLink from "next/link";
import { Box, Button, Chip, CircularProgress, Divider, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNotify } from "@/components/admin/NotificationProvider";
import RichHtmlEditor from "@/components/admin/policy/RichHtmlEditor";
import type { MediaPermissions } from "@/types/media";

interface EditorPerms extends MediaPermissions {
  canPublish: boolean;
}

interface FormState {
  heading: string;
  bannerDescription: string;
  contentHtml: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImage: string;
  status: "DRAFT" | "PUBLISHED";
}

const EMPTY: FormState = {
  heading: "",
  bannerDescription: "",
  contentHtml: "",
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  ogImage: "",
  status: "PUBLISHED",
};

export default function PolicyPageEditor({ slug, perms }: { slug: string; perms: EditorPerms }): JSX.Element {
  const notify = useNotify();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/policy-pages/${slug}`);
      const data: {
        item?: {
          heading: string;
          bannerDescription: string | null;
          contentHtml: string;
          seoTitle: string | null;
          seoDescription: string | null;
          seoKeywords: string | null;
          ogImage: string | null;
          status: "DRAFT" | "PUBLISHED";
        };
        error?: string;
      } = await res.json().catch(() => ({}));
      if (!res.ok || !data.item) {
        notify(data.error ?? "Failed to load", "error");
        return;
      }
      const i = data.item;
      setForm({
        heading: i.heading,
        bannerDescription: i.bannerDescription ?? "",
        contentHtml: i.contentHtml,
        seoTitle: i.seoTitle ?? "",
        seoDescription: i.seoDescription ?? "",
        seoKeywords: i.seoKeywords ?? "",
        ogImage: i.ogImage ?? "",
        status: i.status,
      });
    } catch {
      notify("Network error", "error");
    } finally {
      setLoading(false);
    }
  }, [slug, notify]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(): Promise<void> {
    if (!form.heading.trim() || !form.contentHtml.trim()) {
      notify("Heading and content are required", "warning");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/policy-pages/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Save failed", "error");
        return;
      }
      notify("Policy page saved");
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button component={NextLink} href="/admin/pages" size="small">
            ← Pages
          </Button>
          <Typography variant="h4" fontWeight={800}>
            Edit: {slug}
          </Typography>
          <Chip size="small" label={form.status === "PUBLISHED" ? "Published" : "Draft"} color={form.status === "PUBLISHED" ? "success" : "default"} />
        </Stack>
        <Button component="a" href={`/${slug}`} target="_blank" rel="noreferrer" size="small" endIcon={<OpenInNewIcon />}>
          View page
        </Button>
      </Stack>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <TextField label="Page heading (H1)" value={form.heading} onChange={(e) => setForm((f) => ({ ...f, heading: e.target.value }))} fullWidth required disabled={!perms.canEdit} helperText="Inline HTML allowed (e.g. <br/>)." />
          <TextField label="Banner description (optional)" value={form.bannerDescription} onChange={(e) => setForm((f) => ({ ...f, bannerDescription: e.target.value }))} fullWidth multiline minRows={2} disabled={!perms.canEdit} />

          <Divider textAlign="left">Main content</Divider>
          {perms.canEdit ? (
            <RichHtmlEditor value={form.contentHtml} onChange={(html) => setForm((f) => ({ ...f, contentHtml: html }))} />
          ) : (
            <Box sx={{ p: 2, border: 1, borderColor: "divider", borderRadius: 1 }} dangerouslySetInnerHTML={{ __html: form.contentHtml }} />
          )}

          <Divider textAlign="left">SEO</Divider>
          <TextField label="Meta title" value={form.seoTitle} onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))} fullWidth disabled={!perms.canEdit} />
          <TextField label="Meta description" value={form.seoDescription} onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))} fullWidth multiline minRows={2} disabled={!perms.canEdit} />
          <TextField label="Keywords" value={form.seoKeywords} onChange={(e) => setForm((f) => ({ ...f, seoKeywords: e.target.value }))} fullWidth disabled={!perms.canEdit} helperText="Comma-separated." />
          <TextField label="Open Graph image URL (optional)" value={form.ogImage} onChange={(e) => setForm((f) => ({ ...f, ogImage: e.target.value }))} fullWidth disabled={!perms.canEdit} />

          <Divider textAlign="left">Status</Divider>
          <TextField
            select
            label="Status"
            value={form.status}
            onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as "DRAFT" | "PUBLISHED" }))}
            sx={{ width: 200 }}
            disabled={!perms.canPublish}
            helperText={perms.canPublish ? undefined : "Requires publish permission."}
          >
            <MenuItem value="DRAFT">Draft</MenuItem>
            <MenuItem value="PUBLISHED">Published</MenuItem>
          </TextField>

          {perms.canEdit && (
            <Box>
              <Button variant="contained" onClick={() => void save()} disabled={saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
