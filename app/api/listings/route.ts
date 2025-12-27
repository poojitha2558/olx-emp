import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { validateListing, createListing, IListing } from '@/models/Listing';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const userEmail = session?.user?.email;
    const userName = session?.user?.name;

    if (!userId || !userEmail) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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
      sellerId: String(userId),
      sellerName: userName || String(userEmail).split('@')[0],
      sellerEmail: String(userEmail),
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

export async function GET(request: NextRequest) {
  try {
    // Get database connection
    const db = await getDatabase();
    const listingsCollection = db.collection('listings');

    // Fetch listings (active by default, or filtered by ?status=...)
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const mine = searchParams.get('mine');

    const session = mine ? await getServerSession(authOptions) : null;
    const userId = session?.user?.id;

    const query: Record<string, unknown> = {};

    if (mine) {
      if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      query.sellerId = String(userId);
    }

    if (status && status !== 'all') {
      if (!['active', 'sold', 'deleted'].includes(status)) {
        return NextResponse.json(
          { error: 'Invalid status filter' },
          { status: 400 }
        );
      }
      query.status = status;
    } else if (!mine) {
      // default behavior for home page
      query.status = 'active';
    }

    const listings = await listingsCollection.find(query).sort({ createdAt: -1 }).toArray();

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
