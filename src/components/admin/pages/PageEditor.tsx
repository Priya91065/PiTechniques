"use client";

import { useCallback, useEffect, useState, type JSX } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
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
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNotify } from "@/components/admin/NotificationProvider";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import { SECTION_DESCRIPTIONS, SECTION_GROUPS, SECTION_LABELS, type SectionType } from "@/lib/validation/section";

type PageStatus = "DRAFT" | "PUBLISHED";

export interface EditorPage {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  seoTitle: string | null;
  seoDescription: string | null;
}

export interface EditorSection {
  id: string;
  type: string;
  title: string | null;
  published: boolean;
  content: unknown;
  order: number;
}

interface EditorPerms {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPublish: boolean;
}

// ---- Typed content drafts ----------------------------------------------------
// Numeric fields are kept as strings while editing and converted on save.

interface CardDraftItem {
  icon: string;
  title: string;
  description: string;
  linkLabel: string;
  linkHref: string;
}
interface StatDraftItem {
  value: string;
  suffix: string;
  label: string;
}
interface TimelineDraftItem {
  year: string;
  title: string;
  description: string;
}

type Draft =
  | { type: "hero"; heading: string; subheading: string; backgroundImage: string }
  | { type: "richText"; heading: string; body: string }
  | { type: "imageText"; heading: string; body: string; image: string; imageAlt: string; imagePosition: "left" | "right" }
  | { type: "image"; images: { url: string; alt: string }[]; caption: string }
  | { type: "cards"; eyebrow: string; heading: string; columns: "2" | "3" | "4"; items: CardDraftItem[] }
  | { type: "statistics"; eyebrow: string; heading: string; items: StatDraftItem[] }
  | { type: "timeline"; eyebrow: string; heading: string; items: TimelineDraftItem[] }
  | { type: "cta"; heading: string; text: string; buttonLabel: string; buttonHref: string }
  | { type: "contactForm"; eyebrow: string; heading: string; intro: string }
  | { type: "customHtml"; html: string }
  | { type: "services" | "testimonials" | "clients"; eyebrow: string; heading: string; limit: string }
  | { type: "team"; eyebrow: string; heading: string; limit: string; group: "all" | "leadership" | "executive" }
  | { type: "faq"; eyebrow: string; heading: string; limit: string; category: string };

const EMPTY_CARD: CardDraftItem = { icon: "", title: "", description: "", linkLabel: "", linkHref: "" };
const EMPTY_STAT: StatDraftItem = { value: "", suffix: "+", label: "" };
const EMPTY_MILESTONE: TimelineDraftItem = { year: "", title: "", description: "" };

function emptyDraft(type: SectionType): Draft {
  switch (type) {
    case "hero":
      return { type, heading: "", subheading: "", backgroundImage: "" };
    case "richText":
      return { type, heading: "", body: "" };
    case "imageText":
      return { type, heading: "", body: "", image: "", imageAlt: "", imagePosition: "right" };
    case "image":
      return { type, images: [{ url: "", alt: "" }], caption: "" };
    case "cards":
      return { type, eyebrow: "", heading: "", columns: "3", items: [{ ...EMPTY_CARD }] };
    case "statistics":
      return { type, eyebrow: "", heading: "", items: [{ ...EMPTY_STAT }] };
    case "timeline":
      return { type, eyebrow: "", heading: "", items: [{ ...EMPTY_MILESTONE }] };
    case "cta":
      return { type, heading: "", text: "", buttonLabel: "", buttonHref: "" };
    case "contactForm":
      return { type, eyebrow: "Contact us", heading: "Get in touch", intro: "" };
    case "customHtml":
      return { type, html: "" };
    case "services":
    case "testimonials":
    case "clients":
      return { type, eyebrow: "", heading: "", limit: "" };
    case "team":
      return { type, eyebrow: "", heading: "", limit: "", group: "all" };
    case "faq":
      return { type, eyebrow: "", heading: "", limit: "", category: "" };
  }
}

