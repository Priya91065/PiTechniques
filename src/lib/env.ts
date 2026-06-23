import { z } from "zod";

/**
 * Type-safe, validated access to server environment variables.
 *
 * IMPORTANT: server-only. Do not import this from a Client Component — it reads
 * secrets (DB URL, JWT secrets). Validation is lazy (runs on first
 * `getServerEnv()` call), so importing this module never crashes the app at
 * build/import time; the required vars are only enforced when a consumer
 * (DB client, auth) actually needs them.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),

  // Database (Phase 2)
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1).optional(),

  // Auth (Phase 3)
  JWT_ACCESS_SECRET: z.string().min(32, "JWT_ACCESS_SECRET must be at least 32 characters"),
  JWT_REFRESH_SECRET: z.string().min(32, "JWT_REFRESH_SECRET must be at least 32 characters"),
  JWT_ACCESS_TTL: z.string().default("15m"),
  JWT_REFRESH_TTL: z.string().default("7d"),
  BCRYPT_ROUNDS: z.coerce.number().int().min(10).max(15).default(12),

  // Media (Phase 5)
  UPLOAD_DIR: z.string().default("public/uploads"),
  MAX_UPLOAD_MB: z.coerce.number().int().positive().default(10),

  // Production file storage: when set (Vercel Blob), uploads go to Blob and
  // persist across deploys; when unset, uploads use the local UPLOAD_DIR.
  BLOB_READ_WRITE_TOKEN: z.string().optional(),
});

export type ServerEnv = z.infer<typeof envSchema>;

let cached: ServerEnv | null = null;

/** Returns the validated server environment, throwing a readable error if invalid. */
export function getServerEnv(): ServerEnv {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".") || "(root)"}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid environment variables:\n${issues}`);
  }
  cached = parsed.data;
  return cached;
}
