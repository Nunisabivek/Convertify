import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // REMOVED: output: 'export' - was causing 307 redirects on homepage
  // Static export causes / to redirect to /index.html with 307 status
  // This kills SEO rankings!

  trailingSlash: false,  // Consistent with Vercel config
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Fix 404s from old structure - no trailing slashes to match Vercel
      {
        source: '/tools/image-to-pdf',
        destination: '/jpg-to-pdf',
        permanent: true,
      },
      {
        source: '/image-to-pdf',
        destination: '/jpg-to-pdf',
        permanent: true,
      },
      {
        source: '/tools/pdf-to-jpg',
        destination: '/pdf-to-jpg',
        permanent: true,
      },
      {
        source: '/tools/rotate-pdf',
        destination: '/rotate-pdf',
        permanent: true,
      },
      {
        source: '/tools/:slug',
        destination: '/:slug', // Redirects /tools/any-tool to /any-tool
        permanent: true,
      },
      // CRITICAL: Redirect index.html to / to fix 307 redirect issue
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
      // Additional common variations
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index.php',
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
            value: 'public, max-age=3600',
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
