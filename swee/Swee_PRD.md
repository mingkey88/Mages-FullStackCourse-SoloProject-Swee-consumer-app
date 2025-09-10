# Swee Dual Marketplace PRD (Fresha‑class)

> Version: v0.1 • Date: 2025‑09‑10 • Owner: Swee Product (LXK42 Studio) • Reviewers: Eng, Design, Ops, Compliance

---

## 0) TL;DR
Swee = a dual‑sided beauty & wellness marketplace + merchant OS, built for Singapore first. Consumers discover, compare, and book in under 3 minutes with transparent policies and deposits ("Swee Protect"). Merchants run operations in one place (calendar, staff, POS, simple inventory, promos) and optionally list on the marketplace. Distinctive Swee twists: a lightweight **Swee Quiz** for personalized discovery, **post‑service package offers** baked into the journey, and WhatsApp‑first notifications where possible.

**Launch scope**: SGD only, Stripe Connect split payouts, Cards at launch, PayNow/GrabPay via Stripe (or PSP) if ready, responsive web app (PWA soon after). Tech: Next.js + TS, shadcn/ui, PostgreSQL, Prisma, Redis jobs, OpenTelemetry, Sentry.

**Targets (MVP, M+3):** p95 time‑to‑booking < 3 mins; ≥30% repeat in 60 days; Merchant NPS ≥45; confirmation delivery ≥99%.

---

## 1) Problem & Goals
**Problem.** Consumers struggle to find trustworthy nearby services with clear pricing and real‑time availability. Merchants juggle fragmented tools (calendar, WhatsApp, spreadsheets, POS, marketing) and pay high commissions without lifetime customer ownership.

**Goal.** Ship a Fresha‑class platform where:
- **Consumers** can search, filter, compare, and book in <3 minutes with reliable reminders and flexible cancellation.
- **Merchants** get an all‑in‑one "operating system": calendar, staff, services, inventory, POS, payments, reviews, promotions, and a marketplace to acquire demand.

**Success criteria (MVP M+3):**
- Time‑to‑booking < 3 mins (p95).
- ≥ 30% repeat bookings within 60 days.
- Merchant NPS ≥ 45, Consumer CSAT ≥ 4.6/5.
- Booking confirmation delivery rate ≥ 99%.

---

## 2) In‑Scope vs Out‑of‑Scope (MVP)
**In (MVP)**
- Consumer discovery & booking (list + map, structured filters, service pages, real‑time slot picker, cartless checkout).
- **Swee Quiz** (1–3 questions) to steer categories and pre‑filter results; stored as preferences.
- **Swee Protect** deposits & late‑cancel/no‑show fees (merchant‑configurable).
- **Post‑service package offers** ("Swee Packs") with email follow‑ups.
- Merchant back‑office ("Swee Hub"): services/catalog, calendar, staff shifts, basic POS, simple inventory, discount codes.
- Payments: Stripe Connect split payouts; Cards at launch; PayNow/GrabPay via Stripe/PSP (Phase 1.1 if not day‑1 ready).
- Notifications: Email + SMS; **WhatsApp Business preferred** in SG if approved.
- Ratings & reviews (post‑appointment only; moderation queue).
- Admin console (onboarding/KYC, edits, taxonomy, disputes, abuse handling).
- GST‑aware invoices (SG 9%), downloadable receipts.

**Out (MVP)**
- Multi‑country/multi‑currency.
- Gift cards, loyalty points.
- Advanced inventory (variants, purchase orders), rooms/resources.
- Memberships/subscriptions.
- Advanced marketing automation (funnels, RFM, POS‑integrated CRM).

---

## 2.1) Brand & UX System (Swee)
**Brand idea.** "Swee" (Singlish: tidy/nice) = friendly, modern, trustworthy. Avoid jargon; celebrate clarity and speed.

**Voice & tone.** Warm, concise, helpful. Microcopy focuses on certainty (time, price, policy). Examples:
- Buttons: **Book now**, **Hold with deposit**, **Reschedule**, **Get Swee**.
- Empty states: "No slots this evening—try tomorrow morning or change staff."
- Policy callout: "Cancel free until 24h before—after that, a $15 late fee applies."

**Design tokens (suggested)**
- Primary `#6E56CF` (Iris), Accent `#22C55E` (Emerald), Neutral 900 `#0B1220`, Neutral 50 `#F8FAFC`, Success `#22C55E`, Warning `#F59E0B`, Danger `#EF4444`.
- Radius: `1rem` (2xl) on cards & buttons; Elevation: soft shadow.
- Motion: 150–200ms, ease‑out; reduce‑motion respected.