function draftFromSection(s: EditorSection): Draft {
  const c = (s.content ?? {}) as Record<string, unknown>;
  const str = (v: unknown): string => (typeof v === "string" ? v : "");
  const num = (v: unknown): string => (typeof v === "number" ? String(v) : "");
  const type = s.type as SectionType;
  switch (type) {
    case "hero":
      return { type, heading: str(c.heading), subheading: str(c.subheading), backgroundImage: str(c.backgroundImage) };
    case "richText":
      return { type, heading: str(c.heading), body: str(c.body) };
    case "imageText":
      return {
        type,
        heading: str(c.heading),
        body: str(c.body),
        image: str(c.image),
        imageAlt: str(c.imageAlt),
        imagePosition: c.imagePosition === "left" ? "left" : "right",
      };
    case "image": {
      const imgs = Array.isArray(c.images) ? (c.images as Record<string, unknown>[]) : [];
      return {
        type,
        images: imgs.length > 0 ? imgs.map((i) => ({ url: str(i.url), alt: str(i.alt) })) : [{ url: "", alt: "" }],
        caption: str(c.caption),
      };
    }
    case "cards": {
      const items = Array.isArray(c.items) ? (c.items as Record<string, unknown>[]) : [];
      return {
        type,
        eyebrow: str(c.eyebrow),
        heading: str(c.heading),
        columns: c.columns === 2 ? "2" : c.columns === 4 ? "4" : "3",
        items:
          items.length > 0
            ? items.map((i) => ({ icon: str(i.icon), title: str(i.title), description: str(i.description), linkLabel: str(i.linkLabel), linkHref: str(i.linkHref) }))
            : [{ ...EMPTY_CARD }],
      };
    }
    case "statistics": {
      const items = Array.isArray(c.items) ? (c.items as Record<string, unknown>[]) : [];
      return {
        type,
        eyebrow: str(c.eyebrow),
        heading: str(c.heading),
        items: items.length > 0 ? items.map((i) => ({ value: num(i.value), suffix: str(i.suffix) || "+", label: str(i.label) })) : [{ ...EMPTY_STAT }],
      };
    }
    case "timeline": {
      const items = Array.isArray(c.items) ? (c.items as Record<string, unknown>[]) : [];
      return {
        type,
        eyebrow: str(c.eyebrow),
        heading: str(c.heading),
        items: items.length > 0 ? items.map((i) => ({ year: str(i.year), title: str(i.title), description: str(i.description) })) : [{ ...EMPTY_MILESTONE }],
      };
    }
    case "cta":
      return { type, heading: str(c.heading), text: str(c.text), buttonLabel: str(c.buttonLabel), buttonHref: str(c.buttonHref) };
    case "contactForm":
      return { type, eyebrow: str(c.eyebrow), heading: str(c.heading), intro: str(c.intro) };
    case "customHtml":
      return { type, html: str(c.html) };
    case "services":
    case "testimonials":
    case "clients":
      return { type, eyebrow: str(c.eyebrow), heading: str(c.heading), limit: num(c.limit) };
    case "team":
      return {
        type,
        eyebrow: str(c.eyebrow),
        heading: str(c.heading),
        limit: num(c.limit),
        group: c.group === "leadership" ? "leadership" : c.group === "executive" ? "executive" : "all",
      };
    case "faq":
      return { type, eyebrow: str(c.eyebrow), heading: str(c.heading), limit: num(c.limit), category: str(c.category) };
    default:
      return { type: "richText", heading: "", body: "" };
  }
}

/** Convert an editing draft to the API content payload (numbers parsed). */
function draftToContent(d: Draft): Record<string, unknown> {
  const limit = (v: string): number | undefined => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n > 0 ? n : undefined;
  };
  switch (d.type) {
    case "cards":
      return { eyebrow: d.eyebrow, heading: d.heading, columns: parseInt(d.columns, 10), items: d.items };
    case "statistics":
      return {
        eyebrow: d.eyebrow,
        heading: d.heading,
        items: d.items.map((s) => ({ value: parseInt(s.value, 10) || 0, suffix: s.suffix, label: s.label })),
      };
    case "services":
    case "testimonials":
    case "clients":
      return { eyebrow: d.eyebrow, heading: d.heading, limit: limit(d.limit) };
    case "team":
      return { eyebrow: d.eyebrow, heading: d.heading, limit: limit(d.limit), group: d.group };
    case "faq":
      return { eyebrow: d.eyebrow, heading: d.heading, limit: limit(d.limit), category: d.category };
    default: {
      const { type: _type, ...rest } = d;
      void _type;
      return rest;
    }
  }
}

