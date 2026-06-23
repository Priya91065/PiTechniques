"use client";

import { useCallback, useEffect, useState, type JSX } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
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
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNotify } from "@/components/admin/NotificationProvider";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import { SECTION_LABELS, SECTION_TYPES, type SectionType } from "@/lib/validation/section";

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
type Draft =
  | { type: "hero"; heading: string; subheading: string; backgroundImage: string }
  | { type: "richText"; heading: string; body: string }
  | { type: "image"; images: { url: string; alt: string }[]; caption: string }
  | { type: "cta"; heading: string; text: string; buttonLabel: string; buttonHref: string };

function emptyDraft(type: SectionType): Draft {
  switch (type) {
    case "hero":
      return { type, heading: "", subheading: "", backgroundImage: "" };
    case "richText":
      return { type, heading: "", body: "" };
    case "image":
      return { type, images: [{ url: "", alt: "" }], caption: "" };
    case "cta":
      return { type, heading: "", text: "", buttonLabel: "", buttonHref: "" };
  }
}

function draftFromSection(s: EditorSection): Draft {
  const c = (s.content ?? {}) as Record<string, unknown>;
  const str = (v: unknown): string => (typeof v === "string" ? v : "");
  switch (s.type as SectionType) {
    case "hero":
      return { type: "hero", heading: str(c.heading), subheading: str(c.subheading), backgroundImage: str(c.backgroundImage) };
    case "richText":
      return { type: "richText", heading: str(c.heading), body: str(c.body) };
    case "image": {
      const imgs = Array.isArray(c.images) ? (c.images as Record<string, unknown>[]) : [];
      return {
        type: "image",
        images: imgs.length > 0 ? imgs.map((i) => ({ url: str(i.url), alt: str(i.alt) })) : [{ url: "", alt: "" }],
        caption: str(c.caption),
      };
    }
    case "cta":
      return { type: "cta", heading: str(c.heading), text: str(c.text), buttonLabel: str(c.buttonLabel), buttonHref: str(c.buttonHref) };
    default:
      return { type: "richText", heading: "", body: "" };
  }
}

/** Strip the discriminant — the API stores the rest as the section content. */
function draftToContent(d: Draft): Record<string, unknown> {
  const { type: _type, ...rest } = d;
  void _type;
  return rest;
}

function summarize(s: EditorSection): string {
  const c = (s.content ?? {}) as Record<string, unknown>;
  if (typeof c.heading === "string" && c.heading) return c.heading;
  if (typeof c.body === "string" && c.body) return c.body.slice(0, 80);
  if (typeof c.buttonLabel === "string" && c.buttonLabel) return c.buttonLabel;
  if (Array.isArray(c.images)) return `${c.images.length} image(s)`;
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft("hero"));
  const [sectionTitle, setSectionTitle] = useState("");
  const [sectionPublished, setSectionPublished] = useState(true);
  const [addType, setAddType] = useState<SectionType>("hero");
  const [savingSection, setSavingSection] = useState(false);

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

  function openCreate(): void {
    setEditingId(null);
    setDraft(emptyDraft(addType));
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

  async function move(index: number, dir: -1 | 1): Promise<void> {
    const target = index + dir;
    if (target < 0 || target >= sections.length) return;
    const reordered = [...sections];
    const [m] = reordered.splice(index, 1);
    reordered.splice(target, 0, m);
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
          Content sections
        </Typography>
        {perms.canCreate && (
          <Stack direction="row" spacing={1}>
            <TextField select size="small" value={addType} onChange={(e) => setAddType(e.target.value as SectionType)} sx={{ minWidth: 170 }}>
              {SECTION_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {SECTION_LABELS[t]}
                </MenuItem>
              ))}
            </TextField>
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Add
            </Button>
          </Stack>
        )}
      </Stack>

      <Stack spacing={1.5}>
        {sections.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: "center", color: "text.secondary" }}>No sections yet. Add your first content block above.</Paper>
        ) : (
          sections.map((s, i) => (
            <Paper key={s.id} sx={{ p: 2, display: "flex", alignItems: "center", gap: 1, opacity: s.published ? 1 : 0.55 }}>
              <Stack>
                <IconButton size="small" disabled={!perms.canEdit || i === 0} onClick={() => void move(i, -1)}>
                  <ArrowUpwardIcon fontSize="inherit" />
                </IconButton>
                <IconButton size="small" disabled={!perms.canEdit || i === sections.length - 1} onClick={() => void move(i, 1)}>
                  <ArrowDownwardIcon fontSize="inherit" />
                </IconButton>
              </Stack>
              <Chip size="small" label={SECTION_LABELS[s.type as SectionType] ?? s.type} />
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

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit section" : `Add ${SECTION_LABELS[draft.type]}`}</DialogTitle>
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
  // image
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
