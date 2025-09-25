# Vercel + Supabase Deployment

This app deploys cleanly to Vercel with a managed PostgreSQL on Supabase. Follow these steps to set up hosting and database.

## 1) Create Supabase Project
- Create a new project at https://supabase.com
- Get the Postgres `DATABASE_URL` (Project Settings → Database → Connection string).
- Prefer the pooled connection string (pgBouncer) for serverless:
  - Example: `postgresql://USER:PASSWORD@db.PROJECT.supabase.co:6543/postgres?pgbouncer=true&connection_limit=1`.

## 2) Prepare Prisma for Postgres
We keep local dev on SQLite but deploy Postgres via a second schema.
- Commands (from `swee/`):
  - `npm run db:generate:pg` — generate Prisma client for Postgres
  - `npm run db:migrate:pg` — create and apply dev migrations (local)
  - `npm run db:deploy:pg` — apply migrations in production (Vercel)

## 3) Vercel Project Setup
- Create a new Vercel project and select this repo.
- Set Root Directory to `swee`.
- Build Command: configured via `swee/vercel.json` as
  - `npm run db:generate:pg && npm run db:push:pg && npm run build`
- Output Directory: leave default (Next.js).

## 4) Vercel Environment Variables
Set in Vercel → Project Settings → Environment Variables:
- `DATABASE_URL` = Supabase Postgres URL (pooled)
- `NEXTAUTH_URL` = `https://<your-vercel-domain>`
- `NEXTAUTH_SECRET` = a 32+ char secret (generate via `openssl rand -base64 32`)
- `OPENAI_API_KEY` = your key (optional)
- Optional: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, Stripe keys, SMTP.

## 5) Schema Management & Seeding
- Current build uses `prisma db push` to sync the schema (fast for prototyping).
- When ready to formalize migrations:
  1. Locally set `DATABASE_URL` to a Postgres instance and run `npm run db:migrate:pg -- --name init_pg`.
  2. Commit the generated `prisma/migrations` folder.
  3. Switch Vercel build to `npm run db:generate:pg && npm run db:deploy:pg && npm run build`.
- To seed production data, run from local with Supabase URL exported:
  - `DATABASE_URL="<supabase-url>" npm run db:generate:pg`
  - `DATABASE_URL="<supabase-url>" node prisma/seed.ts`

## 6) Post‑Deploy Checks
- Visit `/auth/signin`, sign in as `dev@swee.sg` (credentials provider in dev) or Google OAuth if configured.
- Verify API routes under `/api/*` respond (e.g., `/api/merchant/profile`).
- Confirm DB writes succeed (create/update a merchant profile).

## Notes
- Use the pooled Supabase URL to avoid connection limits in serverless.
- For local Postgres development, update `.env` `DATABASE_URL` and use `npm run db:migrate:pg`.
