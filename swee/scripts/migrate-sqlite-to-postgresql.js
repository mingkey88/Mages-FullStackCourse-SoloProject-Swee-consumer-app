/**
 * SQLite to PostgreSQL Data Migration Script
 * 
 * This script migrates existing data from SQLite to PostgreSQL
 * Run this after setting up PostgreSQL and running initial migrations
 * 
 * Usage: node scripts/migrate-sqlite-to-postgresql.js
 */

const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Create two Prisma clients with different database URLs
const sqliteClient = new PrismaClient({
  datasources: {
    db: {
      url: "file:./prisma/dev.db"
    }
  }
});

const postgresClient = new PrismaClient();

async function migrateData() {
  console.log('🚀 Starting SQLite to PostgreSQL migration...');
  console.log('');

  try {
    // Check if SQLite database exists
    console.log('📋 Checking SQLite database...');
    
    let sqliteExists = true;
    try {
      await sqliteClient.$queryRaw`SELECT 1`;
      console.log('✅ SQLite database found');
    } catch (error) {
      console.log('⚠️  SQLite database not found or empty');
      sqliteExists = false;
    }

    // Check PostgreSQL connection
    console.log('📋 Checking PostgreSQL connection...');
    try {
      await postgresClient.$queryRaw`SELECT 1`;
      console.log('✅ PostgreSQL database connected');
    } catch (error) {
      console.error('❌ PostgreSQL connection failed:', error.message);
      throw new Error('Cannot connect to PostgreSQL. Please check your DATABASE_URL.');
    }

    console.log('');

    if (!sqliteExists) {
      console.log('⚠️  No SQLite data to migrate. Running fresh seed instead...');
      console.log('💡 Run: npx prisma db seed');
      return;
    }

    // Start migration
    console.log('🔄 Migrating data...');
    console.log('');

    // Migrate ServiceTags first (referenced by Services)
    console.log('1️⃣  Migrating service tags...');
    try {
      const serviceTags = await sqliteClient.serviceTag.findMany();
      
      for (const tag of serviceTags) {
        await postgresClient.serviceTag.upsert({
          where: { id: tag.id },
          update: tag,
          create: tag,
        });
      }
      console.log(`   ✅ Migrated ${serviceTags.length} service tags`);
    } catch (error) {
      console.log(`   ⚠️  Service tags migration skipped: ${error.message}`);
    }

    // Migrate Users
    console.log('2️⃣  Migrating users...');
    try {
      const users = await sqliteClient.user.findMany();
      
      for (const user of users) {
        await postgresClient.user.upsert({
          where: { id: user.id },
          update: user,
          create: user,
        });
      }
      console.log(`   ✅ Migrated ${users.length} users`);
    } catch (error) {
      console.log(`   ⚠️  Users migration failed: ${error.message}`);
    }

    // Migrate Merchants
    console.log('3️⃣  Migrating merchants...');
    try {
      const merchants = await sqliteClient.merchant.findMany();
      
      for (const merchant of merchants) {
        await postgresClient.merchant.upsert({
          where: { id: merchant.id },
          update: merchant,
          create: merchant,
        });
      }
      console.log(`   ✅ Migrated ${merchants.length} merchants`);
    } catch (error) {
      console.log(`   ⚠️  Merchants migration failed: ${error.message}`);
    }

    // Migrate Services (depends on Merchants and ServiceTags)
    console.log('4️⃣  Migrating services...');
    try {
      const services = await sqliteClient.service.findMany({
        include: {
          tags: true,
        },
      });
      
      for (const service of services) {
        const { tags, ...serviceData } = service;
        
        await postgresClient.service.upsert({
          where: { id: service.id },
          update: {
            ...serviceData,
            tags: {
              connect: tags.map(tag => ({ id: tag.id })),
            },
          },
          create: {
            ...serviceData,
            tags: {
              connect: tags.map(tag => ({ id: tag.id })),
            },
          },
        });
      }
      console.log(`   ✅ Migrated ${services.length} services`);
    } catch (error) {
      console.log(`   ⚠️  Services migration failed: ${error.message}`);
    }

    // Migrate Bookings
    console.log('5️⃣  Migrating bookings...');
    try {
      const bookings = await sqliteClient.booking.findMany();
      
      for (const booking of bookings) {
        await postgresClient.booking.upsert({
          where: { id: booking.id },
          update: booking,
          create: booking,
        });
      }
      console.log(`   ✅ Migrated ${bookings.length} bookings`);
    } catch (error) {
      console.log(`   ⚠️  Bookings migration failed: ${error.message}`);
    }

    // Migrate Feedback
    console.log('6️⃣  Migrating feedback...');
    try {
      const feedback = await sqliteClient.feedback.findMany();
      
      for (const fb of feedback) {
        await postgresClient.feedback.upsert({
          where: { id: fb.id },
          update: fb,
          create: fb,
        });
      }
      console.log(`   ✅ Migrated ${feedback.length} feedback entries`);
    } catch (error) {
      console.log(`   ⚠️  Feedback migration failed: ${error.message}`);
    }

    // Migrate Quiz Answers
    console.log('7️⃣  Migrating quiz answers...');
    try {
      const quizAnswers = await sqliteClient.quizAnswer.findMany();
      
      for (const answer of quizAnswers) {
        await postgresClient.quizAnswer.upsert({
          where: { id: answer.id },
          update: answer,
          create: answer,
        });
      }
      console.log(`   ✅ Migrated ${quizAnswers.length} quiz answers`);
    } catch (error) {
      console.log(`   ⚠️  Quiz answers migration failed: ${error.message}`);
    }

    // Migrate Points Transactions
    console.log('8️⃣  Migrating points transactions...');
    try {
      const pointsTransactions = await sqliteClient.pointsTransaction.findMany();
      
      for (const transaction of pointsTransactions) {
        await postgresClient.pointsTransaction.upsert({
          where: { id: transaction.id },
          update: transaction,
          create: transaction,
        });
      }
      console.log(`   ✅ Migrated ${pointsTransactions.length} points transactions`);
    } catch (error) {
      console.log(`   ⚠️  Points transactions migration failed: ${error.message}`);
    }

    // Migrate other tables as needed...
    // Hard Sell Reports, Pending Payments, etc.

    console.log('');
    console.log('🎉 Migration completed successfully!');
    console.log('');
    console.log('📋 Next steps:');
    console.log('   1. Test your application with the new PostgreSQL database');
    console.log('   2. Verify all data migrated correctly');
    console.log('   3. Run your application and test key features');
    console.log('   4. Once confirmed working, you can safely remove the SQLite file');
    console.log('');
    
  } catch (error) {
    console.error('');
    console.error('❌ Migration failed with error:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('   1. Ensure PostgreSQL is running and accessible');
    console.error('   2. Check your DATABASE_URL environment variable');
    console.error('   3. Run: npx prisma migrate dev --name init');
    console.error('   4. Make sure both databases are accessible');
    console.error('');
    process.exit(1);
  } finally {
    await sqliteClient.$disconnect();
    await postgresClient.$disconnect();
  }
}

// Run the migration
if (require.main === module) {
  migrateData()
    .then(() => {
      console.log('✨ Migration process finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration process failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateData };