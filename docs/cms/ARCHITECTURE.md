# Pi Techniques CMS — Architecture

> Phase 1 deliverable. This document is the single source of truth for how the
> Admin Panel / CMS is structured and how CMS content reaches the public site
> **without changing any frontend UI/UX**.

---

## 1. Analysis of the existing website

The public site is a **faithful, pixel-perfect port** of the original PHP site
(`pitechniques.com`). Key facts that constrain the CMS design:

- **Framework:** Next.js 15 (App Router) + React 19 + TypeScript (strict).
- **Styling:** the original production stylesheets are loaded **verbatim** from
  `public/css/*` (bootstrap, style, responsive, animatehome, owl, glide, …).
  The look is produced by these files + exact original markup/class names — not
  by a component design system. **These must not change.**
- **Behaviour:** original JS (jQuery, p5 hero canvas, Owl, Glide, WOW, counters)
  is loaded verbatim from `public/js/*` and re-initialised by client loaders
  (`src/components/home/Scripts.tsx`, `PageScripts.tsx`).
- **Routing:**
  - `src/app/page.tsx` — homepage (self-contained faithful chrome).
  - `src/app/(faithful)/*` — services, careers, career-details, case-studies,
    detailed-project, about, contact-us, and the 4 policy pages. Shared chrome
    via `(faithful)/layout.tsx`.
  - `src/app/(site)/*` — now only the styled `not-found.tsx` (MUI/Providers).
- **Content today is hardcoded** in the page markup and in `src/constants/*`
  (`homeData.ts`, `servicesData.ts`, `faithfulJobs.ts`, `aboutTeam.ts`,
  `caseStudyProjects.ts`, client logos, testimonials, …).

**Implication:** the CMS must move this content into PostgreSQL and have the
faithful pages **read it at render time**, while leaving every tag, class, and
stylesheet byte-identical. We change the *data source*, never the *markup*.

---

## 2. High-level architecture

```
                    ┌──────────────────────────────────────────┐
                    │                Next.js app                │
                    │                                           │
  Admin user  ───▶  │  /admin/*  (MUI dashboard, Client comps)  │
                    │      │                                     │
                    │      ▼  fetch (JWT, RBAC)                  │
                    │  /api/admin/*  (Node route handlers)       │
                    │      │                                     │
                    │      ▼                                     │
                    │   Service layer  ──▶  Prisma  ──▶ Postgres │
                    │      ▲                                     │
                    │      │ read (cached, tagged)              │
  Public visitor ─▶ │  faithful pages (Server Components)        │
                    │      │ revalidateTag/Path on admin save    │
                    └──────────────────────────────────────────┘
```

- **One Next.js app, two surfaces:** the public faithful site and the `/admin`
  dashboard live in the same project but are fully isolated (separate route
  group, layout, providers, and styling). The admin uses **MUI**; the public
  site keeps the **original CSS**. They never share global styles.
- **Shared core:** Prisma client, a typed **service/repository layer**, auth,
  RBAC, and validation are shared by both API routes and Server Components.

---

## 3. Target folder structure (built incrementally across phases)

```
src/
  app/
    (faithful)/ …            # public site (unchanged markup)
    page.tsx                 # homepage (will read CMS content in Phase 6)
    (admin)/                 # NEW — admin route group (Phase 4)
      admin/
        layout.tsx           # MUI shell: sidebar, header, breadcrumbs, theme
        page.tsx             # dashboard
        login/page.tsx       # (Phase 3)
        services/…           # CRUD screens (Phase 6)
        case-studies/…
        testimonials/…
        clients/…
        media/…              # (Phase 5)
        contact/…            # (Phase 7)
        seo/…                # (Phase 8)
        users/…              # (Phase 3/6)
    api/
      admin/                 # NEW — admin API route handlers (Node runtime)
        auth/login|logout|refresh|me/route.ts
        services/route.ts + [id]/route.ts
        …                    # one resource per module
  lib/
    env.ts                   # ✅ Phase 1 — validated env
    db.ts                    # Phase 2 — Prisma singleton
    auth/                    # Phase 3 — jwt, password, session, rbac
    validation/              # zod schemas per resource
    api/                     # response helpers, error handler, with-auth wrapper
  server/
    services/                # business logic per resource (used by API + RSC)
    content/                 # read helpers for the public site (cached)
  components/
    admin/                   # MUI building blocks (DataTable, FormFields, …)
  constants/                 # existing hardcoded content → becomes fallback
prisma/
  schema.prisma              # Phase 2
  migrations/
  seed.ts
docs/cms/                    # this documentation
```

---

## 4. Frontend ⇄ CMS data flow (the "instant update" requirement)

