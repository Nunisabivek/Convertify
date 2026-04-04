import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { hostname } = request.nextUrl

    // Redirect www to non-www
    // This is the ONLY redirect in middleware. All other redirects
    // (trailing slashes, /index.html, old /tools/* paths) are handled
    // by next.config.ts (trailingSlash: false) and vercel.json.
    // Duplicating redirects here causes redirect chains that Google flags as errors.
    if (hostname.startsWith('www.')) {
        const url = request.nextUrl.clone()
        url.hostname = hostname.replace('www.', '')
        return NextResponse.redirect(url, 301)
    }

    const response = NextResponse.next()

    // Security headers
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

    return response
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
}
