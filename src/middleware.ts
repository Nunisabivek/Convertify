import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname, hostname } = request.nextUrl

    // Redirect www to non-www
    if (hostname.startsWith('www.')) {
        const url = request.nextUrl.clone()
        url.hostname = hostname.replace('www.', '')
        return NextResponse.redirect(url, 301)
    }

    // Redirect /index.html to /
    if (pathname === '/index.html') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url, 301)
    }

    // Remove trailing slashes (except root)
    if (pathname !== '/' && pathname.endsWith('/')) {
        const url = request.nextUrl.clone()
        url.pathname = pathname.slice(0, -1)
        return NextResponse.redirect(url, 301)
    }

    const response = NextResponse.next()

    // Security headers
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

    // X-Robots-Tag REMOVED from middleware
    // It was applying "index, follow" to ALL responses including 404 pages,
    // which confused Google (page says "index me" but returns 404).
    // Let each page control its own robots meta tag via Next.js metadata instead.

    return response
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
