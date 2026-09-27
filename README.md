# REXTON WATCHES

Full-stack e-commerce platform for **REXTON** — "Swiss Timeless Root".
Storefront, customer accounts and an admin control panel, built with Next.js
App Router, Prisma and a warm-white/gold luxury design system.

**Status: Phase 1 — Foundation (complete).** App shell, design system, database
schema + seed data, authentication, roles/permissions, guarded admin dashboard
and integration stubs are in place. Shop, collections, cart/checkout, orders
and CMS arrive in later phases.

## Stack

| Layer      | Choice                                                                  |
| ---------- | ----------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack), React 19, TypeScript                 |
| Styling    | Tailwind CSS v4 + shadcn/ui (radix-nova)                                |
| Data       | Prisma 6 + SQLite (`prisma/dev.db`)                                     |
| Auth       | DB-backed sessions, bcryptjs, server-side permission checks             |
| Validation | Zod v4                                                                  |
| Payments   | Razorpay (real when keys present, otherwise mocked)                     |
| Email      | Resend (real when key present, otherwise logged)                        |
| Storage    | Cloudinary signed uploads (otherwise local `public/images`)             |

## Quick start

```bash
npm install
cp .env.example .env        # Windows: copy .env.example .env
npm run setup               # migrate + placeholder images + seed
npm run dev                 # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start               # http://localhost:3000
```

### Seeded accounts

| Role    | Email                         | Password       | Access            |
| ------- | ----------------------------- | -------------- | ----------------- |
| Super admin | `admin@rexton.in`          | `Rexton@2026`  | `/admin` (all)    |
| Admin   | `manager@rexton.in`           | `Rexton@2026`  | `/admin`          |
| Staff   | `editor@rexton.in`            | `Rexton@2026`  | `/admin` (limited)|
| Customer | `aarav.sharma@example.in`   | `Customer@2026`| `/account`        |

`npm run db:seed` is idempotent — it only creates what is missing.

## Scripts

| Command            | What it does                                              |
| ------------------ | --------------------------------------------------------- |
| `npm run dev`      | Dev server (Turbopack)                                    |
| `npm run build`    | Production build                                          |
| `npm run start`    | Serve the production build                                |
| `npm run lint`     | ESLint                                                    |
| `npm run typecheck`| `tsc --noEmit`                                            |
| `npm run setup`    | `prisma migrate dev` + placeholder images + seed          |
| `npm run db:migrate` | Create/apply a new migration                            |
| `npm run db:deploy`  | Apply migrations without creating them (production)     |
| `npm run db:seed`  | Seed demo data                                            |
| `npm run db:reset` | Drop, migrate and re-seed                                 |
| `npm run db:studio`| Prisma Studio                                             |
| `npm run images`   | Regenerate placeholder watch SVGs in `public/images`      |

## Environment

Copy `.env.example` to `.env`. Everything degrades to a **mock mode** when its
keys are empty, so no third-party account is needed to develop:

- **Payments** — `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` set → real order
  creation plus server-side signature and webhook HMAC verification. Empty →
  orders come back as `mocked: true` and signatures use a fixed mock value.
- **Email** — `RESEND_API_KEY` set → real delivery. Empty → each message is
  printed to the dev console and stored as a `Notification` when a user is known.
- **Images** — `CLOUDINARY_CLOUD_NAME` set → signed browser uploads and CDN
  URLs. Empty → local assets under `public/images`.
- **`SESSION_SECRET`** — required in production; the dev fallback is insecure.

`DATABASE_URL` stays `file:./dev.db`. Prisma's CLI resolves that relative to
`prisma/`, while the generated client resolves it relative to the working
directory; `lib/db.ts` normalises both to one absolute path.

## Architecture notes

- **Routes** — `app/(storefront)/` holds public pages, `app/admin/` holds the
  control panel. `app/admin/login` is public; `app/admin/(dashboard)/` calls
  `requireAdmin()`, and each page calls `requirePermission()` for its own scope.
- **Auth** — two cookies: `rx_session` (customer, 30 days) and `rx_admin`
  (staff, 12 hours), each mapping to a `Session` row with a scope. Roles are
  `SUPER_ADMIN / ADMIN / STAFF / CUSTOMER`; permissions live in
  `lib/auth/permissions.ts` and are checked on the server, never trusted from
  the client. Login is rate-limited per IP/email.
- **Money** — stored as integer **minor units** (paise). `formatPrice()` in
  `lib/format.ts` is the only place that renders currency.
- **Server actions** — all actions live in `lib/actions/*.ts` with
  `"use server"`; every export must be async. Forms use `useActionState` and
  keep a no-JS fallback, so progressive enhancement works.
- **Design system** — tokens in `app/globals.css` (`--gold`, `--ink`,
  `--hairline`, `--radius`), `.eyebrow` for small caps labels,
  `.container-page` for the max-width wrapper, Inter + Bodoni Moda via
  `next/font`.
- **Nav** — `components/layout/site-config.ts` (storefront) and
  `components/admin/admin-nav.ts` (admin) are the single sources for navigation;
  both only list routes that exist.

## Verification

```bash
npm run typecheck && npm run lint && npm run build
```

The HTTP smoke suite (`rexton-smoke.ps1` in the workspace temp dir) drives the
real server actions: registration, sign-in, wrong-password rejection, admin
login, customer-blocked-from-admin, dashboard rendering, newsletter opt-in and
logout invalidation — 19/19 passing against `next start` on port 3100.

## Deployment

1. Set `APP_URL`, `SESSION_SECRET` and `DATABASE_URL` in the host environment.
2. `npm run db:deploy && npm run db:seed` (seed is safe to re-run).
3. `npm run build && npm run start`.
4. Add Razorpay/Resend/Cloudinary keys to switch off mock mode.
5. For SQLite, persist `prisma/` (or point `DATABASE_URL` at a file on a volume).

For a different database, change the `datasource` in `prisma/schema.prisma` —
the only SQLite-specific accommodations are JSON columns stored as strings.

## Roadmap

- **Phase 2** — catalogue: categories, collections, product pages, search,
  filters, full navigation.
- **Phase 3** — commerce: cart, checkout, Razorpay payments, orders, refunds,
  invoices, coupons.
- **Phase 4** — growth: reviews, wishlist, blog, banners, newsletter, contact,
  analytics, notifications.
- **Phase 5** — hardening: admin CRUD modules, audit log, tests, performance
  and SEO polish.
