import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { z } from 'zod';
import { requireAdminApi } from '@/lib/adminAuth';

import { productSchema } from '@/lib/validations/product';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminApi('/admin/products');
    if ('error' in auth) return auth.error;
    const { id } = await params;
    await connectDB();
    const body = await req.json();
    const validatedData = productSchema.parse(body);

    const product = await Product.findByIdAndUpdate(id, validatedData, { new: true });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminApi('/admin/products');
    if ('error' in auth) return auth.error;
    const { id } = await params;
    await connectDB();
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
