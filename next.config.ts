import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// Capacitor packaging uses a static export. `next dev` (including
// `npm run dev:mobile` live reload) must not set `output: 'export'`,
// because that mode cannot run middleware and Next paints a red overlay.
const isMobileBuild = process.env.NEXT_PUBLIC_MOBILE_BUILD === 'true';
const isDevServer =
  process.env.NODE_ENV === 'development' || process.argv.includes('dev');
const nativeAdsWeb = path.join(path.dirname(fileURLToPath(import.meta.url)), 'src/lib/native-ads.web.ts');

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
  // Website builds must not ship AdMob unit IDs or the Capacitor ads plugin.
  ...(!isMobileBuild && {
    turbopack: {
      resolveAlias: {
        '@/lib/native-ads': './src/lib/native-ads.web.ts',
      },
    },
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib/native-ads': nativeAdsWeb,
      };
      return config;
    },
  }),
  // Redirects and headers are consolidated in vercel.json
  // X-Robots-Tag removed from here - it was applying "index, follow" to 404 pages too,
  // confusing Google. Vercel.json handles this for valid pages only.
};

export default nextConfig;
