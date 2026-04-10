import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://convertify.work'

    // STRATEGY: For a new domain (~3 months old), keep the sitemap lean.
    // Only include pages that deserve to be indexed. Google trusts smaller,
    // high-quality sitemaps over bloated ones. Add more pages gradually
    // as domain authority grows and existing pages get indexed.

    // Core tool pages (highest search volume PDF tools only)
    const coreTools = [
        'merge-pdf',
        'compress-pdf',
        'split-pdf',
        'pdf-to-word',
        'word-to-pdf',
        'pdf-to-jpg',
        'jpg-to-pdf',
        'excel-to-pdf',
        'pdf-to-png',
        'png-to-pdf',
        'rotate-pdf',
        'protect-pdf',
        'unlock-pdf',
        'add-page-numbers',
        'delete-pdf-pages',
        'watermark-pdf',
        'reorder-pdf',
        'organize-pdf',
    ]

    // Secondary tools
    const secondaryTools = [
        'image-compressor',
        'resize-image',
        'heic-to-jpg',
        'jpg-to-png',
        'png-to-jpg',
        'webp-converter',
        'pdf-to-text',
        'html-to-pdf',
        'bmp-to-jpg',
        'gif-to-png',
        'svg-to-png',
        'tiff-to-pdf',
        'qr-code-generator',
        'csv-to-json',
        'json-to-csv',
        'xml-to-json',
        'base64',
        'markdown-to-pdf',
        'text-to-pdf',
    ]

    // Static pages worth indexing
    const staticPages = [
        { path: 'all-tools', priority: 0.8 },
        { path: 'blog', priority: 0.7 },
        { path: 'about', priority: 0.4 },
        { path: 'contact', priority: 0.3 },
        { path: 'security', priority: 0.3 },
        { path: 'pricing', priority: 0.3 },
    ]

    // Only blog posts that have dedicated page.tsx files with real content
    // Dynamic [slug] posts from blog-data.ts are excluded until they have
    // substantial unique content (1500+ words of genuine editorial)
    const blogPosts = [
        'how-to-convert-pdf-to-word-without-software',
        'best-free-pdf-compressor-online',
        'pdf-tools-for-small-business',
        'compress-pdf-under-100kb-government-forms',
    ]

    // Use a fixed date instead of new Date() — Google distrusts sitemaps
    // where every page claims to be freshly modified. Update this date
    // only when you actually make meaningful content changes.
    const lastUpdated = '2026-04-10'

    return [
        // Homepage
        {
            url: baseUrl,
            lastModified: lastUpdated,
            changeFrequency: 'weekly',
            priority: 1,
        },
        // Static pages
        ...staticPages.map(page => ({
            url: `${baseUrl}/${page.path}`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly' as const,
            priority: page.priority,
        })),
        // Core tool pages
        ...coreTools.map(tool => ({
            url: `${baseUrl}/${tool}`,
            lastModified: lastUpdated,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        })),
        // Secondary tools
        ...secondaryTools.map(tool => ({
            url: `${baseUrl}/${tool}`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
        // Blog posts with real dedicated content
        ...blogPosts.map(slug => ({
            url: `${baseUrl}/blog/${slug}`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        })),
    ]
}
