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
import SeoFieldsSection, { EMPTY_SEO_FIELDS, type SeoFieldsValue } from "@/components/admin/shared/SeoFieldsSection";

interface Solution {
  title: string;
  subTitle: string;
  items: string[];
}
interface Feature {
  image: string;
  feature: string;
}
interface Impact {
  image: string;
  title: string;
  subTitle: string;
}
interface AdminCaseStudy {
  id: string;
  slug: string;
  name: string;
  title: string;
  shortDesc: string;
  tags: string[];
  heroImage: string;
  logo: string;
  cardImage: string;
  cardImageMobile: string;
  cardClient: string;
  listImage: string;
  listHeading: string;
  industry: string;
  headquarters: string;
  website: string | null;
  challengeShortInfo: string;
  challengeLists: string[];
  challengeBackground: string;
  solutionDetails: string;
  longTermImpactTitle: string;
  featureGridVariant: string;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  twitterImage: string | null;
  robotsMeta: string | null;
  published: boolean;
  order: number;
  solutions: Solution[];
  features: Feature[];
  impacts: Impact[];
}

interface FormState {
  name: string;
  slug: string;
  title: string;
  shortDesc: string;
  tags: string;
  heroImage: string;
  logo: string;
  cardImage: string;
  cardImageMobile: string;
  cardClient: string;
  listImage: string;
  listHeading: string;
  industry: string;
  headquarters: string;
  website: string;
  featureGridVariant: string;
  challengeShortInfo: string;
  challengeLists: string;
  challengeBackground: string;
  solutionDetails: string;
  longTermImpactTitle: string;
  seo: SeoFieldsValue;
  published: boolean;
  solutions: { title: string; subTitle: string; items: string }[];
  features: Feature[];
  impacts: Impact[];
}

const EMPTY: FormState = {
  name: "",
  slug: "",
  title: "",
  shortDesc: "",
  tags: "",
  heroImage: "",
  logo: "",
  cardImage: "",
  cardImageMobile: "",
  cardClient: "",
  listImage: "",
  listHeading: "",
  industry: "",
  headquarters: "",
  website: "",
  featureGridVariant: "",
  challengeShortInfo: "",
  challengeLists: "",
  challengeBackground: "",
  solutionDetails: "",
  longTermImpactTitle: "",
  seo: EMPTY_SEO_FIELDS,
  published: true,
  solutions: [],
  features: [],
  impacts: [],
};

const lines = (s: string): string[] => s.split("\n").map((x) => x.trim()).filter(Boolean);