const GLOBAL_MODULE_TYPES: readonly string[] = ["services", "testimonials", "team", "clients", "faq"];

function summarize(s: EditorSection): string {
  if (s.title) return s.title;
  const c = (s.content ?? {}) as Record<string, unknown>;
  if (typeof c.heading === "string" && c.heading) return c.heading;
  if (typeof c.eyebrow === "string" && c.eyebrow) return c.eyebrow;
  if (typeof c.body === "string" && c.body) return c.body.slice(0, 80);
  if (typeof c.buttonLabel === "string" && c.buttonLabel) return c.buttonLabel;
  if (typeof c.html === "string" && c.html) return c.html.replace(/<[^>]+>/g, " ").trim().slice(0, 80);
  if (Array.isArray(c.images)) return `${c.images.length} image(s)`;
  if (Array.isArray(c.items)) return `${c.items.length} item(s)`;
  if (GLOBAL_MODULE_TYPES.includes(s.type)) return `From the ${SECTION_LABELS[s.type as SectionType]} collection`;
  return SECTION_LABELS[s.type as SectionType] ?? s.type;
}

export default function PageEditor({
  page,
  initialSections,
  perms,
}: {
  page: EditorPage;
  initialSections: EditorSection[];
  perms: EditorPerms;
}): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();

  // Page meta
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [status, setStatus] = useState<PageStatus>(page.status);
  const [seoTitle, setSeoTitle] = useState(page.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(page.seoDescription ?? "");
  const [savingMeta, setSavingMeta] = useState(false);

  // Sections
  const [sections, setSections] = useState<EditorSection[]>([...initialSections].sort((a, b) => a.order - b.order));
  const [pickerOpen, setPickerOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft("hero"));
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionPublished, setSectionPublished] = useState(true);
  const [savingSection, setSavingSection] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  const reloadSections = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch(`/api/admin/pages/${page.id}/sections`);
      const data: { items?: EditorSection[] } = await res.json().catch(() => ({}));
      if (res.ok) setSections((data.items ?? []).slice().sort((a, b) => a.order - b.order));
    } catch {
      /* keep current */
    }
  }, [page.id]);

  useEffect(() => {
    setSections([...initialSections].sort((a, b) => a.order - b.order));
  }, [initialSections]);

  async function saveMeta(): Promise<void> {
    if (!title.trim() || !slug.trim()) {
      notify("Title and slug are required", "warning");
      return;
    }
    setSavingMeta(true);
    try {
      const res = await fetch(`/api/admin/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, status, seoTitle, seoDescription }),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Save failed", "error");
        return;
      }
      notify("Page details saved");
    } catch {
      notify("Network error", "error");
    } finally {
      setSavingMeta(false);
    }
  }

  function pickType(type: SectionType): void {
    setPickerOpen(false);
    setEditingId(null);
    setDraft(emptyDraft(type));
    setSectionTitle("");
    setSectionPublished(true);
    setDialogOpen(true);
  }

  function openEdit(s: EditorSection): void {
    setEditingId(s.id);
    setDraft(draftFromSection(s));
    setSectionTitle(s.title ?? "");
    setSectionPublished(s.published);
    setDialogOpen(true);
  }

  async function saveSection(): Promise<void> {
    setSavingSection(true);
    try {
      const payload = {
        type: draft.type,
        title: sectionTitle.trim() || undefined,
        published: sectionPublished,
        content: draftToContent(draft),
      };
      const url = editingId ? `/api/admin/pages/${page.id}/sections/${editingId}` : `/api/admin/pages/${page.id}/sections`;
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
      notify(editingId ? "Section updated" : "Section added");
      setDialogOpen(false);
      await reloadSections();
    } catch {
      notify("Network error", "error");
    } finally {
      setSavingSection(false);
    }
  }

  async function duplicateSection(s: EditorSection): Promise<void> {
    try {
      const res = await fetch(`/api/admin/pages/${page.id}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: s.type, title: s.title ?? undefined, published: s.published, content: s.content }),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Duplicate failed", "error");
        return;
      }
      notify("Section duplicated");
      await reloadSections();
    } catch {
      notify("Network error", "error");
    }
  }

  async function togglePublished(s: EditorSection): Promise<void> {
    try {
      const res = await fetch(`/api/admin/pages/${page.id}/sections/${s.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !s.published }),
      });
      if (!res.ok) {
        notify("Update failed", "error");
        return;
      }
      setSections((prev) => prev.map((x) => (x.id === s.id ? { ...x, published: !x.published } : x)));
    } catch {
      notify("Network error", "error");
    }
  }

  async function removeSection(s: EditorSection): Promise<void> {
    const ok = await confirm({ title: "Delete section?", message: "This section will be permanently removed.", confirmText: "Delete", destructive: true });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/pages/${page.id}/sections/${s.id}`, { method: "DELETE" });
      if (!res.ok) {
        notify("Delete failed", "error");
        return;
      }
      setSections((prev) => prev.filter((x) => x.id !== s.id));
      notify("Section deleted");
    } catch {
      notify("Network error", "error");
    }
  }

  async function persistOrder(reordered: EditorSection[]): Promise<void> {
    setSections(reordered);
    try {
      const res = await fetch(`/api/admin/pages/${page.id}/sections/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((x) => x.id) }),
      });
      if (!res.ok) {
        notify("Reorder failed", "error");
        void reloadSections();
      }
    } catch {
      notify("Network error", "error");
      void reloadSections();
    }
  }

  async function move(index: number, dir: -1 | 1): Promise<void> {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const reordered = [...sections];
    const [m] = reordered.splice(index, 1);
    reordered.splice(target, 0, m);
    await persistOrder(reordered);
  }

  function handleDrop(target: number): void {
    setDropIndex(null);
    if (dragIndex === null || dragIndex === target) {
      setDragIndex(null);
      return;
    }
    const reordered = [...sections];
    const [m] = reordered.splice(dragIndex, 1);
    reordered.splice(target, 0, m);
    setDragIndex(null);
    void persistOrder(reordered);
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button component={NextLink} href="/admin/pages" size="small">
            ← Pages
          </Button>
          <Typography variant="h4" fontWeight={800}>
            Edit page
          </Typography>
          <Chip size="small" label={status === "PUBLISHED" ? "Published" : "Draft"} color={status === "PUBLISHED" ? "success" : "default"} />
        </Stack>
        <Button component="a" href={`/${slug}`} target="_blank" rel="noreferrer" size="small" endIcon={<OpenInNewIcon />}>
          View page
        </Button>
      </Stack>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
          Page details
        </Typography>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField label="Page title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth required disabled={!perms.canEdit} />
            <TextField label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} fullWidth required disabled={!perms.canEdit} helperText={`Public URL: /${slug}`} />
            <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value as PageStatus)} sx={{ minWidth: 160 }} disabled={!perms.canPublish}>
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="PUBLISHED">Published</MenuItem>
            </TextField>
          </Stack>
          <Divider textAlign="left">SEO</Divider>
          <TextField label="SEO title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} fullWidth disabled={!perms.canEdit} />
          <TextField label="SEO description" value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} fullWidth multiline minRows={2} disabled={!perms.canEdit} />
          {perms.canEdit && (
            <Box>
              <Button variant="contained" onClick={() => void saveMeta()} disabled={savingMeta}>
                {savingMeta ? "Saving…" : "Save page details"}
              </Button>
            </Box>
          )}
        </Stack>
      </Paper>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          Sections
        </Typography>
        {perms.canCreate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setPickerOpen(true)}>
            Add section
          </Button>
        )}
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Drag to reorder. Sections render on the page from top to bottom.
      </Typography>

      <Stack spacing={1.5}>
        {sections.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>No sections yet. Click “Add section” to choose a component.</Paper>
        ) : (
          sections.map((s, i) => (
            <Paper
              key={s.id}
              draggable={perms.canEdit}
              onDragStart={() => setDragIndex(i)}
              onDragEnd={() => {
                setDragIndex(null);
                setDropIndex(null);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                if (dropIndex !== i) setDropIndex(i);
              }}
              onDrop={() => handleDrop(i)}
              sx={{
                p: 2,
                display: "flex",
                alignItems: "center",
                gap: 1,
                opacity: dragIndex === i ? 0.4 : s.published ? 1 : 0.55,
                cursor: perms.canEdit ? "grab" : "default",
                borderTop: dropIndex === i && dragIndex !== null && dragIndex > i ? "2px solid" : undefined,
                borderBottom: dropIndex === i && dragIndex !== null && dragIndex < i ? "2px solid" : undefined,
                borderColor: "primary.main",
              }}
            >
              {perms.canEdit && <DragIndicatorIcon fontSize="small" sx={{ color: "text.disabled" }} />}
              <Stack>
                <IconButton size="small" disabled={!perms.canEdit || i === 0} onClick={() => void move(i, -1)}>
                  <ArrowUpwardIcon fontSize="inherit" />
                </IconButton>
                <IconButton size="small" disabled={!perms.canEdit || i === sections.length - 1} onClick={() => void move(i, 1)}>
                  <ArrowDownwardIcon fontSize="inherit" />
                </IconButton>
              </Stack>
              <Chip
                size="small"
                label={SECTION_LABELS[s.type as SectionType] ?? s.type}
                color={GLOBAL_MODULE_TYPES.includes(s.type) ? "primary" : "default"}
                variant={GLOBAL_MODULE_TYPES.includes(s.type) ? "outlined" : "filled"}
              />
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap title={summarize(s)}>
                  {summarize(s)}
                </Typography>
              </Box>
              <Tooltip title={s.published ? "Visible" : "Hidden"}>
                <span>
                  <Switch size="small" checked={s.published} disabled={!perms.canEdit} onChange={() => void togglePublished(s)} />
                </span>
              </Tooltip>
              {perms.canEdit && (
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => openEdit(s)}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {perms.canCreate && (
                <Tooltip title="Duplicate">
                  <IconButton size="small" onClick={() => void duplicateSection(s)}>
                    <ContentCopyOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
              {perms.canDelete && (
                <Tooltip title="Delete">
                  <IconButton size="small" color="error" onClick={() => void removeSection(s)}>
                    <DeleteOutlineOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Paper>
          ))
        )}
      </Stack>

      {/* Component picker (WordPress-style "choose a block") */}
      <Dialog open={pickerOpen} onClose={() => setPickerOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Choose a section type</DialogTitle>
        <DialogContent dividers>
          {SECTION_GROUPS.map((group) => (
            <Box key={group.heading} sx={{ mb: 2 }}>
              <Typography variant="overline" color="text.secondary">
                {group.heading}
              </Typography>
              <Box sx={{ display: "grid", gap: 1.5, gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" }, mt: 0.5 }}>
                {group.types.map((t) => (
                  <Card key={t} variant="outlined">
                    <CardActionArea onClick={() => pickType(t)} sx={{ p: 1.5, height: "100%" }}>
                      <Typography fontWeight={700}>{SECTION_LABELS[t]}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {SECTION_DESCRIPTIONS[t]}
                      </Typography>
                    </CardActionArea>
                  </Card>
                ))}
              </Box>
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPickerOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Section fields */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? `Edit ${SECTION_LABELS[draft.type]}` : `Add ${SECTION_LABELS[draft.type]}`}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <TextField label="Internal label (optional)" value={sectionTitle} onChange={(e) => setSectionTitle(e.target.value)} fullWidth size="small" helperText="Admin-only name to identify this block." />
            <Divider />
            <SectionFields draft={draft} setDraft={setDraft} />
            <FormControlLabel control={<Switch checked={sectionPublished} onChange={(e) => setSectionPublished(e.target.checked)} />} label="Visible on the page" />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => void saveSection()} disabled={savingSection}>
            {savingSection ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// ---- Per-type form fields ------------------------------------------------------

function EyebrowHeadingFields({
  eyebrow,
  heading,
  onEyebrow,
  onHeading,
}: {
  eyebrow: string;
  heading: string;
  onEyebrow: (v: string) => void;
  onHeading: (v: string) => void;
}): JSX.Element {
  return (
    <>
      <TextField label="Eyebrow (small title, optional)" value={eyebrow} onChange={(e) => onEyebrow(e.target.value)} fullWidth />
      <TextField label="Heading (optional)" value={heading} onChange={(e) => onHeading(e.target.value)} fullWidth />
    </>
  );
}

function SectionFields({ draft, setDraft }: { draft: Draft; setDraft: (d: Draft) => void }): JSX.Element {
  if (draft.type === "hero") {
    return (
      <>
        <TextField label="Heading" value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} fullWidth required />
        <TextField label="Subheading" value={draft.subheading} onChange={(e) => setDraft({ ...draft, subheading: e.target.value })} fullWidth />
        <TextField label="Background image URL" value={draft.backgroundImage} onChange={(e) => setDraft({ ...draft, backgroundImage: e.target.value })} fullWidth placeholder="/uploads/hero.jpg" />
      </>
    );
  }
  if (draft.type === "richText") {
    return (
      <>
        <TextField label="Heading (optional)" value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} fullWidth />
        <TextField label="Body" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} fullWidth multiline minRows={5} required helperText="Separate paragraphs with a blank line." />
      </>
    );
  }
  if (draft.type === "imageText") {
    return (
      <>
        <TextField label="Heading (optional)" value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} fullWidth />
        <TextField label="Body" value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} fullWidth multiline minRows={4} required helperText="Separate paragraphs with a blank line." />
        <TextField label="Image URL" value={draft.image} onChange={(e) => setDraft({ ...draft, image: e.target.value })} fullWidth required placeholder="/uploads/photo.jpg" />
        <TextField label="Image alt text" value={draft.imageAlt} onChange={(e) => setDraft({ ...draft, imageAlt: e.target.value })} fullWidth />
        <TextField select label="Image position" value={draft.imagePosition} onChange={(e) => setDraft({ ...draft, imagePosition: e.target.value as "left" | "right" })} fullWidth>
          <MenuItem value="left">Image left, text right</MenuItem>
          <MenuItem value="right">Image right, text left</MenuItem>
        </TextField>
      </>
    );
  }
  if (draft.type === "cta") {
    return (
      <>
        <TextField label="Heading (optional)" value={draft.heading} onChange={(e) => setDraft({ ...draft, heading: e.target.value })} fullWidth />
        <TextField label="Text (optional)" value={draft.text} onChange={(e) => setDraft({ ...draft, text: e.target.value })} fullWidth multiline minRows={2} />
        <TextField label="Button label" value={draft.buttonLabel} onChange={(e) => setDraft({ ...draft, buttonLabel: e.target.value })} fullWidth required />
        <TextField label="Button link" value={draft.buttonHref} onChange={(e) => setDraft({ ...draft, buttonHref: e.target.value })} fullWidth required placeholder="/contact-us" />
      </>
    );
  }
  if (draft.type === "contactForm") {
    return (
      <>
        <EyebrowHeadingFields eyebrow={draft.eyebrow} heading={draft.heading} onEyebrow={(v) => setDraft({ ...draft, eyebrow: v })} onHeading={(v) => setDraft({ ...draft, heading: v })} />
        <TextField label="Intro text (optional)" value={draft.intro} onChange={(e) => setDraft({ ...draft, intro: e.target.value })} fullWidth multiline minRows={2} />
        <Typography variant="body2" color="text.secondary">
          Submissions arrive in the Messages module.
        </Typography>
      </>
    );
  }
  if (draft.type === "customHtml") {
    return (
      <TextField
        label="HTML"
        value={draft.html}
        onChange={(e) => setDraft({ ...draft, html: e.target.value })}
        fullWidth
        required
        multiline
        minRows={10}
        slotProps={{ input: { sx: { fontFamily: "monospace", fontSize: 13 } } }}
        helperText="Rendered as-is inside the page container."
      />
    );
  }
  if (draft.type === "cards") {
    return (
      <>
        <EyebrowHeadingFields eyebrow={draft.eyebrow} heading={draft.heading} onEyebrow={(v) => setDraft({ ...draft, eyebrow: v })} onHeading={(v) => setDraft({ ...draft, heading: v })} />
        <TextField select label="Columns (desktop)" value={draft.columns} onChange={(e) => setDraft({ ...draft, columns: e.target.value as "2" | "3" | "4" })} fullWidth>
          <MenuItem value="2">2 columns</MenuItem>
          <MenuItem value="3">3 columns</MenuItem>
          <MenuItem value="4">4 columns</MenuItem>
        </TextField>
        {draft.items.map((card, i) => (
          <Paper key={i} variant="outlined" sx={{ p: 1.5 }}>
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Typography variant="subtitle2">Card {i + 1}</Typography>
                <IconButton size="small" color="error" disabled={draft.items.length <= 1} onClick={() => setDraft({ ...draft, items: draft.items.filter((_, j) => j !== i) })}>
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Stack>
              <TextField label="Title" size="small" value={card.title} onChange={(e) => setDraft({ ...draft, items: draft.items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} required />
              <TextField label="Description" size="small" multiline minRows={2} value={card.description} onChange={(e) => setDraft({ ...draft, items: draft.items.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)) })} />
              <TextField label="Icon / image URL (optional)" size="small" value={card.icon} onChange={(e) => setDraft({ ...draft, items: draft.items.map((x, j) => (j === i ? { ...x, icon: e.target.value } : x)) })} />
              <Stack direction="row" spacing={1}>
                <TextField label="Link label" size="small" fullWidth value={card.linkLabel} onChange={(e) => setDraft({ ...draft, items: draft.items.map((x, j) => (j === i ? { ...x, linkLabel: e.target.value } : x)) })} />
                <TextField label="Link URL" size="small" fullWidth value={card.linkHref} onChange={(e) => setDraft({ ...draft, items: draft.items.map((x, j) => (j === i ? { ...x, linkHref: e.target.value } : x)) })} />
              </Stack>
            </Stack>
          </Paper>
        ))}
        <Button size="small" startIcon={<AddIcon />} onClick={() => setDraft({ ...draft, items: [...draft.items, { ...EMPTY_CARD }] })}>
          Add card
        </Button>
      </>
    );
  }
  if (draft.type === "statistics") {
    return (
      <>
        <EyebrowHeadingFields eyebrow={draft.eyebrow} heading={draft.heading} onEyebrow={(v) => setDraft({ ...draft, eyebrow: v })} onHeading={(v) => setDraft({ ...draft, heading: v })} />
        {draft.items.map((stat, i) => (
          <Stack key={i} direction="row" spacing={1} alignItems="center">
            <TextField label="Value" size="small" type="number" sx={{ width: 120 }} value={stat.value} onChange={(e) => setDraft({ ...draft, items: draft.items.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)) })} required />
            <TextField label="Suffix" size="small" sx={{ width: 90 }} value={stat.suffix} onChange={(e) => setDraft({ ...draft, items: draft.items.map((x, j) => (j === i ? { ...x, suffix: e.target.value } : x)) })} />
            <TextField label="Label" size="small" fullWidth value={stat.label} onChange={(e) => setDraft({ ...draft, items: draft.items.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)) })} required />
            <IconButton size="small" color="error" disabled={draft.items.length <= 1} onClick={() => setDraft({ ...draft, items: draft.items.filter((_, j) => j !== i) })}>
              <DeleteOutlineOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
        ))}
        <Button size="small" startIcon={<AddIcon />} onClick={() => setDraft({ ...draft, items: [...draft.items, { ...EMPTY_STAT }] })}>
          Add statistic
        </Button>
      </>
    );
  }
  if (draft.type === "timeline") {
    return (
      <>
        <EyebrowHeadingFields eyebrow={draft.eyebrow} heading={draft.heading} onEyebrow={(v) => setDraft({ ...draft, eyebrow: v })} onHeading={(v) => setDraft({ ...draft, heading: v })} />
        {draft.items.map((item, i) => (
          <Paper key={i} variant="outlined" sx={{ p: 1.5 }}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <TextField label="Year" size="small" sx={{ width: 120 }} value={item.year} onChange={(e) => setDraft({ ...draft, items: draft.items.map((x, j) => (j === i ? { ...x, year: e.target.value } : x)) })} required />
                <TextField label="Title" size="small" fullWidth value={item.title} onChange={(e) => setDraft({ ...draft, items: draft.items.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)) })} required />
                <IconButton size="small" color="error" disabled={draft.items.length <= 1} onClick={() => setDraft({ ...draft, items: draft.items.filter((_, j) => j !== i) })}>
                  <DeleteOutlineOutlinedIcon fontSize="small" />
                </IconButton>
              </Stack>
              <TextField label="Description (optional)" size="small" multiline minRows={2} value={item.description} onChange={(e) => setDraft({ ...draft, items: draft.items.map((x, j) => (j === i ? { ...x, description: e.target.value } : x)) })} />
            </Stack>
          </Paper>
        ))}
        <Button size="small" startIcon={<AddIcon />} onClick={() => setDraft({ ...draft, items: [...draft.items, { ...EMPTY_MILESTONE }] })}>
          Add milestone
        </Button>
      </>
    );
  }
  if (draft.type === "services" || draft.type === "testimonials" || draft.type === "clients") {
    return (
      <>
        <Typography variant="body2" color="text.secondary">
          Renders live records from the global {SECTION_LABELS[draft.type]} collection — manage them in their own module.
        </Typography>
        <EyebrowHeadingFields eyebrow={draft.eyebrow} heading={draft.heading} onEyebrow={(v) => setDraft({ ...draft, eyebrow: v })} onHeading={(v) => setDraft({ ...draft, heading: v })} />
        <TextField label="Limit (optional)" type="number" value={draft.limit} onChange={(e) => setDraft({ ...draft, limit: e.target.value })} fullWidth helperText="Maximum number of records to show. Leave empty for all." />
      </>
    );
  }
  if (draft.type === "team") {
    return (
      <>
        <Typography variant="body2" color="text.secondary">
          Renders live records from the global Team Members collection.
        </Typography>
        <EyebrowHeadingFields eyebrow={draft.eyebrow} heading={draft.heading} onEyebrow={(v) => setDraft({ ...draft, eyebrow: v })} onHeading={(v) => setDraft({ ...draft, heading: v })} />
        <TextField select label="Group" value={draft.group} onChange={(e) => setDraft({ ...draft, group: e.target.value as "all" | "leadership" | "executive" })} fullWidth>
          <MenuItem value="all">All members</MenuItem>
          <MenuItem value="leadership">Leadership</MenuItem>
          <MenuItem value="executive">Executive</MenuItem>
        </TextField>
        <TextField label="Limit (optional)" type="number" value={draft.limit} onChange={(e) => setDraft({ ...draft, limit: e.target.value })} fullWidth />
      </>
    );
  }
  if (draft.type === "faq") {
    return (
      <>
        <Typography variant="body2" color="text.secondary">
          Renders live questions from the global FAQs collection.
        </Typography>
        <EyebrowHeadingFields eyebrow={draft.eyebrow} heading={draft.heading} onEyebrow={(v) => setDraft({ ...draft, eyebrow: v })} onHeading={(v) => setDraft({ ...draft, heading: v })} />
        <TextField label="Category filter (optional)" value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} fullWidth helperText="Only show FAQs in this category. Leave empty for all." />
        <TextField label="Limit (optional)" type="number" value={draft.limit} onChange={(e) => setDraft({ ...draft, limit: e.target.value })} fullWidth />
      </>
    );
  }
  if (draft.type !== "image") return <></>;
  return (
    <>
      <Typography variant="body2" color="text.secondary">
        Images {draft.images.length > 1 ? "(gallery)" : ""}
      </Typography>
      {draft.images.map((img, i) => (
        <Stack key={i} direction="row" spacing={1} alignItems="flex-start">
          <Stack spacing={1} sx={{ flex: 1 }}>
            <TextField label={`Image ${i + 1} URL`} value={img.url} onChange={(e) => setDraft({ ...draft, images: draft.images.map((x, j) => (j === i ? { ...x, url: e.target.value } : x)) })} fullWidth size="small" required />
            <TextField label="Alt text" value={img.alt} onChange={(e) => setDraft({ ...draft, images: draft.images.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)) })} fullWidth size="small" />
          </Stack>
          <IconButton size="small" color="error" disabled={draft.images.length <= 1} onClick={() => setDraft({ ...draft, images: draft.images.filter((_, j) => j !== i) })}>
            <DeleteOutlineOutlinedIcon fontSize="small" />
          </IconButton>
        </Stack>
      ))}
      <Button size="small" startIcon={<AddIcon />} onClick={() => setDraft({ ...draft, images: [...draft.images, { url: "", alt: "" }] })}>
        Add image
      </Button>
      <TextField label="Caption (optional)" value={draft.caption} onChange={(e) => setDraft({ ...draft, caption: e.target.value })} fullWidth />
    </>
  );
}
