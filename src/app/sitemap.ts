import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://convertify.vercel.app'

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

    const blogUrls = [
        'how-to-merge-pdf-files-free',
        'convert-jpg-to-pdf-online',
        'compress-pdf-reduce-file-size'
    ].map(slug => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
    }))

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/all-tools`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        ...toolUrls,
        ...blogUrls
    ]
}
