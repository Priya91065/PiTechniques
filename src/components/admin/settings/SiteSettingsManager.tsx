"use client";

import { useCallback, useEffect, useState, type JSX } from "react";
import { Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useNotify } from "@/components/admin/NotificationProvider";
import type { MediaPermissions } from "@/types/media";

interface FormState {
  companyEmail: string;
  companyPhone: string;
  address: string; // one line per row in a textarea
  linkedinUrl: string;
  footerNote: string;
}

const EMPTY: FormState = { companyEmail: "", companyPhone: "", address: "", linkedinUrl: "", footerNote: "" };

export default function SiteSettingsManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/settings");
      const data: {
        item?: {
          companyEmail: string;
          companyPhone: string;
          addressLines: string[];
          linkedinUrl: string | null;
          footerNote: string | null;
        } | null;
        error?: string;
      } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Failed to load", "error");
        return;
      }
      if (data.item) {
        setForm({
          companyEmail: data.item.companyEmail,
          companyPhone: data.item.companyPhone,
          address: data.item.addressLines.join("\n"),
          linkedinUrl: data.item.linkedinUrl ?? "",
          footerNote: data.item.footerNote ?? "",
        });
      }
    } catch {
      notify("Network error", "error");
    } finally {
      setLoading(false);
    }
  }, [notify]);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(): Promise<void> {
    const addressLines = form.address
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);
    if (!form.companyEmail.trim() || !form.companyPhone.trim() || addressLines.length === 0) {
      notify("Email, phone and at least one address line are required", "warning");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyEmail: form.companyEmail,
          companyPhone: form.companyPhone,
          addressLines,
          linkedinUrl: form.linkedinUrl,
          footerNote: form.footerNote,
        }),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Save failed", "error");
        return;
      }
      notify("Settings saved");
      await load();
    } catch {
      notify("Network error", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 2 }}>
        Site Settings
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Contact details and footer content shown across the public site.
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper sx={{ p: 3, maxWidth: 640 }}>
          <Stack spacing={2.5}>
            <TextField
              label="Company email"
              type="email"
              value={form.companyEmail}
              onChange={(e) => setForm((f) => ({ ...f, companyEmail: e.target.value }))}
              required
              fullWidth
              disabled={!perms.canEdit}
            />
            <TextField
              label="Company phone"
              value={form.companyPhone}
              onChange={(e) => setForm((f) => ({ ...f, companyPhone: e.target.value }))}
              required
              fullWidth
              disabled={!perms.canEdit}
            />
            <TextField
              label="Address"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              required
              fullWidth
              multiline
              minRows={2}
              helperText="One line per row — rendered as separate lines in the footer."
              disabled={!perms.canEdit}
            />
            <TextField
              label="LinkedIn URL (optional)"
              value={form.linkedinUrl}
              onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
              fullWidth
              disabled={!perms.canEdit}
            />
            <TextField
              label="Footer note (optional)"
              value={form.footerNote}
              onChange={(e) => setForm((f) => ({ ...f, footerNote: e.target.value }))}
              fullWidth
              helperText='Shown after "© {year}" in the copyright line.'
              disabled={!perms.canEdit}
            />
            {perms.canEdit && (
              <Box>
                <Button variant="contained" startIcon={<SaveIcon />} onClick={() => void save()} disabled={saving}>
                  {saving ? "Saving…" : "Save settings"}
                </Button>
              </Box>
            )}
          </Stack>
        </Paper>
      )}
    </Box>
  );
}
