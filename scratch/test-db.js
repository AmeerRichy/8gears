const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  console.log('Testing connection to:', uri ? uri.substring(0, 20) + '...' : 'undefined');
  
  if (!uri) {
    console.error('MONGODB_URI is missing');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ Successfully connected to MongoDB');
    
    // Check collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
    process.exit(1);
  }
}

testConnection();
