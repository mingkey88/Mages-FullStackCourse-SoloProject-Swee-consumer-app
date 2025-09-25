/**
 * Quick script to create a super admin user for development
 * This runs directly against the existing SQLite database
 * 
 * Usage: node scripts/create-super-admin.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSuperAdmin() {
  console.log('🔑 Creating super admin user for development...');
  
  try {
    const superAdmin = await prisma.user.upsert({
      where: { email: 'dev@swee.sg' },
      update: {
        name: 'Super Admin (Dev)',
        role: 'ADMIN',
        points: 999999,
        serviceType: 'All Services',
        budgetRange: 'Unlimited',
        frequency: 'As needed',
        lifestyle: 'Developer',
      },
      create: {
        email: 'dev@swee.sg',
        name: 'Super Admin (Dev)',
        role: 'ADMIN',
        points: 999999,
        serviceType: 'All Services',
        budgetRange: 'Unlimited',
        frequency: 'As needed',
        lifestyle: 'Developer',
      },
    });

    console.log('✅ Super admin created successfully!');
    console.log('');
    console.log('🔑 Super Admin Login Credentials:');
    console.log(`   📧 Email: ${superAdmin.email}`);
    console.log(`   🔒 Password: any password (dev mode accepts any password)`);
    console.log(`   👤 Role: ${superAdmin.role}`);
    console.log(`   🎯 Name: ${superAdmin.name}`);
    console.log('');
    console.log('💡 Now you can sign in at: http://localhost:3001/auth/signin');
    console.log('   Use the credentials above to access all pages as super admin');
    
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    
    if (error.message.includes('database')) {
      console.log('');
      console.log('💡 Make sure your database exists. Try running:');
      console.log('   npm run db:push');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  createSuperAdmin()
    .then(() => {
      console.log('✨ Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createSuperAdmin };