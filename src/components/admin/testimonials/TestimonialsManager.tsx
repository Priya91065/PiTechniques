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

interface AdminTestimonial {
  id: string;
  quote: string;
  company: string;
  authorName: string;
  designation: string;
  photo: string | null;
  published: boolean;
  order: number;
}

type FormState = {
  quote: string;
  company: string;
  authorName: string;
  designation: string;
  photo: string;
  published: boolean;
};

const EMPTY_FORM: FormState = {
  quote: "",
  company: "",
  authorName: "",
  designation: "",
  photo: "",
  published: true,
};

export default function TestimonialsManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();

  const [items, setItems] = useState<AdminTestimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/testimonials");
      const data: { items?: AdminTestimonial[]; error?: string } = await res.json().catch(() => ({}));
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
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(t: AdminTestimonial): void {
    setEditingId(t.id);
    setForm({
      quote: t.quote,
      company: t.company,
      authorName: t.authorName,
      designation: t.designation,
      photo: t.photo ?? "",
      published: t.published,
    });
    setDialogOpen(true);
  }

  async function save(): Promise<void> {
    if (!form.quote.trim() || !form.company.trim() || !form.authorName.trim() || !form.designation.trim()) {
      notify("Please fill in all required fields", "warning");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/testimonials/${editingId}` : "/api/admin/testimonials";
      const method = editingId ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, photo: form.photo || null }),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Save failed", "error");
        return;
      }
      notify(editingId ? "Testimonial updated" : "Testimonial created");
      setDialogOpen(false);
      await load();
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(t: AdminTestimonial): Promise<void> {
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !t.published }),
      });
      if (!res.ok) {
        notify("Update failed", "error");
        return;
      }
      setItems((prev) => prev.map((x) => (x.id === t.id ? { ...x, published: !x.published } : x)));
      notify(t.published ? "Unpublished" : "Published");
    } catch {
      notify("Network error", "error");
    }
  }

  async function remove(t: AdminTestimonial): Promise<void> {
    const ok = await confirm({
      title: "Delete testimonial?",
      message: `The testimonial for "${t.company}" will be permanently removed.`,
      confirmText: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${t.id}`, { method: "DELETE" });
      if (!res.ok) {
        notify("Delete failed", "error");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== t.id));
      notify("Testimonial deleted");
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
      const res = await fetch("/api/admin/testimonials/reorder", {
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
          Testimonials
        </Typography>
        {perms.canCreate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            New testimonial
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
                <TableCell>Company</TableCell>
                <TableCell>Author</TableCell>
                <TableCell>Designation</TableCell>
                <TableCell align="center">Published</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No testimonials yet.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((t, i) => (
                  <TableRow key={t.id} hover>
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
                    <TableCell sx={{ fontWeight: 600 }}>{t.company}</TableCell>
                    <TableCell>{t.authorName}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{t.designation}</TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={t.published}
                        disabled={!perms.canEdit}
                        onChange={() => void togglePublished(t)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {perms.canEdit && (
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(t)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {perms.canDelete && (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => void remove(t)}>
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
        <DialogTitle>{editingId ? "Edit testimonial" : "New testimonial"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Quote"
              value={form.quote}
              onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
              multiline
              minRows={4}
              required
              fullWidth
            />
            <TextField
              label="Company"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Author name"
              value={form.authorName}
              onChange={(e) => setForm((f) => ({ ...f, authorName: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Designation"
              value={form.designation}
              onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Photo URL (optional)"
              value={form.photo}
              onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))}
              placeholder="/uploads/…"
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
