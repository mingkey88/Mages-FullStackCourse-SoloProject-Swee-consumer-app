# Contributing to Swee

Thanks for helping improve Swee. This guide reflects the current Next.js + Prisma app under `swee/`. For architecture details and commands, see `README.md` and `AGENTS.md`.

## Setup
- Node 20 LTS recommended. Use `npm` (pnpm works but README uses npm).
- From `swee/`: `npm ci` then `cp .env.example .env` (see `DATABASE_MIGRATION.md` for `DATABASE_URL`).
- Initialize DB: `npm run db:push && npm run db:generate && npm run db:seed`.

## Workflow
- Branches: `feat/<scope>`, `fix/<scope>`, `chore/<scope>`.
- Commits: Conventional style (e.g., `feat: add merchant calendar view`).
- Keep changes focused. Avoid committing `*.bak` or generated artifacts.

## Code Quality
- Lint: `npm run lint` (autofix with `npm run lint:fix`).
- Format: `npm run format` / `npm run format:check` (Prettier: 2 spaces, single quotes, semicolons).
- Typecheck: `npx tsc -p . --noEmit`.
- UI: Place primitives in `src/components/ui/`, feature components in `src/components/<feature>/`.
- Routes follow App Router: folders with `page.tsx`, `layout.tsx`, dynamic `[id]` segments.

## Database
- Prisma files in `swee/prisma/`. After schema changes: `npm run db:generate` and either `npm run db:push` (dev) or `npm run db:migrate` (create migration).
- Open Studio: `npm run db:studio`.
- For Postgres migration details and sample env, see `DATABASE_MIGRATION.md`.

## Pull Requests
Include:
- Summary, scope, and screenshots (UI).
- DB changes + commands run (e.g., `db:migrate`, `db:seed`).
- Any new env vars and defaults.
- Test plan: steps to verify (lint/typecheck must pass).

Questions? Open a draft PR early or ask in the issue thread.

