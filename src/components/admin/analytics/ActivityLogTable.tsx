"use client";

import { useCallback, useEffect, useState, type JSX } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
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
  TextField,
  Typography,
} from "@mui/material";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { useNotify } from "@/components/admin/NotificationProvider";

type Action = "CREATE" | "UPDATE" | "DELETE" | "PUBLISH" | "LOGIN" | "LOGOUT";

interface Row {
  id: string;
  action: Action;
  entityType: string;
  summary: string;
  createdAt: string;
  user: { name: string } | null;
}

const ACTIONS: Action[] = ["CREATE", "UPDATE", "DELETE", "PUBLISH", "LOGIN", "LOGOUT"];
const ACTION_COLOR: Record<Action, "success" | "info" | "error" | "warning" | "default"> = {
  CREATE: "success",
  UPDATE: "info",
  DELETE: "error",
  PUBLISH: "warning",
  LOGIN: "default",
  LOGOUT: "default",
};

function fmt(s: string): string {
  return new Date(s).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function ActivityLogTable(): JSX.Element {
  const notify = useNotify();
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [entityTypes, setEntityTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState<"ALL" | Action>("ALL");
  const [entityType, setEntityType] = useState<"ALL" | string>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [take, setTake] = useState(25);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (action !== "ALL") qs.set("action", action);
      if (entityType !== "ALL") qs.set("entityType", entityType);
      if (search.trim()) qs.set("search", search.trim());
      qs.set("page", String(page + 1));
      qs.set("take", String(take));
      const res = await fetch(`/api/admin/activity?${qs.toString()}`);
      const data: { items?: Row[]; total?: number; entityTypes?: string[]; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Failed to load", "error");
        return;
      }
      setRows(data.items ?? []);
      setTotal(data.total ?? 0);
      if (data.entityTypes) setEntityTypes(data.entityTypes);
    } catch {
      notify("Network error", "error");
    } finally {
      setLoading(false);
    }
  }, [action, entityType, search, page, take, notify]);

  useEffect(() => {
    void load();
  }, [load]);

  function exportCsv(): void {
    const esc = (v: string): string => `"${v.replace(/"/g, '""')}"`;
    const header = ["Time", "Action", "Type", "User", "Summary"];
    const lines = rows.map((r) => [fmt(r.createdAt), r.action, r.entityType, r.user?.name ?? "—", r.summary].map((v) => esc(String(v))).join(","));
    const csv = [header.map(esc).join(","), ...lines].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `activity-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1, flexWrap: "wrap", gap: 1 }}>
        <Typography variant="h6" fontWeight={700}>
          Activity log
        </Typography>
        <Button variant="outlined" size="small" startIcon={<DownloadOutlinedIcon />} onClick={exportCsv} disabled={rows.length === 0}>
          Export CSV
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField select size="small" label="Action" value={action} onChange={(e) => { setAction(e.target.value as "ALL" | Action); setPage(0); }} sx={{ width: 150 }}>
          <MenuItem value="ALL">All actions</MenuItem>
          {ACTIONS.map((a) => (
            <MenuItem key={a} value={a}>
              {a.charAt(0) + a.slice(1).toLowerCase()}
            </MenuItem>
          ))}
        </TextField>
        <TextField select size="small" label="Type" value={entityType} onChange={(e) => { setEntityType(e.target.value); setPage(0); }} sx={{ width: 170 }}>
          <MenuItem value="ALL">All types</MenuItem>
          {entityTypes.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>
        <TextField size="small" placeholder="Search summary…" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} sx={{ width: { xs: "100%", sm: 260 } }} />
      </Stack>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Action</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Summary</TableCell>
                <TableCell>User</TableCell>
                <TableCell>When</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No activity.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((r) => (
                  <TableRow key={r.id} hover>
                    <TableCell>
                      <Chip size="small" label={r.action} color={ACTION_COLOR[r.action]} variant="outlined" />
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{r.entityType}</TableCell>
                    <TableCell>{r.summary}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{r.user?.name ?? "—"}</TableCell>
                    <TableCell sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>{fmt(r.createdAt)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={take}
            onRowsPerPageChange={(e) => { setTake(Number(e.target.value)); setPage(0); }}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </TableContainer>
      )}
    </Box>
  );
}
