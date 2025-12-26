// Complete MongoDB CRUD Operations Demo
// Run with: node mongodb-tutorial.js

const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://poojithasukamanchi_db_user:pooja2558@cluster1-olx.ue6s4yq.mongodb.net/";

async function tutorial() {
  const client = new MongoClient(uri);

  try {
    // STEP 1: Connect to MongoDB
    console.log('========================================');
    console.log('STEP 1: Connecting to MongoDB');
    console.log('========================================');
    await client.connect();
    console.log('✅ Connected!\n');

    // STEP 2: Create/Select Database
    console.log('========================================');
    console.log('STEP 2: Create/Select Database');
    console.log('========================================');
    const database = client.db('olx-emp'); // Database is created automatically when you insert data
    console.log('✅ Database "olx-emp" selected\n');

    // STEP 3: Create/Select Collection (like a table)
    console.log('========================================');
    console.log('STEP 3: Create Collection');
    console.log('========================================');
    const usersCollection = database.collection('users');
    const listingsCollection = database.collection('listings');
    console.log('✅ Collections "users" and "listings" ready\n');

    // STEP 4: INSERT DATA (Create)
    console.log('========================================');
    console.log('STEP 4: INSERT DATA');
    console.log('========================================');
    
    // Insert one user
    const user = {
      name: 'Rahul Sharma',
      email: 'rahul@company.com',
      department: 'Engineering',
      createdAt: new Date()
    };
    const userResult = await usersCollection.insertOne(user);
    console.log('✅ Inserted 1 user with ID:', userResult.insertedId);

    // Insert multiple listings
    const listings = [
      {
        title: 'iPhone 13 Pro',
        price: 45000,
        category: 'Electronics',
        sellerId: userResult.insertedId,
        createdAt: new Date()
      },
      {
        title: 'Office Chair',
        price: 15000,
        category: 'Furniture',
        sellerId: userResult.insertedId,
        createdAt: new Date()
      },
      {
        title: 'MacBook Pro',
        price: 120000,
        category: 'Electronics',
        sellerId: userResult.insertedId,
        createdAt: new Date()
      }
    ];
    const listingsResult = await listingsCollection.insertMany(listings);
    console.log('✅ Inserted', listingsResult.insertedCount, 'listings\n');

    // STEP 5: READ DATA (Get/Find)
    console.log('========================================');
    console.log('STEP 5: READ DATA');
    console.log('========================================');
    
    // Find all users
    console.log('📄 All users:');
    const allUsers = await usersCollection.find({}).toArray();
    console.log(allUsers);
    console.log('');

    // Find all listings
    console.log('📄 All listings:');
    const allListings = await listingsCollection.find({}).toArray();
    allListings.forEach(listing => {
      console.log(`  - ${listing.title}: ₹${listing.price}`);
    });
    console.log('');

    // Find specific listings (Electronics only)
    console.log('📄 Electronics only:');
    const electronics = await listingsCollection.find({ category: 'Electronics' }).toArray();
    electronics.forEach(listing => {
      console.log(`  - ${listing.title}: ₹${listing.price}`);
    });
    console.log('');

    // Find one user by email
    console.log('📄 Find user by email:');
    const foundUser = await usersCollection.findOne({ email: 'rahul@company.com' });
    console.log(foundUser);
    console.log('');

    // STEP 6: UPDATE DATA
    console.log('========================================');
    console.log('STEP 6: UPDATE DATA');
    console.log('========================================');
    
    // Update one listing (change price)
    const updateResult = await listingsCollection.updateOne(
      { title: 'iPhone 13 Pro' },
      { $set: { price: 42000, updatedAt: new Date() } }
    );
    console.log('✅ Updated', updateResult.modifiedCount, 'listing');
    
    // Verify update
    const updatedListing = await listingsCollection.findOne({ title: 'iPhone 13 Pro' });
    console.log('📄 Updated listing:', updatedListing);
    console.log('');

    // STEP 7: DELETE DATA
    console.log('========================================');
    console.log('STEP 7: DELETE DATA');
    console.log('========================================');
    
    // Delete one listing
    const deleteResult = await listingsCollection.deleteOne({ title: 'Office Chair' });
    console.log('✅ Deleted', deleteResult.deletedCount, 'listing');
    
    // Count remaining listings
    const count = await listingsCollection.countDocuments();
    console.log('📊 Remaining listings:', count);
    console.log('');

    // STEP 8: ADVANCED QUERIES
    console.log('========================================');
    console.log('STEP 8: ADVANCED QUERIES');
    console.log('========================================');
    
    // Sort listings by price (highest first)
    console.log('📄 Listings sorted by price (high to low):');
    const sortedListings = await listingsCollection
      .find({})
      .sort({ price: -1 })
      .toArray();
    sortedListings.forEach(listing => {
      console.log(`  - ${listing.title}: ₹${listing.price}`);
    });
    console.log('');

    // Filter listings by price range
    console.log('📄 Listings between ₹10,000 and ₹50,000:');
    const filteredListings = await listingsCollection
      .find({ price: { $gte: 10000, $lte: 50000 } })
      .toArray();
    filteredListings.forEach(listing => {
      console.log(`  - ${listing.title}: ₹${listing.price}`);
    });
    console.log('');

    console.log('========================================');
    console.log('🎉 Tutorial Complete!');
    console.log('========================================');
    console.log('Your database "olx-emp" now has:');
    console.log(`  - ${allUsers.length} user(s)`);
    console.log(`  - ${count} listing(s)`);
    console.log('');
    console.log('💡 Check MongoDB Compass to see your data!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('\n🔌 Connection closed.');
  }
}

// Run the tutorial
tutorial();
