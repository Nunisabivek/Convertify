import { MetadataRoute } from 'next'
import { useCases } from '@/lib/use-cases-data'
import { indexableBlogPosts } from '@/lib/blog-data'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://convertify.work'

    // Strategy: every page in the sitemap now carries genuinely substantial
    // content (deep-guide sections on tool pages, enriched use-case template,
    // full blog posts). The earlier "lean sitemap" approach was masking the
    // real fix — page quality. Including everything now both gives Google a
    // complete map of the site and surfaces 100+ long-tail keyword pages.

    const coreTools = [
        'merge-pdf', 'compress-pdf', 'split-pdf',
        'pdf-to-word', 'word-to-pdf',
        'pdf-to-jpg', 'jpg-to-pdf',
        'pdf-to-png', 'png-to-pdf',
        'excel-to-pdf', 'pdf-to-excel',
        'powerpoint-to-pdf', 'pdf-to-powerpoint',
        'rotate-pdf', 'protect-pdf', 'unlock-pdf',
        'add-page-numbers', 'delete-pdf-pages',
        'watermark-pdf', 'reorder-pdf', 'organize-pdf',
        'pdf-to-text', 'text-to-pdf',
        'html-to-pdf', 'markdown-to-pdf',
        'tiff-to-pdf',
        'autocad-pdf-editor',
    ]

    const secondaryTools = [
        'image-compressor', 'resize-image',
        'heic-to-jpg', 'jpg-to-png', 'png-to-jpg',
        'webp-converter', 'bmp-to-jpg', 'gif-to-png', 'svg-to-png',
        'qr-code-generator',
        'csv-to-json', 'json-to-csv', 'xml-to-json', 'base64',
    ]

    const staticPages = [
        { path: 'all-tools', priority: 0.8 },
        { path: 'blog', priority: 0.7 },
        { path: 'pricing', priority: 0.6 },
        { path: 'about', priority: 0.4 },
        { path: 'contact', priority: 0.3 },
        { path: 'security', priority: 0.4 },
        { path: 'privacy', priority: 0.3 },
        { path: 'terms', priority: 0.3 },
    ]

    // Use a fixed date instead of new Date() — Google distrusts sitemaps
    // where every page claims to be freshly modified. Update this when the
    // page content actually changes meaningfully. Bumped on 2026-05-19 after
    // the indexability/sitemap-consistency fix so Google re-crawls the tool
    // pages that were stuck "Crawled - currently not indexed" from crawls
    // that predate the deep-content rollout.
    const lastUpdated = '2026-05-19'

    return [
        {
            url: baseUrl,
            lastModified: lastUpdated,
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...staticPages.map(page => ({
            url: `${baseUrl}/${page.path}`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly' as const,
            priority: page.priority,
        })),
        ...coreTools.map(tool => ({
            url: `${baseUrl}/${tool}`,
            lastModified: lastUpdated,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        })),
        ...secondaryTools.map(tool => ({
            url: `${baseUrl}/${tool}`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
        // Only indexable blog posts. Thin posts are noindex (see
        // blog-data.ts) and must NOT appear here — advertising a noindex
        // URL is the contradictory signal that caused the growing
        // "Crawled - currently not indexed" count.
        ...indexableBlogPosts.map(post => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.date || lastUpdated,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        })),
        // All use-case pages — long-tail keyword targets, now substantial
        ...useCases.map(uc => ({
            url: `${baseUrl}/use-cases/${uc.slug}`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly' as const,
            priority: 0.5,
        })),
    ]
}
