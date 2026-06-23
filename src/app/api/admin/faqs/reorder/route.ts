import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { reorderInput } from "@/lib/validation/common";
import { reorderFaqs } from "@/server/services/faqs";

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

  await reorderFaqs(parsed.data.ids);
  revalidateTag("faqs");
  return jsonOk({ ok: true });
}
