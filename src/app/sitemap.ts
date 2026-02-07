import { MetadataRoute } from 'next'
import { blogPosts } from '@/lib/blog-data'
import { getAllTools } from '@/lib/tools-registry'

export const dynamic = 'force-static'

// Dynamically get all tools from the centralized registry
// This ensures sitemap stays in sync when new tools are added
const allTools = getAllTools().map(tool => tool.href)

// Additional tools/pages that may not be in registry but have pages
const additionalToolPages = [
    'organize-pdf',
    'repair-pdf',
    'crop-pdf',
    'text-to-pdf',
    'extract-pdf', // Captures "extract pdf" queries, redirects to split-pdf
]

// Combine and deduplicate
const allToolSlugs = [...new Set([...allTools, ...additionalToolPages])]

// Static pages
const staticPages = [
    'all-tools',
    'blog',
    'contact',
    'privacy',
    'terms',
    'security',
]

// High-volume keyword landing pages (SEO-optimized guides)
const landingPages = [
    'how-to-merge-pdf-files-windows-10',
    'how-to-compress-pdf-to-100kb',
    'how-to-convert-jpg-to-pdf-iphone',
    'how-to-split-pdf-by-page-number',
    'how-to-convert-word-to-pdf-without-office',
    'how-to-reduce-pdf-file-size-for-email',
    'how-to-convert-pdf-to-word-editable',
    'how-to-combine-multiple-pdfs-into-one',
    'how-to-extract-pages-from-pdf',
    'how-to-convert-excel-to-pdf-free',
]

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

    // Landing pages - Very high priority SEO pages (10 pages)
    const landingUrls = landingPages.map(page => ({
        url: `${baseUrl}/${page}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: 0.92, // Very high priority - new content targeting high-volume keywords
    }))

    // Total: 1 (homepage) + 6 (static) + 32 (tools) + 30 (blogs) + 10 (landing) = 79+ pages
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
        // Landing pages (high-volume keywords)
        ...landingUrls,
        // Tool pages
        ...toolUrls,
        // Blog posts
        ...blogUrls,
    ]
}