export default function CaseStudiesManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();
  const [items, setItems] = useState<AdminCaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/case-studies");
      const data: { items?: AdminCaseStudy[]; error?: string } = await res.json().catch(() => ({}));
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

  function openEdit(c: AdminCaseStudy): void {
    setEditingId(c.id);
    setForm({
      name: c.name,
      slug: c.slug,
      title: c.title,
      shortDesc: c.shortDesc,
      tags: c.tags.join(", "),
      heroImage: c.heroImage,
      logo: c.logo,
      cardImage: c.cardImage,
      cardImageMobile: c.cardImageMobile,
      cardClient: c.cardClient,
      listImage: c.listImage,
      listHeading: c.listHeading,
      industry: c.industry,
      headquarters: c.headquarters,
      website: c.website ?? "",
      featureGridVariant: c.featureGridVariant,
      challengeShortInfo: c.challengeShortInfo,
      challengeLists: c.challengeLists.join("\n"),
      challengeBackground: c.challengeBackground,
      solutionDetails: c.solutionDetails,
      longTermImpactTitle: c.longTermImpactTitle,
      seo: {
        seoTitle: c.seoTitle ?? "",
        seoDescription: c.seoDescription ?? "",
        seoKeywords: c.seoKeywords ?? "",
        canonicalUrl: c.canonicalUrl ?? "",
        ogImage: c.ogImage ?? "",
        twitterImage: c.twitterImage ?? "",
        robotsMeta: c.robotsMeta ?? "",
      },
      published: c.published,
      solutions: c.solutions.map((s) => ({ title: s.title, subTitle: s.subTitle, items: s.items.join("\n") })),
      features: c.features.map((f) => ({ image: f.image, feature: f.feature })),
      impacts: c.impacts.map((m) => ({ image: m.image, title: m.title, subTitle: m.subTitle })),
    });
    setDialogOpen(true);
  }

  async function save(): Promise<void> {
    if (!form.name.trim() || !form.slug.trim() || !form.title.trim() || !form.shortDesc.trim()) {
      notify("Name, slug, title and short description are required", "warning");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        title: form.title,
        shortDesc: form.shortDesc,
        tags: lines(form.tags.replace(/,/g, "\n")),
        heroImage: form.heroImage,
        logo: form.logo,
        cardImage: form.cardImage,
        cardImageMobile: form.cardImageMobile,
        cardClient: form.cardClient,
        listImage: form.listImage,
        listHeading: form.listHeading,
        industry: form.industry,
        headquarters: form.headquarters,
        website: form.website || null,
        featureGridVariant: form.featureGridVariant,
        challengeShortInfo: form.challengeShortInfo,
        challengeLists: lines(form.challengeLists),
        challengeBackground: form.challengeBackground,
        solutionDetails: form.solutionDetails,
        longTermImpactTitle: form.longTermImpactTitle,
        seoTitle: form.seo.seoTitle || null,
        seoDescription: form.seo.seoDescription || null,
        seoKeywords: form.seo.seoKeywords || null,
        canonicalUrl: form.seo.canonicalUrl || null,
        ogImage: form.seo.ogImage || null,
        twitterImage: form.seo.twitterImage || null,
        robotsMeta: form.seo.robotsMeta || null,
        published: form.published,
        solutions: form.solutions.map((s) => ({ title: s.title, subTitle: s.subTitle, items: lines(s.items) })),
        features: form.features,
        impacts: form.impacts,
      };
      const url = editingId ? `/api/admin/case-studies/${editingId}` : "/api/admin/case-studies";
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
      notify(editingId ? "Case study updated" : "Case study created");
      setDialogOpen(false);
      await load();
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(c: AdminCaseStudy): Promise<void> {
    try {
      const res = await fetch(`/api/admin/case-studies/${c.id}`, {
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

  async function remove(c: AdminCaseStudy): Promise<void> {
    const ok = await confirm({
      title: "Delete case study?",
      message: `"${c.name}" and all its sections will be permanently removed.`,
      confirmText: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/case-studies/${c.id}`, { method: "DELETE" });
      if (!res.ok) {
        notify("Delete failed", "error");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== c.id));
      notify("Case study deleted");
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
      const res = await fetch("/api/admin/case-studies/reorder", {
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

  // ---- child-row helpers ----
  const set = (patch: Partial<FormState>): void => setForm((f) => ({ ...f, ...patch }));

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={800}>
          Case Studies
        </Typography>
        {perms.canCreate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            New case study
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
                <TableCell>Title</TableCell>
                <TableCell align="center">Published</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                    No case studies yet.
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
                    <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                    <TableCell sx={{ color: "text.secondary", maxWidth: 360 }}>{c.title}</TableCell>
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{editingId ? "Edit case study" : "New case study"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="overline" color="text.secondary">
              Overview
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Name" value={form.name} onChange={(e) => set({ name: e.target.value })} required fullWidth />
              <TextField label="Slug" value={form.slug} onChange={(e) => set({ slug: e.target.value })} required fullWidth />
            </Stack>
            <TextField label="Title" value={form.title} onChange={(e) => set({ title: e.target.value })} required fullWidth />
            <TextField
              label="Short description"
              value={form.shortDesc}
              onChange={(e) => set({ shortDesc: e.target.value })}
              multiline
              minRows={2}
              required
              fullWidth
            />
            <TextField label="Tags (comma separated)" value={form.tags} onChange={(e) => set({ tags: e.target.value })} fullWidth />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Hero image URL" value={form.heroImage} onChange={(e) => set({ heroImage: e.target.value })} fullWidth />
              <TextField label="Logo URL" value={form.logo} onChange={(e) => set({ logo: e.target.value })} fullWidth />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Carousel card image" value={form.cardImage} onChange={(e) => set({ cardImage: e.target.value })} fullWidth />
              <TextField label="Carousel card image (mobile)" value={form.cardImageMobile} onChange={(e) => set({ cardImageMobile: e.target.value })} fullWidth />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Carousel client label" value={form.cardClient} onChange={(e) => set({ cardClient: e.target.value })} fullWidth />
              <TextField label="List card image" value={form.listImage} onChange={(e) => set({ listImage: e.target.value })} fullWidth />
            </Stack>
            <TextField label="List heading (e.g. brand | Industry)" value={form.listHeading} onChange={(e) => set({ listHeading: e.target.value })} fullWidth />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Industry" value={form.industry} onChange={(e) => set({ industry: e.target.value })} fullWidth />
              <TextField label="Headquarters" value={form.headquarters} onChange={(e) => set({ headquarters: e.target.value })} fullWidth />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Website" value={form.website} onChange={(e) => set({ website: e.target.value })} fullWidth />
              <TextField
                select
                label="Feature grid variant"
                value={form.featureGridVariant}
                onChange={(e) => set({ featureGridVariant: e.target.value })}
                fullWidth
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="taj-features">taj-features</MenuItem>
                <MenuItem value="citius-features">citius-features</MenuItem>
              </TextField>
            </Stack>

            <Divider />
            <Typography variant="overline" color="text.secondary">
              The challenge
            </Typography>
            <TextField label="Challenge — short info" value={form.challengeShortInfo} onChange={(e) => set({ challengeShortInfo: e.target.value })} multiline minRows={2} fullWidth />
            <TextField label="Challenge — bullet list (one per line)" value={form.challengeLists} onChange={(e) => set({ challengeLists: e.target.value })} multiline minRows={2} fullWidth />
            <TextField label="What we did (background)" value={form.challengeBackground} onChange={(e) => set({ challengeBackground: e.target.value })} multiline minRows={2} fullWidth />

            <Divider />
            <Typography variant="overline" color="text.secondary">
              The Pi Solution
            </Typography>
            <TextField label="Solution details" value={form.solutionDetails} onChange={(e) => set({ solutionDetails: e.target.value })} multiline minRows={2} fullWidth />
            {form.solutions.map((s, i) => (
              <Box key={i} sx={{ border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                  <TextField label="Title" value={s.title} onChange={(e) => set({ solutions: form.solutions.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} fullWidth size="small" />
                  <TextField label="Subtitle" value={s.subTitle} onChange={(e) => set({ solutions: form.solutions.map((x, j) => (j === i ? { ...x, subTitle: e.target.value } : x)) })} fullWidth size="small" />
                  <IconButton color="error" onClick={() => set({ solutions: form.solutions.filter((_, j) => j !== i) })}>
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                  </IconButton>
                </Stack>
                <TextField label="Items (one per line)" value={s.items} onChange={(e) => set({ solutions: form.solutions.map((x, j) => (j === i ? { ...x, items: e.target.value } : x)) })} multiline minRows={2} fullWidth size="small" />
              </Box>
            ))}
            <Button size="small" startIcon={<AddIcon />} onClick={() => set({ solutions: [...form.solutions, { title: "", subTitle: "", items: "" }] })}>
              Add solution
            </Button>

            <Divider />
            <Typography variant="overline" color="text.secondary">
              Key features
            </Typography>
            {form.features.map((f, i) => (
              <Stack key={i} direction="row" spacing={2}>
                <TextField label="Image URL" value={f.image} onChange={(e) => set({ features: form.features.map((x, j) => (j === i ? { ...x, image: e.target.value } : x)) })} fullWidth size="small" />
                <TextField label="Feature" value={f.feature} onChange={(e) => set({ features: form.features.map((x, j) => (j === i ? { ...x, feature: e.target.value } : x)) })} fullWidth size="small" />
                <IconButton color="error" onClick={() => set({ features: form.features.filter((_, j) => j !== i) })}>
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
            <Button size="small" startIcon={<AddIcon />} onClick={() => set({ features: [...form.features, { image: "", feature: "" }] })}>
              Add feature
            </Button>

            <Divider />
            <Typography variant="overline" color="text.secondary">
              Long-term impact
            </Typography>
            <TextField label="Impact intro" value={form.longTermImpactTitle} onChange={(e) => set({ longTermImpactTitle: e.target.value })} multiline minRows={2} fullWidth />
            {form.impacts.map((m, i) => (
              <Stack key={i} direction="row" spacing={2}>
                <TextField label="Image URL" value={m.image} onChange={(e) => set({ impacts: form.impacts.map((x, j) => (j === i ? { ...x, image: e.target.value } : x)) })} fullWidth size="small" />
                <TextField label="Title" value={m.title} onChange={(e) => set({ impacts: form.impacts.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} fullWidth size="small" />
                <TextField label="Subtitle" value={m.subTitle} onChange={(e) => set({ impacts: form.impacts.map((x, j) => (j === i ? { ...x, subTitle: e.target.value } : x)) })} fullWidth size="small" />
                <IconButton color="error" onClick={() => set({ impacts: form.impacts.filter((_, j) => j !== i) })}>
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Stack>
            ))}
            <Button size="small" startIcon={<AddIcon />} onClick={() => set({ impacts: [...form.impacts, { image: "", title: "", subTitle: "" }] })}>
              Add impact
            </Button>

            <SeoFieldsSection value={form.seo} onChange={(next) => set({ seo: next })} disabled={!perms.canEdit} />
            <FormControlLabel
              control={<Switch checked={form.published} onChange={(e) => set({ published: e.target.checked })} />}
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
