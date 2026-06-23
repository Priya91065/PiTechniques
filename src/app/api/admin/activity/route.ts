import { NextResponse, type NextRequest } from "next/server";
import type { ActivityAction } from "@prisma/client";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { listActivity, listActivityEntityTypes } from "@/server/services/activityLog";

const ACTIONS = ["CREATE", "UPDATE", "DELETE", "PUBLISH", "LOGIN", "LOGOUT"] as const;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;

  const sp = req.nextUrl.searchParams;
  const actionParam = sp.get("action");
  const action = ACTIONS.includes(actionParam as ActivityAction) ? (actionParam as ActivityAction) : undefined;
  const entityType = sp.get("entityType")?.trim() || undefined;
  const search = sp.get("search")?.trim() || undefined;
  const page = Math.max(1, Number(sp.get("page") ?? 1) || 1);
  const take = Math.min(100, Math.max(1, Number(sp.get("take") ?? 25) || 25));

  try {
    const [result, entityTypes] = await Promise.all([
      listActivity({ action, entityType, search, skip: (page - 1) * take, take }),
      listActivityEntityTypes(),
    ]);
    return jsonOk({ ...result, entityTypes, page, take });
  } catch {
    return jsonError("Couldn't load activity. Is the database connected?", 503, "DB_UNAVAILABLE");
  }
}
