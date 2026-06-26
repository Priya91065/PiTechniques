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

interface AdminOfficeLocation {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  mapUrl: string | null;
  published: boolean;
  order: number;
}

type FormState = {
  name: string;
  address: string;
  phone: string;
  email: string;
  mapUrl: string;
  published: boolean;
};

const EMPTY: FormState = { name: "", address: "", phone: "", email: "", mapUrl: "", published: true };

export default function OfficeLocationsManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();
  const [items, setItems] = useState<AdminOfficeLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/office-locations");
      const data: { items?: AdminOfficeLocation[]; error?: string } = await res.json().catch(() => ({}));
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

  function openEdit(o: AdminOfficeLocation): void {
    setEditingId(o.id);
    setForm({ name: o.name, address: o.address, phone: o.phone ?? "", email: o.email ?? "", mapUrl: o.mapUrl ?? "", published: o.published });
    setDialogOpen(true);
  }

  async function save(): Promise<void> {
    if (!form.name.trim() || !form.address.trim()) {
      notify("Name and address are required", "warning");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        address: form.address,
        phone: form.phone || null,
        email: form.email || null,
        mapUrl: form.mapUrl || null,
        published: form.published,
      };
      const url = editingId ? `/api/admin/office-locations/${editingId}` : "/api/admin/office-locations";
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
      notify(editingId ? "Office location updated" : "Office location created");
      setDialogOpen(false);
      await load();
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(o: AdminOfficeLocation): Promise<void> {
    try {
      const res = await fetch(`/api/admin/office-locations/${o.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !o.published }),
      });
      if (!res.ok) {
        notify("Update failed", "error");
        return;
      }
      setItems((prev) => prev.map((x) => (x.id === o.id ? { ...x, published: !x.published } : x)));
      notify(o.published ? "Unpublished" : "Published");
    } catch {
      notify("Network error", "error");
    }
  }

  async function remove(o: AdminOfficeLocation): Promise<void> {
    const ok = await confirm({
      title: "Delete office location?",
      message: `"${o.name}" will be permanently removed.`,
      confirmText: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/office-locations/${o.id}`, { method: "DELETE" });
      if (!res.ok) {
        notify("Delete failed", "error");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== o.id));
      notify("Office location deleted");
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
      const res = await fetch("/api/admin/office-locations/reorder", {
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
    <Box sx={{ mb: 3 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h6" fontWeight={700}>
          Office locations
        </Typography>
        {perms.canCreate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            New office location
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
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell align="center">Published</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No office locations yet.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((o, i) => (
                  <TableRow key={o.id} hover>
                    <TableCell>
                      <IconButton size="small" disabled={i === 0 || !perms.canEdit} onClick={() => void move(i, -1)}>
                        <ArrowUpwardIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton size="small" disabled={i === items.length - 1 || !perms.canEdit} onClick={() => void move(i, 1)}>
                        <ArrowDownwardIcon fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{o.name}</TableCell>
                    <TableCell sx={{ color: "text.secondary", maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis" }}>{o.address}</TableCell>
                    <TableCell align="center">
                      <Switch checked={o.published} disabled={!perms.canEdit} onChange={() => void togglePublished(o)} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      {perms.canEdit && (
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(o)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {perms.canDelete && (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => void remove(o)}>
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
        <DialogTitle>{editingId ? "Edit office location" : "New office location"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required fullWidth placeholder="Nariman Point" />
            <TextField
              label="Address"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              required
              fullWidth
              multiline
              minRows={2}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} fullWidth />
              <TextField label="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} fullWidth />
            </Stack>
            <TextField label="Map URL (directions link)" value={form.mapUrl} onChange={(e) => setForm((f) => ({ ...f, mapUrl: e.target.value }))} fullWidth />
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
