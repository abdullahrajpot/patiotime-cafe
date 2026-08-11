/**
 * Check menu item images in database
 */

require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('./models/MenuItem');
const Category = require('./models/Category');
const fs = require('fs');
const path = require('path');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patiotime';

async function checkImages() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const menuItems = await MenuItem.find().populate('category');
    console.log(`📋 Found ${menuItems.length} menu items\n`);

    const clientImagesPath = path.join(__dirname, '../client/public/images');
    console.log(`📁 Checking images in: ${clientImagesPath}\n`);

    console.log('═══════════════════════════════════════════════════════════════');

    let missingCount = 0;
    let foundCount = 0;

    for (const item of menuItems) {
      const imageName = item.image;
      const categoryName = item.category?.name || 'Unknown';
      
      console.log(`\n📦 ${item.name} (${categoryName})`);
      console.log(`   Image field: "${imageName}"`);

      if (!imageName) {
        console.log('   ❌ NO IMAGE SET');
        missingCount++;
        continue;
      }

      // Check if file exists
      const imagePath = path.join(clientImagesPath, imageName);
      const exists = fs.existsSync(imagePath);

      if (exists) {
        const stats = fs.statSync(imagePath);
        console.log(`   ✅ EXISTS - ${(stats.size / 1024).toFixed(2)} KB`);
        console.log(`   📍 Path: ${imagePath}`);
        foundCount++;
      } else {
        console.log(`   ❌ NOT FOUND`);
        console.log(`   📍 Expected: ${imagePath}`);
        missingCount++;
      }
    }

    console.log('\n═══════════════════════════════════════════════════════════════');
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Found: ${foundCount}`);
    console.log(`   ❌ Missing: ${missingCount}`);
    console.log(`   📋 Total: ${menuItems.length}`);

    if (missingCount > 0) {
      console.log(`\n⚠️  ${missingCount} images are missing from client/public/images/`);
      console.log(`\nTo fix:`);
      console.log(`1. Check which images are missing (listed above)`);
      console.log(`2. Add the missing images to client/public/images/`);
      console.log(`3. Or update the menu items in database with correct filenames`);
    } else {
      console.log(`\n✅ All menu item images exist!`);
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('❌ Error:', err);
    process.exit(1);
  }
}

checkImages();
