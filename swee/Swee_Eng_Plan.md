# Swee Engineering Work Plan (MVP → Beta)

> Version: v0.1 • Date: 2025-09-10 • Stack: Next.js (App Router, TS), Tailwind + shadcn/ui, PostgreSQL + Prisma, Redis (BullMQ), NextAuth (magic link), Stripe Connect (Express), S3-compatible storage, Google Maps, Email/SMS/WhatsApp, Sentry, OpenTelemetry

---

## 0) Scope & North Stars
**Goal:** Ship Swee MVP (Singapore-first dual marketplace + merchant OS) to a closed beta cohort in ~8–10 weeks.

**North stars**
- Completed bookings per active merchant
- p95 time-to-booking < 3 mins
- Confirmation delivery ≥ 99%

**Definition of Done (global)**
- Unit tests (Vitest) for business logic ≥ 60% (MVP)
- E2E critical paths (Playwright): signup, booking, payment, cancellation
- a11y passes axe checks on key screens
- Observability: Sentry + OTLP traces for booking+payment path
- Security basics: secrets in .env* only, RBAC checks, input validation

---

## 1) Repos, Environments & Tooling
**Repo approach:** Single repo (monorepo ready). Start single Next.js app; can later hoist libs.

```
/swee
  /apps/web            # Next.js app + API routes
  /packages/ui         # (Phase 1.1) shared UI components
  /packages/config     # ESLint/TS config
  infra/               # docker-compose, terraform (future)
  prisma/              # schema & migrations
  scripts/             # seed, maintenance
```

**Environments**
- Local: Docker or native Postgres/Redis
- Dev: Vercel (Web), Railway/Fly/Render (API if split), Neon/Supabase (PG), Upstash/Redis
- Prod: Vercel + managed PG + Redis

**Tooling**
- Node 20 LTS, pnpm, corepack, TypeScript strict, ESLint, Prettier, Husky + lint-staged
- Vitest, Playwright, msw
- Commit message lint (conventional commits)

**Bootstrap commands (Windows + Git Bash)**
```bash
# Node 20 LTS suggested; install if needed
corepack enable
corepack prepare pnpm@latest --activate

pnpm create next-app@latest web --ts --eslint --tailwind --app --src-dir --import-alias "@/*"
cd web
pnpm add -D prettier eslint-config-prettier husky lint-staged
pnpm add @prisma/client prisma zod date-fns
pnpm add next-auth @auth/prisma-adapter
pnpm add @radix-ui/react-dropdown-menu class-variance-authority clsx tailwind-merge lucide-react
pnpm add @tanstack/react-query @upstash/ratelimit ioredis bullmq
pnpm add stripe
pnpm add google-map-react  # or @vis.gl/react-google-maps
pnpm add react-hook-form zod @hookform/resolvers
```

**Docker (local DB/Redis)**
```yaml
# infra/docker-compose.yml
version: '3.9'
services:
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: swee
    ports: ["5432:5432"]
    volumes: [db_data:/var/lib/postgresql/data]
  redis:
    image: redis:7
    ports: ["6379:6379"]
volumes: { db_data: {} }
```

**Env samples (.env.local)**  
```
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# DB / Prisma
DATABASE_URL=postgresql://postgres:password@localhost:5432/swee?schema=public

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=changeme
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=hello@swee.app

# Stripe
STRIPE_SECRET_KEY=sk_live_or_test
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_CONNECT_CLIENT_ID=ca_xxx

# Redis / Queue
REDIS_URL=redis://localhost:6379

# Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=xxx

# Sentry / OTLP
SENTRY_DSN=
OTEL_EXPORTER_OTLP_ENDPOINT=
```

---

## 2) Week-by-Week Plan (Tickets & Acceptance)
> Each ticket is prefixed SWE-###. “DoD” = Definition of Done. Use linear/jira—labels: `MVP`, `consumer`, `merchant`, `payments`, `infra`.

### Week 0 — Repo Bootstrap & Quality Rails (2–3 days)
- **SWE-001:** Initialize Next.js app (App Router), Tailwind, shadcn/ui baseline, absolute imports  
  *AC:* app builds; example shadcn Button renders; import `@/components/ui/button` works.  
