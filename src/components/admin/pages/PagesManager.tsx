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
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import NextLink from "next/link";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNotify } from "@/components/admin/NotificationProvider";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import { slugify } from "@/lib/slug";

export interface PagePermissions {
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canPublish: boolean;
}

type PageStatus = "DRAFT" | "PUBLISHED";

interface AdminPage {
  id: string;
  title: string;
  slug: string;
  status: PageStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  updatedAt: string;
}

type SortField = "title" | "slug" | "status" | "updatedAt";
type FormState = { title: string; slug: string; status: PageStatus; seoTitle: string; seoDescription: string };
const EMPTY: FormState = { title: "", slug: "", status: "DRAFT", seoTitle: "", seoDescription: "" };

export default function PagesManager({ perms }: { perms: PagePermissions }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();

  const [items, setItems] = useState<AdminPage[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0); // 0-based for MUI
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState<SortField>("updatedAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [slugTouched, setSlugTouched] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({
        search,
        page: String(page + 1),
        pageSize: String(pageSize),
        sort,
        order,
      });
      const res = await fetch(`/api/admin/pages?${qs.toString()}`);
      const data: { items?: AdminPage[]; total?: number; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Failed to load pages", "error");
        return;
      }
      setItems(data.items ?? []);
      setTotal(data.total ?? 0);
    } catch {
      notify("Network error", "error");
    } finally {
      setLoading(false);
    }
  }, [search, page, pageSize, sort, order, notify]);

  useEffect(() => {
    const t = setTimeout(() => void load(), 250);
    return () => clearTimeout(t);
  }, [load]);

  function toggleSort(field: SortField): void {
    if (sort === field) setOrder((o) => (o === "asc" ? "desc" : "asc"));
    else {
      setSort(field);
      setOrder("asc");
    }
    setPage(0);
  }

  function openCreate(): void {
    setEditingId(null);
    setForm(EMPTY);
    setSlugTouched(false);
    setDialogOpen(true);
  }

  function openEdit(p: AdminPage): void {
    setEditingId(p.id);
    setForm({
      title: p.title,
      slug: p.slug,
      status: p.status,
      seoTitle: p.seoTitle ?? "",
      seoDescription: p.seoDescription ?? "",
    });
    setSlugTouched(true);
    setDialogOpen(true);
  }

  async function save(): Promise<void> {
    if (!form.title.trim() || !form.slug.trim()) {
      notify("Title and slug are required", "warning");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        slug: form.slug,
        status: form.status,
        seoTitle: form.seoTitle || null,
        seoDescription: form.seoDescription || null,
      };
      const url = editingId ? `/api/admin/pages/${editingId}` : "/api/admin/pages";
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
      notify(editingId ? "Page updated" : "Page created");
      setDialogOpen(false);
      await load();
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(p: AdminPage): Promise<void> {
    const next: PageStatus = p.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    try {
      const res = await fetch(`/api/admin/pages/${p.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Update failed", "error");
        return;
      }
      setItems((prev) => prev.map((x) => (x.id === p.id ? { ...x, status: next } : x)));
      notify(next === "PUBLISHED" ? "Page published" : "Page unpublished");
    } catch {
      notify("Network error", "error");
    }
  }

  async function duplicate(p: AdminPage): Promise<void> {
    try {
      const res = await fetch(`/api/admin/pages/${p.id}/duplicate`, { method: "POST" });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Duplicate failed", "error");
        return;
      }
      notify("Page duplicated");
      await load();
    } catch {
      notify("Network error", "error");
    }
  }

  async function remove(p: AdminPage): Promise<void> {
    const ok = await confirm({
      title: "Delete page?",
      message: `"${p.title}" will be permanently deleted. This cannot be undone.`,
      confirmText: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/pages/${p.id}`, { method: "DELETE" });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Delete failed", "error");
        return;
      }
      notify("Page deleted");
      await load();
    } catch {
      notify("Network error", "error");
    }
  }

  const headers: { field: SortField; label: string }[] = [
    { field: "title", label: "Title" },
    { field: "slug", label: "Slug" },
    { field: "status", label: "Status" },
    { field: "updatedAt", label: "Updated" },
  ];

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, gap: 2 }} flexWrap="wrap">
        <Typography variant="h4" fontWeight={800}>
          Pages
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            placeholder="Search pages…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
            InputProps={{
              startAdornment: <SearchOutlinedIcon fontSize="small" sx={{ mr: 1, color: "text.secondary" }} />,
            }}
          />
          {perms.canCreate && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
              Create page
            </Button>
          )}
        </Stack>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((h) => (
                <TableCell key={h.field}>
                  <TableSortLabel
                    active={sort === h.field}
                    direction={sort === h.field ? order : "asc"}
                    onClick={() => toggleSort(h.field)}
                  >
                    {h.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={28} />
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4, color: "text.secondary" }}>
                  No pages found.
                </TableCell>
              </TableRow>
            ) : (
              items.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{p.title}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>/{p.slug}</TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={p.status === "PUBLISHED" ? "Published" : "Draft"}
                      color={p.status === "PUBLISHED" ? "success" : "default"}
                      variant={p.status === "PUBLISHED" ? "filled" : "outlined"}
                    />
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {new Date(p.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell align="right">
                    {perms.canPublish && (
                      <Tooltip title={p.status === "PUBLISHED" ? "Unpublish" : "Publish"}>
                        <IconButton size="small" onClick={() => void toggleStatus(p)}>
                          {p.status === "PUBLISHED" ? (
                            <VisibilityOffOutlinedIcon fontSize="small" />
                          ) : (
                            <PublicOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                    {perms.canCreate && (
                      <Tooltip title="Duplicate">
                        <IconButton size="small" onClick={() => void duplicate(p)}>
                          <ContentCopyOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    <Tooltip title="Edit content">
                      <IconButton size="small" component={NextLink} href={`/admin/pages/${p.id}`}>
                        <ArticleOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    {perms.canEdit && (
                      <Tooltip title="Edit details">
                        <IconButton size="small" onClick={() => openEdit(p)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    {perms.canDelete && (
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => void remove(p)}>
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
        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(_e, p) => setPage(p)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) => {
            setPageSize(parseInt(e.target.value, 10));
            setPage(0);
          }}
          rowsPerPageOptions={[10, 25, 50]}
        />
      </TableContainer>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editingId ? "Edit page" : "Create page"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={form.title}
              onChange={(e) => {
                const title = e.target.value;
                setForm((f) => ({ ...f, title, slug: slugTouched ? f.slug : slugify(title) }));
              }}
              required
              fullWidth
            />
            <TextField
              label="Slug"
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setForm((f) => ({ ...f, slug: e.target.value }));
              }}
              required
              fullWidth
              helperText="URL path, e.g. about-us"
            />
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as PageStatus }))}
              fullWidth
              disabled={!perms.canPublish && form.status !== "PUBLISHED"}
            >
              <MenuItem value="DRAFT">Draft</MenuItem>
              <MenuItem value="PUBLISHED">Published</MenuItem>
            </TextField>
            <TextField
              label="SEO title"
              value={form.seoTitle}
              onChange={(e) => setForm((f) => ({ ...f, seoTitle: e.target.value }))}
              fullWidth
            />
            <TextField
              label="SEO description"
              value={form.seoDescription}
              onChange={(e) => setForm((f) => ({ ...f, seoDescription: e.target.value }))}
              multiline
              minRows={2}
              fullWidth
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
