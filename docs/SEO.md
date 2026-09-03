# 8-Gear SEO configuration

SEO is controlled by two server-side Vercel environment variables:

```text
SITE_URL=https://www.final-domain.example
ALLOW_INDEXING=false
```

`SITE_URL` must be the final HTTPS origin. Localhost and `*.vercel.app` values are rejected so they can never become canonical URLs. `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_ALLOW_INDEXING` are supported as compatibility fallbacks, but the server-only names above are preferred.

Indexing is enabled only when all of these conditions are true:

1. `SITE_URL` is a valid HTTPS URL that is not localhost or a Vercel domain.
2. `ALLOW_INDEXING=true`.
3. On Vercel, `VERCEL_ENV=production` (Vercel sets this automatically).

Until launch, keep `ALLOW_INDEXING=false`. Pages remain crawlable and emit `noindex, nofollow`; the temporary site does not advertise a sitemap. Preview deployments remain non-indexable even if production indexing is enabled.

## Final-domain launch

1. Add the verified final origin as `SITE_URL` in the Vercel Production environment only.
2. Set `ALLOW_INDEXING=true` in the Vercel Production environment only.
3. Redeploy production; do not promote old preview builds.
4. Confirm page source contains the final canonical, `index, follow`, Open Graph URL, and JSON-LD URLs.
5. Confirm `/robots.txt` allows public routes, blocks private routes, and references the final `/sitemap.xml`.
6. Confirm `/sitemap.xml` lists active products and real categories only.
7. Test representative URLs with Google's Rich Results Test and validate product data.
8. Add every final-domain variant to Google Search Console, verify the preferred property, and submit `/sitemap.xml`.
9. Request indexing for the homepage, collection, technology, sustainability, and priority product pages.
10. Verify favicon, social previews, HTTPS redirects, preferred host redirects, and trailing-slash behavior.
11. Keep `ALLOW_INDEXING` unset or false in Vercel Preview and Development environments.
