"use client";

import { useCallback, useEffect, useMemo, useState, type JSX } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
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
import SeoFieldsSection, { EMPTY_SEO_FIELDS } from "@/components/admin/shared/SeoFieldsSection";

type Status = "ACTIVE" | "INACTIVE";

interface AdminJob {
  id: string;
  jobTitle: string;
  slug: string;
  jobCode: string | null;
  department: string | null;
  experience: string;
  location: string | null;
  employmentType: string | null;
  shortDescription: string | null;
  qualifications: string[];
  responsibilities: unknown;
  skills: string[];
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  canonicalUrl: string | null;
  twitterImage: string | null;
  robotsMeta: string | null;
  status: Status;
  displayOrder: number;
}

const formSchema = z.object({
  jobTitle: z.string().trim().min(1, "Job title is required"),
  slug: z.string().trim().optional(),
  jobCode: z.string().trim().optional(),
  department: z.string().trim().optional(),
  experience: z.string().trim().min(1, "Experience is required"),
  location: z.string().trim().optional(),
  employmentType: z.string().trim().optional(),
  shortDescription: z.string().trim().optional(),
  qualificationsText: z.string().optional(),
  skillsText: z.string().optional(),
  respMode: z.enum(["flat", "grouped"]),
  respFlatText: z.string().optional(),
  respGroups: z.array(z.object({ heading: z.string(), itemsText: z.string() })),
  seo: z.object({
    seoTitle: z.string(),
    seoDescription: z.string(),
    seoKeywords: z.string(),
    canonicalUrl: z.string(),
    ogImage: z.string(),
    twitterImage: z.string(),
    robotsMeta: z.string(),
  }),
  status: z.enum(["ACTIVE", "INACTIVE"]),
});
type FormValues = z.infer<typeof formSchema>;

const EMPTY: FormValues = {
  jobTitle: "",
  slug: "",
  jobCode: "",
  department: "",
  experience: "",
  location: "",
  employmentType: "",
  shortDescription: "",
  qualificationsText: "",
  skillsText: "",
  respMode: "flat",
  respFlatText: "",
  respGroups: [],
  seo: EMPTY_SEO_FIELDS,
  status: "ACTIVE",
};

