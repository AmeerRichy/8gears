# 8-Gear SEO audit and keyword map

## Implementation audit

- Public routes: `/`, `/category`, `/product/[slug]`, `/technology`, `/sustainability`, `/dealers`, `/contact`, `/warranty`, `/return-policy`, `/shopping-policy`, `/privacy-policy`, `/tncs`, and `/track-order`.
- Transactional routes: `/checkout` and `/checkout/success`; these are intentionally non-indexable.
- Private routes: all `/admin` routes and APIs; admin pages are explicitly non-indexable and crawler access is blocked after public indexing is enabled.
- Dynamic content: products and categories are stored in MongoDB. There are no implemented article/blog routes or CMS article models.
- Before this work, only global fallback metadata and basic product metadata existed. There was no sitemap, robots route, canonical strategy, Twitter metadata, or structured data.
- Category filtering uses `?cat=` rather than route segments. Each real category filter receives its own canonical; search-only UI state does not create URLs.
- Product pages correctly use `notFound()` for missing/inactive products. Inactive products are excluded from APIs, product pages, related products, and the sitemap.
- Primary navigation and footer expose nonexistent `/about`, `/policies`, and `/blog` destinations. These should be implemented from approved brand content or removed in a separate navigation decision.
- Local imagery is approximately 43 MB. Several source PNGs are 1.5–3 MB. Next.js delivery now optimizes the homepage LCP hero, fleece banner, and footer logos; remaining large assets should be converted to AVIF/WebP at source without changing CMS image behavior.
- The collection page previously had two H1 elements. It now has one query-aware collection H1 while preserving the same visual styling.

## Keyword and search-intent map

Titles below are implemented unless the row is database-driven. Category and product wording is generated from actual stored content.

| Page | Search intent | Primary topic | Secondary terms | Recommended/implemented title | Recommended/implemented description |
|---|---|---|---|---|---|
| `/` | Brand + commercial discovery | premium motorcycle riding gear | riding apparel, protective motorcycle gear, rider comfort | Premium Motorcycle Riding Gear \| 8-Gear | Explore 8-Gear motorcycle riding apparel engineered for rider protection, comfort, performance, and everyday adventure. |
| `/category` | Browse/shop | motorcycle riding gear collection | protective apparel, riding gear collection | Motorcycle Riding Gear Collection \| 8-Gear | Browse the complete collection of premium motorcycle riding apparel and protective gear. |
| Real `?cat=` category | Category commercial | `[real category] motorcycle riding gear` | category name, protective/comfortable riding apparel | `[Category] Motorcycle Riding Gear \| 8-Gear` | Uses the category's real CMS description, with a restrained fallback. |
| `/product/[slug]` | Product purchase/research | actual product name | actual category, brand, SKU | `[Product] – [Category] \| 8-Gear` | Uses the real product description and image. |
| `/technology` | Informational/product research | motorcycle apparel technology | protective materials, garment certification, wash care | Motorcycle Apparel Technology \| 8-Gear | Covers the materials, construction, certification classes, and care content present on the page. |
| `/sustainability` | Brand research | durable responsible riding gear | materials, longevity, considered manufacturing | Durable and Responsible Riding Gear \| 8-Gear | Reflects the existing durability, materials, and manufacturing content. |
| `/dealers` | Local/transactional | 8-Gear dealers | motorcycle gear dealer, authorized dealer | Find an 8-Gear Dealer \| 8-Gear | Directs users to the existing dealer locator. |
| `/contact` | Support/navigation | contact 8-Gear | order support, product help, partnerships | Contact Us \| 8-Gear | Describes the existing support and contact purposes. |
| `/warranty` | Post-purchase | motorcycle gear warranty | coverage, exclusions, warranty claims | Product Warranty \| 8-Gear | Summarizes the real warranty page scope. |
| Policy/legal pages | Trust/support | relevant policy name | shipping, returns, privacy, terms | Page-specific policy title | Each uses a unique, restrained summary of its actual content. |
| `/track-order` | Existing-customer utility | track 8-Gear order | order status, delivery progress | Track Your Order \| 8-Gear | Intentionally `noindex` because it is a user utility rather than a search landing page. |

## Content opportunities requiring owner input

- Approved About/Our Story/Vision/Mission copy is needed before creating the currently linked `/about` page.
- A decision is needed on whether `/policies` should be a real policy hub or whether that navigation link should point to existing policy pages.
- The footer links to `/blog`, but no journal model or route exists. Do not publish an empty SEO page; provide an editorial plan first.
- Pakistan-focused landing content may be valuable if 8-Gear genuinely sells and supports delivery there. Confirm service area, currency strategy, delivery coverage, and dealer locations before targeting Pakistan terms.
- Provide the final legal brand name, final domain, approved social profile URLs, and a dedicated 1200×630 social-sharing image. Placeholder `#` social links are not emitted in structured data.
