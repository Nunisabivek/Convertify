import { MetadataRoute } from 'next'
import { indexableBlogPosts } from '@/lib/blog-data'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://convertify.work'

    // QUALITY-FIRST STRATEGY: Only include pages with substantial unique
    // content. Use-case pages are noindexed (templated thin content that
    // was suppressing domain-wide rankings). Blog posts only included if
    // they pass the 350-word minimum quality threshold.
    //
    // Target: ~60 high-quality URLs instead of 161 thin ones.

    const coreTools = [
        'merge-pdf', 'compress-pdf', 'split-pdf',
        'pdf-to-word', 'word-to-pdf',
        'pdf-to-jpg', 'jpg-to-pdf',
        'pdf-to-png', 'png-to-pdf',
        'excel-to-pdf',
        'rotate-pdf',
        'add-page-numbers',
        'watermark-pdf',
        'organize-pdf',
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
        { path: 'about', priority: 0.4 },
    ]

    // Bumped on 2026-07-12: protect-pdf/unlock-pdf removed (were fake —
    // no real encryption), pdf-to-word/word-to-pdf/html-to-pdf rebuilt with
    // real conversions, and inflated marketing copy corrected sitewide.
    const lastUpdated = '2026-07-12'

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
        // Only blog posts with substantial unique content (350+ words)
        ...indexableBlogPosts.map(post => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.date || lastUpdated,
            changeFrequency: 'monthly' as const,
            priority: 0.6,
        })),
        // USE-CASE PAGES REMOVED — they are templated thin content that
        // dilutes domain quality signals. Noindexed in their page.tsx.
        // Will re-add only when each page has 800+ words of unique content.
    ]
}
