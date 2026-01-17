import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-data'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://convertify.work'

    // All PDF tools - COMPLETE LIST (30+ tools)
    const tools = [
        // Organize PDF
        'merge-pdf',
        'split-pdf',
        'organize-pdf',
        'rotate-pdf',

        // Optimize PDF
        'compress-pdf',
        'repair-pdf',
        'ocr-pdf',

        // Convert from PDF
        'pdf-to-word',
        'pdf-to-excel',
        'pdf-to-powerpoint',
        'pdf-to-jpg',
        'pdf-to-png',
        'pdf-to-text',

        // Convert to PDF
        'word-to-pdf',
        'excel-to-pdf',
        'powerpoint-to-pdf',
        'jpg-to-pdf',
        'png-to-pdf',
        'text-to-pdf',
        'html-to-pdf',

        // Edit PDF
        'edit-pdf',
        'sign-pdf',
        'watermark-pdf',
        'add-page-numbers',
        'crop-pdf',

        // Security
        'protect-pdf',
        'unlock-pdf',
        'redact-pdf',

        // Advanced Tools
        'compare-pdf',
        'pdf-to-pdfa',
    ]

    const toolUrls = tools.map((tool) => ({
        url: `${baseUrl}/${tool}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }))

    // All blog posts (dynamically from blog-data.ts)
    const blogUrls = blogPosts.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [
        // Homepage - highest priority
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        // All tools page
        {
            url: `${baseUrl}/all-tools`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        // Blog index
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        // Tool pages
        ...toolUrls,
        // Blog posts
        ...blogUrls,
    ]
}
