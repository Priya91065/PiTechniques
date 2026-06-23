import { NextResponse, type NextRequest } from "next/server";
import type { ContactStatus } from "@prisma/client";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { listSubmissions } from "@/server/services/contactSubmissions";

const STATUSES = ["UNREAD", "READ", "ARCHIVED"] as const;
const SOURCES = ["CONTACT", "CAREER"] as const;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;

  const sp = req.nextUrl.searchParams;
  const statusParam = sp.get("status");
  const sourceParam = sp.get("source");
  const status = STATUSES.includes(statusParam as ContactStatus) ? (statusParam as ContactStatus) : undefined;
  const source = SOURCES.includes(sourceParam as (typeof SOURCES)[number]) ? (sourceParam as (typeof SOURCES)[number]) : undefined;
  const search = sp.get("search")?.trim() || undefined;
  const page = Math.max(1, Number(sp.get("page") ?? 1) || 1);
  const take = Math.min(100, Math.max(1, Number(sp.get("take") ?? 25) || 25));

  try {
    const result = await listSubmissions({ status, source, search, skip: (page - 1) * take, take });
    return jsonOk({ ...result, page, take });
  } catch {
    return jsonError("Couldn't load messages. Is the database connected?", 503, "DB_UNAVAILABLE");
  }
}
