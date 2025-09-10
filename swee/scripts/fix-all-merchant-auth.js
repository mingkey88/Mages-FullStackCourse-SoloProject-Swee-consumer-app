/**
 * Comprehensive fix for all merchant auth guards
 * Updates all merchant pages and components to allow ADMIN access
 */

const fs = require('fs');
const path = require('path');

// Files to update
const filesToUpdate = [
  'src/app/merchant/dashboard/page.tsx',
  'src/app/merchant/calendar/page.tsx',
  'src/app/merchant/services/page.tsx',
  'src/app/merchant/profile/page.tsx',
  'src/app/merchant/payments/page.tsx',
  'src/components/merchant/MerchantLayout.tsx',
  'src/components/merchant/MerchantSidebar.tsx',
];

// Patterns to replace
const patterns = [
  {
    old: `session.user?.role !== 'MERCHANT'`,
    new: `session.user?.role !== 'MERCHANT' && session.user?.role !== 'ADMIN'`
  },
  {
    old: `session?.user?.role !== 'MERCHANT'`,
    new: `session?.user?.role !== 'MERCHANT' && session?.user?.role !== 'ADMIN'`
  },
  {
    old: `user?.role !== 'MERCHANT'`,
    new: `user?.role !== 'MERCHANT' && user?.role !== 'ADMIN'`
  },
];

console.log('🔧 Fixing ALL merchant auth guards to allow admin access...');
console.log('');

let totalUpdates = 0;

filesToUpdate.forEach((filePath, index) => {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let fileUpdated = false;
      let updateCount = 0;
      
      patterns.forEach(pattern => {
        const matches = content.match(new RegExp(pattern.old.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'));
        if (matches) {
          content = content.replaceAll(pattern.old, pattern.new);
          updateCount += matches.length;
          fileUpdated = true;
        }
      });
      
      if (fileUpdated) {
        fs.writeFileSync(fullPath, content);
        console.log(`✅ ${index + 1}. Updated: ${filePath} (${updateCount} changes)`);
        totalUpdates += updateCount;
      } else {
        console.log(`⚠️  ${index + 1}. Skipped: ${filePath} (no patterns found)`);
      }
    } else {
      console.log(`❌ ${index + 1}. Missing: ${filePath}`);
    }
  } catch (error) {
    console.log(`💥 ${index + 1}. Error: ${filePath} - ${error.message}`);
  }
});

console.log('');
console.log(`🎉 Bulk update complete! Made ${totalUpdates} total changes.`);
console.log('');
console.log('✅ Super admin can now access ALL merchant features:');
console.log('   📊 Dashboard & Analytics');
console.log('   📅 Calendar & Booking Management');
console.log('   🛍️  Service Management');
console.log('   👤 Profile & Settings');
console.log('   💳 Payment & Financial Tools');
console.log('');
console.log('🔑 Test the login now:');
console.log('   🌐 URL: http://localhost:3002/merchant/auth/signin');
console.log('   📧 Email: dev@swee.sg');
console.log('   🔒 Password: any text (dev mode)');
console.log('');
console.log('🚀 Full UI/UX development access achieved!');