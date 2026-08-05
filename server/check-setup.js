// Setup checker script
console.log('='.repeat(50));
console.log('PatioTime Server Setup Checker');
console.log('='.repeat(50));

// Check Node modules
console.log('\n📦 Checking dependencies...');

try {
  require('bcryptjs');
  console.log('✅ bcryptjs - installed');
} catch (e) {
  console.log('❌ bcryptjs - NOT installed');
  console.log('   Run: npm install bcryptjs');
}

try {
  require('jsonwebtoken');
  console.log('✅ jsonwebtoken - installed');
} catch (e) {
  console.log('❌ jsonwebtoken - NOT installed');
  console.log('   Run: npm install jsonwebtoken');
}

try {
  require('mongoose');
  console.log('✅ mongoose - installed');
} catch (e) {
  console.log('❌ mongoose - NOT installed');
}

try {
  require('express');
  console.log('✅ express - installed');
} catch (e) {
  console.log('❌ express - NOT installed');
}

try {
  require('cors');
  console.log('✅ cors - installed');
} catch (e) {
  console.log('❌ cors - NOT installed');
}

try {
  require('multer');
  console.log('✅ multer - installed');
} catch (e) {
  console.log('❌ multer - NOT installed');
}

// Check environment
console.log('\n🔐 Checking environment...');
require('dotenv').config();

if (process.env.JWT_SECRET) {
  console.log('✅ JWT_SECRET - configured');
} else {
  console.log('⚠️  JWT_SECRET - using default (set in .env for production)');
}

if (process.env.MONGO_URI) {
  console.log('✅ MONGO_URI - configured:', process.env.MONGO_URI);
} else {
  console.log('⚠️  MONGO_URI - using default: mongodb://127.0.0.1:27017/patiotime');
}

// Check files
console.log('\n📁 Checking files...');
const fs = require('fs');
const path = require('path');

const files = [
  'models/User.js',
  'routes/auth.js',
  'routes/menu.js',
  'routes/orders.js',
  'routes/admin.js',
  'server.js'
];

files.forEach(file => {
  if (fs.existsSync(path.join(__dirname, file))) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
  }
});

console.log('\n' + '='.repeat(50));
console.log('Setup check complete!');
console.log('='.repeat(50));
console.log('\nTo start server: npm run dev');
console.log('To install missing packages: npm install\n');
