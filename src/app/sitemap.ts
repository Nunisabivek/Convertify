import { MetadataRoute } from 'next'
import { getAllTools } from '@/lib/tools-registry'

export const dynamic = 'force-static'

// Dynamically get all tools from the centralized registry
const allTools = getAllTools().map(tool => tool.href)

// Additional tools/pages that may not be in registry but have pages
const additionalToolPages = [
    'organize-pdf',
    'repair-pdf',
    'crop-pdf',
    'text-to-pdf',
    'extract-pdf',
    'heic-to-jpg',
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

// Only include the highest-quality, most-searched blog posts
// These target real search queries with substantial unique content
const topBlogPosts = [
    'how-to-merge-pdf-files-free',
    'compress-pdf-reduce-file-size',
    'convert-jpg-to-pdf-online',
    'how-to-convert-pdf-to-word-without-software',
    'split-pdf-extract-pages-free',
    'convert-word-to-pdf-keep-formatting',
    'best-free-pdf-tools-2025',
    'how-to-electronically-sign-pdf-free',
    'how-to-make-scanned-pdf-searchable-ocr',
    'reduce-pdf-size-without-losing-quality',
    'best-free-pdf-compressor-online',
    'pdf-tools-for-small-business',
    'free-pdf-tools-vs-adobe-acrobat',
    'resume-guide-word-to-pdf',
    'pdf-tips-for-students',
]

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://convertify.work'
    const currentDate = new Date()

    // Top priority tools (most searched)
    const topPriorityTools = [
        'merge-pdf', 'compress-pdf', 'jpg-to-pdf', 'word-to-pdf',
        'pdf-to-word', 'split-pdf', 'pdf-to-jpg', 'excel-to-pdf',
        'pdf-to-excel', 'edit-pdf'
    ]

    // Tool pages
    const toolUrls = allToolSlugs.map((tool) => ({
        url: `${baseUrl}/${tool}`,
        lastModified: currentDate,
        changeFrequency: 'weekly' as const,
        priority: topPriorityTools.includes(tool) ? 0.95 : 0.85,
    }))

    // Only top blog posts
    const blogUrls = topBlogPosts.map(slug => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: currentDate,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    // Static pages
    const staticUrls = staticPages.map(page => ({
        url: `${baseUrl}/${page}`,
        lastModified: currentDate,
        changeFrequency: page === 'blog' ? 'daily' as const : 'monthly' as const,
        priority: page === 'all-tools' || page === 'blog' ? 0.9 : 0.5,
    }))

    // USE CASE PAGES REMOVED FROM SITEMAP
    // 83 thin/programmatic use-case pages were hurting indexing.
    // These pages still exist but are noindexed until domain authority grows.
    // Re-add gradually once core pages are indexed and ranking.

    return [
        // Homepage
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
        // Top blog posts only
        ...blogUrls,
    ]
}
