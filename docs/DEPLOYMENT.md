# Deploying to Vercel (database + Prisma + env)

This guide fixes the production error:

> "Can't reach the database…"

It only covers **database / Prisma / environment / deployment** config. The
frontend UI/UX is unchanged.

---

## Root cause

The admin panel talks to PostgreSQL through Prisma. On Vercel it failed because:

1. **`DATABASE_URL` was not available to the deployed app.** `.env` is
   git-ignored (correctly — it holds secrets), so it never ships to Vercel.
   Without the env var set in the Vercel dashboard, Prisma throws
   `PrismaClientInitializationError`, which the login route reports as
   "Can't reach the database…".
2. **The build didn't generate the Prisma Client or apply migrations.** The
   build script was `next build` only. Vercel caches dependencies, so Prisma's
   auto-generate can be skipped on later deploys (stale client), and the
   production database never received the schema/migrations.

## What changed in the repo

| File | Change |
| --- | --- |
| `package.json` | `build` → `prisma generate && next build`; added `postinstall: prisma generate`. Guarantees a fresh Prisma Client on every deploy. (Migrations are run as a one-off step — see below — so a missing/misconfigured DB never hard-fails the deploy.) |
| `src/app/api/admin/auth/login/route.ts` | DB-error message is now environment-agnostic (no longer says "edit .env"); logs the full error to the server (visible in Vercel function logs). |
| `.env.example` | Documents the pooled `DATABASE_URL` vs direct `DIRECT_URL` for Neon/Supabase on Vercel. |

> The build **does not** require the DB (the homepage prerenders with built-in
> fallbacks if the DB is unreachable at build time). But the running app and the
> migrate/seed steps DO need the env vars below.

---

## Required environment variables (set in Vercel → Settings → Environment Variables)

Set these for **Production** (and Preview if you use preview deploys):

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | **Pooled** connection string (Neon host with `-pooler`, `?sslmode=require&pgbouncer=true`). Used by the app at runtime. |
| `DIRECT_URL` | **Direct** (non-pooled) connection string (`?sslmode=require`). Used by `prisma migrate deploy`. |
| `JWT_ACCESS_SECRET` | Long random string (≥32 chars). |
| `JWT_REFRESH_SECRET` | A *different* long random string (≥32 chars). |
| `NEXT_PUBLIC_SITE_URL` | `https://<your-vercel-domain>` (used for canonical/OG/sitemap). |
| `SEED_SUPERADMIN_EMAIL` | First admin email (for the one-time seed). |
| `SEED_SUPERADMIN_PASSWORD` | First admin password (change after first login). |
| `SEED_SUPERADMIN_NAME` | e.g. `Super Admin`. |
| `BCRYPT_ROUNDS` | `12` (optional; defaults to 12). |
| `JWT_ACCESS_TTL` / `JWT_REFRESH_TTL` | optional (`15m` / `7d`). |
| `MAX_UPLOAD_MB` | optional (defaults to 10). |

Generate a secret:
`node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`

---

## Database setup (one time)

1. **Provision Postgres** if you don't have one — Neon (or Vercel Postgres /
   Supabase). Copy both the **pooled** and **direct** connection strings.
2. Put them in Vercel env vars (`DATABASE_URL` pooled, `DIRECT_URL` direct).
   **When adding each variable, tick all of Production, Preview AND Development**
   so it's available at build and runtime — then **redeploy** (existing deploys
   do not pick up new env vars automatically).
3. **Apply migrations to the production DB — one time.** Run from your machine
   with the production connection string (use the **direct** URL, since
   migrations can't run through a pooler):
   ```bash
   DATABASE_URL="<direct-url>" DIRECT_URL="<direct-url>" npx prisma migrate deploy
   ```
4. **Seed the admin + CMS data — once.** From your machine, pointed at prod:
   ```bash
   DATABASE_URL="<direct-url>" \
   DIRECT_URL="<direct-url>" \
   SEED_SUPERADMIN_EMAIL="you@example.com" \
   SEED_SUPERADMIN_PASSWORD="a-strong-password" \
   npm run db:seed
   ```
   This creates the Super Admin and the initial CMS content (services,
   testimonials, case studies, jobs, nav, home stats, SEO, etc.).

> Prefer auto-migrate on deploy? Set the project's **Build Command** (Vercel →
> Settings → Build & Development) to
> `prisma generate && prisma migrate deploy && next build`. Only do this once
> `DATABASE_URL` **and** `DIRECT_URL` are set, or the build will fail.

---

## Deployment steps

1. Commit & push these changes (or redeploy the current commit).
2. Set the env vars above in Vercel (all environments) **and redeploy**.
3. Run the one-time migrate (step 3) and seed (step 4) against the prod DB.
4. Visit `/admin/login` and sign in with the seeded Super Admin.

---

## Troubleshooting: `Environment variable not found: DATABASE_URL`

This exact error (seen in the Vercel build/runtime logs) means **`DATABASE_URL`
is not present in the Vercel environment** — Prisma can't read
`env("DATABASE_URL")` from `prisma/schema.prisma`. It is **not** a code problem.

Fix:
1. Vercel → your project → **Settings → Environment Variables**.
2. Add `DATABASE_URL` (and `DIRECT_URL`) with the connection strings, ticking
   **Production, Preview, and Development**.
3. **Redeploy** (Deployments → ⋯ → Redeploy). Env-var changes only take effect
   on a new build/deploy.

During the build you may still see these Prisma errors logged while pages
prerender — the site falls back to built-in content so the **build still
succeeds**, but the admin/API need the variable at **runtime**, so it must be
set regardless.

---

## Media uploads on Vercel — Vercel Blob (implemented)

Vercel's serverless filesystem is read-only/ephemeral, so writing uploads to
`public/uploads` does not work there. The upload helpers now use **Vercel Blob**
automatically **when `BLOB_READ_WRITE_TOKEN` is set**, and fall back to local
disk when it isn't (local dev). Stored URLs in the DB are unchanged in shape.

To enable persistent uploads in production:

1. In Vercel: **Storage → Blob → Create**, then connect it to the project. This
   adds the `BLOB_READ_WRITE_TOKEN` env var automatically (or add it manually).
2. Redeploy. Image (Media Library, banner, about) and CV uploads now go to Vercel
   Blob and persist across redeploys; deletes/replacements remove the old blob.

No code or UI changes are needed — it's controlled entirely by the env var.
Everything else (text, numbers, cards, testimonials, logos, SEO, etc.) lives in
Postgres and already persists across redeploys.
