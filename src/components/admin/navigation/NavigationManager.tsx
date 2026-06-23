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
  MenuItem,
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

type NavLocation = "HEADER" | "FOOTER";

interface AdminNavItem {
  id: string;
  label: string;
  href: string;
  location: NavLocation;
  published: boolean;
  order: number;
}

type FormState = { label: string; href: string; location: NavLocation; published: boolean };
const EMPTY: FormState = { label: "", href: "", location: "HEADER", published: true };

export default function NavigationManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();
  const [items, setItems] = useState<AdminNavItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/navigation");
      const data: { items?: AdminNavItem[]; error?: string } = await res.json().catch(() => ({}));
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

  function openCreate(location: NavLocation): void {
    setEditingId(null);
    setForm({ ...EMPTY, location });
    setDialogOpen(true);
  }

  function openEdit(n: AdminNavItem): void {
    setEditingId(n.id);
    setForm({ label: n.label, href: n.href, location: n.location, published: n.published });
    setDialogOpen(true);
  }

  async function save(): Promise<void> {
    if (!form.label.trim() || !form.href.trim()) {
      notify("Label and link are required", "warning");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/navigation/${editingId}` : "/api/admin/navigation";
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
      notify(editingId ? "Nav item updated" : "Nav item created");
      setDialogOpen(false);
      await load();
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(n: AdminNavItem): Promise<void> {
    try {
      const res = await fetch(`/api/admin/navigation/${n.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !n.published }),
      });
      if (!res.ok) {
        notify("Update failed", "error");
        return;
      }
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, published: !x.published } : x)));
      notify(n.published ? "Hidden" : "Shown");
    } catch {
      notify("Network error", "error");
    }
  }

  async function remove(n: AdminNavItem): Promise<void> {
    const ok = await confirm({
      title: "Delete nav item?",
      message: `"${n.label}" will be removed from the ${n.location.toLowerCase()} navigation.`,
      confirmText: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/navigation/${n.id}`, { method: "DELETE" });
      if (!res.ok) {
        notify("Delete failed", "error");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== n.id));
      notify("Nav item deleted");
    } catch {
      notify("Network error", "error");
    }
  }

  async function move(location: NavLocation, index: number, dir: -1 | 1): Promise<void> {
    const group = items.filter((x) => x.location === location);
    const target = index + dir;
    if (target < 0 || target >= group.length) return;
    const reordered = [...group];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);
    // optimistic: rebuild full list with the reordered group
    setItems((prev) => [...prev.filter((x) => x.location !== location), ...reordered]);
    try {
      const res = await fetch("/api/admin/navigation/reorder", {
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

  function groupTable(location: NavLocation): JSX.Element {
    const group = items.filter((x) => x.location === location).sort((a, b) => a.order - b.order);
    return (
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            {location === "HEADER" ? "Header navigation" : "Footer navigation"}
          </Typography>
          {perms.canCreate && (
            <Button size="small" startIcon={<AddIcon />} onClick={() => openCreate(location)}>
              Add item
            </Button>
          )}
        </Stack>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width={90}>Order</TableCell>
                <TableCell>Label</TableCell>
                <TableCell>Link</TableCell>
                <TableCell align="center">Visible</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {group.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No items.
                  </TableCell>
                </TableRow>
              ) : (
                group.map((n, i) => (
                  <TableRow key={n.id} hover>
                    <TableCell>
                      <IconButton size="small" disabled={i === 0 || !perms.canEdit} onClick={() => void move(location, i, -1)}>
                        <ArrowUpwardIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        size="small"
                        disabled={i === group.length - 1 || !perms.canEdit}
                        onClick={() => void move(location, i, 1)}
                      >
                        <ArrowDownwardIcon fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{n.label}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{n.href}</TableCell>
                    <TableCell align="center">
                      <Switch checked={n.published} disabled={!perms.canEdit} onChange={() => void togglePublished(n)} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      {perms.canEdit && (
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(n)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {perms.canDelete && (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => void remove(n)}>
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
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
        Navigation
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {groupTable("HEADER")}
          {groupTable("FOOTER")}
        </>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit nav item" : "New nav item"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Label" value={form.label} onChange={(e) => setForm((f) => ({ ...f, label: e.target.value }))} required fullWidth />
            <TextField label="Link (href)" value={form.href} onChange={(e) => setForm((f) => ({ ...f, href: e.target.value }))} placeholder="/about" required fullWidth />
            <TextField
              select
              label="Location"
              value={form.location}
              onChange={(e) => setForm((f) => ({ ...f, location: e.target.value as NavLocation }))}
              fullWidth
            >
              <MenuItem value="HEADER">Header</MenuItem>
              <MenuItem value="FOOTER">Footer</MenuItem>
            </TextField>
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
