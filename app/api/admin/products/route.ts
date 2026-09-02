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

export async function POST(req: Request) {
  try {
    const auth = await requireAdminApi('/admin/products');
    if ('error' in auth) return auth.error;
    await connectDB();
    const body = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = await requireAdminApi('/admin/products');
    if ('error' in auth) return auth.error;
    await connectDB();
    const body = await req.json();
    const { _id, ...updateData } = body;
    const product = await Product.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await requireAdminApi('/admin/products');
    if ('error' in auth) return auth.error;
    await connectDB();
    const { ids } = await req.json();
    const result = await Product.deleteMany({ _id: { $in: ids } });
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
