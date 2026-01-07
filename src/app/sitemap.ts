import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-data'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://convertify.work'

    // All PDF tools
    const tools = [
        'merge-pdf',
        'split-pdf',
        'compress-pdf',
        'jpg-to-pdf',
        'png-to-pdf',
        'word-to-pdf',
        'pdf-to-jpg',
        'pdf-to-png',
        'text-to-pdf',
        'pdf-to-text',
        'excel-to-pdf',
        'powerpoint-to-pdf',
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
