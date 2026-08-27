import { MetadataRoute } from 'next'
import { allIndexableBlogPosts } from '@/lib/blog-data'

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

    const staticPages: { path: string; priority: number; lastModified?: string }[] = [
        { path: 'all-tools', priority: 0.8 },
        { path: 'blog', priority: 0.7 },
        { path: 'privacy', priority: 0.3, lastModified: '2026-08-27' },
        { path: 'about', priority: 0.4 },
    ]

    // Bumped on 2026-07-26: 6 orphaned hand-written blog posts re-attached,
    // titles/descriptions trimmed to SERP width, remaining false capability
    // claims removed.
    const lastUpdated = '2026-07-26'
    const recrawlToday = '2026-08-27'
    const toolLastModified: Record<string, string> = {
        'png-to-pdf': recrawlToday,
        'excel-to-pdf': recrawlToday,
        'pdf-to-jpg': recrawlToday,
        'jpg-to-pdf': recrawlToday,
    }

    return [
        {
            url: baseUrl,
            lastModified: recrawlToday,
            changeFrequency: 'weekly',
            priority: 1,
        },
        ...staticPages.map(page => ({
            url: `${baseUrl}/${page.path}`,
            lastModified: page.lastModified ?? lastUpdated,
            changeFrequency: 'monthly' as const,
            priority: page.priority,
        })),
        ...coreTools.map(tool => ({
            url: `${baseUrl}/${tool}`,
            lastModified: toolLastModified[tool] ?? lastUpdated,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        })),
        ...secondaryTools.map(tool => ({
            url: `${baseUrl}/${tool}`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
        // Blog posts with substantial unique content (350+ words), plus the
        // hand-written posts that live as their own route files — those were
        // orphaned out of the sitemap entirely until 2026-07-26.
        ...allIndexableBlogPosts.map(post => ({
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