**IA labels.**
- Consumer top‑nav: **Explore**, **Categories**, **Near me**, **Bookings**.
- Merchant app: **Swee Hub** (home), **Calendar**, **Catalog**, **Staff**, **POS**, **Reports**, **Settings**.

**Component system.** shadcn/ui + Tailwind; staff avatars, slot chips, policy banners, deposit pill ("Swee Protect").

---

## 3) Personas
- **C1 — Time‑pressed Consumer** (25‑45): wants nearby, available today/this weekend, transparent pricing, trusted reviews.
- **C2 — Value‑seeker** (18‑35): hunts promos, off‑peak slots, bundle savings.
- **M1 — Solo Owner**: single chair/room; wants simple calendar + payments.
- **M2 — Boutique Studio**: 3–10 staff; needs roster, performance tracking, no‑show protection, basic inventory.
- **M3 — Chain Manager**: multi‑branch oversight, centralized catalog, staff permissions, payouts reconciliation.

---

## 4) Key Journeys (MVP)
**Consumer**
1. Land → **Swee Quiz** (optional) → search (map/list) → filters → service page → slot picker → policy banner + **Swee Protect** (if enabled) → pay → confirmation → WhatsApp/Email reminders → visit → review → **Swee Packs** offer.

**Merchant**
1. Sign up → KYC via Stripe Connect → create services & pricing → set hours & staff → connect payouts → publish to marketplace (optional) → receive bookings → manage calendar → POS checkout → payouts & reports → configure **Swee Packs** and policies.

---

## 5) Functional Requirements
### 5.1 Consumer App
**Discovery & Search**
- Home surfaces Quiz shortcuts: "Hair this week?" "Nails for the weekend?" with date chips.
- Search: keywords + filters (category, subcategory, price, rating, distance, date/time, duration, amenities). Map/list toggle; sticky filters.

**Swee Quiz & Preferences**
- 1–3 Qs (goal, time window, budget). Output: saved preferences that pre‑seed filters and ranking. Editable in Profile.

**Merchant Profile & Service Pages**
- Photos, address (Google Maps), hours, policies, ratings, staff bios, services & add‑ons.
- Policy banner and **Swee Protect** pill with fee/deposit rules.

**Booking & Checkout**
- Staff‑agnostic or staff‑specific slot picker; conflict‑free.
- Require explicit policy agreement; show deposit/fee math.
- Payment: Cards; deposit vs full‑pay (merchant‑configurable).
- Confirmation + .ics; "Share via WhatsApp" deep‑link.

**Account & History**
- Magic link auth (NextAuth); bookings list; cancel/reschedule in policy window; receipts; waitlist.
- Reviews: post‑visit only; text + stars; photo review later.

### 5.2 Merchant OS (Back‑Office)
**Onboarding & KYC**
- Guided setup; business details; Stripe Connect (Express recommended) for payouts.

**Catalog**
- Services CRUD; duration, buffers, GST, add‑ons, visibility (marketplace on/off).
- **Swee Packs** (lite): pre‑paid 3/5/10 sessions; balance tracking shown at checkout and in receipts.

**Calendar & Scheduling**
- Day/Week/Multi‑staff; drag‑drop; blocks; recurring events; tagging for late/no‑show; auto‑fees per policy.
- Waitlist with auto‑fill.

**Staff & Permissions**
- Roles: Owner, Manager, Staff (own), Receptionist.
- Targets: utilization %, sales; CSV exports.

**POS (MVP)**
- Walk‑in checkout; services/products; discounts; accept Cards/PayNow (record cash); GST invoice.

**Inventory (Basic)**
- Products (SKU, cost, price, stock); low‑stock alerts.

**Promotions & Marketing**
- Discount codes; post‑service package prompts; **WhatsApp Broadcast** (templated messages via provider when approved).

### 5.3 Reviews & Trust
- Post‑visit only; fraud checks (device, order history); report abuse; soft‑moderation queue.
- Display: overall rating, recency weighting, response from merchant.

### 5.4 Payments, Fees & Payouts
- Stripe Connect split: marketplace fee %, processing fees, merchant net.
- Held deposits and late‑cancel/no‑show fees (configurable windows & fee tables).
- Payout schedule: daily/weekly; statements & reconciliation downloads.

### 5.5 Notifications
- Transactional: booking confirm/change/cancel, reminders (24h/3h), no‑show, refund, receipt.
- Channels: Email + SMS; **WhatsApp Business (preferred in SG)** once approved; user preferences center.
- Delivery metrics & rate limits.

