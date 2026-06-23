import { NextResponse, type NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { contactSubmissionInput } from "@/lib/validation/contact";
import { createSubmission } from "@/server/services/contactSubmissions";
import { ResumeUploadError, saveResume } from "@/lib/media/resume";
import { rateLimit } from "@/lib/rateLimit";

/**
 * Public contact / career form submission endpoint. Unauthenticated by design
 * (the middleware only guards /admin and /api/admin). Accepts either JSON (the
 * contact form) or multipart/form-data (the career form, which includes a CV).
 * Persists the message so it shows up in the admin Messages inbox.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // Throttle abuse: max 5 submissions per 10 minutes per IP.
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const limited = rateLimit(`contact:${ip}`, 5, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfterSeconds) } },
    );
  }

  const contentType = req.headers.get("content-type") ?? "";

  let raw: Record<string, unknown>;
  let resumeUrl: string | null = null;

  try {
    if (contentType.includes("multipart/form-data")) {
      const fd = await req.formData();
      const resume = fd.get("resume");
      if (resume instanceof File && resume.size > 0) {
        try {
          resumeUrl = (await saveResume(resume)).url;
        } catch (err) {
          if (err instanceof ResumeUploadError) return jsonError(err.message, 422);
          throw err;
        }
      }
      raw = {
        source: (fd.get("source") as string) || "CAREER",
        firstName: fd.get("firstName"),
        lastName: fd.get("lastName"),
        email: fd.get("email"),
        phone: fd.get("phone"),
        message: fd.get("message"),
        position: fd.get("position"),
        resumeUrl,
      };
    } else {
      raw = (await req.json()) as Record<string, unknown>;
    }
  } catch {
    return jsonError("Invalid request", 400);
  }

  const parsed = contactSubmissionInput.safeParse(raw);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Please check the form and try again", 422);
  }

  try {
    const ipAddress = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = req.headers.get("user-agent");
    await createSubmission(parsed.data, { ipAddress, userAgent });
    return jsonOk({ ok: true, message: "Thanks! Your message has been sent." }, 201);
  } catch {
    return jsonError("Something went wrong sending your message. Please try again.", 500);
  }
}
