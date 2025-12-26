// Simple MongoDB Connection Test Script
// Run with: node test-db-connection.js

const { MongoClient } = require('mongodb');

// Your MongoDB connection string
const uri = "mongodb+srv://poojithasukamanchi_db_user:pooja2558@cluster1-olx.ue6s4yq.mongodb.net/";

async function testConnection() {
  const client = new MongoClient(uri);

  try {
    console.log('🔄 Connecting to MongoDB...');
    
    // Connect to MongoDB
    await client.connect();
    
    console.log('✅ Successfully connected to MongoDB!');
    
    // List databases
    const databasesList = await client.db().admin().listDatabases();
    
    console.log('\n📊 Available databases:');
    databasesList.databases.forEach(db => {
      console.log(`   - ${db.name}`);
    });
    
    console.log('\n🎉 Connection test passed!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    // Close connection
    await client.close();
    console.log('\n🔌 Connection closed.');
  }
}

// Run the test
testConnection();
