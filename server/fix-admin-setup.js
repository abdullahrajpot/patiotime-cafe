require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patiotime';

async function fixAdminSetup() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ Connected to MongoDB');

    // Step 1: Create categories if they don't exist
    console.log('\n📚 Checking categories...');
    const categoriesExist = await Category.countDocuments();
    
    if (categoriesExist === 0) {
      console.log('Creating categories...');
      const categories = [
        {
          name: 'Coffees & Teas',
          eyebrow: 'Best Drinks',
          slug: 'coffees-teas',
          sortOrder: 1,
          isActive: true
        },
        {
          name: 'Bakery & Lunch',
          eyebrow: 'Delicious Food',
          slug: 'bakery-lunch',
          sortOrder: 2,
          isActive: true
        },
        {
          name: 'All-Day Brunch',
          eyebrow: 'We Also Have',
          slug: 'all-day-brunch',
          sortOrder: 3,
          isActive: true
        }
      ];

      await Category.insertMany(categories);
      console.log('✅ Categories created successfully!');
    } else {
      console.log(`✅ ${categoriesExist} categories already exist`);
    }

    // Show existing categories
    const allCategories = await Category.find().sort({ sortOrder: 1 });
    console.log('\n📋 Existing categories:');
    allCategories.forEach(cat => {
      console.log(`  - ${cat.name} (slug: ${cat.slug}, id: ${cat._id})`);
    });

    // Step 2: Check/Create admin user
    console.log('\n👤 Checking admin user...');
    let adminUser = await User.findOne({ email: 'admin@patiotime.com' });
    
    if (!adminUser) {
      console.log('Creating admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@patiotime.com',
        password: hashedPassword,
        role: 'admin',
        phone: '+1234567890',
        address: 'Admin Address'
      });
      console.log('✅ Admin user created!');
      console.log('\n🔑 Admin Credentials:');
      console.log('   Email: admin@patiotime.com');
      console.log('   Password: admin123');
    } else {
      console.log('✅ Admin user already exists');
      console.log('   Email:', adminUser.email);
      console.log('   Name:', adminUser.name);
      console.log('   Role:', adminUser.role);
    }

    // Step 3: Verify regular users
    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    console.log(`\n📊 Total users: ${totalUsers} (${adminCount} admin, ${totalUsers - adminCount} regular)`);

    console.log('\n✅ Setup complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Restart your backend server (npm start)');
    console.log('2. Login with: admin@patiotime.com / admin123');
    console.log('3. Go to Admin Panel → Menu Management');
    console.log('4. Add menu items with categories');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

fixAdminSetup();
