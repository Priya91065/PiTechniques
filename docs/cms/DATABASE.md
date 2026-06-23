# Database Guide (PostgreSQL + Prisma)

Everything you need to create, run, migrate, seed, back up, and host the
database. **You don't have a database yet — start with Step 1.**

> Recommended for beginners: **Option A (Neon cloud)** — no installation, just a
> connection string. If you'd rather keep everything local, use Option B or C.

---

## Step 1 — Get a PostgreSQL database

### Option A — Neon (free cloud Postgres, no install) ✅ recommended
1. Go to **https://neon.tech** → **Sign up** (GitHub/Google/email).
2. Click **Create project**. Name it `pitechniques`. Region: pick the closest.
3. After it's created, open **Dashboard → Connect** and copy the
   **connection string**. It looks like:
   ```
   postgresql://USER:PASSWORD@ep-xxxx.region.aws.neon.tech/pitechniques?sslmode=require
   ```
4. Paste it into your `.env` (see Step 2). Neon also shows a **pooled** and a
   **direct** string — use the pooled one for `DATABASE_URL` and the direct one
   for `DIRECT_URL` (if only one is shown, use it for both).

### Option B — Local PostgreSQL (native install, Windows)
1. Download the installer: **https://www.postgresql.org/download/windows/**
   (EnterpriseDB). Install PostgreSQL 16 — accept defaults, set a password for
   the `postgres` user, keep port **5432**, and install **pgAdmin** (the GUI).
2. Open **pgAdmin** → connect with the password you set → right-click
   **Databases → Create → Database** → name it `pitechniques`.
3. Your connection string (using the default `postgres` user):
   ```
   postgresql://postgres:YOUR_PASSWORD@localhost:5432/pitechniques?schema=public
   ```

### Option C — Docker (if you install Docker Desktop later)
A `docker-compose.yml` is included. With Docker Desktop running:
```bash
docker compose up -d            # starts Postgres on localhost:5432
```
Use the default string already in `.env.example`:
```
postgresql://pi_admin:pi_password@localhost:5432/pitechniques?schema=public
```
> `docker-compose.yml` is a **file**, not a command. Run `docker compose up -d`.

---

## Step 2 — Configure environment variables
1. If you haven't already: `cp .env.example .env` (PowerShell:
   `Copy-Item .env.example .env`).
2. Open `.env` and set **`DATABASE_URL`** (and `DIRECT_URL`) to the string from
   Step 1.
3. Generate strong JWT secrets (needed from Phase 3) — run twice and paste:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
   ```
   Put the two values in `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET`.

`.env` is git-ignored — never commit it.

---

## Step 3 — Create the tables (migrate) and seed
From the project root:
```bash
npm run db:migrate        # creates all tables (first run names it, e.g. "init")
npm run db:seed           # loads the Super Admin + current site content
```
- `db:migrate` runs `prisma migrate dev` — it creates the SQL migration in
  `prisma/migrations/` and applies it.
- `db:seed` creates the **Super Admin** login and fills services, testimonials,
  clients, case studies, homepage content, site settings, and SEO defaults.

**Super Admin credentials** come from `.env`
(`SEED_SUPERADMIN_EMAIL` / `SEED_SUPERADMIN_PASSWORD`) — default
`admin@pitechniques.com` / `ChangeMe!2025`. Change these before production.

Verify visually:
```bash
npm run db:studio         # opens Prisma Studio at http://localhost:5555
```

---

## Useful commands
| Command | Purpose |
|---|---|
| `npm run db:generate` | regenerate the Prisma client after schema edits |
| `npm run db:migrate` | create + apply a new migration (development) |
| `npm run db:migrate:deploy` | apply existing migrations (production/CI) |
| `npm run db:seed` | (re)seed content — idempotent |
| `npm run db:studio` | browse/edit data in a GUI |
| `npm run db:reset` | **drops** the DB, re-applies migrations, re-seeds (dev only) |

---

## Backup & restore (PostgreSQL)
- **Backup** (logical dump):
  ```bash
  pg_dump "postgresql://USER:PASSWORD@HOST:5432/pitechniques" -Fc -f backup.dump
  ```
- **Restore**:
  ```bash
  pg_restore --clean --no-owner -d "postgresql://USER:PASSWORD@HOST:5432/pitechniques" backup.dump
  ```
- **Managed hosts** (Neon/Supabase/RDS) provide automated daily backups +
  point-in-time recovery in their dashboards — enable them for production.

---

## Hosting recommendations (production)
| Provider | Why |
|---|---|
| **Neon** | Serverless Postgres, generous free tier, autoscaling, branching. Great with Vercel. |
| **Supabase** | Postgres + dashboard + auth/storage extras; simple. |
| **AWS RDS / Aurora** | Enterprise scale, fine-grained control, VPC. |
| **Railway / Render** | Easy managed Postgres for small teams. |

App hosting: **Vercel** (first-class Next.js) with the DB on Neon/Supabase is
the smoothest path. Set the same env vars in the host's dashboard; run
`npm run db:migrate:deploy` on deploy.

---

## Best practices baked in
- **Migrations are version-controlled** (`prisma/migrations/`) — never edit the
  DB by hand in production; change `schema.prisma` and migrate.
- **Indexes** on every foreign key, `order`, `published`, `status`, and lookup
  columns (`slug`, `email`, `path`) for fast queries.
- **Connection pooling**: use the pooled `DATABASE_URL` on serverless and the
  `DIRECT_URL` for migrations (`prisma migrate` needs a direct connection).
- **Cascade deletes** on child rows (case-study children, sessions) to keep the
  DB consistent.
- **Secrets** only in `.env` / host env — never in code or git.
- **Least privilege**: in production, create a dedicated DB user limited to the
  app schema rather than the superuser.

For the overall design, see [`ARCHITECTURE.md`](./ARCHITECTURE.md).
