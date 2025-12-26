import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid listing ID' },
        { status: 400 }
      );
    }

    // Get database connection
    const db = await getDatabase();
    const listingsCollection = db.collection('listings');

    // Find listing by ID
    const listing = await listingsCollection.findOne({ _id: new ObjectId(id) });

    if (!listing) {
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await listingsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { views: 1 } }
    );

    return NextResponse.json(
      {
        success: true,
        listing,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching listing:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listing' },
      { status: 500 }
    );
  }
}
