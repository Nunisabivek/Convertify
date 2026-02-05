import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get('host') || '';
    const pathname = url.pathname;

    // CRITICAL: Redirect www to non-www permanently (301)
    if (hostname.startsWith('www.')) {
        url.hostname = hostname.replace('www.', '');
        return NextResponse.redirect(url, 301);
    }

    // CRITICAL SEO FIX: Redirect index.html to root with 301
    if (pathname === '/index.html' || pathname === '/index.html/') {
        url.pathname = '/';
        return NextResponse.redirect(url, 301);
    }

    // SEO: Ensure trailing slash consistency
    // If URL ends with / and it's not the root, redirect to non-trailing version
    // or vice versa depending on your strategy
    if (pathname !== '/' && pathname.endsWith('/')) {
        url.pathname = pathname.slice(0, -1);
        return NextResponse.redirect(url, 301);
    }

    // Add security headers
    const response = NextResponse.next();

    // Add HSTS header for SEO (Google prefers HTTPS)
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // Add X-Robots-Tag to allow indexing
    response.headers.set('X-Robots-Tag', 'index, follow');

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - sitemap.xml
         * - robots.txt
         */
        '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ],
};
