"use client";

import { useCallback, useEffect, useRef, useState, type JSX } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import { useNotify } from "@/components/admin/NotificationProvider";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import type { MediaPermissions } from "@/types/media";

interface BannerForm {
  heroTitle: string;
  heroSubtitle: string;
  heroCtaLabel: string;
  heroCtaHref: string;
  heroCtaNewTab: boolean;
  bannerImage: string;
  bannerVideo: string;
  bannerAlt: string;
  bannerImageTitle: string;
  showBanner: boolean;
  showStats: boolean;
}

interface Counter {
  id: string;
  value: number;
  label: string;
  suffix: string;
  published: boolean;
  order: number;
}

const EMPTY: BannerForm = {
  heroTitle: "",
  heroSubtitle: "",
  heroCtaLabel: "",
  heroCtaHref: "",
  heroCtaNewTab: false,
  bannerImage: "",
  bannerVideo: "",
  bannerAlt: "",
  bannerImageTitle: "",
  showBanner: true,
  showStats: true,
};

export default function BannerManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<BannerForm>(EMPTY);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Counter dialog
  const [cDialogOpen, setCDialogOpen] = useState(false);
  const [cEditingId, setCEditingId] = useState<string | null>(null);
  const [cForm, setCForm] = useState<{ value: string; label: string; suffix: string }>({ value: "", label: "", suffix: "+" });
  const [cSaving, setCSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const [bRes, cRes] = await Promise.all([fetch("/api/admin/banner"), fetch("/api/admin/banner/counters")]);
      const bData: { item?: Partial<BannerForm> | null; error?: string } = await bRes.json().catch(() => ({}));
      const cData: { items?: Counter[] } = await cRes.json().catch(() => ({}));
      if (!bRes.ok) {
        notify(bData.error ?? "Failed to load", "error");
        return;
      }
      if (bData.item) {
        setForm({
          heroTitle: bData.item.heroTitle ?? "",
          heroSubtitle: bData.item.heroSubtitle ?? "",
          heroCtaLabel: bData.item.heroCtaLabel ?? "",
          heroCtaHref: bData.item.heroCtaHref ?? "",
          heroCtaNewTab: bData.item.heroCtaNewTab ?? false,
          bannerImage: bData.item.bannerImage ?? "",
          bannerVideo: bData.item.bannerVideo ?? "",
          bannerAlt: bData.item.bannerAlt ?? "",
          bannerImageTitle: bData.item.bannerImageTitle ?? "",
          showBanner: bData.item.showBanner ?? true,
          showStats: bData.item.showStats ?? true,
        });
      }
      setCounters((cData.items ?? []).slice().sort((a, b) => a.order - b.order));
    } catch {
      notify("Network error", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void load();
  }, [load]);

  async function saveBanner(): Promise<void> {
    if (!form.heroTitle.trim()) {
      notify("Heading is required", "warning");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/banner", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Save failed", "error");
        return;
      }
      notify("Banner saved");
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function onUpload(file: File): Promise<void> {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("files", file);
      const res = await fetch("/api/admin/media", { method: "POST", body: fd });
      const data: { items?: { url: string }[]; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.items?.[0]) {
        notify(data.error ?? "Upload failed", "error");
        return;
      }
      setForm((f) => ({ ...f, bannerImage: data.items![0].url }));
      notify("Image uploaded");
    } catch {
      notify("Network error", "error");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  // ---- Counters ----
  function openCreateCounter(): void {
    setCEditingId(null);
    setCForm({ value: "", label: "", suffix: "+" });
    setCDialogOpen(true);
  }
  function openEditCounter(c: Counter): void {
    setCEditingId(c.id);
    setCForm({ value: String(c.value), label: c.label, suffix: c.suffix });
    setCDialogOpen(true);
  }

  async function saveCounter(): Promise<void> {
    if (!cForm.label.trim() || cForm.value.trim() === "") {
      notify("Value and label are required", "warning");
      return;
    }
    setCSaving(true);
    try {
      const url = cEditingId ? `/api/admin/banner/counters/${cEditingId}` : "/api/admin/banner/counters";
      const res = await fetch(url, {
        method: cEditingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value: Number(cForm.value), label: cForm.label, suffix: cForm.suffix }),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Save failed", "error");
        return;
      }
      notify(cEditingId ? "Counter updated" : "Counter added");
      setCDialogOpen(false);
      await load();
    } catch {
      notify("Network error", "error");
    } finally {
      setCSaving(false);
    }
  }

  async function toggleCounter(c: Counter): Promise<void> {
    try {
      const res = await fetch(`/api/admin/banner/counters/${c.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !c.published }),
      });
      if (!res.ok) {
        notify("Update failed", "error");
        return;
      }
      setCounters((prev) => prev.map((x) => (x.id === c.id ? { ...x, published: !x.published } : x)));
    } catch {
      notify("Network error", "error");
    }
  }

  async function removeCounter(c: Counter): Promise<void> {
    const ok = await confirm({ title: "Delete counter?", message: `"${c.label}" will be removed.`, confirmText: "Delete", destructive: true });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/banner/counters/${c.id}`, { method: "DELETE" });
      if (!res.ok) {
        notify("Delete failed", "error");
        return;
      }
      setCounters((prev) => prev.filter((x) => x.id !== c.id));
      notify("Counter deleted");
    } catch {
      notify("Network error", "error");
    }
  }

  async function moveCounter(index: number, dir: -1 | 1): Promise<void> {
    const target = index + dir;
    if (target < 0 || target >= counters.length) return;
    const reordered = [...counters];
    const [m] = reordered.splice(index, 1);
    reordered.splice(target, 0, m);
    setCounters(reordered);
    try {
      const res = await fetch("/api/admin/banner/counters/reorder", {
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

  const heroLines = form.heroTitle.split("\n");
  const visibleCounters = counters.filter((c) => c.published);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
        Banner / Hero
      </Typography>

      <Box sx={{ display: "grid", gap: 3, gridTemplateColumns: { xs: "1fr", lg: "1.4fr 1fr" }, alignItems: "start" }}>
        {/* ---- Left: forms ---- */}
        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>
                Content
              </Typography>
              <Stack direction="row" spacing={2}>
                <FormControlLabel control={<Switch checked={form.showBanner} disabled={!perms.canEdit} onChange={(e) => setForm((f) => ({ ...f, showBanner: e.target.checked }))} />} label="Show banner" />
                <FormControlLabel control={<Switch checked={form.showStats} disabled={!perms.canEdit} onChange={(e) => setForm((f) => ({ ...f, showStats: e.target.checked }))} />} label="Show stats" />
              </Stack>
            </Stack>
            <Stack spacing={2}>
              <TextField label="Main heading" value={form.heroTitle} onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))} fullWidth multiline minRows={3} required disabled={!perms.canEdit} helperText="One line per row — each row becomes a line break in the hero." />
              <TextField label="Sub heading / description" value={form.heroSubtitle} onChange={(e) => setForm((f) => ({ ...f, heroSubtitle: e.target.value }))} fullWidth multiline minRows={2} disabled={!perms.canEdit} />
              <Divider textAlign="left">CTA button</Divider>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="Button text" value={form.heroCtaLabel} onChange={(e) => setForm((f) => ({ ...f, heroCtaLabel: e.target.value }))} fullWidth disabled={!perms.canEdit} />
                <TextField label="Button URL" value={form.heroCtaHref} onChange={(e) => setForm((f) => ({ ...f, heroCtaHref: e.target.value }))} fullWidth disabled={!perms.canEdit} />
              </Stack>
              <FormControlLabel control={<Switch checked={form.heroCtaNewTab} disabled={!perms.canEdit} onChange={(e) => setForm((f) => ({ ...f, heroCtaNewTab: e.target.checked }))} />} label="Open in new tab" />

              <Divider textAlign="left">Background media (optional)</Divider>
              <Typography variant="caption" color="text.secondary">
                The hero uses its animated canvas by default. Set an image/video only to override it.
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                {form.bannerImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.bannerImage} alt="" style={{ width: 96, height: 60, objectFit: "cover", borderRadius: 6 }} />
                ) : (
                  <Box sx={{ width: 96, height: 60, borderRadius: 1, bgcolor: "action.hover", display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary", fontSize: 12 }}>None</Box>
                )}
                {perms.canEdit && (
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined" startIcon={<UploadOutlinedIcon />} onClick={() => fileRef.current?.click()} disabled={uploading}>
                      {uploading ? "Uploading…" : form.bannerImage ? "Replace" : "Upload image"}
                    </Button>
                    {form.bannerImage && (
                      <Button size="small" color="error" onClick={() => setForm((f) => ({ ...f, bannerImage: "" }))}>
                        Remove
                      </Button>
                    )}
                  </Stack>
                )}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) void onUpload(file);
                  }}
                />
              </Stack>
              <TextField label="Background video URL (optional)" value={form.bannerVideo} onChange={(e) => setForm((f) => ({ ...f, bannerVideo: e.target.value }))} fullWidth disabled={!perms.canEdit} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="Image alt text (SEO)" value={form.bannerAlt} onChange={(e) => setForm((f) => ({ ...f, bannerAlt: e.target.value }))} fullWidth disabled={!perms.canEdit} />
                <TextField label="Image title (SEO)" value={form.bannerImageTitle} onChange={(e) => setForm((f) => ({ ...f, bannerImageTitle: e.target.value }))} fullWidth disabled={!perms.canEdit} />
              </Stack>

              {perms.canEdit && (
                <Box>
                  <Button variant="contained" onClick={() => void saveBanner()} disabled={saving}>
                    {saving ? "Saving…" : "Save banner"}
                  </Button>
                </Box>
              )}
            </Stack>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
              <Typography variant="h6" fontWeight={700}>
                Statistics / counters
              </Typography>
              {perms.canCreate && (
                <Button size="small" startIcon={<AddIcon />} onClick={openCreateCounter}>
                  Add counter
                </Button>
              )}
            </Stack>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width={80}>Order</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Label</TableCell>
                    <TableCell align="center">Visible</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {counters.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 2, color: "text.secondary" }}>
                        No counters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    counters.map((c, i) => (
                      <TableRow key={c.id} hover>
                        <TableCell>
                          <IconButton size="small" disabled={!perms.canEdit || i === 0} onClick={() => void moveCounter(i, -1)}>
                            <ArrowUpwardIcon fontSize="inherit" />
                          </IconButton>
                          <IconButton size="small" disabled={!perms.canEdit || i === counters.length - 1} onClick={() => void moveCounter(i, 1)}>
                            <ArrowDownwardIcon fontSize="inherit" />
                          </IconButton>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>
                          {c.value}
                          {c.suffix}
                        </TableCell>
                        <TableCell>{c.label}</TableCell>
                        <TableCell align="center">
                          <Switch size="small" checked={c.published} disabled={!perms.canEdit} onChange={() => void toggleCounter(c)} />
                        </TableCell>
                        <TableCell align="right">
                          {perms.canEdit && (
                            <Tooltip title="Edit">
                              <IconButton size="small" onClick={() => openEditCounter(c)}>
                                <EditOutlinedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          {perms.canDelete && (
                            <Tooltip title="Delete">
                              <IconButton size="small" color="error" onClick={() => void removeCounter(c)}>
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
          </Paper>
        </Stack>

        {/* ---- Right: live preview ---- */}
        <Paper sx={{ p: 0, overflow: "hidden", position: { lg: "sticky" }, top: { lg: 16 } }}>
          <Box sx={{ px: 2, py: 1, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="subtitle2" fontWeight={700}>
              Live preview
            </Typography>
          </Box>
          {form.showBanner ? (
            <Box
              sx={{
                bgcolor: "#0b0b0b",
                color: "#fff",
                p: 3,
                minHeight: 260,
                backgroundImage: form.bannerImage ? `url(${form.bannerImage})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <Typography component="h2" sx={{ fontSize: 26, fontWeight: 800, lineHeight: 1.15 }}>
                {heroLines.map((line, i) => (
                  <span key={i}>
                    {line}
                    {i < heroLines.length - 1 ? <br /> : null}
                  </span>
                ))}
              </Typography>
              {form.heroSubtitle && (
                <Typography sx={{ mt: 1.5, opacity: 0.8 }}>{form.heroSubtitle}</Typography>
              )}
              {form.heroCtaLabel && (
                <Box sx={{ mt: 2, display: "inline-flex", alignItems: "center", gap: 1, px: 2, py: 1, border: "1px solid #fff", borderRadius: 999, fontSize: 14 }}>
                  {form.heroCtaLabel} →
                </Box>
              )}
              {form.showStats && visibleCounters.length > 0 && (
                <Stack direction="row" spacing={3} sx={{ mt: 4, flexWrap: "wrap" }}>
                  {visibleCounters.map((c) => (
                    <Box key={c.id}>
                      <Typography sx={{ fontSize: 28, fontWeight: 800 }}>
                        {c.value}
                        <span style={{ color: "#f60" }}>{c.suffix}</span>
                      </Typography>
                      <Typography sx={{ fontSize: 11, letterSpacing: 1, opacity: 0.7 }}>{c.label}</Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </Box>
          ) : (
            <Box sx={{ p: 3 }}>
              <Chip label="Banner hidden" />
            </Box>
          )}
        </Paper>
      </Box>

      <Dialog open={cDialogOpen} onClose={() => setCDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>{cEditingId ? "Edit counter" : "Add counter"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Value" type="number" value={cForm.value} onChange={(e) => setCForm((f) => ({ ...f, value: e.target.value }))} required fullWidth />
            <TextField label="Label" value={cForm.label} onChange={(e) => setCForm((f) => ({ ...f, label: e.target.value }))} required fullWidth placeholder="NUMBER OF CLIENTS" />
            <TextField label="Suffix" value={cForm.suffix} onChange={(e) => setCForm((f) => ({ ...f, suffix: e.target.value }))} fullWidth helperText='e.g. "+", "%", or leave blank' />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => void saveCounter()} disabled={cSaving}>
            {cSaving ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
