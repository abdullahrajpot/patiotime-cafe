/**
 * Migration Script: Convert Category Strings to ObjectIDs
 * 
 * This script migrates existing menu items from string-based categories
 * to ObjectID references.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const Category = require('../models/Category');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patiotime';

// Mapping of old string categories to new slugs
const CATEGORY_MAP = {
  'coffees-teas': 'coffees-teas',
  'bakery-lunch': 'bakery-lunch',
  'all-day-brunch': 'all-day-brunch',
  // Add any other old formats here
};

async function migrate() {
  try {
    console.log('🔄 Starting Category Migration...\n');
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected\n');

    // Step 1: Fetch all categories
    console.log('📊 Fetching categories from database...');
    const categories = await Category.find().lean();
    console.log(`✅ Found ${categories.length} categories\n`);

    if (categories.length === 0) {
      console.log('⚠️  No categories found! Please run seed script first.');
      console.log('   Run: npm run seed\n');
      await mongoose.disconnect();
      process.exit(1);
    }

    // Create slug to ObjectID map
    const slugToId = {};
    categories.forEach(cat => {
      slugToId[cat.slug] = cat._id;
      console.log(`  ${cat.slug} → ${cat._id}`);
    });
    console.log('');

    // Step 2: Find menu items that need migration
    console.log('📊 Checking menu items...');
    const allItems = await MenuItem.find();
    console.log(`✅ Found ${allItems.length} menu items\n`);

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // Step 3: Migrate each item
    console.log('🔄 Migrating menu items...');
    for (const item of allItems) {
      try {
        // Check if category is already an ObjectID
        if (mongoose.Types.ObjectId.isValid(item.category)) {
          // Try to find the category by ID
          const catExists = await Category.findById(item.category);
          if (catExists) {
            console.log(`  ⏭️  Skipped: "${item.name}" (already has valid ObjectID)`);
            skippedCount++;
            continue;
          }
        }

        // Category is a string, needs migration
        const categoryString = String(item.category);
        const newCategoryId = slugToId[categoryString] || slugToId[CATEGORY_MAP[categoryString]];

        if (!newCategoryId) {
          console.log(`  ❌ Error: "${item.name}" has unknown category: "${categoryString}"`);
          errorCount++;
          continue;
        }

        // Update the item
        item.category = newCategoryId;
        await item.save();
        console.log(`  ✅ Updated: "${item.name}" → ${newCategoryId}`);
        updatedCount++;

      } catch (err) {
        console.log(`  ❌ Error updating "${item.name}": ${err.message}`);
        errorCount++;
      }
    }

    // Step 4: Summary
    console.log('\n╔═══════════════════════════════════════╗');
    console.log('║       MIGRATION COMPLETE              ║');
    console.log('╚═══════════════════════════════════════╝');
    console.log(`\n📊 Summary:`);
    console.log(`   Total Items:  ${allItems.length}`);
    console.log(`   ✅ Updated:   ${updatedCount}`);
    console.log(`   ⏭️  Skipped:   ${skippedCount}`);
    console.log(`   ❌ Errors:    ${errorCount}`);

    if (errorCount > 0) {
      console.log('\n⚠️  Some items failed to migrate. Please review errors above.');
    } else if (updatedCount === 0 && skippedCount > 0) {
      console.log('\n✅ All items already using ObjectID references. No migration needed!');
    } else {
      console.log('\n✅ Migration completed successfully!');
    }

    console.log('');
    await mongoose.disconnect();
    console.log('✅ Disconnected from database\n');
    
    process.exit(errorCount > 0 ? 1 : 0);

  } catch (err) {
    console.error('\n❌ Migration failed:', err.message);
    console.error(err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

// Run migration
migrate();
