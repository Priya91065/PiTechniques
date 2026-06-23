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
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
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
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { useNotify } from "@/components/admin/NotificationProvider";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import type { MediaPermissions } from "@/types/media";

interface AdminService {
  id: string;
  slug: string;
  anchor: string;
  title: string;
  description: string;
  iconDark: string;
  iconLight: string;
  tags: string[];
  published: boolean;
  order: number;
}

type FormState = {
  title: string;
  slug: string;
  anchor: string;
  description: string;
  iconDark: string;
  iconLight: string;
  tags: string;
  published: boolean;
};

const EMPTY: FormState = {
  title: "",
  slug: "",
  anchor: "",
  description: "",
  iconDark: "",
  iconLight: "",
  tags: "",
  published: true,
};

export default function ServicesManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();
  const [items, setItems] = useState<AdminService[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/services");
      const data: { items?: AdminService[]; error?: string } = await res.json().catch(() => ({}));
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

  function openEdit(s: AdminService): void {
    setEditingId(s.id);
    setForm({
      title: s.title,
      slug: s.slug,
      anchor: s.anchor,
      description: s.description,
      iconDark: s.iconDark,
      iconLight: s.iconLight,
      tags: s.tags.join(", "),
      published: s.published,
    });
    setDialogOpen(true);
  }

  async function save(): Promise<void> {
    if (!form.title.trim() || !form.slug.trim() || !form.anchor.trim() || !form.description.trim()) {
      notify("Title, slug, anchor and description are required", "warning");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        anchor: form.anchor,
        description: form.description,
        iconDark: form.iconDark || "/images/home-lottie/Tailored.png",
        iconLight: form.iconLight || "/images/services-lottie/Tailored.png",
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        published: form.published,
      };
      const url = editingId ? `/api/admin/services/${editingId}` : "/api/admin/services";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Save failed", "error");
        return;
      }
      notify(editingId ? "Service updated" : "Service created");
      setDialogOpen(false);
      await load();
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(s: AdminService): Promise<void> {
    try {
      const res = await fetch(`/api/admin/services/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !s.published }),
      });
      if (!res.ok) {
        notify("Update failed", "error");
        return;
      }
      setItems((prev) => prev.map((x) => (x.id === s.id ? { ...x, published: !x.published } : x)));
      notify(s.published ? "Unpublished" : "Published");
    } catch {
      notify("Network error", "error");
    }
  }

  async function remove(s: AdminService): Promise<void> {
    const ok = await confirm({
      title: "Delete service?",
      message: `"${s.title}" will be permanently removed.`,
      confirmText: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/services/${s.id}`, { method: "DELETE" });
      if (!res.ok) {
        notify("Delete failed", "error");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== s.id));
      notify("Service deleted");
    } catch {
      notify("Network error", "error");
    }
  }

  async function move(index: number, dir: -1 | 1): Promise<void> {
    const target = index + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setItems(next);
    try {
      const res = await fetch("/api/admin/services/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: next.map((x) => x.id) }),
      });
      if (!res.ok) {
        notify("Reorder failed", "error");
        void load();
      }
    } catch {
      notify("Network error", "error");
      void load();
    }
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={800}>
          Services
        </Typography>
        {perms.canCreate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            New service
          </Button>
        )}
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width={90}>Order</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell align="center">Published</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No services yet.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((s, i) => (
                  <TableRow key={s.id} hover>
                    <TableCell>
                      <IconButton size="small" disabled={i === 0 || !perms.canEdit} onClick={() => void move(i, -1)}>
                        <ArrowUpwardIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        size="small"
                        disabled={i === items.length - 1 || !perms.canEdit}
                        onClick={() => void move(i, 1)}
                      >
                        <ArrowDownwardIcon fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, maxWidth: 360 }}>{s.title}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{s.slug}</TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={s.published}
                        disabled={!perms.canEdit}
                        onChange={() => void togglePublished(s)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {perms.canEdit && (
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(s)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {perms.canDelete && (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => void remove(s)}>
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editingId ? "Edit service" : "New service"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              required
              fullWidth
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                required
                fullWidth
                helperText="Unique identifier"
              />
              <TextField
                label="Anchor"
                value={form.anchor}
                onChange={(e) => setForm((f) => ({ ...f, anchor: e.target.value }))}
                required
                fullWidth
                helperText="Used for /services#anchor links"
              />
            </Stack>
            <TextField
              label="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              multiline
              minRows={3}
              required
              fullWidth
              helperText="Use a blank line to separate paragraphs"
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Dark icon URL (home grid / detail)"
                value={form.iconDark}
                onChange={(e) => setForm((f) => ({ ...f, iconDark: e.target.value }))}
                fullWidth
              />
              <TextField
                label="Light icon URL (services grid)"
                value={form.iconLight}
                onChange={(e) => setForm((f) => ({ ...f, iconLight: e.target.value }))}
                fullWidth
              />
            </Stack>
            <TextField
              label="Tags (comma separated)"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
              fullWidth
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.published}
                  onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                />
              }
              label="Published"
            />
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
