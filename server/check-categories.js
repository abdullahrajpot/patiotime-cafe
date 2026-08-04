require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patiotime';

async function checkCategories() {
  try {
    console.log('Connecting to MongoDB...');
    console.log('URI:', MONGO_URI.replace(/:[^:]*@/, ':****@')); // Hide password
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected successfully!\n');

    const categories = await Category.find().lean();
    
    console.log(`Found ${categories.length} categories:\n`);
    
    if (categories.length === 0) {
      console.log('❌ NO CATEGORIES FOUND!');
      console.log('\nYou need to run: npm run seed');
    } else {
      categories.forEach((cat, i) => {
        console.log(`${i + 1}. ${cat.name}`);
        console.log(`   ID: ${cat._id}`);
        console.log(`   Eyebrow: ${cat.eyebrow}`);
        console.log(`   Sort Order: ${cat.sortOrder}\n`);
      });
      console.log('✅ Categories exist in database!');
    }

    await mongoose.disconnect();
    console.log('\n✅ Done!');
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkCategories();
