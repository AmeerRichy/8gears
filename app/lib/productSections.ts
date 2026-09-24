export const PRODUCT_SECTIONS = [
  { key: 'closeUp', label: 'Close-up' },
  { key: 'engineered', label: 'Engineered' },
  { key: 'cinematic', label: 'Cinematic Hero' },
  { key: 'style', label: 'Style & Aesthetics' },
  { key: 'evolution', label: 'Evolution Gallery' },
] as const;

export type ProductSectionKey = typeof PRODUCT_SECTIONS[number]['key'];
export type ProductSectionSettings = Record<ProductSectionKey, boolean>;
export const DEFAULT_PRODUCT_SECTIONS: ProductSectionSettings = {
  closeUp: false,
  engineered: false,
  cinematic: false,
  style: false,
  evolution: false,
};

export function hasSectionContent(value: unknown): boolean {
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.some(hasSectionContent);
  if (value && typeof value === 'object') {
    return Object.entries(value).some(([key, field]) => key !== '_id' && hasSectionContent(field));
  }
  return false;
}
