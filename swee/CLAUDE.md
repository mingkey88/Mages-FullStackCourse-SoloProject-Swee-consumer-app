# CLAUDE.md - Development Context & Analysis

> **AI Assistant Context File** | Last Updated: 2025-09-10 | Version: 1.0

---

## 📋 **Project Overview**

**Swee** is a dual-sided beauty & wellness marketplace + merchant OS platform, built for Singapore first. Think "Fresha-class" functionality with distinctive Swee twists.

### **Core Value Propositions**
- **Consumers:** Find, compare, and book services in <3 minutes with transparent policies and deposits
- **Merchants:** All-in-one operating system (calendar, staff, POS, inventory) + marketplace exposure
- **Platform:** Anti-hard-selling approach with trust-based scoring system

---

## 🎯 **Current Project Status**

### **✅ What's Working**
- Next.js 15 app with App Router + TypeScript
- Prisma ORM with SQLite database (migrating to PostgreSQL)
- NextAuth.js authentication system
- Basic merchant onboarding and service catalog
- Consumer discovery and booking flow
- API endpoints for merchants and bookings
- UI components using shadcn/ui + Tailwind CSS
- Development server running on port 3002

### **🔧 Current Architecture**
```
Tech Stack:
- Frontend: Next.js 15 (App Router), TypeScript, Tailwind + shadcn/ui
- Backend: Next.js API routes
- Database: SQLite (dev) → PostgreSQL (prod)
- ORM: Prisma
- Auth: NextAuth.js (magic link)
- Payments: Stripe Connect (planned)
- Styling: Tailwind CSS + shadcn/ui components
- Maps: Google Maps integration
```

### **📁 Key Directory Structure**
```
/src/app/
  ├── api/                    # API routes
  │   ├── merchants/         # Merchant data endpoints
  │   ├── merchant/          # Merchant management
  │   ├── auth/              # NextAuth routes
  │   └── bookings/          # Booking system
  ├── merchant/              # Merchant dashboard pages
  ├── providers/[id]/        # Public merchant profiles
  ├── for-business/          # Merchant signup landing
  └── page.tsx               # Homepage

/src/components/
  ├── ui/                    # shadcn/ui components
  └── merchant/              # Merchant-specific components

/prisma/
  ├── schema.prisma          # Database schema
  └── seed.ts                # Sample data
```

---

## 🚀 **MVP Requirements (From PRD)**

### **Phase Breakdown**
**Target: MVP to Beta in 8-10 weeks**

#### **Consumer Features (MVP)**
- [x] Discovery & search (list + map views)
- [x] Service pages with merchant profiles  
- [x] Real-time slot booking
- [ ] **Swee Quiz** (1-3 questions for personalization)
- [ ] **Swee Protect** deposits & cancellation policies
- [ ] Payment integration (Stripe Connect)
- [ ] WhatsApp/Email notifications
- [ ] Reviews (post-service only)

#### **Merchant Features (MVP)**
- [x] Basic onboarding & KYC
- [x] Service catalog management
- [x] Calendar & staff scheduling
- [ ] **Swee Hub** dashboard
- [ ] POS system (basic)
- [ ] Inventory management (basic)
- [ ] **Swee Packs** (prepaid sessions)
- [ ] Promotion codes
- [ ] Analytics & reporting

#### **Platform Features (MVP)**
- [ ] Admin console (KYC, moderation, disputes)
- [ ] Stripe Connect split payouts
- [ ] GST-compliant invoicing
- [ ] WhatsApp Business integration
- [ ] Trust scoring system

---

## 🔍 **Current Issues & Optimization Opportunities**

### **Critical Issues Fixed**
- ✅ Database connection (DATABASE_URL configured)
- ✅ Prisma client generation
- ✅ Sample merchant data seeded
- ✅ API endpoints working

### **Performance Issues Identified**
1. **89 TypeScript/ESLint errors** - blocking clean builds
2. **Security vulnerabilities** - Next.js needs updating
3. **Duplicate code** - 870+ lines in AI search components
4. **Bundle optimization** - missing Next.js performance configs
5. **Database optimization** - N+1 query patterns in API routes

### **Priority Fixes Needed**
1. Update Next.js to fix security vulnerabilities
2. Clean up TypeScript errors and unused imports
3. Consolidate duplicate components (AISearch.tsx + AISearchEnhanced.tsx)
4. Add proper error handling across API routes
5. Implement authentication middleware pattern

