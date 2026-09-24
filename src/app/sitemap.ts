import type { MetadataRoute } from 'next'
import { INDEXABLE_BLOG_SITEMAP_ENTRIES } from '@/lib/blog-sitemap-entries'
import { useCases } from '@/lib/use-cases-data'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://convertify.work'

    // QUALITY-FIRST STRATEGY: Only include pages with substantial unique
    // content. Use-case pages marked indexable: true in use-cases-data.ts
    // have 800+ words of unique content and target high-value long-tail
    // keywords. Blog posts only included if they pass the 350-word minimum.
    //
    // Blog URLs come from blog-sitemap-entries.ts (slug + date only). Do
    // not import blog-data.ts here — that module ships full post bodies
    // and would bloat this route.

    const coreTools = [
        'merge-pdf', 'split-pdf',
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
        'sign-pdf',
        'crop-pdf',
        'redact-pdf',
        'repair-pdf',
        'pdf-to-excel',
        'delete-pdf-pages',
        'reorder-pdf',
        'unlock-pdf',
        'protect-pdf',
        'edit-pdf',
        'compare-pdf',
        'ocr-pdf',
        'pdf-to-powerpoint',
        'powerpoint-to-pdf',
        'pdf-to-pdfa',
    ]

    // Working first-class tools with unique pages (not Android-only).
    // Do not add /passport or /background-remove — those 404.
    const uniqueTools = [
        'compress-pdf',
        'fit-to-size',
        'passport-photo',
        'remove-background',
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
        { path: 'pricing', priority: 0.6 },
        { path: 'contact', priority: 0.4 },
        { path: 'security', priority: 0.4 },
        { path: 'about', priority: 0.4 },
        { path: 'privacy', priority: 0.3, lastModified: '2026-09-16' },
        { path: 'terms', priority: 0.3 },
    ]

    const lastUpdated = '2026-09-18'
    const recrawlToday = '2026-09-18'
    const uniqueToolsUpdated = recrawlToday
    const toolLastModified: Record<string, string> = {
        'png-to-pdf': recrawlToday,
        'excel-to-pdf': recrawlToday,
        'pdf-to-jpg': recrawlToday,
        'jpg-to-pdf': recrawlToday,
    }

    const entries: MetadataRoute.Sitemap = [
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
        ...uniqueTools.map(tool => ({
            url: `${baseUrl}/${tool}`,
            lastModified: uniqueToolsUpdated,
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        })),
        ...secondaryTools.map(tool => ({
            url: `${baseUrl}/${tool}`,
            lastModified: lastUpdated,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
        ...INDEXABLE_BLOG_SITEMAP_ENTRIES.map(post => ({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.date,
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        })),
        ...useCases
            .filter(uc => uc.indexable !== false)
            .map(useCase => ({
                url: `${baseUrl}/${useCase.slug}`,
                lastModified: lastUpdated,
                changeFrequency: 'monthly' as const,
                priority: 0.8,
            })),
    ]

    return entries
}
