"use client";

import { useCallback, useEffect, useState, type JSX } from "react";
import { Alert, Box, Button, Chip, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useNotify } from "@/components/admin/NotificationProvider";
import { useConfirm } from "@/components/admin/ConfirmProvider";

export default function HomepagePublishBar({ canPublish, canEdit }: { canPublish: boolean; canEdit: boolean }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();
  const [hasChanges, setHasChanges] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  const loadStatus = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch("/api/admin/homepage/status");
      const data: { hasChanges?: boolean } = await res.json().catch(() => ({}));
      if (res.ok) setHasChanges(Boolean(data.hasChanges));
    } catch {
      /* leave unknown */
    }
  }, []);

  useEffect(() => {
    void loadStatus();
  }, [loadStatus]);

  async function publish(): Promise<void> {
    const ok = await confirm({
      title: "Publish homepage?",
      message: "Your draft changes to the Banner, Statistics and About sections will go live on the homepage.",
      confirmText: "Publish",
    });
    if (!ok) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/homepage/publish", { method: "POST" });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Publish failed", "error");
        return;
      }
      notify("Homepage published");
      setHasChanges(false);
    } catch {
      notify("Network error", "error");
    } finally {
      setBusy(false);
    }
  }

  async function discard(): Promise<void> {
    const ok = await confirm({
      title: "Discard draft changes?",
      message: "The Banner, Statistics and About sections will be reverted to the last published version.",
      confirmText: "Discard",
      destructive: true,
    });
    if (!ok) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/homepage/discard", { method: "POST" });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Discard failed", "error");
        return;
      }
      notify("Draft reverted to published");
      setHasChanges(false);
      // Refresh the page so the editors re-read the reverted draft.
      window.location.reload();
    } catch {
      notify("Network error", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} justifyContent="space-between">
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Typography fontWeight={700}>Publishing</Typography>
          {hasChanges === null ? (
            <CircularProgress size={16} />
          ) : hasChanges ? (
            <Chip size="small" color="warning" label="Unpublished changes" />
          ) : (
            <Chip size="small" color="success" label="Published — up to date" />
          )}
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="text" component="a" href="/" target="_blank" rel="noreferrer" endIcon={<OpenInNewIcon />}>
            Preview live
          </Button>
          {canEdit && (
            <Button size="small" variant="outlined" color="inherit" startIcon={<UndoOutlinedIcon />} onClick={() => void discard()} disabled={busy || hasChanges === false}>
              Discard
            </Button>
          )}
          {canPublish && (
            <Button size="small" variant="contained" startIcon={<PublishOutlinedIcon />} onClick={() => void publish()} disabled={busy || hasChanges === false}>
              {busy ? "Working…" : "Publish"}
            </Button>
          )}
        </Stack>
      </Stack>
      <Box sx={{ mt: 1.5 }}>
        <Alert severity="info" variant="outlined" sx={{ py: 0.5 }}>
          Edits to <strong>Banner</strong>, <strong>Statistics</strong> and <strong>About</strong> are saved as a draft and only appear on the live site after you publish. Other sections (Services, Case Studies, Clients, Testimonials, Footer, SEO) publish immediately on save.
        </Alert>
      </Box>
    </Paper>
  );
}
