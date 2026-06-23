"use client";

import { useCallback, useEffect, useState, type JSX } from "react";
import {
  Avatar,
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

type Group = "leadership" | "executive";
type ColSpan = 4 | 6 | 12;

interface AdminTeamMember {
  id: string;
  name: string;
  role: string;
  photo: string | null;
  photoMobile: string | null;
  colSpan: number;
  cardMb0: boolean;
  linkedin: string | null;
  group: string;
  published: boolean;
  order: number;
}

interface FormState {
  name: string;
  role: string;
  photo: string;
  photoMobile: string;
  colSpan: ColSpan;
  cardMb0: boolean;
  linkedin: string;
  group: Group;
  published: boolean;
}

const EMPTY: FormState = {
  name: "",
  role: "",
  photo: "",
  photoMobile: "",
  colSpan: 4,
  cardMb0: false,
  linkedin: "",
  group: "leadership",
  published: true,
};

export default function TeamManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();
  const [items, setItems] = useState<AdminTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/team");
      const data: { items?: AdminTeamMember[]; error?: string } = await res.json().catch(() => ({}));
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

  function openCreate(group: Group): void {
    setEditingId(null);
    setForm({ ...EMPTY, group });
    setDialogOpen(true);
  }

  function openEdit(m: AdminTeamMember): void {
    setEditingId(m.id);
    setForm({
      name: m.name,
      role: m.role,
      photo: m.photo ?? "",
      photoMobile: m.photoMobile ?? "",
      colSpan: (m.colSpan === 6 || m.colSpan === 12 ? m.colSpan : 4) as ColSpan,
      cardMb0: m.cardMb0,
      linkedin: m.linkedin ?? "",
      group: (m.group === "executive" ? "executive" : "leadership") as Group,
      published: m.published,
    });
    setDialogOpen(true);
  }

  async function save(): Promise<void> {
    if (!form.name.trim() || !form.role.trim() || !form.photo.trim()) {
      notify("Name, role and photo are required", "warning");
      return;
    }
    setSaving(true);
    try {
      const url = editingId ? `/api/admin/team/${editingId}` : "/api/admin/team";
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
      notify(editingId ? "Team member updated" : "Team member created");
      setDialogOpen(false);
      await load();
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(m: AdminTeamMember): Promise<void> {
    try {
      const res = await fetch(`/api/admin/team/${m.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !m.published }),
      });
      if (!res.ok) {
        notify("Update failed", "error");
        return;
      }
      setItems((prev) => prev.map((x) => (x.id === m.id ? { ...x, published: !x.published } : x)));
      notify(m.published ? "Hidden" : "Shown");
    } catch {
      notify("Network error", "error");
    }
  }

  async function remove(m: AdminTeamMember): Promise<void> {
    const ok = await confirm({
      title: "Delete team member?",
      message: `"${m.name}" will be removed from the team grid.`,
      confirmText: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/team/${m.id}`, { method: "DELETE" });
      if (!res.ok) {
        notify("Delete failed", "error");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== m.id));
      notify("Team member deleted");
    } catch {
      notify("Network error", "error");
    }
  }

  async function move(group: string, index: number, dir: -1 | 1): Promise<void> {
    const inGroup = items.filter((x) => x.group === group).sort((a, b) => a.order - b.order);
    const target = index + dir;
    if (target < 0 || target >= inGroup.length) return;
    const reordered = [...inGroup];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);
    setItems((prev) => [...prev.filter((x) => x.group !== group), ...reordered]);
    try {
      const res = await fetch("/api/admin/team/reorder", {
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

  function groupTable(group: Group, heading: string): JSX.Element {
    const rows = items.filter((x) => x.group === group).sort((a, b) => a.order - b.order);
    return (
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" fontWeight={700}>
            {heading}
          </Typography>
          {perms.canCreate && (
            <Button size="small" startIcon={<AddIcon />} onClick={() => openCreate(group)}>
              Add member
            </Button>
          )}
        </Stack>
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width={90}>Order</TableCell>
                <TableCell>Member</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="center">Width</TableCell>
                <TableCell align="center">Visible</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No members.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((m, i) => (
                  <TableRow key={m.id} hover>
                    <TableCell>
                      <IconButton size="small" disabled={i === 0 || !perms.canEdit} onClick={() => void move(group, i, -1)}>
                        <ArrowUpwardIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton
                        size="small"
                        disabled={i === rows.length - 1 || !perms.canEdit}
                        onClick={() => void move(group, i, 1)}
                      >
                        <ArrowDownwardIcon fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={m.photo ?? undefined} alt={m.name} variant="rounded" sx={{ width: 40, height: 40 }} />
                        <span style={{ fontWeight: 600 }}>{m.name}</span>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{m.role}</TableCell>
                    <TableCell align="center">{m.colSpan === 12 ? "Full" : m.colSpan === 6 ? "Half" : "Std"}</TableCell>
                    <TableCell align="center">
                      <Switch checked={m.published} disabled={!perms.canEdit} onChange={() => void togglePublished(m)} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      {perms.canEdit && (
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(m)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {perms.canDelete && (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => void remove(m)}>
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
        Team Members
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {groupTable("leadership", "Leadership")}
          {groupTable("executive", "Executive Team")}
        </>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit team member" : "New team member"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required fullWidth />
            <TextField label="Role" value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} required fullWidth />
            <TextField
              label="Photo URL"
              value={form.photo}
              onChange={(e) => setForm((f) => ({ ...f, photo: e.target.value }))}
              placeholder="/images/about/team-members/name.jpg"
              required
              fullWidth
            />
            <TextField
              label="Mobile photo URL (optional)"
              value={form.photoMobile}
              onChange={(e) => setForm((f) => ({ ...f, photoMobile: e.target.value }))}
              helperText="Set only for group photos that swap on mobile."
              fullWidth
            />
            <TextField
              label="LinkedIn URL (optional)"
              value={form.linkedin}
              onChange={(e) => setForm((f) => ({ ...f, linkedin: e.target.value }))}
              fullWidth
            />
            <Stack direction="row" spacing={2}>
              <TextField
                select
                label="Group"
                value={form.group}
                onChange={(e) => setForm((f) => ({ ...f, group: e.target.value as Group }))}
                fullWidth
              >
                <MenuItem value="leadership">Leadership</MenuItem>
                <MenuItem value="executive">Executive Team</MenuItem>
              </TextField>
              <TextField
                select
                label="Card width"
                value={form.colSpan}
                onChange={(e) => setForm((f) => ({ ...f, colSpan: Number(e.target.value) as ColSpan }))}
                fullWidth
              >
                <MenuItem value={4}>Standard</MenuItem>
                <MenuItem value={6}>Half</MenuItem>
                <MenuItem value={12}>Full</MenuItem>
              </TextField>
            </Stack>
            <Stack direction="row" spacing={3}>
              <FormControlLabel
                control={<Switch checked={form.cardMb0} onChange={(e) => setForm((f) => ({ ...f, cardMb0: e.target.checked }))} />}
                label="No bottom margin"
              />
              <FormControlLabel
                control={<Switch checked={form.published} onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))} />}
                label="Visible"
              />
            </Stack>
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
