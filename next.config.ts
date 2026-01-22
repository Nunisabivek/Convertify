import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // Fix 404s from old structure
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
        source: '/tools/:slug',
        destination: '/:slug', // Redirects /tools/any-tool to /any-tool
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
