import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // REMOVED: output: 'export' - was causing 307 redirects on homepage
  // Static export causes / to redirect to /index.html with 307 status
  // This kills SEO rankings!

  trailingSlash: false,  // Changed to false to match Vercel config
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Fix 404s from old structure - use trailing slash for consistency
      {
        source: '/tools/image-to-pdf',
        destination: '/jpg-to-pdf/',
        permanent: true,
      },
      {
        source: '/image-to-pdf',
        destination: '/jpg-to-pdf/',
        permanent: true,
      },
      {
        source: '/tools/pdf-to-jpg',
        destination: '/pdf-to-jpg/',
        permanent: true,
      },
      {
        source: '/tools/rotate-pdf',
        destination: '/rotate-pdf/',
        permanent: true,
      },
      {
        source: '/tools/:slug',
        destination: '/:slug/', // Redirects /tools/any-tool to /any-tool
        permanent: true,
      },
      // CRITICAL: Redirect index.html to / to fix 307 redirect issue
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