- **SWE-002:** ESLint+Prettier, tsconfig strict, Husky pre-commit, lint-staged  
  *AC:* `pnpm lint` & `pnpm typecheck` pass, pre-commit runs.  
- **SWE-003:** Sentry & OTLP skeleton; request/trace ids middleware  
  *AC:* Trace spans visible for `/api/health`, error captured in Sentry sandbox.  
- **SWE-004:** Docker compose for PG/Redis; Prisma init  
  *AC:* `pnpm prisma migrate dev` creates schema; `db:seed` works.  

**DoD:** clean CI, devs can run `pnpm dev` + DB/Redis locally.

---

### Week 1 — Auth, Core Schema, RBAC
- **SWE-010:** NextAuth email magic link + Auth pages (Sign in, Verify)  
  *AC:* magic link flow works, session available in RSC & API routes.  
- **SWE-011:** Prisma schema v1 (Users, Merchant, Location, Staff, Service, Booking, Payment, Review, PromotionCode)  
  *AC:* migrations applied; relationships validated by seed.  
- **SWE-012:** RBAC middleware (Owner/Manager/Staff/Receptionist/Consumer)  
  *AC:* private routes gated; unit tests for guards.  
- **SWE-013:** File storage adapter (S3-compatible) with signed URLs (images)  
  *AC:* merchant logo upload works in dev (local mock acceptable).

**Snippet — Prisma (core)**
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  role      Role     @default(CONSUMER)
  createdAt DateTime @default(now())
  bookings  Booking[]
  reviews   Review[]
}

model Merchant {
  id         String    @id @default(cuid())
  ownerId    String
  owner      User      @relation(fields: [ownerId], references: [id])
  name       String
  gstNumber  String?
  stripeAccId String?  // Connect account
  locations  Location[]
  services   Service[]
  staff      Staff[]
  createdAt  DateTime  @default(now())
}

enum Role { CONSUMER OWNER MANAGER STAFF RECEPTIONIST ADMIN }
```

---

### Week 2 — Merchant Onboarding (Swee Hub) & Catalog
- **SWE-020:** Onboarding wizard (business, location, hours, categories)  
  *AC:* merchant can reach a working “Hub” after wizard; incomplete steps persisted.  
- **SWE-021:** Stripe Connect (Express) account link + webhook skeleton (`account.updated`)  
  *AC:* KYC status stored; payout-disabled merchants blocked from marketplace publish.  
- **SWE-022:** Catalog CRUD (services, durations, buffers, GST, add-ons, visibility) using shadcn DataTable & Dialog  
  *AC:* Create/edit/delete service; validations via zod; optimistic UI.  
- **SWE-023:** Staff & working hours; basic availability rules  
  *AC:* Staff skills mapped to services; exceptions supported (off-days).  

**UI components (shadcn)**
- Card, Input, Select, Dialog, Sheet, DataTable, Badge, Tabs, Toast, Calendar, Popover

---

### Week 3 — Consumer Discovery (List + Map), Service Page, Slot Picker
- **SWE-030:** Search endpoint + Postgres search (trigram) + filters (category/date/price/rating/distance)  
  *AC:* `GET /api/search` returns stable sorted results within 1.5s p95.  
- **SWE-031:** Map/List UI with sticky filters; SSR for SEO pages  
  *AC:* `/explore` indexable; map pins cluster; list scroll syncs with map.  
- **SWE-032:** Merchant profile & service page (photos, policies, staff bios)  
  *AC:* deep linkable pages with OG tags.  
- **SWE-033:** Slot service — conflict-free availability (staff-agnostic or specific)  
  *AC:* slot generation < 800ms; unit tests for collision & buffers.

**Mermaid (slot flow)**
```mermaid
sequenceDiagram
  participant C as Client
  participant API as /api/slots
  participant DB as Postgres
  C->>API: request slots(serviceId, date)
  API->>DB: fetch staff availability + bookings + blocks
  DB-->>API: datasets
  API-->>C: computed slots (considering buffers & skills)
