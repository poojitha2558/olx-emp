import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { validateListing, createListing, IListing } from '@/models/Listing';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate using schema
    const validation = validateListing(body);
    
    if (!validation.valid) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // Get database connection
    const db = await getDatabase();
    const listingsCollection = db.collection<IListing>('listings');

    // Create listing document using schema
    const listing = createListing({
      title: body.title,
      category: body.category,
      price: Number(body.price),
      location: body.location,
      description: body.description,
      images: body.images || [],
      sellerId: body.sellerId,
      sellerName: body.sellerName,
      sellerEmail: body.sellerEmail,
      status: 'active',
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Insert into MongoDB
    const result = await listingsCollection.insertOne(listing as any);

    return NextResponse.json(
      {
        success: true,
        message: 'Listing created successfully',
        listingId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating listing:', error);
    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get database connection
    const db = await getDatabase();
    const listingsCollection = db.collection('listings');

    // Fetch all listings
    const listings = await listingsCollection
      .find({ status: 'active' })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      {
        success: true,
        listings,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
