import { NextResponse, type NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { contactSubmissionInput } from "@/lib/validation/contact";
import { createSubmission } from "@/server/services/contactSubmissions";
import { ResumeUploadError, saveResume } from "@/lib/media/resume";
import { rateLimit } from "@/lib/rateLimit";
import { isEmailConfigured, sendEmail } from "@/lib/email/mailer";
import type { ContactSubmissionInput } from "@/lib/validation/contact";

/** Builds the notification email body from a submission. */
function buildNotification(data: ContactSubmissionInput): { subject: string; text: string; html: string } {
  const name = [data.firstName, data.lastName].filter(Boolean).join(" ").trim();
  const label = data.source === "CAREER" ? "career application" : "contact enquiry";
  const rows: [string, string | null | undefined][] = [
    ["Name", name],
    ["Email", data.email],
    ["Phone", data.phone],
    ["Position", data.position],
    ["Message", data.message],
    ["Resume", data.resumeUrl],
  ];
  const present = rows.filter(([, v]) => v && String(v).trim().length > 0) as [string, string][];
  const text = present.map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `<h2>New ${label}</h2><table cellpadding="6">${present
    .map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table>`;
  return { subject: `New ${label} from ${name || data.email}`, text, html };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

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
  } catch (err) {
    console.error("[contact] failed to persist submission:", err);
    return jsonError("Something went wrong sending your message. Please try again.", 500);
  }

  // The submission is now safely stored (admin Messages inbox). Attempt to send
  // the notification email on top of that. We only report "sent" once the email
  // provider has accepted the message — but a mail failure does NOT lose the
  // submission, since it's already persisted above.
  if (!isEmailConfigured()) {
    // No SMTP configured yet: log loudly so it's visible in server logs, and
    // preserve the existing DB-only behavior rather than failing the request.
    console.warn(
      "[contact] email not configured (SMTP_HOST/SMTP_USER/SMTP_PASS unset) — submission saved to DB only, no email sent.",
    );
    return jsonOk({ ok: true, message: "Thanks! Your message has been sent." }, 201);
  }

  try {
    const { subject, text, html } = buildNotification(parsed.data);
    const result = await sendEmail({ subject, text, html, replyTo: parsed.data.email });
    console.info("[contact] notification email accepted by provider:", result.messageId);
    return jsonOk({ ok: true, message: "Thanks! Your message has been sent." }, 201);
  } catch (err) {
    console.error("[contact] email send failed (submission was saved):", err);
    return jsonError(
      "We received your details but couldn't send the notification email. We'll still be in touch.",
      502,
    );
  }
}
