import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { deleteUploadFile, saveUpload, UploadError } from "@/lib/media/upload";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("DELETE");
  if ("response" in g) return g.response;
  const { id } = await params;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return jsonError("Media not found", 404);

  await deleteUploadFile(media.filename);
  await prisma.media.delete({ where: { id } });
  await prisma.activityLog.create({
    data: {
      userId: g.user.sub,
      action: "DELETE",
      entityType: "Media",
      entityId: id,
      summary: `Deleted media "${media.originalName}"`,
    },
  });
  return jsonOk({ ok: true });
}

export async function PATCH(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;
  const { id } = await params;

  let body: { alt?: unknown };
  try {
    body = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }
  const alt = typeof body.alt === "string" ? body.alt : null;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return jsonError("Media not found", 404);

  const updated = await prisma.media.update({ where: { id }, data: { alt } });
  return jsonOk({ item: updated });
}

export async function PUT(req: NextRequest, { params }: Ctx): Promise<NextResponse> {
  const g = await guard("EDIT");
  if ("response" in g) return g.response;
  const { id } = await params;

  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) return jsonError("Media not found", 404);

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError("Expected multipart form data", 400);
  }
  const file = form.get("file");
  if (!(file instanceof File)) return jsonError("No replacement file provided", 400);

  try {
    const saved = await saveUpload(file);
    await deleteUploadFile(media.filename); // remove the old file
    const updated = await prisma.media.update({
      where: { id },
      data: {
        filename: saved.filename,
        originalName: file.name,
        url: saved.url,
        mimeType: saved.mimeType,
        sizeBytes: saved.sizeBytes,
        width: saved.width,
        height: saved.height,
      },
    });
    await prisma.activityLog.create({
      data: {
        userId: g.user.sub,
        action: "UPDATE",
        entityType: "Media",
        entityId: id,
        summary: `Replaced media "${updated.originalName}"`,
      },
    });
    return jsonOk({ item: updated });
  } catch (err) {
    if (err instanceof UploadError) return jsonError(err.message, 422);
    console.error("[media replace] error:", err);
    return jsonError("Replace failed", 500);
  }
}
