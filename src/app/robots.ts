import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/private/', '/_next/static/media/'],
        },
        sitemap: 'https://convertify.work/sitemap.xml',
    }
}
