import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { z } from 'zod';

const variantSchema = z.object({
  color: z.string(),
  colorHex: z.string().optional(),
  size: z.string(),
  price: z.number().min(0),
  comparePrice: z.number().optional().nullable(),
  stockQuantity: z.number().int().min(0),
  sku: z.string(),
  images: z.array(z.string()),
});

const productSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  category: z.string(),
  baseDescription: z.string(),
  fullDescription: z.string(),
  brand: z.string(),
  tags: z.array(z.string()).optional(),
  variants: z.array(variantSchema).min(1),
  materialCare: z.object({
    composition: z.string(),
    careInstructions: z.string(),
  }),
  advantages: z.array(z.object({ title: z.string(), description: z.string() })),
  logistics: z.object({
    shipping: z.string(),
    returns: z.string(),
  }),
  closeUpSection: z.array(z.object({ image: z.string(), title: z.string(), description: z.string() })).optional(),
  engineeredSection: z.object({ title: z.string(), description: z.string(), image: z.string() }).optional(),
  lifestyleImage: z.string().optional(),
  stylishSection: z.object({ title: z.string(), description: z.string(), mainImage: z.string(), secondaryImage: z.string() }).optional(),
  bottomGallery: z.array(z.string()).optional(),
});

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
