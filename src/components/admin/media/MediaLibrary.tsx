"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent, type JSX } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { useNotify } from "@/components/admin/NotificationProvider";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import type { MediaItem, MediaPermissions } from "@/types/media";

function formatBytes(b: number): string {
  if (b < 1024) return `${b} B`;
  if (b < 1048576) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1048576).toFixed(1)} MB`;
}

export default function MediaLibrary({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();

  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [editItem, setEditItem] = useState<MediaItem | null>(null);
  const [altDraft, setAltDraft] = useState("");

  const uploadInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const replacingId = useRef<string | null>(null);

  const load = useCallback(
    async (q: string): Promise<void> => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/media?search=${encodeURIComponent(q)}`);
        const data: { items?: MediaItem[]; error?: string } = await res.json().catch(() => ({}));
        if (!res.ok) {
          notify(data.error ?? "Failed to load media", "error");
          return;
        }
        setItems(data.items ?? []);
      } catch {
        notify("Network error loading media", "error");
      } finally {
        setLoading(false);
      }
    },
    [notify],
  );

  useEffect(() => {
    const t = setTimeout(() => void load(search), 250);
    return () => clearTimeout(t);
  }, [search, load]);

  async function uploadFiles(files: FileList | File[]): Promise<void> {
    const list = Array.from(files);
    if (list.length === 0) return;
    setUploading(true);
    try {
      const form = new FormData();
      list.forEach((f) => form.append("files", f));
      const res = await fetch("/api/admin/media", { method: "POST", body: form });
      const data: { items?: MediaItem[]; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Upload failed", "error");
        return;
      }
      setItems((prev) => [...(data.items ?? []), ...prev]);
      notify(`Uploaded ${data.items?.length ?? 0} file(s)`);
    } catch {
      notify("Network error during upload", "error");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) void uploadFiles(e.dataTransfer.files);
  }

  async function copyUrl(item: MediaItem): Promise<void> {
    const full = `${window.location.origin}${item.url}`;
    try {
      await navigator.clipboard.writeText(full);
      notify("URL copied to clipboard");
    } catch {
      notify(full, "info");
    }
  }

  async function saveAlt(): Promise<void> {
    if (!editItem) return;
    try {
      const res = await fetch(`/api/admin/media/${editItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alt: altDraft }),
      });
      const data: { item?: MediaItem; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.item) {
        notify(data.error ?? "Failed to update", "error");
        return;
      }
      setItems((prev) => prev.map((m) => (m.id === data.item!.id ? data.item! : m)));
      notify("Alt text saved");
      setEditItem(null);
    } catch {
      notify("Network error", "error");
    }
  }

  function startReplace(id: string): void {
    replacingId.current = id;
    replaceInputRef.current?.click();
  }

  async function onReplaceSelected(file: File): Promise<void> {
    const id = replacingId.current;
    if (!id) return;
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch(`/api/admin/media/${id}`, { method: "PUT", body: form });
      const data: { item?: MediaItem; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok || !data.item) {
        notify(data.error ?? "Replace failed", "error");
        return;
      }
      setItems((prev) => prev.map((m) => (m.id === id ? data.item! : m)));
      notify("Image replaced");
    } catch {
      notify("Network error", "error");
    } finally {
      replacingId.current = null;
    }
  }

  async function remove(item: MediaItem): Promise<void> {
    const ok = await confirm({
      title: "Delete image?",
      message: `"${item.originalName}" will be permanently removed.`,
      confirmText: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/media/${item.id}`, { method: "DELETE" });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Delete failed", "error");
        return;
      }
      setItems((prev) => prev.filter((m) => m.id !== item.id));
      notify("Image deleted");
    } catch {
      notify("Network error", "error");
    }
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2, gap: 2 }} flexWrap="wrap">
        <Typography variant="h4" fontWeight={800}>
          Media Library
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            size="small"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          {perms.canCreate && (
            <Button
              variant="contained"
              startIcon={<CloudUploadOutlinedIcon />}
              onClick={() => uploadInputRef.current?.click()}
              disabled={uploading}
            >
              Upload
            </Button>
          )}
        </Stack>
      </Stack>

      {/* Hidden inputs */}
      <input
        ref={uploadInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) void uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void onReplaceSelected(f);
          e.target.value = "";
        }}
      />

      {perms.canCreate && (
        <Box
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
          onClick={() => uploadInputRef.current?.click()}
          sx={{
            border: "2px dashed",
            borderColor: dragOver ? "primary.main" : "divider",
            bgcolor: dragOver ? "action.hover" : "transparent",
            borderRadius: 2,
            p: 4,
            mb: 3,
            textAlign: "center",
            cursor: "pointer",
            transition: "all .15s",
          }}
        >
          {uploading ? (
            <CircularProgress size={28} />
          ) : (
            <>
              <CloudUploadOutlinedIcon sx={{ fontSize: 40, color: "text.secondary" }} />
              <Typography color="text.secondary">
                Drag &amp; drop images here, or click to browse (PNG, JPG, WEBP, GIF, SVG)
              </Typography>
            </>
          )}
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
          No media yet.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: { xs: "1fr 1fr", sm: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(5, 1fr)" },
          }}
        >
          {items.map((item) => (
            <Card key={item.id}>
              <Box
                sx={{
                  height: 140,
                  bgcolor: "action.hover",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url}
                  alt={item.alt ?? item.originalName}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </Box>
              <CardContent sx={{ p: 1.5 }}>
                <Tooltip title={item.originalName}>
                  <Typography variant="body2" noWrap fontWeight={600}>
                    {item.originalName}
                  </Typography>
                </Tooltip>
                <Typography variant="caption" color="text.secondary">
                  {item.width && item.height ? `${item.width}×${item.height} · ` : ""}
                  {formatBytes(item.sizeBytes)}
                </Typography>
                <Stack direction="row" sx={{ mt: 0.5 }}>
                  <Tooltip title="Copy URL">
                    <IconButton size="small" onClick={() => void copyUrl(item)}>
                      <ContentCopyOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {perms.canEdit && (
                    <Tooltip title="Edit alt text">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditItem(item);
                          setAltDraft(item.alt ?? "");
                        }}
                      >
                        <EditOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {perms.canEdit && (
                    <Tooltip title="Replace">
                      <IconButton size="small" onClick={() => startReplace(item.id)}>
                        <SwapHorizOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                  {perms.canDelete && (
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => void remove(item)}>
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={Boolean(editItem)} onClose={() => setEditItem(null)} fullWidth maxWidth="sm">
        <DialogTitle>Edit alt text</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Alt text"
            value={altDraft}
            onChange={(e) => setAltDraft(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditItem(null)}>Cancel</Button>
          <Button variant="contained" onClick={() => void saveAlt()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
