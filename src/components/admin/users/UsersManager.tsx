"use client";

import { useCallback, useEffect, useState, type JSX } from "react";
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
import { useNotify } from "@/components/admin/NotificationProvider";
import { useConfirm } from "@/components/admin/ConfirmProvider";

type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

interface FormState {
  email: string;
  name: string;
  role: Role;
  password: string;
  isActive: boolean;
}

const EMPTY: FormState = { email: "", name: "", role: "EDITOR", password: "", isActive: true };

const ROLE_LABEL: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editor",
};
const ROLE_COLOR: Record<Role, "error" | "primary" | "default"> = {
  SUPER_ADMIN: "error",
  ADMIN: "primary",
  EDITOR: "default",
};

function fmtDate(s: string | null): string {
  if (!s) return "Never";
  return new Date(s).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function UsersManager({ currentUserId }: { currentUserId: string }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data: { items?: AdminUser[]; error?: string } = await res.json().catch(() => ({}));
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

  function openEdit(u: AdminUser): void {
    setEditingId(u.id);
    setForm({ email: u.email, name: u.name, role: u.role, password: "", isActive: u.isActive });
    setDialogOpen(true);
  }

  async function save(): Promise<void> {
    if (!form.email.trim() || !form.name.trim()) {
      notify("Name and email are required", "warning");
      return;
    }
    if (!editingId && form.password.length < 8) {
      notify("Password must be at least 8 characters", "warning");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/users/${editingId}` : "/api/admin/users";
      // On edit, omit password when left blank (keeps the current one).
      const payload: Record<string, unknown> = {
        email: form.email,
        name: form.name,
        role: form.role,
        isActive: form.isActive,
      };
      if (form.password.length > 0) payload.password = form.password;
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
      notify(editingId ? "User updated" : "User created");
      setDialogOpen(false);
      await load();
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(u: AdminUser): Promise<void> {
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !u.isActive }),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Update failed", "error");
        return;
      }
      setItems((prev) => prev.map((x) => (x.id === u.id ? { ...x, isActive: !x.isActive } : x)));
      notify(u.isActive ? "User deactivated" : "User activated");
    } catch {
      notify("Network error", "error");
    }
  }

  async function remove(u: AdminUser): Promise<void> {
    const ok = await confirm({
      title: "Delete user?",
      message: `"${u.email}" will be permanently deleted. Their activity history is kept but unattributed.`,
      confirmText: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/users/${u.id}`, { method: "DELETE" });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Delete failed", "error");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== u.id));
      notify("User deleted");
    } catch {
      notify("Network error", "error");
    }
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={800}>
          Users
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          New User
        </Button>
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell>Last login</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((u) => {
                const isSelf = u.id === currentUserId;
                return (
                  <TableRow key={u.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {u.name}
                      {isSelf && <Chip label="You" size="small" sx={{ ml: 1 }} />}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{u.email}</TableCell>
                    <TableCell>
                      <Chip label={ROLE_LABEL[u.role]} size="small" color={ROLE_COLOR[u.role]} />
                    </TableCell>
                    <TableCell align="center">
                      <Switch checked={u.isActive} disabled={isSelf} onChange={() => void toggleActive(u)} size="small" />
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{fmtDate(u.lastLoginAt)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(u)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={isSelf ? "You can't delete yourself" : "Delete"}>
                        <span>
                          <IconButton size="small" color="error" disabled={isSelf} onClick={() => void remove(u)}>
                            <DeleteOutlineOutlinedIcon fontSize="small" />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit user" : "New user"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required fullWidth />
            <TextField label="Email" type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} required fullWidth />
            <TextField
              select
              label="Role"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as Role }))}
              fullWidth
            >
              <MenuItem value="EDITOR">Editor — create & edit content</MenuItem>
              <MenuItem value="ADMIN">Admin — full content control</MenuItem>
              <MenuItem value="SUPER_ADMIN">Super Admin — manage users too</MenuItem>
            </TextField>
            <TextField
              label={editingId ? "New password (leave blank to keep)" : "Password"}
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required={!editingId}
              fullWidth
              autoComplete="new-password"
              helperText="At least 8 characters."
            />
            <FormControlLabel
              control={<Switch checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} />}
              label="Active (can sign in)"
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
