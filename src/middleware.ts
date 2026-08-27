import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Android live reload (`npm run dev:mobile`) and the Capacitor export
    // must not run website SEO/canonical middleware. Production website
    // builds do not set NEXT_PUBLIC_MOBILE_BUILD, so this is a no-op there.
    if (process.env.NEXT_PUBLIC_MOBILE_BUILD === 'true') {
        return NextResponse.next()
    }

    const { hostname, pathname } = request.nextUrl

    // Redirect www to non-www (301 permanent — consolidates domain authority)
    // Also handled at Vercel edge level in vercel.json as a safety net.
    if (hostname.startsWith('www.')) {
        const url = request.nextUrl.clone()
        url.hostname = hostname.replace('www.', '')
        return NextResponse.redirect(url, 301)
    }

    const response = NextResponse.next()

    // Security headers
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

    // Canonical Link header — reinforces the canonical URL signal for crawlers
    // that respect HTTP Link headers (Google, Bing, AI bots)
    const canonical = `https://convertify.work${pathname === '/' ? '' : pathname}`
    response.headers.set('Link', `<${canonical}>; rel="canonical"`)

    return response
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|robots.txt|llms.txt|llms-full.txt|ads.txt).*)',
    ],
}
