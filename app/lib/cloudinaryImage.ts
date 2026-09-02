const CLOUDINARY_UPLOAD_MARKER = '/image/upload/';
const NON_IMAGE_EXTENSIONS = /\.(?:pdf|mp4|webm|mov|avi|mp3|wav)(?:$|\?)/i;

export function getOptimizedCloudinaryImage(url: string | null | undefined, width: number): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes(CLOUDINARY_UPLOAD_MARKER) || NON_IMAGE_EXTENSIONS.test(url)) {
    return url || '';
  }

  const safeWidth = Math.max(1, Math.round(width));
  return url.replace(CLOUDINARY_UPLOAD_MARKER, `${CLOUDINARY_UPLOAD_MARKER}f_auto,q_auto,c_limit,w_${safeWidth}/`);
}

export function getCloudinarySrcSet(url: string): string | undefined {
  if (!url.includes('res.cloudinary.com') || NON_IMAGE_EXTENSIONS.test(url)) return undefined;
  return [420, 720, 1080].map((width) => `${getOptimizedCloudinaryImage(url, width)} ${width}w`).join(', ');
}
