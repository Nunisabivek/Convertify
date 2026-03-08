import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-data'
import { getAllTools } from '@/lib/tools-registry'

export const dynamic = 'force-static'

// Dynamically get all tools from the centralized registry
// This ensures sitemap stays in sync when new tools are added
const allTools = getAllTools().map(tool => tool.href)

// Additional tools/pages that may not be in registry but have pages
import { useCases } from '@/lib/use-cases-data'

const additionalToolPages = [
    'organize-pdf',
    'repair-pdf',
    'crop-pdf',
    'text-to-pdf',
    'extract-pdf',
    'heic-to-jpg',
]

// New SEO-optimized blog articles (added Feb 2026)
const newBlogPosts = [
    'how-to-convert-pdf-to-word-without-software',
    'best-free-pdf-compressor-online',
    'pdf-tools-for-small-business',
]

// Combine and deduplicate
const allToolSlugs = [...new Set([...allTools, ...additionalToolPages])]

// Static pages
const staticPages = [
    'all-tools',
    'blog',
    'about',
    'contact',
    'privacy',
    'terms',
    'security',
    'pricing',
]

// High-volume keyword landing pages removed - replaced with quality blog content

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://convertify.work'
    const currentDate = new Date()

    // Top priority tools (most searched, currently unindexed)
    const topPriorityTools = [
        'merge-pdf', 'compress-pdf', 'jpg-to-pdf', 'word-to-pdf',
        'pdf-to-word', 'split-pdf', 'pdf-to-jpg', 'excel-to-pdf',
        'pdf-to-excel', 'edit-pdf'
    ]

    // Tool pages - Tiered priority based on importance
    const toolUrls = allToolSlugs.map((tool) => ({
        url: `${baseUrl}/${tool}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: topPriorityTools.includes(tool) ? 0.95 : 0.85, // Higher priority for top tools
    }))

    // Blog posts (30 pages from blog-data.ts + new articles)
    const blogUrls = blogPosts.map(post => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    // Add new SEO blog posts to sitemap
    const newBlogUrls = newBlogPosts.map(slug => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.75, // Slightly higher priority for new content
    }))

    // Static pages (6 pages)
    const staticUrls = staticPages.map(page => ({
        url: `${baseUrl}/${page}`,
        lastModified: currentDate,
        changeFrequency: page === 'blog' ? 'daily' as const : 'monthly' as const,
        priority: page === 'all-tools' || page === 'blog' ? 0.9 : 0.5,
    }))

    // Use Case pages (Programmatic SEO)
    const useCaseUrls = useCases.map(uc => ({
        url: `${baseUrl}/use-cases/${uc.slug}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.85,
    }))

    // Total: 1 (homepage) + 6 (static) + 32 (tools) + 33 (blogs) + 10 (landing) = 82+ pages
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
        // Use Case pages
        ...useCaseUrls,
        // Tool pages
        ...toolUrls,
        // Blog posts
        ...blogUrls,
        // New SEO blog posts
        ...newBlogUrls,
    ]
}
