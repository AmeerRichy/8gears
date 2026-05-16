import { NextResponse } from 'next/server';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';
import { z } from 'zod';

// Zod Schema for Product Validation
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
  sizeChart: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const validatedData = productSchema.parse(body);
    
    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug: validatedData.slug });
    if (existingProduct) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const product = await Product.create(validatedData);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('❌ PRODUCT CREATION ERROR:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    // Handle Mongoose duplicate key error (code 11000)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json({ error: `Duplicate value for ${field}. Please use a unique value.` }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    
    const query = category ? { category } : {};
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server Error' }, { status: 500 });
  }
}
