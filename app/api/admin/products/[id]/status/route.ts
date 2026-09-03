import { NextResponse } from 'next/server';
import { z } from 'zod';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { requireAdminApi } from '@/lib/adminAuth';

const statusSchema = z.object({ isActive: z.boolean() });

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await requireAdminApi('/admin/products');
    if ('error' in auth) return auth.error;

    const { id } = await params;
    const { isActive } = statusSchema.parse(await req.json());
    await connectDB();

    const product = await Product.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ _id: product._id, isActive: product.isActive });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    const message = error instanceof Error ? error.message : 'Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
