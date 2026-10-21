/**
 * Lightweight slug + date list for /sitemap.xml.
 *
 * Do NOT put post bodies, excerpts, or keywords in this file. sitemap.ts
 * must stay a tiny module so Vercel cannot OOM / timeout while generating
 * https://convertify.work/sitemap.xml.
 *
 * Keep in sync with INDEXED_BLOG_SLUGS in blog-data.ts.
 * blog-sitemap.test.ts (npm run test:unit) fails if the two drift.
 */

export type SitemapBlogEntry = {
  slug: string
  date: string
}

export const INDEXABLE_BLOG_SITEMAP_ENTRIES: SitemapBlogEntry[] = [
  { slug: 'add-page-numbers-thesis-dissertation', date: '2026-07-06' },
  { slug: 'combine-receipts-into-one-pdf', date: '2026-05-14' },
  { slug: 'combine-scanned-documents-into-one-pdf', date: '2026-01-13' },
  { slug: 'compress-image-for-website-speed', date: '2026-05-07' },
  { slug: 'compress-pdf-for-visa-application', date: '2026-05-11' },
  { slug: 'compress-pdf-for-whatsapp-sharing', date: '2026-01-14' },
  { slug: 'compress-pdf-to-500kb', date: '2026-05-04' },
  { slug: 'compress-pdf-under-100kb-government-forms', date: '2026-04-04' },
  { slug: 'copy-text-from-pdf-that-wont-let-you', date: '2026-06-15' },
  { slug: 'extract-one-page-from-pdf', date: '2026-06-08' },
  { slug: 'heic-to-jpg-on-windows', date: '2026-05-25' },
  { slug: 'merge-pdf-android-phone-free', date: '2026-01-11' },
  { slug: 'merge-pdf-on-chromebook', date: '2026-06-01' },
  { slug: 'merge-pdf-windows-10-without-software', date: '2026-01-09' },
  { slug: 'passport-photo-size-us-india-uk', date: '2026-08-27' },
  { slug: 'png-to-pdf-without-white-borders', date: '2026-06-22' },
  { slug: 'reduce-pdf-size-without-losing-quality', date: '2026-01-15' },
  { slug: 'rotate-scanned-pdf-sideways', date: '2026-06-29' },
  { slug: 'scan-documents-iphone-to-pdf', date: '2026-01-04' },
  { slug: 'split-pdf-bank-statement-by-month', date: '2026-07-24' },
  { slug: 'webp-to-jpg-windows', date: '2026-05-21' },
]