### 5.6 Admin Console
- Merchant directory: status (pending KYC/approved/suspended), flags, documents.
- Content moderation: reviews/photos; takedown workflow.
- Taxonomy & copy management; feature flags; fee configuration.
- Dispute desk: refunds, chargebacks, partial credits.

---

## 6) Non‑Functional Requirements (NFRs)
- **Performance:** p95 TTI < 2.5s on 4G; search results < 1.5s; slot fetch < 800ms.
- **Uptime:** 99.9% monthly; maintenance windows announced ≥ 48h.
- **Scalability:** 10k DAU, 500 concurrent checkouts, 50rps search (MVP targets).
- **Security:** OAuth2/OIDC, TLS 1.2+, hashed passwords (Argon2), role‑based access control.
- **Privacy/Compliance:** PDPA (SG), GDPR principles; data minimization; audit logs 365 days. GST 9% on eligible items. KYC/AML via Stripe.
- **Accessibility:** WCAG 2.1 AA; keyboard navigation; color contrast ≥ 4.5:1.
- **Observability:** Logs, metrics, traces; alerting (SLO burn rate); audit trail for admin actions.
- **Backup/DR:** RPO ≤ 15 min; RTO ≤ 2 h; encrypted backups, tested monthly.

---

## 7) Information Architecture & Data Model (MVP)
**Core Entities**
- User (consumer)
- Merchant (org) ↔ Locations (1..N)
- Staff (users scoped to Merchant)
- Services, Add‑ons, Categories
- Products (for POS)
- Availability (staff schedule, exceptions)
- Booking (status: pending, confirmed, canceled, no‑show, completed)
- Payments (intents, charges, refunds), Payouts, Fees
- Reviews
- InventoryMovements
- PromotionCodes

**Key Relationships**
- Merchant 1..N Locations; Location 1..N Staff; Service N..N Staff (skills matrix);
- Booking → (User, Merchant, Location, Staff, Service, TimeSlot, PaymentIntent)
- Review → Booking (enforced after completed)

---

## 8) API Surface (Representative Endpoints)
**Public (Consumer)**
- `GET /v1/search?query=&lat=&lng=&date=&filters=...`
- `GET /v1/merchants/{id}`
- `GET /v1/services/{id}`
- `POST /v1/bookings` (create booking + optional payment intent)
- `POST /v1/payments/confirm` (webhooks for Stripe events)
- `GET /v1/users/me/bookings`
- `POST /v1/reviews`

**Merchant**
- `POST /v1/merchants` (create + connect account)
- `GET /v1/merchant/availability`
- `POST /v1/merchant/services`
- `POST /v1/merchant/blocks`
- `GET /v1/merchant/bookings?range=...`
- `POST /v1/merchant/pos/checkout`

**Admin**
- `GET /v1/admin/merchants?status=`
- `POST /v1/admin/moderation/reviews/{id}:action`

**Webhooks**
- Stripe: `payment_intent.succeeded`, `.payment_failed`, `charge.refunded`, `account.updated`
- Notifications provider: delivery receipts

---

## 9) Tech Stack & Architecture (Reference)
- **Frontend:** Next.js (React/TypeScript), Tailwind + shadcn/ui, SSR for SEO pages; CSR for app areas; PWA (Phase 1.1).
- **Backend:** Next.js API routes or NestJS; Node 20+; GraphQL or REST (REST MVP for speed).
- **DB:** PostgreSQL 16; Prisma ORM; read replicas Phase 2.
- **Search:** Postgres trigram + GIST for MVP; Meilisearch/Algolia in Phase 2.
- **Cache/Queue:** Redis (BullMQ) for reminders, webhooks, index jobs.
- **Storage:** S3‑compatible (images, receipts).
- **Auth:** NextAuth (email magic link; social later).
- **Payments:** Stripe Connect (Express); optional PayNow/GrabPay via Stripe or HitPay/Xfers if needed.
- **Maps/Geo:** Google Maps Places/Geocoding.
- **Observability:** OpenTelemetry → Grafana/Tempo/Prometheus; Sentry for FE/BE.

**Key Design Decisions & Trade‑offs**
- REST over GraphQL for MVP reduces ceremony and tooling overhead; revisit when mobile apps and public APIs grow.
- Postgres search is "good enough" at start; less complexity than adopting Algolia day 1.
- Stripe Connect Express balances KYC burden with control; Standard may offload support but limits UX control.

---

