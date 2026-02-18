import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // REMOVED: output: 'export' - was causing 307 redirects on homepage
  // Static export causes / to redirect to /index.html with 307 status
  // This kills SEO rankings!

  trailingSlash: false,
  compress: true, // Enable Gzip compression for smaller file sizes
  poweredByHeader: false, // Remove X-Powered-By header for security
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Fix 404s from GSC report
      {
        source: '/tools/pdf-to-jpg',
        destination: '/pdf-to-jpg',
        permanent: true,
      },
      {
        source: '/tools/image-to-pdf',
        destination: '/jpg-to-pdf',
        permanent: true,
      },
      {
        source: '/tools/rotate-pdf',
        destination: '/rotate-pdf',
        permanent: true,
      },
      // Fix Blog redirect loop/error
      {
        source: '/blog/',
        destination: '/blog',
        permanent: true,
      },
      // Catch-all for any other /tools/ links
      {
        source: '/tools/:slug',
        destination: '/:slug',
        permanent: true,
      },
      // Fix 307 Temporary Redirects causing indexing issues
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  // SEO: Add proper headers for all pages
  async headers() {
    return [
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/xml',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=59',
          },
        ],
      },
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
