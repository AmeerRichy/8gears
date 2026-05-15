import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env.local');
  process.exit(1);
}

// Define Schema (Simplified for script usage)
const VariantSchema = new mongoose.Schema({
  color: String,
  colorHex: String,
  size: String,
  price: Number,
  comparePrice: Number,
  stockQuantity: Number,
  sku: String,
  images: [String],
});

const ProductSchema = new mongoose.Schema({
  title: String,
  slug: String,
  category: String,
  baseDescription: String,
  fullDescription: String,
  brand: String,
  tags: [String],
  variants: [VariantSchema],
  technicalSpecifications: [{ title: String, description: String }],
  materialCare: { composition: String, careInstructions: String },
  narrativeSection: String,
  advantages: [{ title: String, description: String }],
  logistics: { shipping: String, returns: String },
  closeUpSection: [{ image: String, title: String, description: String }],
  engineeredSection: { title: String, description: String, image: String },
  lifestyleImage: String,
  stylishSection: { title: String, description: String, mainImage: String, secondaryImage: String },
  bottomGallery: [String],
  reviews: { rating: Number, reviewCount: Number },
  analytics: { totalSold: Number, views: Number },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

async function addBoots() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const bootsData = {
      title: 'Apex Predator Pro Boots',
      slug: 'apex-predator-pro-boots',
      category: 'Boots',
      baseDescription: 'High-performance racing boots for maximum protection and agility.',
      fullDescription: 'The Apex Predator Pro Boots are engineered for riders who demand the best in safety and performance. Featuring carbon-fiber reinforcements, adaptive ankle support, and high-grip soles.',
      brand: '8 GEARS',
      tags: ['boots', 'racing', 'protection', 'leather'],
      variants: [
        {
          color: 'Stealth Black',
          colorHex: '#1a1a1a',
          size: '42',
          price: 24500,
          comparePrice: 28000,
          stockQuantity: 15,
          sku: '8G-BT-BLK-42',
          images: ['https://images.unsplash.com/photo-1605235186531-82915dd97166?q=80&w=2070&auto=format&fit=crop'],
        },
        {
          color: 'Stealth Black',
          colorHex: '#1a1a1a',
          size: '44',
          price: 24500,
          comparePrice: 28000,
          stockQuantity: 10,
          sku: '8G-BT-BLK-44',
          images: ['https://images.unsplash.com/photo-1605235186531-82915dd97166?q=80&w=2070&auto=format&fit=crop'],
        }
      ],
      technicalSpecifications: [
        { title: 'Outer Shell', description: 'Reinforced Full-Grain Leather' },
        { title: 'Protection', description: 'Carbon Fiber Ankle Guards' }
      ],
      materialCare: {
        composition: '80% Leather, 10% Carbon Fiber, 10% Rubber',
        careInstructions: 'Clean with specialized leather cleaner. Store in a cool, dry place.'
      },
      narrativeSection: 'Born on the track, built for the road.',
      advantages: [
        { title: 'Maximum Grip', description: 'Anti-slip rubber soles for perfect peg control.' },
        { title: 'Impact Absorption', description: 'Dual-density foam padding for crashes.' }
      ],
      logistics: {
        shipping: 'Free standard shipping on all orders over Rs. 10,000.',
        returns: '30-day return policy for unused products.'
      },
      closeUpSection: [
        { title: 'Reinforced Toe', description: 'Extra layer of protection for gear shifts.', image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2070&auto=format&fit=crop' }
      ],
      engineeredSection: {
        title: 'Precision Engineering',
        description: 'Every stitch is designed to handle high-speed friction.',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2072&auto=format&fit=crop'
      },
      lifestyleImage: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2080&auto=format&fit=crop',
      stylishSection: {
        title: 'Industrial Aesthetic',
        description: 'Looks as good off the bike as it does on it.',
        mainImage: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070&auto=format&fit=crop',
        secondaryImage: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=1974&auto=format&fit=crop'
      },
      bottomGallery: [
        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=1964&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1512374382149-4332c6c021f1?q=80&w=2010&auto=format&fit=crop'
      ],
      reviews: { rating: 4.8, reviewCount: 42 },
      analytics: { totalSold: 120, views: 1500 }
    };

    // Use findOneAndUpdate with upsert to avoid duplicates if run multiple times
    const product = await Product.findOneAndUpdate(
      { slug: bootsData.slug },
      bootsData,
      { upsert: true, new: true }
    );

    console.log('✅ Product Added/Updated Successfully:', product.title);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding product:', error);
    process.exit(1);
  }
}

addBoots();
