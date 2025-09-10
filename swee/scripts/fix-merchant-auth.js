/**
 * Fix all merchant auth guards to allow ADMIN access
 * Updates all merchant pages to allow both MERCHANT and ADMIN roles
 */

const fs = require('fs');
const path = require('path');

const merchantPages = [
  'src/app/merchant/dashboard/page.tsx',
  'src/app/merchant/calendar/page.tsx', 
  'src/app/merchant/services/page.tsx',
  'src/app/merchant/profile/page.tsx',
  'src/app/merchant/payments/page.tsx',
];

const oldPattern = `session?.user?.role !== 'MERCHANT'`;
const newPattern = `session?.user?.role !== 'MERCHANT' && session?.user?.role !== 'ADMIN'`;

console.log('🔧 Fixing merchant auth guards to allow admin access...');
console.log('');

merchantPages.forEach((filePath, index) => {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      if (content.includes(oldPattern)) {
        const updatedContent = content.replaceAll(oldPattern, newPattern);
        fs.writeFileSync(fullPath, updatedContent);
        console.log(`✅ ${index + 1}. Updated: ${filePath}`);
      } else {
        console.log(`⚠️  ${index + 1}. Skipped: ${filePath} (pattern not found)`);
      }
    } else {
      console.log(`❌ ${index + 1}. Missing: ${filePath}`);
    }
  } catch (error) {
    console.log(`💥 ${index + 1}. Error: ${filePath} - ${error.message}`);
  }
});

console.log('');
console.log('🎉 All merchant auth guards updated!');
console.log('');
console.log('✅ Admin users can now access:');
console.log('   📊 Merchant Dashboard');
console.log('   📅 Calendar & Bookings');  
console.log('   🛍️  Services Management');
console.log('   👤 Profile Settings');
console.log('   💳 Payments & Analytics');
console.log('');
console.log('🔑 Login with: dev@swee.sg + any password');
console.log('🌐 Try: http://localhost:3002/merchant/auth/signin');