/**
 * Quick script to fix error format in test files
 * Run: node fix-tests.js
 */

const fs = require('fs');
const path = require('path');

const files = [
  './tests/validation.test.js',
  './tests/orders.test.js'
];

console.log('🔧 Fixing test files...\n');

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${file}`);
    return;
  }
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changesMade = 0;
  
  // Replace errors with error + details
  const errorsPattern = /expect\(response\.body\)\.toHaveProperty\('errors'\);/g;
  const errorsMatches = content.match(errorsPattern);
  if (errorsMatches) {
    content = content.replace(
      errorsPattern,
      "expect(response.body).toHaveProperty('error');\n      expect(response.body).toHaveProperty('details');"
    );
    changesMade += errorsMatches.length;
  }
  
  // Replace path with field in errors array
  const pathPattern = /\.errors\.some\(e => e\.path ===/g;
  const pathMatches = content.match(pathPattern);
  if (pathMatches) {
    content = content.replace(
      pathPattern,
      ".details.some(e => e.field ==="
    );
    changesMade += pathMatches.length;
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Fixed: ${file} (${changesMade} changes)`);
});

console.log('\n🎉 All test files fixed!');
console.log('📝 Run "npm test" to verify fixes');
