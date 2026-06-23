import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { reorderInput } from "@/lib/validation/common";
import { reorderSections } from "@/server/services/sections";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = reorderInput.safeParse(body);
  if (!parsed.success) return jsonError("Invalid input", 422);

  await reorderSections(id, parsed.data.ids);
  const page = await prisma.page.findUnique({ where: { id }, select: { slug: true } });
  revalidateTag("pages");
  if (page) revalidatePath(`/${page.slug}`);
  return jsonOk({ ok: true });
}
