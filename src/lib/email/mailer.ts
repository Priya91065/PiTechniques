import nodemailer, { type Transporter } from "nodemailer";
import { getServerEnv } from "@/lib/env";

/**
 * SMTP email sender for public form notifications (contact + career).
 *
 * Design notes:
 *  - Server-only. Reads SMTP credentials from the environment.
 *  - Lazily configured: a single transporter is created on first use and reused
 *    (module scope) so we don't reconnect per request.
 *  - Safe to import when email is NOT configured — `isEmailConfigured()` lets
 *    callers detect that and fall back to DB-only persistence instead of
 *    throwing. This preserves existing behavior on deployments that have not
 *    yet set the SMTP_* vars.
 */

let transporter: Transporter | null = null;

/**
 * True when the minimum SMTP credentials are present.
 *
 * `getServerEnv()` validates the *entire* env schema (JWT secrets, DATABASE_URL,
 * etc.), not just the SMTP fields — so an unrelated misconfigured var elsewhere
 * would otherwise throw here and take down public form submissions that have
 * nothing to do with email. Treat any validation failure as "not configured"
 * rather than letting it crash the caller.
 */
export function isEmailConfigured(): boolean {
  try {
    const env = getServerEnv();
    return Boolean(env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS);
  } catch (err) {
    console.error("[mailer] server env validation failed, treating email as unconfigured:", err);
    return false;
  }
}

function getTransporter(): Transporter {
  if (transporter) return transporter;
  const env = getServerEnv();
  if (!env.SMTP_HOST || !env.SMTP_USER || !env.SMTP_PASS) {
    throw new Error("SMTP is not configured (SMTP_HOST, SMTP_USER, SMTP_PASS required)");
  }
  // Default to implicit TLS on port 465, STARTTLS otherwise, unless overridden.
  const secure = env.SMTP_SECURE ?? env.SMTP_PORT === 465;
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure,
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  });
  return transporter;
}

export interface SendEmailParams {
  subject: string;
  text: string;
  html?: string;
  /** Reply-To header — set to the submitter so a reply reaches them directly. */
  replyTo?: string;
}

export interface SendEmailResult {
  /** Provider-assigned message id (present only when the provider accepted it). */
  messageId: string;
  /** Recipients the provider rejected, if any. */
  rejected: (string | { address: string })[];
}

/**
 * Sends an email via SMTP and resolves only once the provider has *accepted*
 * the message. Throws if SMTP is unconfigured, the connection fails, or every
 * recipient was rejected — so callers can report a real failure to the user
 * instead of a false "sent" confirmation.
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const env = getServerEnv();
  const to = env.CONTACT_NOTIFY_TO;
  if (!to) {
    throw new Error("No recipient configured (CONTACT_NOTIFY_TO required)");
  }
  const from = env.CONTACT_FROM_EMAIL ?? env.SMTP_USER!;

  const info = await getTransporter().sendMail({
    from,
    to: to.split(",").map((addr) => addr.trim()).filter(Boolean),
    subject: params.subject,
    text: params.text,
    html: params.html,
    replyTo: params.replyTo,
  });

  // Nodemailer resolves on a 2xx from the server, but a multi-recipient send can
  // still have per-address rejections — treat "all rejected" as a hard failure.
  if (info.accepted.length === 0 && info.rejected.length > 0) {
    throw new Error(`All recipients rejected: ${info.rejected.join(", ")}`);
  }

  return { messageId: info.messageId, rejected: info.rejected };
}
