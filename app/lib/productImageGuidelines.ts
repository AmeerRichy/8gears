export type ProductImageGuidelineKey =
  | 'variant'
  | 'closeUp'
  | 'engineered'
  | 'lifestyle'
  | 'stylishMain'
  | 'stylishSecondary'
  | 'gallery'
  | 'sizeChart';

export type ProductImageGuideline = {
  label: string;
  width: number;
  height: number;
  aspectRatio: string;
  fit: 'cover' | 'contain' | 'natural';
  guidance: string;
};

export const PRODUCT_IMAGE_GUIDELINES: Record<ProductImageGuidelineKey, ProductImageGuideline> = {
  variant: {
    label: 'Product Gallery Image', width: 1200, height: 1600,
    aspectRatio: '3:4', fit: 'cover',
    guidance: 'Use a portrait image with the full product inside the center 80% safe area.',
  },
  closeUp: {
    label: 'Close-up Feature Image', width: 1200, height: 1600,
    aspectRatio: '3:4', fit: 'cover',
    guidance: 'Portrait crop. Keep the feature detail centered for smaller screens.',
  },
  engineered: {
    label: 'Engineered Feature Image', width: 1200, height: 1600,
    aspectRatio: '3:4', fit: 'cover',
    guidance: 'Portrait composition with the primary subject near the center.',
  },
  lifestyle: {
    label: 'Cinematic Lifestyle Image', width: 1920, height: 1080,
    aspectRatio: '16:9', fit: 'natural',
    guidance: 'Wide landscape artwork. The complete image remains visible on every screen.',
  },
  stylishMain: {
    label: 'Style Main Image', width: 1700, height: 1760,
    aspectRatio: '85:88 (near-square portrait)', fit: 'cover',
    guidance: 'Use a near-square portrait composition. Keep the subject centered with breathing room.',
  },
  stylishSecondary: {
    label: 'Style Secondary Image', width: 1200, height: 1600,
    aspectRatio: '3:4', fit: 'cover',
    guidance: 'Portrait composition. Keep important details inside the center 80%.',
  },
  gallery: {
    label: 'Evolution Gallery Image', width: 1200, height: 1600,
    aspectRatio: '3:4', fit: 'natural',
    guidance: 'Portrait is recommended; original proportions remain visible in the masonry gallery.',
  },
  sizeChart: {
    label: 'Size Chart Image', width: 1600, height: 900,
    aspectRatio: '16:9', fit: 'contain',
    guidance: 'Use a sharp landscape chart with readable labels and minimal empty margins.',
  },
};

export function getAspectDifference(width: number, height: number, guideline: ProductImageGuideline) {
  if (!width || !height) return 0;
  const expected = guideline.width / guideline.height;
  return Math.abs(width / height - expected) / expected;
}
