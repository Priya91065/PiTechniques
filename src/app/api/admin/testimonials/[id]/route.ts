import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { testimonialInput } from "@/lib/validation/testimonial";
import { deleteTestimonial, updateTestimonial } from "@/server/services/testimonials";

type Ctx = { params: Promise<{ id: string }> };

function revalidate(): void {
  revalidateTag("testimonials");
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
  const parsed = testimonialInput.partial().safeParse(body);
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid input", 422);

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return jsonError("Testimonial not found", 404);

  const item = await updateTestimonial(id, parsed.data);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: parsed.data.published !== undefined ? "PUBLISH" : "UPDATE",
      entityType: "Testimonial",
      entityId: id,
      summary: `Updated testimonial for ${item.company}`,
    },
  });

  revalidate();
  return jsonOk({ item });
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) return jsonError("Testimonial not found", 404);

  await deleteTestimonial(id);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "DELETE",
      entityType: "Testimonial",
      entityId: id,
      summary: `Deleted testimonial for ${existing.company}`,
    },
  });

  revalidate();
  return jsonOk({ ok: true });
}
