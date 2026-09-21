import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { requireAdminApi } from '@/lib/adminAuth';

export async function GET(req: Request) {
  try {
    const auth = await requireAdminApi('/admin/products');
    if ('error' in auth) return auth.error;
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
