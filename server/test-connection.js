require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/patiotime';

console.log('========================================');
console.log('  Testing MongoDB Connection');
console.log('========================================\n');

// Hide password in output
const safeUri = MONGO_URI.replace(/:[^:]*@/, ':****@');
console.log('Connection String:', safeUri);
console.log();

async function testConnection() {
  try {
    console.log('Attempting to connect...\n');
    
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    
    console.log('✅✅✅ SUCCESS! MongoDB Connected ✅✅✅\n');
    console.log('Database Name:', mongoose.connection.name);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port || 'N/A (cloud)');
    console.log();
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections:`);
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    console.log();
    console.log('✅ Connection test passed!');
    console.log('You can now run: npm run seed');
    
    await mongoose.disconnect();
    console.log('✅ Disconnected successfully\n');
    
  } catch (err) {
    console.log('❌❌❌ CONNECTION FAILED ❌❌❌\n');
    console.log('Error:', err.message);
    console.log();
    
    if (err.message.includes('Authentication failed')) {
      console.log('💡 FIX: Check your username and password in .env file');
      console.log('   - Make sure <db_username> is replaced with actual username');
      console.log('   - Make sure password is correct');
    } else if (err.message.includes('ENOTFOUND')) {
      console.log('💡 FIX: Check your cluster URL in .env file');
      console.log('   - Verify the cluster URL is correct');
      console.log('   - Check your internet connection');
    } else if (err.message.includes('timeout')) {
      console.log('💡 FIX: Connection timeout');
      console.log('   - Check your internet connection');
      console.log('   - Verify IP whitelist in MongoDB Atlas (Network Access)');
      console.log('   - Try allowing access from anywhere (0.0.0.0/0) for testing');
    }
    
    console.log();
    console.log('See FIX-502-ERROR.md for detailed troubleshooting\n');
    process.exit(1);
  }
}

testConnection();
