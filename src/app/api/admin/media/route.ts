import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { guard } from "@/lib/api/guard";
import { jsonError, jsonOk } from "@/lib/api/http";
import { listMedia } from "@/server/services/media";
import { saveUpload, UploadError } from "@/lib/media/upload";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const g = await guard();
  if ("response" in g) return g.response;

  const { searchParams } = req.nextUrl;
  const search = searchParams.get("search") ?? undefined;
  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const take = Math.min(100, Math.max(1, Number(searchParams.get("take") ?? "60")));

  try {
    const { items, total } = await listMedia({ search, skip: (page - 1) * take, take });
    return jsonOk({ items, total, page, take });
  } catch {
    return jsonError("Couldn't load media. Is the database connected?", 503, "DB_UNAVAILABLE");
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const g = await guard("CREATE");
  if ("response" in g) return g.response;

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return jsonError("Expected multipart form data", 400);
  }

  const files = form.getAll("files").filter((f): f is File => f instanceof File);
  if (files.length === 0) return jsonError("No files provided", 400);

  try {
    const created = [];
    for (const file of files) {
      const saved = await saveUpload(file);
      const record = await prisma.media.create({
        data: {
          filename: saved.filename,
          originalName: file.name,
          url: saved.url,
          mimeType: saved.mimeType,
          sizeBytes: saved.sizeBytes,
          width: saved.width,
          height: saved.height,
          uploadedById: g.user.sub,
        },
      });
      created.push(record);
    }

    await prisma.activityLog.create({
      data: {
        userId: g.user.sub,
        action: "CREATE",
        entityType: "Media",
        summary: `Uploaded ${created.length} file${created.length > 1 ? "s" : ""}`,
      },
    });

    return jsonOk({ items: created }, 201);
  } catch (err) {
    if (err instanceof UploadError) return jsonError(err.message, 422);
    console.error("[media upload] error:", err);
    return jsonError("Upload failed", 500);
  }
}