## 10) Policies & Ops
- **Cancellation/No‑show:** Merchant‑configurable windows & fees; consumer must explicitly agree at checkout.
- **Refunds:** Initiated by merchant (admin override available); partial or full; audit log required.
- **Disputes/Chargebacks:** Evidence pack generator (receipts, policy acceptance, comms log).
- **Content Moderation:** Keyword heuristics + manual review; appeals path.
- **Data Retention:** Bookings: 3 years; invoices: 5 years (finance); logs: 1 year.

---

## 11) Metrics & Dashboards
**North Star:** Completed bookings per active merchant.

**Consumer**: conversion to booking, repeat rate (30/60/90), CAC, NPS.

**Merchant**: utilization %, revenue, no‑show rate, repeat customer %, payout timing.

**Platform**: take rate, payment success %, fraud rate, latency SLOs.

---

## 12) Risks & Mitigations
- **Cold start (supply & demand):** Seed top categories/areas, concierge onboarding, zero‑commission beta cohort, referral program.
- **No‑shows:** Deposits, reminders, waitlist backfill, stricter policies.
- **Fraud/abuse:** Reviews gated by completed bookings; velocity limits; KYC; device fingerprinting Phase 2.
- **Operational load:** Automate reminders, webhooks, reconciliation; clear runbooks.

---

## 13) Rollout Plan (MVP → M+3)
**Phase 0 (2–3 wks):** Core data models, auth, Stripe Connect, merchant onboarding, service catalog, basic calendar.

**Phase 1 (3–4 wks):** Consumer discovery/search (list + map), service pages, slot picker, booking + payments, confirmations, reminders.

**Phase 1.1 (2 wks):** POS (walk‑in), GST receipts, review system, WhatsApp/SMS provider.

**Phase 2 (3–4 wks):** Promotions/coupons, inventory basic, waitlist automation, merchant analytics.

**Beta (2 wks):** 10–20 merchants in 2 neighborhoods; feedback loop; polish.

---

## 14) Acceptance Criteria (Samples)
**A1 Booking creation**
- *Given* a consumer selects a service and slot,
- *When* they confirm and pay,
- *Then* a booking with status=confirmed is created, staff calendar is blocked, notifications sent within 30s, and a receipt is available.

**A2 Cancellation policy**
- *Given* a booking with a 24h cancellation window,
- *When* a consumer cancels within 5h,
- *Then* system applies configured late‑cancel fee and updates payout split; notifications reflect fees.

**A3 Review gating**
- *Given* a booking status=completed,
- *When* consumer enters a review,
- *Then* it is linked to booking and visible after moderation; editing allowed for 24h.

**A4 Merchant KYC**
- *Given* a new merchant signs up,
- *When* they finish Stripe Connect onboarding,
- *Then* payouts remain pending until KYC=verified; marketplace listing visible only after Admin approval.

---

## 15) Open Questions
- Stripe Connect **Express vs Standard**: support/UX trade‑offs.
- WhatsApp Business API onboarding timeline & costs in SG.
- Do we enforce **deposit‑only** or optional full prepay at checkout by category?
- Package/membership complexity timing: MVP‑lite vs Phase 2.

---

## 16) Appendix — Parity Checklist (Fresha‑like)
- [ ] Marketplace search (list + map), filter by category/date/rating/price/distance.
- [ ] Merchant profile with photos, services, staff, policies.
- [ ] Real‑time slot selection across staff.
- [ ] Email/SMS reminders + calendar invite.
- [ ] No‑show/late‑cancel fees & deposits.
- [ ] Reviews (post‑visit only) + merchant replies.
- [ ] Back‑office: catalog, calendar, staff, POS (basic), inventory (basic), promotions.
- [ ] Stripe Connect split payouts, GST invoices.
- [ ] Admin: KYC, moderation, disputes, taxonomy.

---

## 16A) Appendix — Swee Brand & Marketing Copy (starter)
**Homepage hero (A/B):**
- A: "Book beauty & wellness—fast, fair, Swee." CTA: **Get Swee** / **Explore nearby**
- B: "Find a slot, hold with a deposit, show up—simple." CTA: **Book now**

**Policy microcopy:** "Free cancel up to 24h. After that, a late fee applies to protect your stylist’s time."

**Deposit microcopy:** "Swee Protect holds $10 now; it’s deducted from your total at checkout."

**Merchant value prop:** "Fewer no‑shows, faster payouts, one place to run it all."

---

### Change Log
- **v0.2 (2025‑09‑10):** Tailored to **Swee** (brand, quiz, deposits, WhatsApp, naming, copy).
- **v0.1 (2025‑09‑10):** Initial MVP PRD drafted for review.
