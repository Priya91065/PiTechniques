"use client";

import { useCallback, useEffect, useState, type JSX } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useNotify } from "@/components/admin/NotificationProvider";

interface PolicyItem {
  slug: string;
  heading: string;
  status: "DRAFT" | "PUBLISHED";
  inDb: boolean;
}

export default function PolicyPagesManager(): JSX.Element {
  const notify = useNotify();
  const [items, setItems] = useState<PolicyItem[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/policy-pages");
      const data: { items?: PolicyItem[]; error?: string } = await res.json().catch(() => ({}));
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

  return (
    <Box>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 1 }}>
        Policy Pages
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Manage the content and SEO of the legal/policy pages. The page design stays exactly as on the live site.
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Page</TableCell>
                <TableCell>Path</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((p) => (
                <TableRow key={p.slug} hover>
                  <TableCell sx={{ fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: p.heading }} />
                  <TableCell sx={{ fontFamily: "monospace", color: "text.secondary" }}>/{p.slug}</TableCell>
                  <TableCell align="center">
                    <Chip size="small" label={p.inDb ? (p.status === "PUBLISHED" ? "Published" : "Draft") : "Default"} color={p.status === "PUBLISHED" ? "success" : "default"} variant={p.inDb ? "filled" : "outlined"} />
                  </TableCell>
                  <TableCell align="right">
                    <Button component={NextLink} href={`/admin/policy-pages/${p.slug}`} size="small" startIcon={<EditOutlinedIcon fontSize="small" />}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
