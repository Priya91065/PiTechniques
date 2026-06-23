# Pi Techniques — Local Setup (Beginner Guide)

This guide gets the project running on your machine. **Phase 1** covers the app
+ tooling. The **database** (PostgreSQL/Prisma) is set up in **Phase 2** — this
file will be extended then.

---

## 1. Prerequisites (install these once)

| Software | Version | Why | Get it |
|---|---|---|---|
| **Node.js** | 18.18+ or 20+ (LTS) | runs Next.js | https://nodejs.org |
| **npm** | comes with Node | installs packages | — |
| **Git** | any recent | version control | https://git-scm.com |
| **VS Code** | latest | editor (ESLint + Prettier extensions recommended) | https://code.visualstudio.com |
| **PostgreSQL 16** *(Phase 2)* | 15 or 16 | the database | https://www.postgresql.org/download/ — or use **Docker** |
| **Docker Desktop** *(optional, Phase 2)* | latest | run Postgres with one command | https://www.docker.com/products/docker-desktop |

> Recommended editor extensions: **ESLint** (`dbaeumer.vscode-eslint`) and
> **Prettier** (`esbenp.prettier-vscode`). Set Prettier as the default formatter
> and enable "Format on Save".

Check your versions:

```bash
node -v      # should print v18.18+ or v20+
npm -v
git --version
```

---

## 2. Install project dependencies

From the project root (`pi-techniques/`):

```bash
npm install
```

---

## 3. Environment variables

```bash
cp .env.example .env       # Windows PowerShell: Copy-Item .env.example .env
```

Open `.env` and fill values. For **Phase 1** the defaults are fine — the app
runs without a database (the public site uses hardcoded content until Phase 6).
DB and JWT values are needed from **Phase 2/3** onward.

`.env` is **git-ignored** — never commit it.

---

## 4. Run the app (development)

```bash
npm run dev
```

Open http://localhost:3000 — the public site. The admin panel appears at
`/admin` from **Phase 4**.

> Tip: only run **one** `npm run dev` at a time. Two dev servers share the
> `.next` cache and will produce spurious 404s.

---

## 5. Project standards & scripts

| Command | What it does |
|---|---|
| `npm run dev` | start the dev server |
| `npm run build` | production build (also type-checks) |
| `npm run start` | run the production build |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript rules) |
| `npm run typecheck` | strict TypeScript check, no emit |
| `npm run format` | format the codebase with Prettier |
| `npm run format:check` | verify formatting in CI |

- **TypeScript only** — the project uses `.ts`/`.tsx`; ESLint + `tsconfig`
  enforce strict mode.
- **Formatting** is Prettier (`.prettierrc.json`); the original verbatim assets
  under `public/{js,css,webfonts,images,pdf}` are intentionally **excluded**
  from formatting/linting so they stay byte-identical.

---

## 6. Database (Phase 2)

The schema, Prisma client, and seed are ready. To create your database and load
content, follow **[`DATABASE.md`](./DATABASE.md)** — the beginner-friendly,
step-by-step guide (recommended: free Neon cloud Postgres, no install). In
short:

```bash
cp .env.example .env          # set DATABASE_URL to your Postgres connection
npm run db:migrate            # create all tables
npm run db:seed               # load Super Admin + current site content
npm run db:studio             # (optional) browse the data
```

## 7. What's next

- **Phase 3 — Authentication:** login page, JWT, role-based access — this is
  where the **`/admin`** area becomes real and visible.

For the full design, see [`ARCHITECTURE.md`](./ARCHITECTURE.md) and
[`DATABASE.md`](./DATABASE.md).
