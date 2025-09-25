/**
 * Create a merchant profile for the super admin user
 * This allows the super admin to access merchant dashboard pages
 * 
 * Usage: node scripts/create-super-admin-merchant.js
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createSuperAdminMerchant() {
  console.log('🏪 Creating merchant profile for super admin...');
  
  try {
    // First, find the super admin user
    const superAdmin = await prisma.user.findUnique({
      where: { email: 'dev@swee.sg' }
    });

    if (!superAdmin) {
      console.error('❌ Super admin user not found. Please run create-super-admin.js first.');
      return;
    }

    console.log(`✅ Found super admin: ${superAdmin.name} (${superAdmin.email})`);

    // Create or update merchant profile for super admin
    const merchant = await prisma.merchant.upsert({
      where: { id: 999 }, // Use a high ID that won't conflict
      update: {
        name: 'Super Admin Test Merchant',
        description: 'Development merchant account for testing all merchant features. Full access to merchant dashboard, bookings, services, and analytics.',
        address: '123 Dev Street, Singapore 123456',
        phone: '+65 9999 9999',
        email: 'merchant@swee.sg',
        website: 'https://dev.swee.sg',
        ownerId: superAdmin.id,
        trustScore: 100.0,
      },
      create: {
        id: 999,
        name: 'Super Admin Test Merchant',
        description: 'Development merchant account for testing all merchant features. Full access to merchant dashboard, bookings, services, and analytics.',
        address: '123 Dev Street, Singapore 123456',
        phone: '+65 9999 9999',
        email: 'merchant@swee.sg',
        website: 'https://dev.swee.sg',
        ownerId: superAdmin.id,
        trustScore: 100.0,
      },
    });

    console.log('✅ Super admin merchant created successfully!');

    // Create some sample services for the merchant
    const services = [
      {
        title: 'Dev Test Hair Service',
        description: 'Test hair service for development and UI testing',
        price: 5000, // $50.00
        duration: 60,
        category: 'BEAUTY',
        merchantId: merchant.id,
      },
      {
        title: 'Dev Test Facial Service', 
        description: 'Test facial service for development and UI testing',
        price: 8000, // $80.00
        duration: 90,
        category: 'BEAUTY',
        merchantId: merchant.id,
      },
      {
        title: 'Dev Test Full Service',
        description: 'Full service package for comprehensive testing',
        price: 15000, // $150.00
        duration: 120,
        category: 'BEAUTY',
        merchantId: merchant.id,
      }
    ];

    console.log('🛍️  Creating sample services...');
    for (const service of services) {
      await prisma.service.upsert({
        where: { 
          id: services.indexOf(service) + 9000 // High IDs to avoid conflicts
        },
        update: service,
        create: {
          ...service,
          id: services.indexOf(service) + 9000,
        },
      });
    }

    // Create some test bookings
    const sampleUser = await prisma.user.findFirst({
      where: { email: 'user@example.com' }
    });

    if (sampleUser) {
      console.log('📅 Creating sample bookings...');
      
      const bookings = [
        {
          id: 'dev-booking-1',
          userId: sampleUser.id,
          serviceId: 9000,
          merchantId: merchant.id,
          datetime: new Date('2025-01-15T10:00:00Z'),
          status: 'CONFIRMED',
          totalAmount: 50.0,
          notes: 'Dev test booking - confirmed',
        },
        {
          id: 'dev-booking-2', 
          userId: sampleUser.id,
          serviceId: 9001,
          merchantId: merchant.id,
          datetime: new Date('2024-12-20T14:00:00Z'),
          status: 'COMPLETED',
          totalAmount: 80.0,
          notes: 'Dev test booking - completed',
        }
      ];

      for (const booking of bookings) {
        await prisma.booking.upsert({
          where: { id: booking.id },
          update: booking,
          create: booking,
        });
      }

      console.log(`✅ Created ${bookings.length} sample bookings`);
    }

    console.log('');
    console.log('🎉 Super Admin Merchant Setup Complete!');
    console.log('');
    console.log('🔑 Merchant Dashboard Access:');
    console.log(`   📧 Login Email: ${superAdmin.email}`);
    console.log(`   🔒 Password: any password (dev mode)`);
    console.log(`   🏪 Merchant: ${merchant.name}`);
    console.log(`   📍 Address: ${merchant.address}`);
    console.log(`   ⭐ Trust Score: ${merchant.trustScore}`);
    console.log('');
    console.log('🎯 Merchant Dashboard URLs:');
    console.log('   📊 Dashboard: http://localhost:3002/merchant/dashboard');
    console.log('   📅 Calendar: http://localhost:3002/merchant/calendar');
    console.log('   🛍️  Services: http://localhost:3002/merchant/services');
    console.log('   👤 Profile: http://localhost:3002/merchant/profile');
    console.log('   💳 Payments: http://localhost:3002/merchant/payments');
    console.log('');
    console.log('💡 Now you can access all merchant features for UI/UX development!');
    
  } catch (error) {
    console.error('❌ Error creating super admin merchant:', error.message);
    
    if (error.message.includes('Unique constraint')) {
      console.log('');
      console.log('💡 Merchant may already exist. This is normal if you\'ve run this script before.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
if (require.main === module) {
  createSuperAdminMerchant()
    .then(() => {
      console.log('✨ Script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

module.exports = { createSuperAdminMerchant };