---

## 🏗️ **Development Priorities**

### **Immediate (Week 1-2)**
1. **Fix build issues**: Resolve 89 TS/ESLint errors
2. **Security updates**: Update Next.js, fix vulnerabilities  
3. **Code cleanup**: Remove duplicated components and code
4. **Database migration**: Move from SQLite to PostgreSQL
5. **Environment setup**: Proper staging/production configs

### **Short-term (Week 3-4)**  
1. **Payments integration**: Implement Stripe Connect
2. **Swee Quiz**: Build personalization system
3. **Booking policies**: Add Swee Protect deposit system
4. **Notifications**: Email/SMS/WhatsApp integration
5. **Admin console**: Basic merchant approval workflow

### **Medium-term (Week 5-8)**
1. **POS system**: Walk-in booking and checkout
2. **Analytics**: Merchant dashboard and reporting
3. **Reviews**: Post-service review and rating system
4. **Inventory**: Basic stock management
5. **Performance**: Caching, optimizations, monitoring

---

## 📊 **Success Metrics (MVP Goals)**
- **Time-to-booking**: <3 minutes (p95)
- **Repeat bookings**: ≥30% within 60 days  
- **Merchant NPS**: ≥45
- **Consumer CSAT**: ≥4.6/5
- **Confirmation delivery**: ≥99%

---

## 🛠️ **Development Guidelines**

### **Code Quality Standards**
- TypeScript strict mode enabled
- ESLint + Prettier for formatting
- 60% test coverage minimum (business logic)
- WCAG 2.1 AA accessibility compliance

### **Architecture Patterns**
- API routes with proper error handling
- Database queries optimized (avoid N+1)
- Component composition over inheritance
- Server-side rendering for SEO pages
- Client-side rendering for interactive features

### **Security Requirements**
- Environment variables for secrets only
- Role-based access control (RBAC)
- Input validation using Zod
- Rate limiting on API endpoints
- Secure session management

---

## 🔄 **Migration Priorities**

### **Database Schema Updates**
Current Prisma schema is MVP-ready but needs:
- [ ] PostgreSQL migration from SQLite
- [ ] Stripe Connect account linking
- [ ] Payment intent and webhook tables
- [ ] Review and rating system tables
- [ ] Notification preferences and delivery tracking

### **API Standardization**  
- [ ] Consistent error response format
- [ ] Authentication middleware implementation
- [ ] Rate limiting configuration
- [ ] Webhook signature verification
- [ ] API versioning strategy

---

## 📝 **Key Files to Monitor**

### **Critical Business Logic**
- `/src/app/api/merchants/[id]/route.ts` - Merchant profile API
- `/src/app/api/bookings/route.ts` - Booking creation
- `/src/app/providers/[id]/page.tsx` - Public merchant pages
- `/src/app/for-business/page.tsx` - Merchant signup landing

### **Configuration Files**
- `/prisma/schema.prisma` - Database schema
- `/next.config.ts` - Next.js configuration  
- `/.env` - Environment variables
- `/package.json` - Dependencies and scripts

### **UI Components**
- `/src/components/ui/*` - shadcn/ui components
- `/src/components/Navigation.tsx` - Main navigation
- `/src/components/AISearch*.tsx` - Search components (need consolidation)

---

## 🎨 **Brand Guidelines**

### **Design System**
- **Primary Color**: `#6E56CF` (Iris)
- **Accent Color**: `#22C55E` (Emerald)  
- **Radius**: `1rem` on cards and buttons
- **Voice**: Warm, concise, helpful (Singlish-friendly)

### **Component Library**
- Using shadcn/ui + Tailwind CSS
- Consistent spacing and typography
- Accessibility-first approach
- Mobile-responsive design

---

## 🚦 **Current Development Status**

### **Environment Status**
- **Development Server**: ✅ Running on localhost:3002
- **Database**: ✅ SQLite with sample data
- **Authentication**: ✅ NextAuth configured
- **Build Status**: ⚠️ 89 errors need fixing

### **Ready for Development**
The project is now in a **stable development state** where:
1. Core architecture is in place
2. Database has sample merchant data
3. API endpoints are functional
4. UI framework is established
5. Development environment is working

**Next Steps**: Focus on cleaning up technical debt, implementing remaining MVP features, and preparing for production deployment.

---

*This file serves as a living context document for AI assistants working on the Swee project. Update as the project evolves.*