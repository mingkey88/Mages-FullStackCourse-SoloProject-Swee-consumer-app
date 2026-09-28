# Repository Guidelines

## Project Structure & Module Organization
- Root app lives in `swee/`.
- Source: `swee/src/` (Next.js App Router in `src/app/`), shared libs in `src/lib/`, UI in `src/components/` (shadcn in `components/ui/`), services in `src/services/`.
- API routes: `src/app/api/**`.
- Data layer: `swee/prisma/` (`schema.prisma`, seeds in `prisma/seed.ts`).
- Scripts: `swee/scripts/` (DB migration, fixes); static assets in `swee/public/`.

## Build, Test, and Development Commands
Run all commands from `swee/`.
- `npm install` — install dependencies.
- `npm run dev` — start Next.js (Turbopack) on localhost.
- `npm run build` / `npm start` — production build and serve.
- `npm run lint` / `npm run lint:fix` — ESLint checks and autofix.
- `npm run format` / `npm run format:check` — Prettier format/verify.
- Prisma: `npm run db:push` (sync schema), `db:migrate` (create dev migration), `db:generate` (generate client), `db:seed`, `db:studio`, `db:reset`.
- Type check: `npx tsc -p . --noEmit`.
- Ad‑hoc scripts: `npx tsx test-booking-flow.ts`, `npm run db:test` (PostgreSQL connectivity).

## Coding Style & Naming Conventions
- Prettier (.prettierrc): 2 spaces, single quotes, semicolons, `trailingComma: es5`, `arrowParens: avoid`.
- ESLint: `next/core-web-vitals` + TypeScript; unused vars with leading `_` allowed; `no-explicit-any` warns.
- React components: PascalCase files (e.g., `Quiz.tsx`); shadcn primitives in `components/ui` are lowercase (e.g., `button.tsx`).
- Routes: Next app router uses `page.tsx`, `layout.tsx`, dynamic segments `[id]`.
- Avoid committing backup files (`*.bak`).

## Testing Guidelines
- No formal test runner yet; prefer colocated `*.test.ts`/`*.test.tsx` and run via `npx tsx path/to/test.ts`.
- Add a short manual test plan in PRs; run `npm run lint` and type checks before pushing.

## Commit & Pull Request Guidelines
- Prefer Conventional Commits (e.g., `feat:`, `fix:`, `chore:`). History shows mixed styles; let’s standardize going forward.
- PRs must include: scope/summary, screenshots for UI, DB changes (and Prisma commands run), env var updates, and a clear test plan. Link related issues.

## Security & Configuration Tips
- Use `.env` (not committed; copy from `swee/.env.example`). Prisma only reads `.env`, not `.env.local`. Common vars: `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENAI_API_KEY`, and Stripe keys if enabled.
- After schema changes: `npm run db:generate` and `npm run db:push` (or `db:migrate`) and include notes in the PR.

