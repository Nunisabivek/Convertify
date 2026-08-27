import type { NextConfig } from "next";

// Capacitor packaging uses a static export. `next dev` (including
// `npm run dev:mobile` live reload) must not set `output: 'export'`,
// because that mode cannot run middleware and Next paints a red overlay.
const isMobileBuild = process.env.NEXT_PUBLIC_MOBILE_BUILD === 'true';
const isDevServer =
  process.env.NODE_ENV === 'development' || process.argv.includes('dev');

const nextConfig: NextConfig = {
  ...(isMobileBuild && !isDevServer && { output: 'export' }),
  trailingSlash: false,
  compress: true,
  poweredByHeader: false,
  // Emulator WebView (10.0.2.2) talking to `next dev`. Ignored in production.
  allowedDevOrigins: ['10.0.2.2', '127.0.0.1', 'localhost'],
  images: {
    unoptimized: true,
  },
  // Redirects and headers are consolidated in vercel.json
  // X-Robots-Tag removed from here - it was applying "index, follow" to 404 pages too,
  // confusing Google. Vercel.json handles this for valid pages only.
};

export default nextConfig;
