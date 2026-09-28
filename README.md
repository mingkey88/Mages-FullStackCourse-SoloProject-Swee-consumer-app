# Swee Consumer App — CTO Overview

Swee is a trust‑first beauty & wellness marketplace with a merchant OS. The app lives under `swee/` (Next.js 15, React 19, TypeScript 5, Prisma, Tailwind 4). This document gives a fast, accurate mental model to take ownership.

## Docs Index
- Product: `swee/Swee_PRD.md`
- Engineering Plan: `swee/Swee_Eng_Plan.md`
- Deployment: `swee/DEPLOYMENT_VERCEL_SUPABASE.md` and `swee/DATABASE_MIGRATION.md`
- AI Assistant Context: `swee/CLAUDE.md`
- Contributor Guide: `AGENTS.md` and `CONTRIBUTING.md`

## Architecture & Code Layout
- App: `swee/src/app/*` (App Router). Key areas: `merchant/*`, `providers/[id]/*`, `api/*`.
- UI: `swee/src/components/*` (shadcn in `components/ui/*`, merchant UI in `components/merchant/*`).
- Services & libs: `swee/src/services/*` (AI assistant), `swee/src/lib/*` (auth, prisma, utils).
- Data: `swee/prisma/schema.prisma` (dev: SQLite), `swee/prisma/schema.postgres.prisma` (deploy: Postgres), seed in `prisma/seed.ts`.
- Scripts: `swee/scripts/*` (admin bootstrap, auth fixes, migrations, demo data).

## Run Locally (Dev: SQLite)
- `cd swee && npm ci && cp .env.example .env` (the default `.env` uses the bundled demo database, which is already seeded)
- Optional, to rebuild demo data in a new database (`DATABASE_URL="file:./dev.db"`): `npm run db:push && npm run db:seed && npm run dev:create-admin && npm run dev:create-merchant && npm run dev:seed-demo`
- Start: `npm run dev` (Turbopack). App default: `http://localhost:3000`
- Sign‑in (dev credentials provider accepts any password): customer `user@example.com`, merchant `info@hairstudio.sg`, admin `dev@swee.sg`. See `swee/README.md` for the full table.

## Environment Variables
See `swee/.env.example`. Common:
- `DATABASE_URL` (SQLite: `file:./prisma/dev.db` for dev; Postgres in deploy)
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`
- Optional: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENAI_API_KEY`, Stripe/SMTP

## Database & Migrations
- Dev uses SQLite (`schema.prisma`). Production targets Postgres (`schema.postgres.prisma`).
- Commands:
  - SQLite (dev): `npm run db:push`, `npm run db:generate`, `npm run db:studio`
  - Postgres: `npm run db:migrate:pg`, `npm run db:deploy:pg`, `npm run db:studio:pg`
- Migration guide: `swee/DATABASE_MIGRATION.md`

## Auth & Security
- NextAuth with Google OAuth and a dev Credentials provider (accepts any password; disable in prod).
- JWT sessions with role in token; RBAC used for merchant/admin pages.

## Key Scripts
- Quality: `npm run lint`, `npm run format`
- Admin bootstrap: `npm run dev:create-admin`, `npm run dev:create-merchant`
- Demo data: `npm run dev:seed-demo` (creates clearly marked “(demo)” merchants and services)
- Postgres helpers: `db:generate:pg`, `db:migrate:pg`, `db:deploy:pg`, `db:push:pg`

## Deployment (Vercel + Supabase)
- Config: `swee/vercel.json` runs Prisma (Postgres) then Next build.
- Steps and envs: `swee/DEPLOYMENT_VERCEL_SUPABASE.md`.

## Current Status & Priorities
- Working: discovery, booking flows, merchant dashboard, API routes, AI assistant (`src/services/aiAssistant.ts`).
- In progress: Stripe Connect, notifications, reviews, admin console.
- Known cleanups: finalize Postgres migration, resolve any TS/ESLint noise, remove legacy `.bak` files where safe, unify package manager (repo has both npm & pnpm locks).

## Contributor & Ops Guides
- Contributor guidelines: `AGENTS.md` (coding style, commands, PR expectations)
- Team workflow: `CONTRIBUTING.md`
- Product/eng context: `swee/Swee_PRD.md`, `swee/Swee_Eng_Plan.md`, AI context in `swee/CLAUDE.md`

All demo data is labeled “(demo)” and flagged in descriptions as non‑production.
