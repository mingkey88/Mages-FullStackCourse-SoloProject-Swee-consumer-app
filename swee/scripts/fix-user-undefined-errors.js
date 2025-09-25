/**
 * Fix undefined user variable errors in merchant files
 * Replaces incorrect user?.role references with session.user?.role
 */

const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  'src/components/merchant/MerchantSidebar.tsx',
  'src/app/merchant/services/page.tsx',
  'src/app/merchant/profile/page.tsx',
  'src/app/merchant/payments/page.tsx',
  'src/app/merchant/calendar/page.tsx',
];

console.log('🔧 Fixing undefined "user" variable errors...');
console.log('');

let totalFixes = 0;

filesToFix.forEach((filePath, index) => {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let fixCount = 0;
      
      // Pattern 1: user?.role in complex conditions
      const pattern1 = /user\?\.role !== 'ADMIN'/g;
      const matches1 = content.match(pattern1);
      if (matches1) {
        content = content.replaceAll('user?.role', 'session.user?.role');
        fixCount += matches1.length;
      }
      
      // Clean up any duplicated or malformed conditions
      const malformedPatterns = [
        {
          from: `session.user?.role !== 'MERCHANT' && session.user?.role !== 'ADMIN' && session.user?.role !== 'ADMIN'`,
          to: `session.user?.role !== 'MERCHANT' && session.user?.role !== 'ADMIN'`
        },
        {
          from: `session.user?.role !== 'MERCHANT' && user?.role !== 'ADMIN' && session.user?.role !== 'ADMIN'`,
          to: `session.user?.role !== 'MERCHANT' && session.user?.role !== 'ADMIN'`
        },
        {
          from: `(session.user?.role !== 'MERCHANT' && session.user?.role !== 'ADMIN' && session.user?.role !== 'ADMIN')`,
          to: `(session.user?.role !== 'MERCHANT' && session.user?.role !== 'ADMIN')`
        }
      ];
      
      malformedPatterns.forEach(pattern => {
        if (content.includes(pattern.from)) {
          content = content.replaceAll(pattern.from, pattern.to);
          fixCount++;
        }
      });
      
      if (fixCount > 0) {
        fs.writeFileSync(fullPath, content);
        console.log(`✅ ${index + 1}. Fixed: ${filePath} (${fixCount} issues)`);
        totalFixes += fixCount;
      } else {
        console.log(`⚠️  ${index + 1}. Clean: ${filePath} (no issues found)`);
      }
    } else {
      console.log(`❌ ${index + 1}. Missing: ${filePath}`);
    }
  } catch (error) {
    console.log(`💥 ${index + 1}. Error: ${filePath} - ${error.message}`);
  }
});

console.log('');
console.log(`🎉 Fixed ${totalFixes} undefined variable errors!`);
console.log('');
console.log('✅ All merchant auth guards should now work correctly.');
console.log('🔑 Super admin can now access all merchant features without errors.');
console.log('');
console.log('🧪 Test the merchant login:');
console.log('   🌐 URL: http://localhost:3002/merchant/auth/signin');
console.log('   📧 Email: dev@swee.sg');
console.log('   🔒 Password: any text');
console.log('');
console.log('🚀 The "user is not defined" error should be resolved!');