const MAX_SOURCE_BYTES = 3 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

type ImageBounds = { width: number; height: number };

export async function optimizeImageUpload(file: File, bounds?: ImageBounds): Promise<File> {
  if (!ALLOWED_TYPES.has(file.type)) throw new Error('Use a JPG, PNG, or WebP image.');
  if (file.size > MAX_SOURCE_BYTES) throw new Error('Source image must be 3 MB or smaller.');

  const bitmap = await createImageBitmap(file);
  const limitWidth = bounds?.width || 1080;
  const limitHeight = bounds?.height || 1350;
  const scale = Math.min(1, limitWidth / bitmap.width, limitHeight / bitmap.height);
  let width = Math.max(1, Math.round(bitmap.width * scale));
  let height = Math.max(1, Math.round(bitmap.height * scale));

  const encode = (quality: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    canvas.getContext('2d', { alpha: true })?.drawImage(bitmap, 0, 0, width, height);
    return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
  };

  let blob: Blob | null = null;
  for (let quality = 0.86; quality >= 0.5; quality -= 0.08) {
    blob = await encode(quality);
    if (blob && blob.size <= MAX_OUTPUT_BYTES) break;
  }
  while (blob && blob.size > MAX_OUTPUT_BYTES && width > 420 && height > 420) {
    width = Math.round(width * 0.85);
    height = Math.round(height * 0.85);
    blob = await encode(0.5);
  }
  bitmap.close();

  if (!blob || blob.size > MAX_OUTPUT_BYTES) throw new Error('Optimized image is still larger than 1 MB. Choose a simpler or smaller image.');
  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  return new File([blob], `${baseName}.webp`, { type: 'image/webp', lastModified: Date.now() });
}
