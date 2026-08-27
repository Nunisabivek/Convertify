/**
 * Lightweight slug + date list for /sitemap.xml.
 *
 * Do NOT put post bodies, excerpts, or keywords in this file. sitemap.ts
 * must stay a tiny module so Vercel cannot OOM / timeout while generating
 * https://convertify.work/sitemap.xml.
 *
 * Keep in sync with indexable posts in blog-data.ts (word count >= 350)
 * plus staticBlogPosts (hand-written route files). blog-data.ts asserts
 * the slug sets match at module load, so `next build` fails on drift.
 */

export type SitemapBlogEntry = {
  slug: string
  date: string
}

export const INDEXABLE_BLOG_SITEMAP_ENTRIES: SitemapBlogEntry[] = [
  { slug: 'add-page-numbers-thesis-dissertation', date: '2026-07-06' },
  { slug: 'base64-encode-image-for-email-css', date: '2026-07-16' },
  { slug: 'best-free-pdf-compressor-online', date: '2026-02-08' },
  { slug: 'best-free-pdf-tools-2025', date: '2025-12-30' },
  { slug: 'combine-multiple-png-to-pdf', date: '2026-04-26' },
  { slug: 'combine-receipts-into-one-pdf', date: '2026-05-14' },
  { slug: 'combine-scanned-documents-into-one-pdf', date: '2026-01-13' },
  { slug: 'compress-image-for-website-speed', date: '2026-05-07' },
  { slug: 'compress-pdf-for-email-attachment', date: '2026-01-01' },
  { slug: 'compress-pdf-for-visa-application', date: '2026-05-11' },
  { slug: 'compress-pdf-for-whatsapp', date: '2026-01-08' },
  { slug: 'compress-pdf-for-whatsapp-sharing', date: '2026-01-14' },
  { slug: 'compress-pdf-reduce-file-size', date: '2026-01-05' },
  { slug: 'compress-pdf-to-500kb', date: '2026-05-04' },
  { slug: 'compress-pdf-under-100kb-government-forms', date: '2026-04-04' },
  { slug: 'convert-iphone-photos-to-pdf', date: '2025-12-31' },
  { slug: 'convert-jpg-to-pdf-online', date: '2026-01-06' },
  { slug: 'convert-screenshots-to-pdf', date: '2026-05-18' },
  { slug: 'convert-word-to-pdf-keep-formatting', date: '2026-01-06' },
  { slug: 'copy-text-from-pdf-that-wont-let-you', date: '2026-06-15' },
  { slug: 'csv-to-json-without-uploading', date: '2026-07-13' },
  { slug: 'extract-one-page-from-pdf', date: '2026-06-08' },
  { slug: 'free-pdf-tools-vs-adobe-acrobat', date: '2026-01-05' },
  { slug: 'heic-to-jpg-on-windows', date: '2026-05-25' },
  { slug: 'how-to-convert-pdf-to-word-without-software', date: '2026-02-08' },
  { slug: 'how-to-merge-pdf-files-free', date: '2026-01-07' },
  { slug: 'json-to-csv-for-excel', date: '2026-07-02' },
  { slug: 'merge-pdf-android-phone-free', date: '2026-01-11' },
  { slug: 'merge-pdf-on-chromebook', date: '2026-06-01' },
  { slug: 'merge-pdf-what-gets-lost', date: '2026-05-28' },
  { slug: 'merge-pdf-windows-10-without-software', date: '2026-01-09' },
  { slug: 'merge-pdf-without-adobe-acrobat', date: '2026-01-02' },
  { slug: 'organize-pdf-reorder-delete-pages', date: '2026-06-11' },
  { slug: 'pdf-tips-for-students', date: '2025-12-29' },
  { slug: 'pdf-to-jpg-convert-pages-images', date: '2026-01-03' },
  { slug: 'pdf-to-png-for-presentation-slides', date: '2026-06-25' },
  { slug: 'pdf-tools-for-small-business', date: '2026-02-08' },
  { slug: 'png-to-pdf-without-white-borders', date: '2026-06-22' },
  { slug: 'reduce-pdf-size-without-losing-quality', date: '2026-01-15' },
  { slug: 'resize-image-for-passport-photo', date: '2026-07-20' },
  { slug: 'rotate-scanned-pdf-sideways', date: '2026-06-29' },
  { slug: 'scan-documents-iphone-to-pdf', date: '2026-01-04' },
  { slug: 'split-pdf-bank-statement-by-month', date: '2026-07-24' },
  { slug: 'split-pdf-extract-pages-free', date: '2026-01-04' },
  { slug: 'split-pdf-into-separate-pages', date: '2026-01-07' },
  { slug: 'svg-to-png-for-social-media', date: '2026-07-09' },
  { slug: 'text-to-pdf-for-printing', date: '2026-06-04' },
  { slug: 'watermark-pdf-before-sending-draft', date: '2026-06-18' },
  { slug: 'webp-to-jpg-windows', date: '2026-05-21' },
  { slug: 'xls-to-pdf-converter-free', date: '2026-04-26' },
]
