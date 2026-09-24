import { z } from 'zod';

export const variantSchema = z.object({
  color: z.string(),
  colorHex: z.string().optional(),
  size: z.string(),
  price: z.number().min(0),
  comparePrice: z.number().optional().nullable(),
  stockQuantity: z.number().int().min(0),
  sku: z.string(),
  images: z.array(z.string()),
});

export const sectionSettingsSchema = z.object({
  closeUp: z.boolean().optional(),
  engineered: z.boolean().optional(),
  cinematic: z.boolean().optional(),
  style: z.boolean().optional(),
  evolution: z.boolean().optional(),
});

export const productSchema = z.object({
  sectionSettings: sectionSettingsSchema.optional(),
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

export type VariantSchemaType = z.infer<typeof variantSchema>;
export type ProductSchemaType = z.infer<typeof productSchema>;
