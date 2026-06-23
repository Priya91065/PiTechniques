import { NextResponse, type NextRequest } from "next/server";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { revalidateCaseStudies } from "@/lib/api/revalidate";
import { reorderInput } from "@/lib/validation/common";
import { reorderCaseStudies } from "@/server/services/caseStudies";

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

  await reorderCaseStudies(parsed.data.ids);
  revalidateCaseStudies();
  return jsonOk({ ok: true });
}
