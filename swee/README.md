# Swee - Beauty Services Booking Platform 💄

> **Beauty services without the sales pressure**

Swee is a modern, consumer-focused booking platform that connects users with trusted beauty professionals through AI-powered matching. Built with transparency, anti-hard-selling protection, and user experience at its core.

## 🚀 Quick Start

```bash
git clone <repository-url>
cd swee
npm ci                     # installs the exact locked dependency versions
cp .env.example .env       # points at the bundled demo database
npm run dev
```

Visit http://localhost:3000 to get started. The bundled SQLite database (`prisma/prisma/dev.db`) already has demo merchants, services and the test accounts below, so no seeding is needed.

To rebuild the demo data in a new database, set `DATABASE_URL="file:./dev.db"` in `.env`, then run:

```bash
npm run db:push && npm run db:seed && npm run dev:create-admin && npm run dev:create-merchant && npm run dev:seed-demo
```

### Test accounts

The dev sign-in accepts **any password** (demo only — not secure).

| Role | Email | Sign in at |
|---|---|---|
| Customer | `user@example.com` | `/auth/signin` |
| Merchant (The Hair Studio) | `info@hairstudio.sg` | `/merchant/auth/signin` |
| Admin (owns the "(demo)" merchants) | `dev@swee.sg` | `/auth/signin` |

**For complete documentation, setup instructions, and development guide, see [CLAUDE.md](./CLAUDE.md)**

## 🌟 Key Features

- **AI-Powered Matching** - Intelligent recommendations based on user preferences
- **Trust System** - Transparent ratings with anti-hard-selling protection
- **Escrow Payments** - Consumer payment protection until service completion
- **Merchant SaaS** - Complete business management platform
- **Rewards System** - Gamified loyalty program with points

## 🛠 Tech Stack

- **Next.js 15** with App Router & Turbopack
- **TypeScript** for type safety
- **Tailwind CSS v4** for styling
- **Prisma ORM** with PostgreSQL
- **NextAuth.js** for authentication
- **Vitest** for testing

## 📱 Demo

### Consumer App
- **Homepage**: AI-powered service recommendations
- **Search**: Advanced filtering with trust scores
- **Booking**: Fresha-style multi-step flow
- **Rewards**: Gamified loyalty system

### Merchant Portal
Visit: http://localhost:3000/merchant/auth/signin
Demo login: `info@hairstudio.sg` / any password

- **Dashboard**: Business KPIs and analytics
- **Services**: CRUD management interface
- **Calendar**: Appointment scheduling
- **Payments**: Escrow tracking and payouts

## 🔒 Authentication

- **Google OAuth** via NextAuth.js
- **Role-based access** (Consumer/Merchant/Admin)
- **Secure sessions** with JWT tokens

## 🧪 Testing

```bash
npm test              # Run tests
npm run test:coverage # Test coverage report
```

Complete test suite with Vitest and React Testing Library.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Make your changes
4. Run tests: `npm test`
5. Submit a pull request

## 📄 Documentation

- **[CLAUDE.md](./CLAUDE.md)** - Complete development guide
- **Prisma Schema** - Database models and relationships
- **Component Tests** - Testing patterns and examples

## 📞 Support

- **Issues**: GitHub Issues for bug reports
- **Discussions**: Community support and feature requests

---

**Built with ❤️ for the beauty industry**


*Swee - Where beauty meets technology, without the pressure.*
