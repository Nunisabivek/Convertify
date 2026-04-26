import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
    // Disallow paths that should never be indexed (static assets, admin,
    // Next.js internals). Allow AI/LLM bots — they cite us in answers, which
    // is the GEO play.
    const sharedDisallow = [
        '/admin/',
        '/private/',
        '/_next/',
        '/_next/static/',
        '/_next/static/media/',
        '/_next/static/chunks/',
        '/api/',
    ]

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: sharedDisallow,
            },
            // AI / LLM crawlers — explicitly allowed for GEO citations
            { userAgent: 'GPTBot', allow: '/', disallow: sharedDisallow },
            { userAgent: 'ChatGPT-User', allow: '/', disallow: sharedDisallow },
            { userAgent: 'OAI-SearchBot', allow: '/', disallow: sharedDisallow },
            { userAgent: 'ClaudeBot', allow: '/', disallow: sharedDisallow },
            { userAgent: 'Claude-Web', allow: '/', disallow: sharedDisallow },
            { userAgent: 'anthropic-ai', allow: '/', disallow: sharedDisallow },
            { userAgent: 'PerplexityBot', allow: '/', disallow: sharedDisallow },
            { userAgent: 'Perplexity-User', allow: '/', disallow: sharedDisallow },
            { userAgent: 'Google-Extended', allow: '/', disallow: sharedDisallow },
            { userAgent: 'GoogleOther', allow: '/', disallow: sharedDisallow },
            { userAgent: 'Applebot-Extended', allow: '/', disallow: sharedDisallow },
            { userAgent: 'CCBot', allow: '/', disallow: sharedDisallow },
            { userAgent: 'YouBot', allow: '/', disallow: sharedDisallow },
            { userAgent: 'Meta-ExternalAgent', allow: '/', disallow: sharedDisallow },
            { userAgent: 'Bytespider', allow: '/', disallow: sharedDisallow },
            { userAgent: 'DuckAssistBot', allow: '/', disallow: sharedDisallow },
            { userAgent: 'Amazonbot', allow: '/', disallow: sharedDisallow },
            { userAgent: 'cohere-ai', allow: '/', disallow: sharedDisallow },
        ],
        sitemap: 'https://convertify.work/sitemap.xml',
        host: 'https://convertify.work',
    }
}
