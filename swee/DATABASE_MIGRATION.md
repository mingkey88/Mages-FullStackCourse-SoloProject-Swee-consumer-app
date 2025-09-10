# Database Migration: SQLite to PostgreSQL

## Overview
This document outlines the migration strategy from SQLite (development) to PostgreSQL (production) for the Swee consumer application.

## Migration Status
- ✅ **Prisma schema updated** - Changed provider from `sqlite` to `postgresql`
- ✅ **PostgreSQL client installed** - Added `pg` and `@types/pg` packages
- ✅ **Environment configuration** - Updated `.env` for PostgreSQL connection
- ⚠️ **Database migration pending** - Need to set up PostgreSQL server and migrate data

## Prerequisites

### 1. PostgreSQL Installation
For local development, install PostgreSQL:

**Windows:**
```bash
# Using chocolatey
choco install postgresql

# Or download from https://www.postgresql.org/download/windows/
```

**macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Database Setup
Create the development database:

```bash
# Connect to PostgreSQL as superuser
sudo -u postgres psql

# Create database and user
CREATE DATABASE swee_dev;
CREATE USER swee_user WITH ENCRYPTED PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE swee_dev TO swee_user;
\q
```

## Migration Steps

### Step 1: Environment Configuration
Update your `.env` file with the correct PostgreSQL connection string:

```env
# Replace with your actual PostgreSQL credentials
DATABASE_URL="postgresql://swee_user:secure_password_here@localhost:5432/swee_dev"
```

### Step 2: Generate Migration Files
```bash
cd swee
npx prisma migrate dev --name init_postgresql
```

### Step 3: Run Migration
```bash
npx prisma db push
```

### Step 4: Seed Database
```bash
npx prisma db seed
```

### Step 5: Generate Prisma Client
```bash
npx prisma generate
```

## Data Migration Script

If you need to migrate existing data from SQLite, use this script:

```javascript
// scripts/migrate-sqlite-to-postgresql.js
const { PrismaClient: SQLiteClient } = require('@prisma/client');
const { PrismaClient: PostgreSQLClient } = require('@prisma/client');

// SQLite client (old database)
const sqliteClient = new SQLiteClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db"
    }
  }
});

// PostgreSQL client (new database)
const postgresClient = new PostgreSQLClient();

async function migrateData() {
  try {
    console.log('🔄 Starting data migration...');

    // Migrate Users
    const users = await sqliteClient.user.findMany();
    for (const user of users) {
      await postgresClient.user.create({ data: user });
    }
    console.log(`✅ Migrated ${users.length} users`);

    // Migrate Merchants
    const merchants = await sqliteClient.merchant.findMany();
    for (const merchant of merchants) {
      await postgresClient.merchant.create({ data: merchant });
    }
    console.log(`✅ Migrated ${merchants.length} merchants`);

    // Migrate Services
    const services = await sqliteClient.service.findMany();
    for (const service of services) {
      await postgresClient.service.create({ data: service });
    }
    console.log(`✅ Migrated ${services.length} services`);

    // Migrate other tables...
    
    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await sqliteClient.$disconnect();
    await postgresClient.$disconnect();
  }
}

migrateData();
```

## Production Deployment

### Recommended PostgreSQL Hosting
1. **Supabase** (Recommended for startups)
   - Built-in auth, real-time features
   - Free tier with 500MB storage
   - Easy integration with Next.js

2. **Vercel PostgreSQL**
   - Seamless integration with Vercel deployment
   - Auto-scaling and backups

3. **Railway**
   - Simple setup and deployment
   - Reasonable pricing

4. **AWS RDS**
   - Enterprise-grade reliability
   - More configuration required

### Production Environment Variables
```env
# Production PostgreSQL URL (example for Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"

# NextAuth settings
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="production-secret-32-chars-or-longer"

# Other production variables...
```

### Production Migration Steps
1. **Set up PostgreSQL hosting**
2. **Update production environment variables**
3. **Run migrations in production**
   ```bash
   npx prisma migrate deploy
   ```
4. **Seed production database** (if needed)
5. **Test all endpoints and functionality**

## Schema Differences (SQLite vs PostgreSQL)

### Key Changes Made
1. **Provider change**: `sqlite` → `postgresql`
2. **Connection string format**: File path → PostgreSQL URL
3. **Data types**: Some automatic conversions by Prisma
4. **Constraints**: PostgreSQL has stricter constraint validation

### Potential Issues to Watch
1. **Case sensitivity**: PostgreSQL is case-sensitive for identifiers
2. **JSON handling**: Slightly different JSON operators
3. **Date/time handling**: Different timezone behavior
4. **Auto-increment**: Uses SERIAL instead of INTEGER PRIMARY KEY

## Testing Checklist
- [ ] Database connection successful
- [ ] All tables created correctly
- [ ] Sample data seeded successfully
- [ ] API endpoints work with new database
- [ ] Authentication flows work
- [ ] File uploads/downloads work (if applicable)
- [ ] Performance is acceptable

## Rollback Plan
If migration fails:
1. Keep SQLite database as backup
2. Revert Prisma schema to SQLite
3. Update environment variables back to SQLite
4. Restart development server

## Monitoring & Maintenance
- Set up database monitoring (connection pool, query performance)
- Regular backups (automated via hosting provider)
- Performance monitoring for N+1 queries
- Index optimization for production queries

## Next Steps After Migration
1. **Performance optimization**: Add database indexes
2. **Connection pooling**: Configure for production load
3. **Backup strategy**: Automated daily backups
4. **Monitoring**: Set up alerts for database issues
5. **Security**: Review connection security and access controls

---

*Last updated: 2025-09-10*
*Migration prepared by: AI Assistant*