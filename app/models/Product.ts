import mongoose, { Schema, Document } from 'mongoose';

export interface IVariant {
  color: string;
  colorHex?: string;
  size: string;
  price: number;
  comparePrice?: number;
  stockQuantity: number;
  sku: string;
  images: string[];
}

export interface IProduct extends Document {
  title: string;
  slug: string;
  category: string;
  baseDescription: string;
  fullDescription: string;
  brand: string;
  tags: string[];
  variants: IVariant[];
  materialCare: {
    composition: string;
    careInstructions: string;
  };
  advantages: { title: string; description: string }[];
  logistics: {
    shipping: string;
    returns: string;
  };
  // Premium Layout Sections
  closeUpSection: { image: string; title: string; description: string }[];
  engineeredSection: { title: string; description: string; image: string };
  lifestyleImage: string;
  stylishSection: { title: string; description: string; mainImage: string; secondaryImage: string };
  bottomGallery: string[];
  reviews: {
    rating: number;
    reviewCount: number;
  };
  analytics: {
    totalSold: number;
    views: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<IVariant>({
  color: { type: String, required: true },
  colorHex: { type: String, default: '#000000' },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  comparePrice: { type: Number },
  stockQuantity: { type: Number, required: true, default: 0 },
  sku: { type: String, required: true, unique: true },
  images: { type: [String], required: true },
});

const ProductSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    baseDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    brand: { type: String, required: true },
    tags: { type: [String], default: [] },
    variants: [VariantSchema],

    materialCare: {
      composition: { type: String, required: true },
      careInstructions: { type: String, required: true },
    },

    advantages: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    logistics: {
      shipping: { type: String, required: true },
      returns: { type: String, required: true },
    },
    // Premium Layout Sections
    closeUpSection: [
      {
        image: { type: String },
        title: { type: String },
        description: { type: String },
      },
    ],
    engineeredSection: {
      title: { type: String },
      description: { type: String },
      image: { type: String },
    },
    lifestyleImage: { type: String },
    stylishSection: {
      title: { type: String },
      description: { type: String },
      mainImage: { type: String },
      secondaryImage: { type: String },
    },
    bottomGallery: { type: [String], default: [] },
    reviews: {
      rating: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 },
    },
    analytics: {
      totalSold: { type: Number, default: 0 },
      views: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Add text index for search
ProductSchema.index({ title: 'text', baseDescription: 'text', tags: 'text' });

// Force refresh model in development to avoid schema caching issues
if (process.env.NODE_ENV === 'development') {
  delete mongoose.models.Product;
}

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
