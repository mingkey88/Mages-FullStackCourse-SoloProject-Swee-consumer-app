# Swee PRD — CTO Summary (Updated)

Version: v0.2 • Date: 2025‑09‑11 • Scope: MVP → Beta

## Overview
Swee is a trust‑first beauty & wellness marketplace plus merchant OS for Singapore. Consumers discover, compare, and book in under 3 minutes; merchants manage services, availability, and payouts. Differentiators: anti‑hard‑sell stance, lightweight personalization (Swee Quiz), and transparent policies (Swee Protect).

## MVP Scope
- Consumer discovery and booking (list/map, filters, service pages, slot picker, cartless checkout).
- Swee Quiz (1–3 Qs) to guide discovery; preferences saved to profile.
- Swee Protect: deposits + late‑cancel/no‑show fees (merchant‑configurable).
- Merchant back office: catalog, calendar, basic POS, simple inventory, discount codes.
- Payments: Stripe Connect split payouts (cards at launch; PayNow/GrabPay follow‑on).
- Notifications: Email (WhatsApp/SMS when approved).
- Reviews (post‑service only). Admin console for approvals and moderation.

Out of scope (MVP): multi‑currency, advanced inventory, memberships, complex marketing automation.

## Users & Journeys (MVP)
- Consumer: land → optional quiz → search/filter → service page → slot → policy banner → pay → confirmation → reminders.
- Merchant: sign up → onboard → create services → set schedule → receive bookings → reconcile payouts.
- Admin: approve merchants/KYC, moderate reviews, manage taxonomy and fees.

## Success Metrics (M+3)
- p95 time‑to‑booking < 3 min; ≥30% repeat in 60 days.
- Merchant NPS ≥ 45; consumer CSAT ≥ 4.6/5.
- Confirmation delivery ≥ 99%.

## Non‑Functional Requirements
- Performance: p95 TTI < 2.5s; search < 1.5s.
- Security/Privacy: OAuth2/OIDC, RBAC, PDPA/GDPR principles; audit trails for policy events.
- Accessibility: WCAG 2.1 AA.
- Reliability: 99.9% uptime target; backups/DR tested.

## Data Model (MVP)
- User, Merchant, Service, Booking, Feedback, Points, HardSellReport, PendingPayment/Payout; NextAuth tables.
- Booking status: PENDING/CONFIRMED/COMPLETED/CANCELLED/NO_SHOW.

## Current Status
- Implemented: discovery, booking flow, merchant dashboard, NextAuth, API routes, demo data, AI assistant scaffolding.
- In progress: Stripe Connect payments, notifications, reviews, admin console.
- DB: Dev = SQLite; Deploy = Postgres (see `prisma/schema.postgres.prisma`).

## Rollout Plan
1) MVP hardening: payments, policies, moderation, error handling.
2) Beta: seed 10–20 merchants; measure time‑to‑booking and repeat.
3) Enhance: notifications (WhatsApp), promotions, inventory basics, analytics.

## Risks & Mitigations
- Supply/demand cold start → curated seed merchants, incentives, concierge onboarding.
- No‑shows → deposits, reminders, policy acceptance at checkout.
- Abuse/fraud → reviews gated by completed bookings; rate limits; KYC via Stripe.

## API (Representative)
- Public: search, merchants/{id}, services/{id}, bookings, reviews.
- Merchant: services CRUD, availability, bookings, POS checkout (basic).
- Admin: merchants moderation, reviews moderation.

This PRD reflects the live codebase and near‑term plan. For engineering specifics, see `Swee_Eng_Plan.md`.

