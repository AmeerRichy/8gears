import type { Metadata } from 'next';

export const SITE_NAME = '8-Gear';
export const DEFAULT_DESCRIPTION =
  'Premium motorcycle riding apparel and gear designed for protection, comfort, performance, and everyday adventure.';
export const DEFAULT_OG_IMAGE_PATH = '/assets/images/h1m.png';

function readConfiguredSiteUrl(): URL | null {
  const configuredUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (!configuredUrl) return null;

  try {
    const url = new URL(configuredUrl);
    const hostname = url.hostname.toLowerCase();
    if (url.protocol !== 'https:' || hostname === 'localhost' || hostname.endsWith('.vercel.app')) {
      return null;
    }
    url.pathname = '/';
    url.search = '';
    url.hash = '';
    return url;
  } catch {
    return null;
  }
}

export const siteUrl = readConfiguredSiteUrl();

export const allowIndexing =
  Boolean(siteUrl) &&
  (process.env.ALLOW_INDEXING || process.env.NEXT_PUBLIC_ALLOW_INDEXING) === 'true' &&
  (!process.env.VERCEL_ENV || process.env.VERCEL_ENV === 'production');

export const robotsMetadata: Metadata['robots'] = allowIndexing
  ? {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    }
  : {
      index: false,
      follow: false,
      googleBot: { index: false, follow: false, noimageindex: true },
    };

export function absoluteUrl(path = '/') {
  return siteUrl ? new URL(path, siteUrl).toString() : null;
}

export function cleanSeoText(value: string | undefined, maxLength = 160) {
  const text = (value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string | null;
  noIndex?: boolean;
};

export function createPageMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE_PATH,
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const imageUrl = image ? absoluteUrl(image) : null;
  const socialTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const robots = noIndex
    ? { index: false, follow: false, googleBot: { index: false, follow: false } }
    : robotsMetadata;

  return {
    title,
    description,
    robots,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: socialTitle,
      description,
      url: canonical || undefined,
      images: imageUrl ? [{ url: imageUrl, alt: `${SITE_NAME} motorcycle riding gear` }] : undefined,
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: socialTitle,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}
