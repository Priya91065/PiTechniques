"use client";

import type { JSX } from "react";
import { Divider, Stack, TextField } from "@mui/material";

export interface SeoFieldsValue {
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  canonicalUrl: string;
  ogImage: string;
  twitterImage: string;
  robotsMeta: string;
}

export const EMPTY_SEO_FIELDS: SeoFieldsValue = {
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  canonicalUrl: "",
  ogImage: "",
  twitterImage: "",
  robotsMeta: "",
};

/** Reusable SEO fields form section, shared by Services/Jobs/CaseStudies/About/Contact admin managers. */
export default function SeoFieldsSection({
  value,
  onChange,
  disabled = false,
}: {
  value: SeoFieldsValue;
  onChange: (next: SeoFieldsValue) => void;
  disabled?: boolean;
}): JSX.Element {
  const set = <K extends keyof SeoFieldsValue>(key: K, v: string) => onChange({ ...value, [key]: v });

  return (
    <Stack spacing={2}>
      <Divider textAlign="left">SEO</Divider>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField label="SEO title" value={value.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} fullWidth disabled={disabled} />
        <TextField label="Canonical URL" value={value.canonicalUrl} onChange={(e) => set("canonicalUrl", e.target.value)} fullWidth disabled={disabled} />
      </Stack>
      <TextField
        label="SEO description"
        value={value.seoDescription}
        onChange={(e) => set("seoDescription", e.target.value)}
        fullWidth
        multiline
        minRows={2}
        disabled={disabled}
      />
      <TextField label="SEO keywords" value={value.seoKeywords} onChange={(e) => set("seoKeywords", e.target.value)} fullWidth disabled={disabled} helperText="Comma-separated" />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <TextField label="OG image URL" value={value.ogImage} onChange={(e) => set("ogImage", e.target.value)} fullWidth disabled={disabled} />
        <TextField label="Twitter image URL" value={value.twitterImage} onChange={(e) => set("twitterImage", e.target.value)} fullWidth disabled={disabled} />
      </Stack>
      <TextField
        label="Robots meta"
        value={value.robotsMeta}
        onChange={(e) => set("robotsMeta", e.target.value)}
        fullWidth
        disabled={disabled}
        placeholder="index, follow"
      />
    </Stack>
  );
}
