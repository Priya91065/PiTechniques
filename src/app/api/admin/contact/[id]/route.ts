import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { contactStatusUpdate } from "@/lib/validation/contact";
import { deleteSubmission, getSubmission, setSubmissionStatus } from "@/server/services/contactSubmissions";
import { deleteResume } from "@/lib/media/resume";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;
  const { id } = await params;
  const item = await getSubmission(id);
  if (!item) return jsonError("Message not found", 404);
  return jsonOk({ item });
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
  const parsed = contactStatusUpdate.safeParse(body);
  if (!parsed.success) return jsonError("Invalid status", 422);

  const existing = await getSubmission(id);
  if (!existing) return jsonError("Message not found", 404);

  const item = await setSubmissionStatus(id, parsed.data.status);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "UPDATE",
      entityType: "ContactSubmission",
      entityId: id,
      summary: `Marked message from ${existing.email} as ${parsed.data.status.toLowerCase()}`,
    },
  });
  return jsonOk({ item });
}

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const existing = await getSubmission(id);
  if (!existing) return jsonError("Message not found", 404);

  await deleteSubmission(id);
  await deleteResume(existing.resumeUrl);
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "DELETE",
      entityType: "ContactSubmission",
      entityId: id,
      summary: `Deleted message from ${existing.email}`,
    },
  });
  return jsonOk({ ok: true });
}
