import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';

export async function GET() {
  try {
    await connectDB();
    const categories = await Product.distinct('category');
    const formattedCategories = categories.map(cat => ({ name: cat, _id: cat }));
    return NextResponse.json(formattedCategories);
  } catch (error: any) {
    console.error('Categories API error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}