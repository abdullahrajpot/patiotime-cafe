const path = require('path');
const fs = require('fs');

const uploadsPath = path.join(__dirname, 'uploads');
const publicImagesPath = path.join(__dirname, 'public/images');
const clientImagesPath = path.join(__dirname, '../client/public/images');

console.log('\n📁 Checking image paths:');
console.log('1. uploadsPath:', uploadsPath);
console.log('   Exists?', fs.existsSync(uploadsPath));

console.log('\n2. publicImagesPath:', publicImagesPath);
console.log('   Exists?', fs.existsSync(publicImagesPath));

console.log('\n3. clientImagesPath:', clientImagesPath);
console.log('   Exists?', fs.existsSync(clientImagesPath));

function resolveImageFile(filename) {
  const safeName = path.basename(filename);
  if (!safeName || safeName !== filename || safeName.includes('..')) return null;

  const candidates = [
    path.join(uploadsPath, safeName),
    path.join(publicImagesPath, safeName),
    path.join(clientImagesPath, safeName),
  ];

  for (const filePath of candidates) {
    if (fs.existsSync(filePath)) {
      console.log(`✅ Found at: ${filePath}`);
      return filePath;
    }
  }
  console.log(`❌ Not found in any location`);
  return null;
}

console.log('\n🔍 Testing file resolution:');
console.log('Test 1: 1786280211909-coffee-2-(1).jpg');
resolveImageFile('1786280211909-coffee-2-(1).jpg');

console.log('\nTest 2: herobg.png');
resolveImageFile('herobg.png');

console.log('\nTest 3: 1786343193006-coffee-5-2.jpg');
resolveImageFile('1786343193006-coffee-5-2.jpg');

// List some files in client/public/images
if (fs.existsSync(clientImagesPath)) {
  console.log('\n📋 First 10 files in client/public/images:');
  const files = fs.readdirSync(clientImagesPath).slice(0, 10);
  files.forEach(f => console.log(`  - ${f}`));
}
