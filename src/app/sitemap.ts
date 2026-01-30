import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-data'

export const dynamic = 'force-static'

// Complete list of all tools - 29 total
const allTools = [
    // Organize PDF (4)
    'merge-pdf',
    'split-pdf',
    'organize-pdf',
    'rotate-pdf',

    // Optimize PDF (3)
    'compress-pdf',
    'repair-pdf',
    'ocr-pdf',

    // Convert from PDF (6)
    'pdf-to-word',
    'pdf-to-excel',
    'pdf-to-powerpoint',
    'pdf-to-jpg',
    'pdf-to-png',
    'pdf-to-text',

    // Convert to PDF (7)
    'word-to-pdf',
    'excel-to-pdf',
    'powerpoint-to-pdf',
    'jpg-to-pdf',
    'png-to-pdf',
    'text-to-pdf',
    'html-to-pdf',

    // Edit PDF (5)
    'edit-pdf',
    'sign-pdf',
    'watermark-pdf',
    'add-page-numbers',
    'crop-pdf',

    // Security (3)
    'protect-pdf',
    'unlock-pdf',
    'redact-pdf',

    // Advanced Tools (2)
    'compare-pdf',
    'pdf-to-pdfa',
]

// Static pages
const staticPages = [
    'all-tools',
    'blog',
    'contact',
    'privacy',
    'terms',
    'security',
]

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://convertify.work'
    const currentDate = new Date()

    // Tool pages - High priority (29 pages)
    const toolUrls = allTools.map((tool) => ({
        url: `${baseUrl}/${tool}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // Blog posts (30 pages from blog-data.ts)
    const blogUrls = blogPosts.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    // Static pages (6 pages)
    const staticUrls = staticPages.map(page => ({
        url: `${baseUrl}/${page}`,
        lastModified: currentDate,
        changeFrequency: page === 'blog' ? 'daily' as const : 'monthly' as const,
        priority: page === 'all-tools' || page === 'blog' ? 0.9 : 0.5,
    }))

    // Total: 1 (homepage) + 29 (tools) + 30 (blogs) + 6 (static) = 66+ pages
    return [
        // Homepage - highest priority
        {
            url: baseUrl,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 1,
        },
        // Static pages
        ...staticUrls,
        // Tool pages
        ...toolUrls,
        // Blog posts
        ...blogUrls,
    ]
}