const linesToArray = (s: string | undefined): string[] =>
  (s ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

/** Build the form state from an existing job (for editing). */
function jobToForm(j: AdminJob): FormValues {
  const r = j.responsibilities;
  let respMode: "flat" | "grouped" = "flat";
  let respFlatText = "";
  let respGroups: { heading: string; itemsText: string }[] = [];
  if (Array.isArray(r) && r.length > 0) {
    if (typeof r[0] === "string") {
      respFlatText = (r as string[]).join("\n");
    } else {
      respMode = "grouped";
      respGroups = (r as { heading?: string; items?: string[] }[]).map((g) => ({
        heading: g.heading ?? "",
        itemsText: (g.items ?? []).join("\n"),
      }));
    }
  }
  return {
    jobTitle: j.jobTitle,
    slug: j.slug,
    jobCode: j.jobCode ?? "",
    department: j.department ?? "",
    experience: j.experience,
    location: j.location ?? "",
    employmentType: j.employmentType ?? "",
    shortDescription: j.shortDescription ?? "",
    qualificationsText: j.qualifications.join("\n"),
    skillsText: j.skills.join("\n"),
    respMode,
    respFlatText,
    respGroups,
    seo: {
      seoTitle: j.seoTitle ?? "",
      seoDescription: j.seoDescription ?? "",
      seoKeywords: j.seoKeywords ?? "",
      canonicalUrl: j.canonicalUrl ?? "",
      ogImage: "",
      twitterImage: j.twitterImage ?? "",
      robotsMeta: j.robotsMeta ?? "",
    },
    status: j.status,
  };
}

export default function JobsManager({ perms }: { perms: MediaPermissions }): JSX.Element {
  const notify = useNotify();
  const confirm = useConfirm();
  const [items, setItems] = useState<AdminJob[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<"ALL" | Status>("ALL");
  const [deptFilter, setDeptFilter] = useState<"ALL" | string>("ALL");
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const { register, handleSubmit, control, reset, watch, formState } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: EMPTY,
  });
  const { fields: groupFields, append: appendGroup, remove: removeGroup } = useFieldArray({ control, name: "respGroups" });
  const respMode = watch("respMode");

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ admin: "1" });
      if (statusFilter !== "ALL") qs.set("status", statusFilter);
      if (deptFilter !== "ALL") qs.set("department", deptFilter);
      if (search.trim()) qs.set("search", search.trim());
      const res = await fetch(`/api/jobs?${qs.toString()}`);
      const data: { items?: AdminJob[]; departments?: string[]; error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Failed to load", "error");
        return;
      }
      setItems(data.items ?? []);
      setDepartments(data.departments ?? []);
    } catch {
      notify("Network error", "error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, deptFilter, search, notify]);

  useEffect(() => {
    void load();
  }, [load]);

  function openCreate(): void {
    setEditingId(null);
    reset(EMPTY);
    setDialogOpen(true);
  }
  function openEdit(j: AdminJob): void {
    setEditingId(j.id);
    reset(jobToForm(j));
    setDialogOpen(true);
  }

  function toPayload(v: FormValues): Record<string, unknown> {
    const responsibilities =
      v.respMode === "grouped"
        ? v.respGroups
            .map((g) => ({ heading: g.heading.trim(), items: linesToArray(g.itemsText) }))
            .filter((g) => g.heading.length > 0 && g.items.length > 0)
        : linesToArray(v.respFlatText);
    return {
      jobTitle: v.jobTitle,
      slug: v.slug?.trim() ? v.slug.trim() : undefined,
      jobCode: v.jobCode ?? "",
      department: v.department ?? "",
      experience: v.experience,
      location: v.location ?? "",
      employmentType: v.employmentType ?? "",
      shortDescription: v.shortDescription ?? "",
      qualifications: linesToArray(v.qualificationsText),
      responsibilities: responsibilities.length > 0 ? responsibilities : null,
      skills: linesToArray(v.skillsText),
      seoTitle: v.seo.seoTitle ?? "",
      seoDescription: v.seo.seoDescription ?? "",
      seoKeywords: v.seo.seoKeywords ?? "",
      canonicalUrl: v.seo.canonicalUrl ?? "",
      twitterImage: v.seo.twitterImage ?? "",
      robotsMeta: v.seo.robotsMeta ?? "",
      status: v.status,
    };
  }

  const onSubmit = handleSubmit(async (v) => {
    try {
      const url = editingId ? `/api/jobs/${editingId}` : "/api/jobs";
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(toPayload(v)),
      });
      const data: { error?: string } = await res.json().catch(() => ({}));
      if (!res.ok) {
        notify(data.error ?? "Save failed", "error");
        return;
      }
      notify(editingId ? "Job updated" : "Job created");
      setDialogOpen(false);
      await load();
    } catch {
      notify("Network error", "error");
    }
  });

  async function toggleStatus(j: AdminJob): Promise<void> {
    const next: Status = j.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const res = await fetch(`/api/jobs/${j.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) {
        notify("Update failed", "error");
        return;
      }
      setItems((prev) => prev.map((x) => (x.id === j.id ? { ...x, status: next } : x)));
      notify(next === "ACTIVE" ? "Job activated" : "Job deactivated");
      if (statusFilter !== "ALL" && statusFilter !== next) void load();
    } catch {
      notify("Network error", "error");
    }
  }

  async function remove(j: AdminJob): Promise<void> {
    const ok = await confirm({
      title: "Delete job?",
      message: `"${j.jobTitle}" will be permanently deleted.`,
      confirmText: "Delete",
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/jobs/${j.id}`, { method: "DELETE" });
      if (!res.ok) {
        notify("Delete failed", "error");
        return;
      }
      setItems((prev) => prev.filter((x) => x.id !== j.id));
      notify("Job deleted");
    } catch {
      notify("Network error", "error");
    }
  }

  const ordered = useMemo(() => [...items].sort((a, b) => a.displayOrder - b.displayOrder), [items]);
  const canReorder = perms.canEdit && statusFilter === "ALL" && deptFilter === "ALL" && search.trim() === "";

  async function move(index: number, dir: -1 | 1): Promise<void> {
    const target = index + dir;
    if (target < 0 || target >= ordered.length) return;
    const reordered = [...ordered];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(target, 0, moved);
    setItems(reordered);
    try {
      const res = await fetch("/api/jobs/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: reordered.map((x) => x.id) }),
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

  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h4" fontWeight={800}>
          Careers
        </Typography>
        {perms.canCreate && (
          <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
            New Job
          </Button>
        )}
      </Stack>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField select size="small" label="Status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "ALL" | Status)} sx={{ width: 150 }}>
          <MenuItem value="ALL">All statuses</MenuItem>
          <MenuItem value="ACTIVE">Active</MenuItem>
          <MenuItem value="INACTIVE">Inactive</MenuItem>
        </TextField>
        <TextField select size="small" label="Department" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} sx={{ width: 180 }}>
          <MenuItem value="ALL">All departments</MenuItem>
          {departments.map((d) => (
            <MenuItem key={d} value={d}>
              {d}
            </MenuItem>
          ))}
        </TextField>
        <TextField size="small" placeholder="Search jobs…" value={search} onChange={(e) => setSearch(e.target.value)} sx={{ width: { xs: "100%", sm: 260 } }} />
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
                <TableCell width={90}>Order</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Experience</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {ordered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3, color: "text.secondary" }}>
                    No jobs.
                  </TableCell>
                </TableRow>
              ) : (
                ordered.map((j, i) => (
                  <TableRow key={j.id} hover>
                    <TableCell>
                      <IconButton size="small" disabled={!canReorder || i === 0} onClick={() => void move(i, -1)}>
                        <ArrowUpwardIcon fontSize="inherit" />
                      </IconButton>
                      <IconButton size="small" disabled={!canReorder || i === ordered.length - 1} onClick={() => void move(i, 1)}>
                        <ArrowDownwardIcon fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {j.jobTitle}
                      <Box component="span" sx={{ display: "block", color: "text.secondary", fontWeight: 400, fontSize: 12 }}>
                        /{j.slug}
                      </Box>
                    </TableCell>
                    <TableCell>{j.department ?? "—"}</TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>{j.experience}</TableCell>
                    <TableCell align="center">
                      {perms.canEdit ? (
                        <Switch checked={j.status === "ACTIVE"} onChange={() => void toggleStatus(j)} size="small" />
                      ) : (
                        <Chip size="small" label={j.status === "ACTIVE" ? "Active" : "Inactive"} color={j.status === "ACTIVE" ? "success" : "default"} />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {perms.canEdit && (
                        <Tooltip title="Edit">
                          <IconButton size="small" onClick={() => openEdit(j)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {perms.canDelete && (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => void remove(j)}>
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
        <DialogTitle>{editingId ? "Edit job" : "New job"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Job title" fullWidth required {...register("jobTitle")} error={!!formState.errors.jobTitle} helperText={formState.errors.jobTitle?.message} />
              <TextField label="Slug (auto if blank)" fullWidth {...register("slug")} />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Experience" fullWidth required {...register("experience")} error={!!formState.errors.experience} helperText={formState.errors.experience?.message} placeholder="0 - 4 YRS OF EXPERIENCE" />
              <TextField label="Department" fullWidth {...register("department")} />
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField label="Location" fullWidth {...register("location")} />
              <TextField label="Employment type" fullWidth {...register("employmentType")} placeholder="Full-time" />
              <TextField label="Job code" fullWidth {...register("jobCode")} />
            </Stack>
            <TextField label="Short description" fullWidth multiline minRows={2} {...register("shortDescription")} />

            <Divider textAlign="left">Qualifications (one per line)</Divider>
            <TextField fullWidth multiline minRows={3} {...register("qualificationsText")} placeholder={"3 - 6 years of experience\nKnowledge of GraphQL."} />

            <Divider textAlign="left">Key Responsibilities</Divider>
            <Controller
              control={control}
              name="respMode"
              render={({ field }) => (
                <RadioGroup row value={field.value} onChange={(_, v) => field.onChange(v)}>
                  <FormControlLabel value="flat" control={<Radio />} label="Simple list" />
                  <FormControlLabel value="grouped" control={<Radio />} label="Grouped by section" />
                </RadioGroup>
              )}
            />
            {respMode === "flat" ? (
              <TextField fullWidth multiline minRows={3} {...register("respFlatText")} placeholder={"One responsibility per line"} />
            ) : (
              <Stack spacing={2}>
                {groupFields.map((g, i) => (
                  <Paper key={g.id} variant="outlined" sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                      <TextField label="Section heading" size="small" fullWidth {...register(`respGroups.${i}.heading` as const)} placeholder="Front-end Development" />
                      <IconButton size="small" color="error" onClick={() => removeGroup(i)}>
                        <DeleteOutlineOutlinedIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                    <TextField label="Items (one per line)" fullWidth multiline minRows={2} {...register(`respGroups.${i}.itemsText` as const)} />
                  </Paper>
                ))}
                <Button size="small" startIcon={<AddIcon />} onClick={() => appendGroup({ heading: "", itemsText: "" })}>
                  Add section
                </Button>
              </Stack>
            )}

            <Divider textAlign="left">Good to have (one per line)</Divider>
            <TextField fullWidth multiline minRows={2} {...register("skillsText")} />

            <Controller
              control={control}
              name="seo"
              render={({ field }) => (
                <SeoFieldsSection value={field.value} onChange={field.onChange} disabled={!perms.canEdit} />
              )}
            />

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <FormControl size="small" sx={{ width: 180 }}>
                  <InputLabel id="job-status">Status</InputLabel>
                  <Select labelId="job-status" label="Status" value={field.value} onChange={field.onChange}>
                    <MenuItem value="ACTIVE">Active</MenuItem>
                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => void onSubmit()} disabled={formState.isSubmitting}>
            {formState.isSubmitting ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
