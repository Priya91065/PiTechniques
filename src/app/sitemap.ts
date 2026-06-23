import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/** Faithful marketing routes that always exist. */
const STATIC_PATHS = [
  "",
  "/about",
  "/services",
  "/case-studies",
  "/careers",
  "/contact-us",
  "/privacy-policy",
  "/terms-of-use",
  "/csr-policy",
  "/data-protection",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let pages: { slug: string; updatedAt: Date }[] = [];
  let jobs: { slug: string; updatedAt: Date }[] = [];
  try {
    [pages, jobs] = await Promise.all([
      prisma.page.findMany({ where: { status: "PUBLISHED" }, select: { slug: true, updatedAt: true } }),
      prisma.job.findMany({ where: { status: "ACTIVE" }, select: { slug: true, updatedAt: true } }),
    ]);
  } catch {
    // DB unavailable at build/runtime — still emit the static routes.
  }

  const now = new Date();
  return [
    ...STATIC_PATHS.map((p) => ({ url: `${BASE}${p || "/"}`, lastModified: now })),
    ...pages.map((p) => ({ url: `${BASE}/${p.slug}`, lastModified: p.updatedAt })),
    ...jobs.map((j) => ({ url: `${BASE}/career-details?jobTitle=${j.slug}`, lastModified: j.updatedAt })),
  ];
}
