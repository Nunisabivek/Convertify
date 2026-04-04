import type { NextConfig } from "next";

// Enable static export for Capacitor mobile builds via env variable:
// NEXT_PUBLIC_MOBILE_BUILD=true npm run build
const isMobileBuild = process.env.NEXT_PUBLIC_MOBILE_BUILD === 'true';

const nextConfig: NextConfig = {
  ...(isMobileBuild && { output: 'export' }),
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
