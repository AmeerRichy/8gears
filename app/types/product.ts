export interface Variant {
  color: string;
  colorHex?: string;
  size: string;
  price: number;
  comparePrice?: number;
  stockQuantity: number;
  sku: string;
  images: string[];
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  category: string;
  baseDescription: string;
  fullDescription: string;
  brand: string;
  tags: string[];
  variants: Variant[];
  closeUpSection: { image: string; title: string; description: string }[];
  engineeredSection: { title: string; description: string; image: string };
  lifestyleImage: string;
  stylishSection: { title: string; description: string; mainImage: string; secondaryImage: string };
  bottomGallery: string[];
  reviews: {
    rating: number;
    reviewCount: number;
  };
}
