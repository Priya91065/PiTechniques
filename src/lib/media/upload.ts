import { randomBytes } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { put, del } from "@vercel/blob";
import { getServerEnv } from "@/lib/env";

const RASTER = new Set(["image/jpeg", "image/png", "image/webp"]);
const PASSTHROUGH = new Set(["image/svg+xml", "image/gif"]);
export const ALLOWED_MIME = new Set([...RASTER, ...PASSTHROUGH]);

const EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};

const MAX_DIMENSION = 2400;

/** Use Vercel Blob when a token is configured (production); else local disk (dev). */
function blobEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export class UploadError extends Error {}

export interface SavedFile {
  filename: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
}

function publicUrlFor(uploadDir: string, filename: string): string {
  const base = uploadDir.replace(/\\/g, "/").replace(/^public/, "");
  const prefix = base.startsWith("/") ? base : `/${base}`;
  return `${prefix}/${filename}`.replace(/\/+/g, "/");
}

/** Validates, optimizes (raster) and stores an uploaded image — Vercel Blob in
 *  production (BLOB_READ_WRITE_TOKEN set), otherwise the local UPLOAD_DIR. */
export async function saveUpload(file: File): Promise<SavedFile> {
  const env = getServerEnv();
  const maxBytes = env.MAX_UPLOAD_MB * 1024 * 1024;

  if (!ALLOWED_MIME.has(file.type)) {
    throw new UploadError(`Unsupported file type: ${file.type || "unknown"}`);
  }
  if (file.size > maxBytes) {
    throw new UploadError(`File exceeds the ${env.MAX_UPLOAD_MB}MB limit`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = EXT[file.type];
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;

  let outBuffer: Buffer = buffer;
  let width: number | null = null;
  let height: number | null = null;

  if (RASTER.has(file.type)) {
    const image = sharp(buffer, { failOn: "none" });
    const meta = await image.metadata();
    let pipeline = image;
    if (meta.width && meta.width > MAX_DIMENSION) {
      pipeline = pipeline.resize({ width: MAX_DIMENSION, withoutEnlargement: true });
    }
    if (file.type === "image/jpeg") pipeline = pipeline.jpeg({ quality: 82, mozjpeg: true });
    else if (file.type === "image/png") pipeline = pipeline.png({ compressionLevel: 9 });
    else if (file.type === "image/webp") pipeline = pipeline.webp({ quality: 82 });
    outBuffer = await pipeline.toBuffer();
    const outMeta = await sharp(outBuffer).metadata();
    width = outMeta.width ?? meta.width ?? null;
    height = outMeta.height ?? meta.height ?? null;
  }

  let url: string;
  if (blobEnabled()) {
    const blob = await put(`uploads/${filename}`, outBuffer, { access: "public", contentType: file.type });
    url = blob.url;
  } else {
    const uploadDir = path.join(process.cwd(), env.UPLOAD_DIR);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), outBuffer);
    url = publicUrlFor(env.UPLOAD_DIR, filename);
  }

  return { filename, url, mimeType: file.type, sizeBytes: outBuffer.length, width, height };
}

/** Deletes a stored file by its public URL (Blob) or filename/path (local). */
export async function deleteUploadFile(urlOrFilename: string): Promise<void> {
  if (/^https?:\/\//.test(urlOrFilename)) {
    try {
      await del(urlOrFilename);
    } catch {
      // Already gone — nothing to do.
    }
    return;
  }
  const env = getServerEnv();
  const dest = path.join(process.cwd(), env.UPLOAD_DIR, path.basename(urlOrFilename));
  try {
    await unlink(dest);
  } catch {
    // File already removed — nothing to do.
  }
}
