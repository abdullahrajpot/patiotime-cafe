/**
 * Quick Fix: Reset Categories and Menu Items
 * Run this if you're getting 500 errors after Phase 2
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const MenuItem = require('./models/MenuItem');

const MONGO_URI = process.env.MONGO_URI;

async function quickFix() {
  try {
    console.log('🔧 Quick Fix: Resetting Categories and Menu Items\n');
    
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Step 1: Clear everything
    console.log('🗑️  Clearing old data...');
    await Category.deleteMany({});
    await MenuItem.deleteMany({});
    console.log('✅ Cleared\n');

    // Step 2: Create categories with slugs
    console.log('📁 Creating categories...');
    const coffee = await Category.create({ 
      name: 'Coffees & Teas', 
      eyebrow: 'Best Drinks', 
      slug: 'coffees-teas',
      sortOrder: 1,
      isActive: true
    });
    console.log(`✅ Created: ${coffee.name} (${coffee._id})`);

    const bakery = await Category.create({ 
      name: 'Bakery & Lunch', 
      eyebrow: 'Delicious Food', 
      slug: 'bakery-lunch',
      sortOrder: 2,
      isActive: true
    });
    console.log(`✅ Created: ${bakery.name} (${bakery._id})`);

    const brunch = await Category.create({ 
      name: 'All-Day Brunch', 
      eyebrow: 'We Also Have', 
      slug: 'all-day-brunch',
      sortOrder: 3,
      isActive: true
    });
    console.log(`✅ Created: ${brunch.name} (${brunch._id})\n`);

    // Step 3: Create sample menu items
    console.log('🍽️  Creating menu items...');
    
    const coffeeItems = [
      { name: 'Marbled Iced Latte', description: 'Condensed Milk, Ice Cubes, Espresso', price: 3.65, badge: 'SEASONAL', image: 'cf9.jpg' },
      { name: 'Hot Vanilla Latte', description: 'Espresso, Vanilla Syrup, Steamed Milk', price: 3.25, badge: null, image: 'cf10.jpg' },
      { name: 'Almondmilk Latte', description: 'Espresso, Almond Milk, Vegan', price: 4.25, badge: 'NEW', image: 'cf11.jpg' },
    ];

    for (let i = 0; i < coffeeItems.length; i++) {
      await MenuItem.create({
        ...coffeeItems[i],
        category: coffee._id,
        sortOrder: i + 1,
        isAvailable: true
      });
    }
    console.log(`✅ Created ${coffeeItems.length} coffee items`);

    const bakeryItems = [
      { name: 'Breakfast Sandwich', description: 'Bacon, Gouda, Toasted Sourdough', price: 4.25, badge: null, image: 'food-3.jpg' },
      { name: 'Croissant Bun', description: 'Slow Roasted Ham, Butter Croissant', price: 3.75, badge: null, image: 'food-4.jpg' },
    ];

    for (let i = 0; i < bakeryItems.length; i++) {
      await MenuItem.create({
        ...bakeryItems[i],
        category: bakery._id,
        sortOrder: i + 1,
        isAvailable: true
      });
    }
    console.log(`✅ Created ${bakeryItems.length} bakery items`);

    const brunchItems = [
      { name: 'Spaghetti alla Puttanesca', description: 'Prawns, green peas, sun dried tomato, white wine', price: 29.99, badge: null, image: 'img-37.jpg' },
      { name: 'Penne Alla Arrabbiata', description: 'Pasta with garlic, bacon, onion, basil and red sauce', price: 24.99, badge: null, image: 'img-39.jpg' },
      { name: 'Seafood Capellini Pasta', description: 'Fresh seafood in regional tomato sauce', price: 24.99, badge: null, image: 'home-06.jpg' },
    ];

    for (let i = 0; i < brunchItems.length; i++) {
      await MenuItem.create({
        ...brunchItems[i],
        category: brunch._id,
        sortOrder: i + 1,
        isAvailable: true
      });
    }
    console.log(`✅ Created ${brunchItems.length} brunch items\n`);

    console.log('🎉 Quick Fix Complete!\n');
    console.log('Categories:');
    console.log(`  - ${coffee.name} (slug: ${coffee.slug})`);
    console.log(`  - ${bakery.name} (slug: ${bakery.slug})`);
    console.log(`  - ${brunch.name} (slug: ${brunch.slug})\n`);
    console.log('Total Menu Items:', coffeeItems.length + bakeryItems.length + brunchItems.length);
    console.log('\n✅ You can now restart your server and the errors should be gone!\n');

    await mongoose.disconnect();
    process.exit(0);

  } catch (err) {
    console.error('\n❌ Quick fix failed:', err.message);
    console.error(err);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  }
}

quickFix();
