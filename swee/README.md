# 🧼 Swee - Beauty & Wellness Marketplace

> **Singapore's trust-first beauty booking platform**

A dual-sided marketplace connecting consumers with beauty & wellness professionals, featuring transparent pricing, anti-hard-selling protection, and merchant management tools.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup database
npm run db:push
npm run db:generate
npm run db:seed

# Start development server
npm run dev
```

Visit: http://localhost:3000

## 📋 Project Status

**Current Version**: MVP in Development  
**Tech Stack**: Next.js 15, TypeScript, Prisma, SQLite → PostgreSQL  
**Development Server**: Port 3002 (active)

### ✅ Implemented Features
- Consumer discovery & booking flow
- Merchant onboarding & dashboard  
- Service catalog management
- Basic calendar scheduling
- NextAuth authentication
- Responsive UI with shadcn/ui

### 🔧 In Progress
- Stripe Connect payment integration
- WhatsApp/Email notifications
- Review & rating system
- Admin console & KYC workflow

## 📚 Documentation

- **[Swee_PRD.md](./Swee_PRD.md)** - Product Requirements Document
- **[Swee_Eng_Plan.md](./Swee_Eng_Plan.md)** - Engineering Implementation Plan  
- **[CLAUDE.md](./CLAUDE.md)** - AI Assistant Context & Development Guide

## 🏗️ Key Architecture

```
/src/app/
├── api/              # API routes
├── merchant/         # Merchant dashboard
├── providers/[id]/   # Public merchant profiles
├── for-business/     # Merchant signup
└── (consumer)/       # Consumer pages

/src/components/
├── ui/               # shadcn/ui components
└── merchant/         # Merchant components
```

## 🎯 MVP Goals

- **Time-to-booking**: <3 minutes  
- **Repeat rate**: ≥30% in 60 days
- **Merchant NPS**: ≥45
- **Confirmation delivery**: ≥99%

## 🛠️ Development Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run lint         # Run ESLint
npm run typecheck    # TypeScript checking
npm run db:studio    # Open Prisma Studio
```

## 📊 Current Development Priorities

1. **Fix build issues** (89 TS/ESLint errors)
2. **Security updates** (Next.js vulnerabilities)
3. **Payment integration** (Stripe Connect)
4. **Database migration** (SQLite → PostgreSQL)
5. **Performance optimizations**

---

**Built with ❤️ for Singapore's beauty community**