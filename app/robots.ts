import type { MetadataRoute } from 'next';
import { absoluteUrl, allowIndexing } from '@/app/lib/seo';

export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) {
    return {
      // Pages remain crawlable so bots can read their noindex directives.
      rules: { userAgent: '*', allow: '/' },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/checkout/', '/track-order'],
    },
    sitemap: absoluteUrl('/sitemap.xml') || undefined,
  };
}