```

---

### Week 4 — Booking, Payments, Policies, Notifications
- **SWE-040:** Booking create -> tentative hold -> payment intent create  
  *AC:* `POST /api/bookings` returns bookingId with status=pending.  
- **SWE-041:** Stripe checkout/Elements, Connect split, deposits (**Swee Protect**)  
  *AC:* deposit/full-pay configurable; fees visible to user; on success booking=confirmed.  
- **SWE-042:** Webhooks (`payment_intent.succeeded`, `payment_failed`, `charge.refunded`)  
  *AC:* idempotent handler; state transitions audited; tests with stripe-cli.  
- **SWE-043:** Policy capture (late-cancel/no-show windows/fees), explicit consent checkbox  
  *AC:* stored with booking; change displayed in receipts.  
- **SWE-044:** Notifications: email provider + ICS attachments; queue via BullMQ  
  *AC:* confirm/reminder (24h/3h) jobs scheduled; retry with backoff.

**Queue worker skeleton**
```ts
new Queue("notifications", { connection });
new Worker("notifications", async (job) => sendNotification(job.data), { connection });
```

---

### Week 5 — Reviews, POS (Basic), GST Invoices
- **SWE-050:** Post-visit review gating; moderation queue  
  *AC:* only completed bookings can review; merchant reply enabled.  
- **SWE-051:** POS checkout (walk-in), add services/products, discounts, record cash/PayNow  
  *AC:* prints/email GST invoice; updates inventory.  
- **SWE-052:** Invoice numberer + GST breakdown + PDF receipt storage  
  *AC:* download from booking history; compliant totals.

---

### Week 6 — Promotions, Swee Packs, Inventory (Basic), Analytics
- **SWE-060:** Promotion codes (percent/fixed, min spend, windows, usage caps)  
  *AC:* validation server-side; one promo per order (MVP).  
- **SWE-061:** **Swee Packs** (lite) — pre-paid sessions, decrement on POS/online  
  *AC:* balances shown to staff & in receipts; safeguards against negative.  
- **SWE-062:** Inventory basics (SKU, stock on hand, low-stock alerts)  
  *AC:* movements recorded; export CSV.  
- **SWE-063:** Merchant dashboard — utilization %, revenue, no-show rate  
  *AC:* charts with caching; export CSV.

---

### Week 7 — WhatsApp, Waitlist, Admin Console
- **SWE-070:** WhatsApp Business (via provider) templates for confirm/reminder  
  *AC:* provider sandbox sends messages; opt-in stored; fallback to email/SMS.  
- **SWE-071:** Waitlist — auto-fill cancellations by priority  
  *AC:* job promotes waitlist to booking; notification sent; audit trail.  
- **SWE-072:** Admin console: KYC status, moderation, disputes, taxonomy  
  *AC:* admin roles, action logs, feature flags.

---

### Week 8 — Beta Readiness, Perf & DR
- **SWE-080:** Seed pack (SG categories, sample merchants) + data scripts  
  *AC:* `pnpm db:seed` loads realistic test data.  
- **SWE-081:** Perf passes: search < 1.5s p95; slot < 800ms; TTFB < 200ms for key pages  
  *AC:* light k6/Gatling run documented; bottlenecks fixed.  
- **SWE-082:** Backups & DR drill; RPO ≤ 15m; RTO ≤ 2h  
  *AC:* restore from backup to staging, run smoke tests.  
- **SWE-083:** Security pass: rate limits, CSRF on mutations, secrets review  
  *AC:* checklist signed; dependency audit clean.  

**Beta Exit Criteria**
- 10–20 merchants onboarded with successful payouts
- ≥ 100 completed bookings with <2% payment failure
- Support runbooks in place

---

## 3) API Outline (MVP)
```
GET   /api/health
POST  /api/auth/* (NextAuth)

# Consumer
GET   /api/search
GET   /api/merchants/:id
GET   /api/services/:id
GET   /api/slots?serviceId=&date=
POST  /api/bookings
POST  /api/payments/confirm    # client confirmation callback
POST  /api/reviews

# Merchant (auth required)
GET   /api/me/merchant
POST  /api/merchant/services
PATCH /api/merchant/services/:id
DELETE /api/merchant/services/:id
GET   /api/merchant/bookings
POST  /api/merchant/pos/checkout
POST  /api/merchant/promotions
POST  /api/merchant/packs

# Admin
GET   /api/admin/merchants?status=
POST  /api/admin/moderation/reviews/:id:action

# Webhooks
POST  /api/webhooks/stripe
POST  /api/webhooks/notify
```

---

## 4) UI Checklists (shadcn/ui)
**Global**
- [ ] Layout shell, AppHeader, AppNav, Footer
- [ ] Toaster, Dialog, Sheet, Drawer, Tooltip
- [ ] Form primitives (react-hook-form + zod)
- [ ] DataTable (catalog, bookings, reviews)

**Consumer**
- [ ] Explore (list + map), Filters bar, Sort
- [ ] Merchant profile, Service page
- [ ] Slot picker (chip grid)
- [ ] Checkout (policy banner + Swee Protect pill)
- [ ] Bookings list, Receipts

**Merchant (Swee Hub)**
- [ ] Onboarding wizard
- [ ] Calendar (week/day/multi-staff)
- [ ] Catalog CRUD
- [ ] Staff & hours
- [ ] POS checkout
- [ ] Reports

**Admin**
- [ ] Merchant directory
- [ ] Moderation queue
- [ ] Disputes desk

---

## 5) Testing Strategy
- **Unit:** business rules (slots, policies, fees, promo validation)
- **Integration:** DB + API (prisma test DB with transactions)
- **E2E:** Playwright flows (signup, search, book, pay, cancel, review)
- **Contract:** webhook payloads with stripe-mock/stripe-cli
- **Load:** light k6 on `/api/search`, `/api/slots`, `/api/bookings`

**Commands**
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "ts-node scripts/seed.ts",
    "queue:dev": "ts-node apps/web/src/queue/worker.ts",
    "webhooks:stripe": "stripe listen --forward-to localhost:3000/api/webhooks/stripe"
  }
}
```

---

## 6) Operational Runbooks (MVP)
- **Payments Failures:** check Stripe dashboard → reconcile booking state → trigger `recovery` job
- **Chargebacks:** export evidence pack (policy acceptance, receipt, comms log), respond in 3 days
- **No-Show Disputes:** manual override fee → partial refund path (admin only)
- **Outage:** post status page, disable booking creation, keep read-only search alive
- **Backups:** nightly PG; verify restore weekly

---

## 7) Risk Register (Eng)
- **Complex slot logic** → heavy unit coverage, property-based tests
- **Webhook idempotency** → store event ids + hashes, 24h TTL dedupe
- **State drift (booking vs payment)** → saga-style transitions + compensating actions
- **Map perf** → server-side tile hints + clustering

---

## 8) Appendices
### A) Seed Data (starter)
- Categories: Hair, Nails, Massage, Facial, Brows & Lashes, Hair Removal
- Amenities: Free Wi-Fi, Female-only, Couple room, Parking
- Time windows: Today PM, Tomorrow AM, Weekend

### B) Minimal Prisma Additions (booking/policy)
```prisma
model Booking {
  id           String   @id @default(cuid())
  userId       String
  merchantId   String
  serviceId    String
  staffId      String?
  start        DateTime
  end          DateTime
  status       BookingStatus @default(PENDING)
  policyJSON   Json
  paymentId    String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

enum BookingStatus { PENDING CONFIRMED CANCELED NO_SHOW COMPLETED }
```

### C) Stripe Connect Split (pseudo)
```ts
// amount: total in cents, deposit if applicable
const applicationFeeAmount = Math.round(amount * PLATFORM_RATE); // take rate
const transferData = { destination: merchant.stripeAccId };
const mode = "payment";
```

---

## 9) Weekly Demo Targets
- W2: Merchant can complete onboarding & create services
- W3: Consumer can discover merchants on list+map
- W4: Full booking + payment + policy capture end-to-end
- W5: POS checkout invoice (GST) & review gating
- W6: Promo + Pack redemption + inventory decrement
- W7: WhatsApp reminders + Admin moderation
- W8: Beta merchants transacting in staging with seeded data

---

**Next:** green-light Weeks 0–2 and I’ll generate tickets, component specs, and Prisma schema v1 as a separate `Swee_Tickets_W0-W2.csv`. 
