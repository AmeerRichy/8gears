import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectDB from '@/lib/db/mongodb';
import Product from '@/models/Product';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const nextCursor = searchParams.get('next_cursor');

    // Fetch resources from Cloudinary
    const result = await cloudinary.api.resources({
      type: 'upload',
      prefix: '', // Can be adjusted to a specific folder if needed
      max_results: 50,
      next_cursor: nextCursor || undefined,
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Cloudinary Fetch Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { publicId, secureUrl } = await req.json();

    if (!publicId) {
      return NextResponse.json({ error: 'Public ID is required' }, { status: 400 });
    }

    // Connect to DB to check usage
    await connectDB();

    // Check where this image is used across all products
    const productsUsingImage = await Product.find({
      $or: [
        { 'variants.images': secureUrl },
        { 'closeUpSection.image': secureUrl },
        { 'engineeredSection.image': secureUrl },
        { 'lifestyleImage': secureUrl },
        { 'stylishSection.mainImage': secureUrl },
        { 'stylishSection.secondaryImage': secureUrl },
        { 'bottomGallery': secureUrl }
      ]
    }).select('title');

    if (productsUsingImage.length > 0) {
      const productNames = productsUsingImage.map(p => p.title).join(', ');
      return NextResponse.json({ 
        error: `Cannot delete. Image is currently used in these products: ${productNames}. Remove it from the products first.` 
      }, { status: 400 });
    }

    // Delete from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId);
    
    if (result.result !== 'ok') {
      throw new Error(result.result || 'Failed to delete image');
    }

    return NextResponse.json({ message: 'Image deleted successfully' });
  } catch (error: any) {
    console.error('Cloudinary Delete Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
