import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  compress: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
  // Redirects and headers are consolidated in vercel.json
  // X-Robots-Tag removed from here - it was applying "index, follow" to 404 pages too,
  // confusing Google. Vercel.json handles this for valid pages only.
};

export default nextConfig;
