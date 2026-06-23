"use client";

import { useCallback, useEffect, useState, type JSX, type ReactNode } from "react";
import {
  Badge,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  MenuItem,
  Paper,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ArchiveOutlinedIcon from "@mui/icons-material/ArchiveOutlined";
import UnarchiveOutlinedIcon from "@mui/icons-material/UnarchiveOutlined";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import MarkEmailUnreadOutlinedIcon from "@mui/icons-material/MarkEmailUnreadOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import { useNotify } from "@/components/admin/NotificationProvider";
import { useConfirm } from "@/components/admin/ConfirmProvider";
import type { MediaPermissions } from "@/types/media";

type Status = "UNREAD" | "READ" | "ARCHIVED";
type Source = "CONTACT" | "CAREER";

interface Submission {
  id: string;
  source: Source;
  firstName: string;
  lastName: string | null;
  email: string;
  phone: string | null;
  message: string | null;
  position: string | null;
  resumeUrl: string | null;
  status: Status;
  createdAt: string;
}

const STATUS_TABS = ["ALL", "UNREAD", "READ", "ARCHIVED"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

function fmtDateTime(s: string): string {
  return new Date(s).toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function fullName(s: Submission): string {
  return [s.firstName, s.lastName].filter(Boolean).join(" ");
}

export default function MessagesManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();
  const [rows, setRows] = useState<Submission[]>([]);
  const [total, setTotal] = useState(0);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState<StatusTab>("ALL");
  const [source, setSource] = useState<"ALL" | Source>("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0); // zero-based for TablePagination
  const [take, setTake] = useState(25);
  const [selected, setSelected] = useState<Submission | null>(null);

  const fetchList = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (statusTab !== "ALL") qs.set("status", statusTab);
      if (source !== "ALL") qs.set("source", source);
      if (search.trim()) qs.set("search", search.trim());
      qs.set("page", String(page + 1));
      qs.set("take", String(take));
      const res = await fetch(`/api/admin/contact?${qs.toString()}`);
      const data: { items?: Submission[]; total?: number; unread?: number; error?: string } = await res
        .json()
        .catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Failed to load", "error");
        return;
      }
      setRows(data.items ?? []);
      setTotal(data.total ?? 0);
      setUnread(data.unread ?? 0);
    } catch {
      notify("Network error", "error");
    } finally {
      setLoading(false);
    }
  }, [statusTab, source, search, page, take, notify]);

  useEffect(() => {
    void fetchList();
  }, [fetchList]);

  async function patchStatus(id: string, status: Status): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        notify("Update failed", "error");
        return false;
      }
      return true;
    } catch {
      notify("Network error", "error");
      return false;
    }
  }

  async function openDetail(s: Submission): Promise<void> {
    setSelected(s);
    if (s.status === "UNREAD" && perms.canEdit) {
      if (await patchStatus(s.id, "READ")) {
        setRows((prev) => prev.map((x) => (x.id === s.id ? { ...x, status: "READ" } : x)));
        setUnread((u) => Math.max(0, u - 1));
        setSelected((cur) => (cur && cur.id === s.id ? { ...cur, status: "READ" } : cur));
      }
    }
  }

  async function changeStatus(s: Submission, status: Status): Promise<void> {
    if (!(await patchStatus(s.id, status))) return;
    setRows((prev) => prev.map((x) => (x.id === s.id ? { ...x, status } : x)));
    setUnread((u) => u + (s.status === "UNREAD" ? -1 : 0) + (status === "UNREAD" ? 1 : 0));
    notify(`Marked ${status.toLowerCase()}`);
    // If a status filter is active and the row no longer matches, refresh.
    if (statusTab !== "ALL" && statusTab !== status) void fetchList();
  }

  async function remove(s: Submission): Promise<void> {
    const ok = await confirm({
      title: "Delete message?",
      message: `The message from ${s.email} will be permanently deleted.`,
      confirmText: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/admin/contact/${s.id}`, { method: "DELETE" });
      if (!res.ok) {
        notify("Delete failed", "error");
        return;
      }
      setRows((prev) => prev.filter((x) => x.id !== s.id));
      setTotal((t) => Math.max(0, t - 1));
      if (s.status === "UNREAD") setUnread((u) => Math.max(0, u - 1));
      if (selected?.id === s.id) setSelected(null);
      notify("Message deleted");
    } catch {
      notify("Network error", "error");
    }
  }

  function exportCsv(): void {
    const header = ["Date", "Source", "Name", "Email", "Phone", "Position", "Status", "Message"];
    const esc = (v: string): string => `"${v.replace(/"/g, '""')}"`;
    const lines = rows.map((s) =>
      [
        fmtDateTime(s.createdAt),
        s.source,
        fullName(s),
        s.email,
        s.phone ?? "",
        s.position ?? "",
        s.status,
        (s.message ?? "").replace(/\r?\n/g, " "),
      ]
        .map((v) => esc(String(v)))
        .join(","),
    );
    const csv = [header.map(esc).join(","), ...lines].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `messages-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="h4" fontWeight={800}>
            Messages
          </Typography>
          {unread > 0 && <Badge color="error" badgeContent={unread} sx={{ "& .MuiBadge-badge": { position: "static", transform: "none" } }} />}
        </Stack>
        <Button variant="outlined" startIcon={<DownloadOutlinedIcon />} onClick={exportCsv} disabled={rows.length === 0}>
          Export CSV
        </Button>
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }} sx={{ mb: 2 }}>
        <Tabs
          value={statusTab}
          onChange={(_, v: StatusTab) => {
            setStatusTab(v);
            setPage(0);
          }}
          sx={{ minHeight: 0 }}
        >
          {STATUS_TABS.map((t) => (
            <Tab key={t} value={t} label={t === "ALL" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()} sx={{ minHeight: 0, py: 1 }} />
          ))}
        </Tabs>
        <Box sx={{ flex: 1 }} />
        <TextField
          select
          size="small"
          label="Source"
          value={source}
          onChange={(e) => {
            setSource(e.target.value as "ALL" | Source);
            setPage(0);
          }}
          sx={{ width: 150 }}
        >
          <MenuItem value="ALL">All sources</MenuItem>
          <MenuItem value="CONTACT">Contact</MenuItem>
          <MenuItem value="CAREER">Career</MenuItem>
        </TextField>
        <TextField
          size="small"
          placeholder="Search name, email, message…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          sx={{ width: { xs: "100%", sm: 280 } }}
        />
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
                <TableCell>From</TableCell>
                <TableCell>Source</TableCell>
                <TableCell>Message</TableCell>
                <TableCell>Received</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No messages.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((s) => {
                  const isUnread = s.status === "UNREAD";
                  return (
                    <TableRow
                      key={s.id}
                      hover
                      onClick={() => void openDetail(s)}
                      sx={{ cursor: "pointer", "& td": { fontWeight: isUnread ? 700 : 400 } }}
                    >
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {isUnread && <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "error.main" }} />}
                          <Box>
                            <div>{fullName(s)}</div>
                            <Box component="span" sx={{ color: "text.secondary", fontWeight: 400, fontSize: 13 }}>
                              {s.email}
                            </Box>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={s.source === "CAREER" ? "Career" : "Contact"} size="small" color={s.source === "CAREER" ? "secondary" : "default"} />
                      </TableCell>
                      <TableCell sx={{ maxWidth: 360, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {s.message ?? <em style={{ color: "#999" }}>—</em>}
                      </TableCell>
                      <TableCell sx={{ color: "text.secondary", fontWeight: 400, whiteSpace: "nowrap" }}>{fmtDateTime(s.createdAt)}</TableCell>
                      <TableCell align="right" onClick={(e) => e.stopPropagation()}>
                        {perms.canEdit && (
                          <Tooltip title={isUnread ? "Mark read" : "Mark unread"}>
                            <IconButton size="small" onClick={() => void changeStatus(s, isUnread ? "READ" : "UNREAD")}>
                              {isUnread ? <MarkEmailReadOutlinedIcon fontSize="small" /> : <MarkEmailUnreadOutlinedIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        )}
                        {perms.canEdit && (
                          <Tooltip title={s.status === "ARCHIVED" ? "Unarchive" : "Archive"}>
                            <IconButton size="small" onClick={() => void changeStatus(s, s.status === "ARCHIVED" ? "READ" : "ARCHIVED")}>
                              {s.status === "ARCHIVED" ? <UnarchiveOutlinedIcon fontSize="small" /> : <ArchiveOutlinedIcon fontSize="small" />}
                            </IconButton>
                          </Tooltip>
                        )}
                        {perms.canDelete && (
                          <Tooltip title="Delete">
                            <IconButton size="small" color="error" onClick={() => void remove(s)}>
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onPageChange={(_, p) => setPage(p)}
            rowsPerPage={take}
            onRowsPerPageChange={(e) => {
              setTake(Number(e.target.value));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </TableContainer>
      )}

      <Dialog open={selected !== null} onClose={() => setSelected(null)} fullWidth maxWidth="sm">
        {selected && (
          <>
            <DialogTitle>
              <Stack direction="row" spacing={1} alignItems="center">
                <span>{fullName(selected)}</span>
                <Chip label={selected.source === "CAREER" ? "Career" : "Contact"} size="small" color={selected.source === "CAREER" ? "secondary" : "default"} />
              </Stack>
            </DialogTitle>
            <DialogContent dividers>
              <Stack spacing={1.5}>
                <Detail label="Email" value={<a href={`mailto:${selected.email}`}>{selected.email}</a>} />
                {selected.phone && <Detail label="Phone" value={<a href={`tel:${selected.phone}`}>{selected.phone}</a>} />}
                {selected.position && <Detail label="Position" value={selected.position} />}
                {selected.resumeUrl && (
                  <Detail
                    label="Resume"
                    value={
                      <a href={selected.resumeUrl} target="_blank" rel="noreferrer">
                        Download CV
                      </a>
                    }
                  />
                )}
                <Detail label="Received" value={fmtDateTime(selected.createdAt)} />
                <Detail label="Status" value={selected.status.charAt(0) + selected.status.slice(1).toLowerCase()} />
                <Divider />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Message
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap", mt: 0.5 }}>{selected.message || "—"}</Typography>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              {perms.canEdit && (
                <Button
                  onClick={() => {
                    void changeStatus(selected, selected.status === "ARCHIVED" ? "READ" : "ARCHIVED");
                    setSelected(null);
                  }}
                >
                  {selected.status === "ARCHIVED" ? "Unarchive" : "Archive"}
                </Button>
              )}
              <Button variant="contained" onClick={() => setSelected(null)}>
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

function Detail({ label, value }: { label: string; value: ReactNode }): JSX.Element {
  return (
    <Stack direction="row" spacing={2}>
      <Typography variant="body2" color="text.secondary" sx={{ width: 90, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}
