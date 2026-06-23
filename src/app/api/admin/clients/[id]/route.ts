import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { clientInput } from "@/lib/validation/client";
import { deleteClient, updateClient } from "@/server/services/clients";

type Ctx = { params: Promise<{ id: string }> };

function revalidate(): void {
  revalidateTag("clients");
  revalidatePath("/");
}

export async function PATCH(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const parsed = clientInput.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const existing = await prisma.client.findUnique({ where: { id } });
  if (!existing) return jsonError("Client not found", 404);

  const item = await updateClient(id, parsed.data);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: parsed.data.published !== undefined ? "PUBLISH" : "UPDATE",
      entityType: "Client",
      entityId: id,
      summary: `Updated client "${item.name}"`,
    },
  });

  revalidate();
  return jsonOk({ item });
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const existing = await prisma.client.findUnique({ where: { id } });
  if (!existing) return jsonError("Client not found", 404);

  await deleteClient(id);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "DELETE",
      entityType: "Client",
      entityId: id,
      summary: `Deleted client "${existing.name}"`,
    },
  });

  revalidate();
  return jsonOk({ ok: true });
}
