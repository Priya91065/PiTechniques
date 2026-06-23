"use client";

import { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import {
  Box,
  Button,
  Chip,
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

interface AdminFaq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  published: boolean;
  order: number;
}

interface FormState {
  question: string;
  answer: string;
  category: string;
  published: boolean;
}

const EMPTY: FormState = { question: "", answer: "", category: "", published: true };

export default function FaqManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();
  const [items, setItems] = useState<AdminFaq[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/faqs");
      const data: { items?: AdminFaq[]; error?: string } = await res.json().catch(() => ({}));
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

  const ordered = useMemo(() => [...items].sort((a, b) => a.order - b.order), [items]);
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return ordered;
    return ordered.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        (f.category ?? "").toLowerCase().includes(q),
    );
  }, [ordered, search]);

  function openCreate(): void {
    setEditingId(null);
    setForm(EMPTY);
    setDialogOpen(true);
  }

  function openEdit(f: AdminFaq): void {
    setEditingId(f.id);
    setForm({ question: f.question, answer: f.answer, category: f.category ?? "", published: f.published });
    setDialogOpen(true);
  }

  async function save(): Promise<void> {
    if (!form.question.trim() || !form.answer.trim()) {
      notify("Question and answer are required", "warning");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/faqs/${editingId}` : "/api/admin/faqs";
      const res = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Save failed", "error");
        return;
      }
      notify(editingId ? "FAQ updated" : "FAQ created");
      setDialogOpen(false);
      await load();
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(f: AdminFaq): Promise<void> {
    try {
      const res = await fetch(`/api/admin/faqs/${f.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !f.published }),
      });
      if (!res.ok) {
        notify("Update failed", "error");
        return;
      }
      setItems((prev) => prev.map((x) => (x.id === f.id ? { ...x, published: !x.published } : x)));
      notify(f.published ? "Hidden" : "Shown");
    } catch {
      notify("Network error", "error");
    }
  }

  async function remove(f: AdminFaq): Promise<void> {
    const ok = await confirm({
      title: "Delete FAQ?",
      message: `"${f.question}" will be permanently deleted.`,
      confirmText: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/faqs/${f.id}`, { method: "DELETE" });
      if (!res.ok) {
        notify("Delete failed", "error");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== f.id));
      notify("FAQ deleted");
    } catch {
      notify("Network error", "error");
    }
  }

  // Reorder operates on the full ordered list (disabled while a search filter is active).
  async function move(index: number, dir: -1 | 1): Promise<void> {
    const target = index + dir;
    if (target < 0 || target >= ordered.length) return;
    const reordered = [...ordered];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);
    setItems(reordered);
    try {
      const res = await fetch("/api/admin/faqs/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((x) => x.id) }),
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

  const canReorder = perms.canEdit && search.trim() === "";

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={800}>
          FAQs
        </Typography>
        {perms.canCreate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            New FAQ
          </Button>
        )}
      </Stack>

      <TextField
        size="small"
        placeholder="Search questions, answers, categories…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, width: { xs: "100%", sm: 360 } }}
      />

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width={90}>Order</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="center">Visible</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    {search ? "No matching FAQs." : "No FAQs yet."}
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((f) => {
                  const idx = ordered.findIndex((x) => x.id === f.id);
                  return (
                    <TableRow key={f.id} hover>
                      <TableCell>
                        <IconButton size="small" disabled={!canReorder || idx === 0} onClick={() => void move(idx, -1)}>
                          <ArrowUpwardIcon fontSize="inherit" />
                        </IconButton>
                        <IconButton
                          size="small"
                          disabled={!canReorder || idx === ordered.length - 1}
                          onClick={() => void move(idx, 1)}
                        >
                          <ArrowDownwardIcon fontSize="inherit" />
                        </IconButton>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, maxWidth: 480 }}>{f.question}</TableCell>
                      <TableCell>{f.category ? <Chip label={f.category} size="small" /> : "—"}</TableCell>
                      <TableCell align="center">
                        <Switch checked={f.published} disabled={!perms.canEdit} onChange={() => void togglePublished(f)} size="small" />
                      </TableCell>
                      <TableCell align="right">
                        {perms.canEdit && (
                          <Tooltip title="Edit">
                            <IconButton size="small" onClick={() => openEdit(f)}>
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                        {perms.canDelete && (
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => void remove(f)}>
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit FAQ" : "New FAQ"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Question" value={form.question} onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))} required fullWidth />
            <TextField
              label="Answer"
              value={form.answer}
              onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
              required
              fullWidth
              multiline
              minRows={4}
            />
            <TextField
              label="Category (optional)"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              fullWidth
            />
            <FormControlLabel
              control={<Switch checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />}
              label="Visible"
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
