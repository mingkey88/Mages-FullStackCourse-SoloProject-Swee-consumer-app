# Swee Engineering Plan — CTO Summary (Updated)

Version: v0.2 • Date: 2025‑09‑11 • Scope: MVP → Beta

## Overview & Stack
- Next.js 15 (App Router), React 19, TypeScript 5, Tailwind 4 + shadcn/ui.
- Prisma ORM; Dev DB: SQLite; Deploy DB: PostgreSQL (Supabase/Neon recommended).
- Auth: NextAuth (Google OAuth + dev Credentials provider).
- Payments: Stripe Connect (planned). AI: OpenAI client integrated.

## Repo Structure
- App: `swee/src/app/*` (routes, API under `app/api/*`, merchant area in `app/merchant/*`).
- UI: `swee/src/components/*` (shadcn in `components/ui/*`).
- Libs/Services: `swee/src/lib/*` (auth, prisma), `swee/src/services/*` (AI assistant).
- Data: `swee/prisma/*` (`schema.prisma` for SQLite, `schema.postgres.prisma` for Postgres, `seed.ts`).
- Scripts: `swee/scripts/*` (admin bootstrap, fixes, demo data, migration helpers).

## Environments
- Local: Node 20 LTS, SQLite; run everything from `swee/`.
- Staging/Prod: Vercel (web) + managed Postgres (Supabase/Neon). Use pooled URL.

## Local Development
```bash
cd swee
npm install
npm run db:push && npm run db:generate && npm run db:seed
npm run dev:create-admin && npm run dev:create-merchant  # convenience
npm run dev  # http://localhost:3000
```
Sign-in (dev credentials provider accepts any password): `dev@swee.sg`.

## Database & Migrations
- SQLite for speed locally (`prisma/schema.prisma`).
- Postgres for deploys (`prisma/schema.postgres.prisma`).
- Commands:
  - Dev (SQLite): `db:push`, `db:generate`, `db:studio`.
  - Postgres: `db:generate:pg`, `db:migrate:pg` (create dev migrations), `db:deploy:pg` (apply in deploy), `db:studio:pg`.
- Demo data: `npm run dev:seed-demo` creates clearly marked “(demo)” merchants/services.

## Auth & Security
- NextAuth JWT sessions with role; Google OAuth supported via env vars.
- Dev‑only Credentials provider accepts any password — disable in production.
- Secrets only in env; never commit real keys. Lock down `NEXTAUTH_SECRET`.

## Build, Quality & Tooling
- Lint/format: `npm run lint`, `npm run format`.
- Type check: `npx tsc -p . --noEmit`.
- Testing: none formal yet; prefer colocated tests and add Playwright for critical flows when stabilizing payments.

## Deployment (Vercel + Supabase)
- `swee/vercel.json` build: `npm run db:generate:pg && npm run db:push:pg && npm run build`.
- Env on Vercel: `DATABASE_URL` (pooled), `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, optional OAuth/Stripe/SMTP/OpenAI.
- When ready for migrations: switch build to `db:deploy:pg` and commit `prisma/migrations`.

## Current Priorities (2–4 weeks)
1) Payments: Stripe Connect (Express) — checkout flow, split payouts, webhooks, idempotency.
2) Policies & trust: late‑cancel/no‑show capture; consent storage; display in receipts.
3) Notifications: email (and WhatsApp/SMS when approved); reminders; retries.
4) Reviews & moderation: post‑service gating; admin queue.
5) Postgres migration: finalize schema/migrations; staging on Supabase.
6) Cleanup: remove legacy `.bak` files where safe; resolve remaining TS/ESLint issues; unify package manager.

## Risks & Operational Notes
- File locking on Windows may interrupt Prisma generate — if hit, retry after closing processes or remove `.prisma/client` cache and regenerate.
- Stripe/Webhooks: ensure idempotency keys + persisted event dedupe.
- DB connections: use pooled Postgres on Vercel to avoid connection limits.
- Demo data: all demo merchants are suffixed “(demo)” and disclaimers exist in descriptions.

## Checklists
- Security: secrets in env, RBAC verified on merchant/admin routes, input validation.
- Reliability: basic error handling in API routes; add request logging for booking/payment paths.
- Accessibility: audit key screens (contrast, focus, keyboard nav).
- Observability (recommended): Sentry + minimal OTLP traces for booking/payment once flows stabilize.

This plan reflects the current repo and near‑term milestones. For onboarding, see root `README.md`.

