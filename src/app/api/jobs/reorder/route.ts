import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { reorderInput } from "@/lib/validation/common";
import { reorderJobs } from "@/server/services/jobs";

/** POST /api/jobs/reorder — guarded display-order update. Static segment wins over [idOrSlug]. */
export async function POST(req: NextRequest): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = reorderInput.safeParse(body);
  if (!parsed.success) return jsonError("Invalid input", 422);

  await reorderJobs(parsed.data.ids);
  revalidateTag("jobs");
  revalidatePath("/careers");
  revalidatePath("/career-details");
  return jsonOk({ ok: true });
}