**Strategy: Server Components read PostgreSQL through a cached content layer;
admin writes call on-demand revalidation.** This satisfies SEO, performance,
and "changes appear automatically without redeploy".

### 4.1 Server vs Client Components
- **Public pages → Server Components.** All faithful pages stay server-rendered
  so the HTML (and SEO metadata) is produced on the server from DB content. The
  existing client pieces (script loaders, body-class) remain client components
  but receive no content — they only run the legacy JS.
- **Admin → mostly Client Components** (MUI tables/forms/dialogs) talking to
  `/api/admin/*`. Server Components are used for the initial admin data fetch
  where helpful.

### 4.2 Content fetching pattern
A single read layer in `src/server/content/*` wraps Prisma queries with
Next.js caching and **cache tags**:

```ts
// example shape (implemented in Phase 6)
export const getTestimonials = unstable_cache(
  () => prisma.testimonial.findMany({ where: { published: true }, orderBy: { order: "asc" } }),
  ["testimonials"],
  { tags: ["testimonials"], revalidate: 3600 }, // ISR: refresh hourly as a safety net
);
```

Pages call these helpers instead of importing the hardcoded constants.

### 4.3 Caching + ISR
- Reads are cached with `unstable_cache` + a per-resource **tag**
  (`testimonials`, `services`, `clients`, `case-studies`, `homepage`, `seo`).
- A background `revalidate` window (e.g. 1 hour) is a safety net; the primary
  freshness mechanism is on-demand revalidation below.

### 4.4 On-demand revalidation (instant reflection)
When an admin saves, the API mutation calls:

```ts
import { revalidateTag } from "next/cache";
revalidateTag("testimonials"); // and revalidatePath("/") for the homepage
```

Next purges that tag's cache; the **next** public request re-renders from fresh
DB data. No redeploy, near-instant. This is the recommended App-Router pattern
and avoids `force-dynamic` (which would disable caching and hurt performance).

### 4.5 Fallback content (safety during migration)
The read helpers fall back to the **existing hardcoded constants** when the DB
has no row yet (or the DB is unreachable). This guarantees the site stays
pixel-perfect during the phased migration and is resilient to DB hiccups:

```ts
const rows = await getServicesSafe();      // DB first…
return rows.length ? rows : servicesData;  // …else current constants
```

### 4.6 Images
- Admin uploads go to `public/uploads/**` (Phase 5), served as static files.
- The public markup keeps using plain `<img src="…">` (as the original does) so
  layout/animation are untouched. Optimization happens at upload time (resize +
  modern format) rather than via `next/image`, to avoid changing markup.

### 4.7 SEO
- A `SeoSetting` table per route powers `generateMetadata()` in each Server
  Component (title, description, canonical, OG, Twitter).
- `app/sitemap.ts` and `app/robots.ts` are generated from the DB (Phase 8).

### 4.8 Error handling & resilience
- Read helpers never throw into the page: on error they log and return the
  fallback constant, so the public site cannot be taken down by a CMS/DB issue.
- Admin APIs return typed JSON errors `{ error, code, details? }` with proper
  status codes; the MUI UI shows toasts.

---

## 5. Security model (detailed in Phases 3 & 10)
- **JWT auth**: short-lived access token + httpOnly refresh cookie.
- **Passwords**: bcrypt (cost from `BCRYPT_ROUNDS`).
- **RBAC**: roles `SUPER_ADMIN | ADMIN | EDITOR` × permissions
  `CREATE | EDIT | DELETE | PUBLISH`, enforced in a single `withAuth` API
  wrapper and in admin route guards.
- **CSRF**: same-site cookies + a CSRF token on state-changing requests.
- **Input validation**: every API body validated with zod before it reaches the
  service layer.
- **Secure uploads**: extension/MIME allow-list, size limit, random file names,
  no executable types, served from a non-executable static dir.

---

## 6. Why these choices
| Decision | Rationale |
|---|---|
| Same app, isolated `/admin` | One deploy, shared types & Prisma; isolation keeps the public CSS clean. |
| Prisma + PostgreSQL | Type-safe (strict-TS), great migrations/relations; Postgres is robust, free, scales, and is the best general default. |
| Server Components + tags + on-demand revalidation | SEO-friendly, cached/fast, yet updates appear instantly on save — no redeploy, no `force-dynamic`. |
| DB-with-constant-fallback | Site stays pixel-perfect and online even mid-migration or during DB outages. |
| Upload-time image optimization | Keeps original `<img>` markup → zero layout/animation drift. |

---

## 7. Phase roadmap
1. **Foundation** (this phase) · 2. Database · 3. Auth/RBAC · 4. Admin layout ·
5. Media · 6. Content CRUD + frontend reflection · 7. Contact · 8. SEO ·
9. Analytics/activity · 10. Production hardening.

Each phase is delivered and approved independently.
