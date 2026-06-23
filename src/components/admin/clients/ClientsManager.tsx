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

interface AdminClient {
  id: string;
  name: string;
  logo: string;
  width: number | null;
  height: number | null;
  published: boolean;
  order: number;
}

type FormState = { name: string; logo: string; width: string; height: string; published: boolean };
const EMPTY: FormState = { name: "", logo: "", width: "", height: "", published: true };

export default function ClientsManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();
  const [items, setItems] = useState<AdminClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/clients");
      const data: { items?: AdminClient[]; error?: string } = await res.json().catch(() => ({}));
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

  function openEdit(c: AdminClient): void {
    setEditingId(c.id);
    setForm({
      name: c.name,
      logo: c.logo,
      width: c.width?.toString() ?? "",
      height: c.height?.toString() ?? "",
      published: c.published,
    });
    setDialogOpen(true);
  }

  async function save(): Promise<void> {
    if (!form.name.trim() || !form.logo.trim()) {
      notify("Name and logo URL are required", "warning");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        logo: form.logo,
        width: form.width ? Number(form.width) : null,
        height: form.height ? Number(form.height) : null,
        published: form.published,
      };
      const url = editingId ? `/api/admin/clients/${editingId}` : "/api/admin/clients";
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
      notify(editingId ? "Client updated" : "Client created");
      setDialogOpen(false);
      await load();
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(c: AdminClient): Promise<void> {
    try {
      const res = await fetch(`/api/admin/clients/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !c.published }),
      });
      if (!res.ok) {
        notify("Update failed", "error");
        return;
      }
      setItems((prev) => prev.map((x) => (x.id === c.id ? { ...x, published: !x.published } : x)));
      notify(c.published ? "Unpublished" : "Published");
    } catch {
      notify("Network error", "error");
    }
  }

  async function remove(c: AdminClient): Promise<void> {
    const ok = await confirm({
      title: "Delete client?",
      message: `"${c.name}" will be permanently removed from the logo marquee.`,
      confirmText: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/clients/${c.id}`, { method: "DELETE" });
      if (!res.ok) {
        notify("Delete failed", "error");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== c.id));
      notify("Client deleted");
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
      const res = await fetch("/api/admin/clients/reorder", {
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
          Clients
        </Typography>
        {perms.canCreate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            New client
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
                <TableCell>Logo</TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="center">Published</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No clients yet.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((c, i) => (
                  <TableRow key={c.id} hover>
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
                    <TableCell>
                      <Box
                        sx={{
                          width: 96,
                          height: 44,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          bgcolor: "action.hover",
                          borderRadius: 1,
                          p: 0.5,
                        }}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={c.logo}
                          alt={c.name}
                          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={c.published}
                        disabled={!perms.canEdit}
                        onChange={() => void togglePublished(c)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      {perms.canEdit && (
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(c)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {perms.canDelete && (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => void remove(c)}>
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
        <DialogTitle>{editingId ? "Edit client" : "New client"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              fullWidth
            />
            <TextField
              label="Logo URL"
              value={form.logo}
              onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))}
              placeholder="/images/clients-logo/… or /uploads/…"
              required
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                label="Width (px)"
                value={form.width}
                onChange={(e) => setForm((f) => ({ ...f, width: e.target.value.replace(/[^0-9]/g, "") }))}
                fullWidth
              />
              <TextField
                label="Height (px)"
                value={form.height}
                onChange={(e) => setForm((f) => ({ ...f, height: e.target.value.replace(/[^0-9]/g, "") }))}
                fullWidth
              />
            </Stack>
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
