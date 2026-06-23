import { randomBytes } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import { getServerEnv } from "@/lib/env";

const ALLOWED: Record<string, string> = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
};

/** Resume uploads are capped independently of image uploads. */
const MAX_RESUME_MB = 25;

export class ResumeUploadError extends Error {}

export interface SavedResume {
  url: string;
  filename: string;
}

/** Validates and writes an uploaded CV/resume (PDF/DOC/DOCX) to UPLOAD_DIR/resumes. */
export async function saveResume(file: File): Promise<SavedResume> {
  const ext = ALLOWED[file.type];
  if (!ext) {
    throw new ResumeUploadError("Only PDF or Word documents are allowed.");
  }
  if (file.size > MAX_RESUME_MB * 1024 * 1024) {
    throw new ResumeUploadError(`File exceeds the ${MAX_RESUME_MB}MB limit.`);
  }

  const env = getServerEnv();
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${randomBytes(6).toString("hex")}.${ext}`;
  const dir = path.join(process.cwd(), env.UPLOAD_DIR, "resumes");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);

  const base = env.UPLOAD_DIR.replace(/\\/g, "/").replace(/^public/, "");
  const prefix = base.startsWith("/") ? base : `/${base}`;
  return { url: `${prefix}/resumes/${filename}`.replace(/\/+/g, "/"), filename };
}

/** Removes a stored resume given its public URL (best-effort; basename only). */
export async function deleteResume(url: string | null | undefined): Promise<void> {
  if (!url) return;
  const env = getServerEnv();
  const dest = path.join(process.cwd(), env.UPLOAD_DIR, "resumes", path.basename(url));
  try {
    await unlink(dest);
  } catch {
    // Already gone — nothing to do.
  }
}
