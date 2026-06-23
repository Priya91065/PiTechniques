"use client";

import { useCallback, useEffect, useState, type JSX } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useNotify } from "@/components/admin/NotificationProvider";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import type { MediaPermissions } from "@/types/media";

interface SeoEntry {
  id: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
}

interface FormState {
  path: string;
  metaTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

const EMPTY: FormState = {
  path: "",
  metaTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  twitterTitle: "",
  twitterDescription: "",
  twitterImage: "",
};

function toForm(e: SeoEntry): FormState {
  return {
    path: e.path,
    metaTitle: e.metaTitle,
    metaDescription: e.metaDescription,
    canonicalUrl: e.canonicalUrl ?? "",
    ogTitle: e.ogTitle ?? "",
    ogDescription: e.ogDescription ?? "",
    ogImage: e.ogImage ?? "",
    twitterTitle: e.twitterTitle ?? "",
    twitterDescription: e.twitterDescription ?? "",
    twitterImage: e.twitterImage ?? "",
  };
}

export default function SeoManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();
  const [items, setItems] = useState<SeoEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/seo");
      const data: { items?: SeoEntry[]; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Failed to load", "error");
        return;
      }
      setItems(data.items ?? []);
    } catch {
      notify("Network error", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate(): void {
    setEditingId(null);
    setForm(EMPTY);
    setDialogOpen(true);
  }
  function openEdit(e: SeoEntry): void {
    setEditingId(e.id);
    setForm(toForm(e));
    setDialogOpen(true);
  }

  async function save(): Promise<void> {
    if (!form.path.trim() || !form.metaTitle.trim() || !form.metaDescription.trim()) {
      notify("Path, meta title and meta description are required", "warning");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/seo/${editingId}` : "/api/admin/seo";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Save failed", "error");
        return;
      }
      notify(editingId ? "SEO updated" : "SEO created");
      setDialogOpen(false);
      await load();
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function remove(e: SeoEntry): Promise<void> {
    const ok = await confirm({
      title: "Delete SEO settings?",
      message: `SEO settings for "${e.path}" will be removed (the page falls back to its built-in defaults).`,
      confirmText: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/seo/${e.id}`, { method: "DELETE" });
      if (!res.ok) {
        notify("Delete failed", "error");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== e.id));
      notify("SEO settings deleted");
    } catch {
      notify("Network error", "error");
    }
  }

  const titleLen = form.metaTitle.length;
  const descLen = form.metaDescription.length;

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h4" fontWeight={800}>
          SEO
        </Typography>
        {perms.canCreate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            New Path
          </Button>
        )}
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Per-page meta titles, descriptions and social cards. The <code>path</code> must match a route (e.g. <code>/about</code>). Pages without an entry use their built-in defaults.
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width={180}>Path</TableCell>
                <TableCell>Meta title</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No SEO entries yet.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((e) => (
                  <TableRow key={e.id} hover>
                    <TableCell sx={{ fontFamily: "monospace", fontWeight: 600 }}>{e.path}</TableCell>
                    <TableCell>{e.metaTitle}</TableCell>
                    <TableCell align="right">
                      {perms.canEdit && (
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(e)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {perms.canDelete && (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => void remove(e)}>
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit SEO settings" : "New SEO settings"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField label="Path" value={form.path} onChange={(e) => setForm((f) => ({ ...f, path: e.target.value }))} required fullWidth placeholder="/about" disabled={!!editingId} helperText={editingId ? "Path can't be changed after creation." : "Must start with / and match a route."} />
            <TextField
              label="Meta title"
              value={form.metaTitle}
              onChange={(e) => setForm((f) => ({ ...f, metaTitle: e.target.value }))}
              required
              fullWidth
              helperText={`${titleLen} chars${titleLen > 60 ? " — search engines may truncate over ~60" : ""}`}
            />
            <TextField
              label="Meta description"
              value={form.metaDescription}
              onChange={(e) => setForm((f) => ({ ...f, metaDescription: e.target.value }))}
              required
              fullWidth
              multiline
              minRows={2}
              helperText={`${descLen} chars${descLen > 160 ? " — search engines may truncate over ~160" : ""}`}
            />
            <TextField label="Canonical URL (optional)" value={form.canonicalUrl} onChange={(e) => setForm((f) => ({ ...f, canonicalUrl: e.target.value }))} fullWidth />

            <Divider textAlign="left">Open Graph (Facebook/LinkedIn)</Divider>
            <TextField label="OG title" value={form.ogTitle} onChange={(e) => setForm((f) => ({ ...f, ogTitle: e.target.value }))} fullWidth helperText="Defaults to meta title." />
            <TextField label="OG description" value={form.ogDescription} onChange={(e) => setForm((f) => ({ ...f, ogDescription: e.target.value }))} fullWidth multiline minRows={2} helperText="Defaults to meta description." />
            <TextField label="OG image URL" value={form.ogImage} onChange={(e) => setForm((f) => ({ ...f, ogImage: e.target.value }))} fullWidth placeholder="/images/og/about.jpg" />

            <Divider textAlign="left">Twitter / X</Divider>
            <TextField label="Twitter title" value={form.twitterTitle} onChange={(e) => setForm((f) => ({ ...f, twitterTitle: e.target.value }))} fullWidth />
            <TextField label="Twitter description" value={form.twitterDescription} onChange={(e) => setForm((f) => ({ ...f, twitterDescription: e.target.value }))} fullWidth multiline minRows={2} />
            <TextField label="Twitter image URL" value={form.twitterImage} onChange={(e) => setForm((f) => ({ ...f, twitterImage: e.target.value }))} fullWidth />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => void save()} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
