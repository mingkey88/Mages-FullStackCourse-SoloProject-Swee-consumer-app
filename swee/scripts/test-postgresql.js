/**
 * PostgreSQL Connection Test Script
 * 
 * This script tests the PostgreSQL database connection
 * and validates the Prisma setup.
 * 
 * Usage: node scripts/test-postgresql.js
 */

const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🧪 Testing PostgreSQL connection...');
  console.log('');
  
  const prisma = new PrismaClient();
  
  try {
    // Test basic connection
    console.log('1️⃣  Testing database connection...');
    await prisma.$queryRaw`SELECT 1 as test`;
    console.log('   ✅ Connection successful');
    
    // Test if tables exist
    console.log('2️⃣  Checking database schema...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    
    const tableNames = tables.map(t => t.table_name);
    console.log(`   ✅ Found ${tableNames.length} tables: ${tableNames.join(', ')}`);
    
    if (tableNames.length === 0) {
      console.log('   ⚠️  No tables found. You may need to run migrations first.');
      console.log('   💡 Run: npx prisma migrate dev --name init');
    }
    
    // Test basic CRUD if tables exist
    if (tableNames.includes('users')) {
      console.log('3️⃣  Testing basic operations...');
      
      // Count existing records
      const userCount = await prisma.user.count();
      const merchantCount = await prisma.merchant.count();
      const serviceCount = await prisma.service.count();
      
      console.log(`   📊 Current data: ${userCount} users, ${merchantCount} merchants, ${serviceCount} services`);
      
      console.log('   ✅ Database operations working');
    }
    
    console.log('');
    console.log('🎉 PostgreSQL setup is working correctly!');
    
    if (tableNames.length === 0) {
      console.log('');
      console.log('📋 Next steps to complete setup:');
      console.log('   1. Run: npx prisma migrate dev --name init');
      console.log('   2. Run: npx prisma db seed');
      console.log('   3. Run this test again to verify');
    } else if (tableNames.length > 0) {
      console.log('');
      console.log('📋 Database is ready! You can now:');
      console.log('   1. Start your Next.js application');
      console.log('   2. Run data migration (if moving from SQLite)');
      console.log('   3. Test all application features');
    }
    
  } catch (error) {
    console.error('');
    console.error('❌ Connection test failed:', error.message);
    console.error('');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('🔧 Connection refused - PostgreSQL server is not running or not accessible');
      console.error('');
      console.error('💡 Solutions:');
      console.error('   1. Check if PostgreSQL is installed and running');
      console.error('   2. Verify your DATABASE_URL in .env file');
      console.error('   3. Consider using a cloud PostgreSQL service (Supabase, Railway, etc.)');
    } else if (error.code === 'ENOTFOUND') {
      console.error('🔧 Host not found - Check your DATABASE_URL hostname');
    } else if (error.message.includes('password authentication failed')) {
      console.error('🔧 Authentication failed - Check your username and password in DATABASE_URL');
    } else if (error.message.includes('database') && error.message.includes('does not exist')) {
      console.error('🔧 Database does not exist - Create the database first');
      console.error('   Example: CREATE DATABASE swee_dev;');
    } else {
      console.error('🔧 Unexpected error. Check your PostgreSQL setup and DATABASE_URL');
    }
    
    console.error('');
    console.error('🌐 Quick setup with cloud services:');
    console.error('   • Supabase: https://supabase.com (Free tier available)');
    console.error('   • Railway: https://railway.app (Simple setup)');
    console.error('   • Vercel Postgres: https://vercel.com/storage/postgres');
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
if (require.main === module) {
  testConnection()
    .then(() => {
      console.log('');
      console.log('✨ Test completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testConnection };