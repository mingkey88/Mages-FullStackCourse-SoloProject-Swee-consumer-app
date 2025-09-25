/**
 * Fix double session errors in merchant files
 * Replaces session.session.user with session.user and cleans up malformed conditions
 */

const fs = require('fs');
const path = require('path');

// Files to fix based on grep results
const filesToFix = [
  'src/app/merchant/calendar/page.tsx',
  'src/app/merchant/payments/page.tsx', 
  'src/app/merchant/profile/page.tsx',
  'src/app/merchant/services/page.tsx',
];

console.log('🔧 Fixing double session errors and malformed conditions...');
console.log('');

let totalFixes = 0;

filesToFix.forEach((filePath, index) => {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    if (fs.existsSync(fullPath)) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let fixCount = 0;
      
      // Fix double session references
      if (content.includes('session.session.user')) {
        content = content.replaceAll('session.session.user', 'session.user');
        fixCount++;
      }
      
      // Clean up extremely long malformed conditions that got created by our bulk script
      const malformedPatterns = [
        // Pattern 1: Super long conditions with duplicates
        {
          from: /session\.user\?\.role !== 'MERCHANT' && session\.user\?\.role !== 'ADMIN' && session\.user\?\.role !== 'ADMIN' && session\.user\?\.role !== 'ADMIN'/g,
          to: `session.user?.role !== 'MERCHANT' && session.user?.role !== 'ADMIN'`
        },
        // Pattern 2: Mixed user/session.user references
        {
          from: /session\.user\?\.role !== 'MERCHANT' && user\?\.role !== 'ADMIN' && session\.user\?\.role !== 'ADMIN'/g,
          to: `session.user?.role !== 'MERCHANT' && session.user?.role !== 'ADMIN'`
        },
        // Pattern 3: In parentheses
        {
          from: /\(session\.user\?\.role !== 'MERCHANT' && session\.user\?\.role !== 'ADMIN' && session\.user\?\.role !== 'ADMIN'\)/g,
          to: `(session.user?.role !== 'MERCHANT' && session.user?.role !== 'ADMIN')`
        },
        // Pattern 4: Very complex conditions
        {
          from: /!session \|\| session\.user\?\.role !== 'MERCHANT' && session\.user\?\.role !== 'ADMIN' && session\.user\?\.role !== 'ADMIN'/g,
          to: `!session || (session.user?.role !== 'MERCHANT' && session.user?.role !== 'ADMIN')`
        }
      ];
      
      malformedPatterns.forEach(pattern => {
        const matches = content.match(pattern.from);
        if (matches) {
          content = content.replace(pattern.from, pattern.to);
          fixCount += matches.length;
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
console.log(`🎉 Fixed ${totalFixes} double session and malformed condition errors!`);
console.log('');
console.log('✅ All merchant auth guards should now work correctly.');
console.log('🔑 The "Cannot read properties of undefined (reading \'user\')" error should be resolved.');
console.log('');
console.log('🧪 Test the merchant login now:');
console.log('   🌐 URL: http://localhost:3002/merchant/auth/signin');
console.log('   📧 Email: dev@swee.sg');
console.log('   🔒 Password: any text');
console.log('');
console.log('🚀 Super admin merchant access should be fully working!');