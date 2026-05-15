import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongodb';
import Review from '@/models/Review';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    const isAdminFetch = searchParams.get('admin') === 'true';

    // If admin is fetching, they need to be authenticated
    if (isAdminFetch) {
      const session = await getServerSession(authOptions);
      if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      
      // Admin sees all reviews, sorted by newest
      const reviews = await Review.find()
        .populate('productId', 'title')
        .sort({ createdAt: -1 });
      return NextResponse.json(reviews);
    }

    // Public fetch for a specific product
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const reviews = await Review.find({ 
      productId: new mongoose.Types.ObjectId(productId),
      status: 'approved' 
    }).sort({ createdAt: -1 });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Review Fetch Error:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const { productId, userName, userLocation, rating, title, comment } = body;

    if (!productId || !userName || !rating || !title || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const review = await Review.create({
      productId: new mongoose.Types.ObjectId(productId),
      userName,
      userLocation,
      rating: Number(rating),
      title,
      comment,
      status: 'approved', // Auto-approve by default for convenience
      isVerified: false
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Review Post Error:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
