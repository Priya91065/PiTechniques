import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { serviceInput } from "@/lib/validation/service";
import { deleteService, updateService } from "@/server/services/services";

type Ctx = { params: Promise<{ id: string }> };

function revalidate(): void {
  revalidateTag("services");
  revalidatePath("/");
  revalidatePath("/services");
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
  const parsed = serviceInput.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return jsonError("Service not found", 404);

  try {
    const item = await updateService(id, parsed.data);
    await prisma.activityLog.create({
      data: {
        userId: g.user.sub,
        action: parsed.data.published !== undefined ? "PUBLISH" : "UPDATE",
        entityType: "Service",
        entityId: id,
        summary: `Updated service "${item.title}"`,
      },
    });
    revalidate();
    return jsonOk({ item });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return jsonError("A service with that slug already exists", 409);
    }
    throw err;
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const existing = await prisma.service.findUnique({ where: { id } });
  if (!existing) return jsonError("Service not found", 404);

  await deleteService(id);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "DELETE",
      entityType: "Service",
      entityId: id,
      summary: `Deleted service "${existing.title}"`,
    },
  });

  revalidate();
  return jsonOk({ ok: true });
}
