import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { officeLocationInput } from "@/lib/validation/contactPage";
import { deleteOfficeLocation, updateOfficeLocation } from "@/server/services/officeLocations";

type Ctx = { params: Promise<{ id: string }> };

function revalidate(): void {
  revalidateTag("contact-page");
  revalidatePath("/contact-us");
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
  const parsed = officeLocationInput.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const existing = await prisma.officeLocation.findUnique({ where: { id } });
  if (!existing) return jsonError("Office location not found", 404);

  const item = await updateOfficeLocation(id, parsed.data);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: parsed.data.published !== undefined ? "PUBLISH" : "UPDATE",
      entityType: "OfficeLocation",
      entityId: id,
      summary: `Updated office location "${item.name}"`,
    },
  });
  revalidate();
  return jsonOk({ item });
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const existing = await prisma.officeLocation.findUnique({ where: { id } });
  if (!existing) return jsonError("Office location not found", 404);

  await deleteOfficeLocation(id);
  await prisma.activityLog.create({
    data: { userId: g.user.sub, action: "DELETE", entityType: "OfficeLocation", entityId: id, summary: `Deleted office location "${existing.name}"` },
  });

  revalidate();
  return jsonOk({ ok: true });
}
