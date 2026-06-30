import { NextResponse } from "next/server";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { listPolicyPages } from "@/server/services/policyPages";
import { POLICY_PAGES_HTML, POLICY_SLUGS } from "@/constants/policyPagesHtml";

export async function GET(): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  try {
    const rows = await listPolicyPages();
    const bySlug = new Map(rows.map((r) => [r.slug, r]));
    // Always surface the known policy pages, even before they exist in the DB.
    const items = POLICY_SLUGS.map((slug) => {
      const row = bySlug.get(slug);
      const def = POLICY_PAGES_HTML[slug];
      return {
        slug,
        heading: row?.heading ?? def.heading,
        status: row?.status ?? "PUBLISHED",
        inDb: Boolean(row),
        updatedAt: row?.updatedAt ?? null,
      };
    });
    return jsonOk({ items });
  } catch {
    return jsonError("Couldn't load policy pages. Is the database connected?", 503, "DB_UNAVAILABLE");
  }
}
