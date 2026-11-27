import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

// Capacitor packaging uses a static export. `next dev` (including
// `npm run dev:mobile` live reload) must not set `output: 'export'`,
// because that mode cannot run middleware and Next paints a red overlay.
const isMobileBuild = process.env.NEXT_PUBLIC_MOBILE_BUILD === 'true';
const isDevServer =
  process.env.NODE_ENV === 'development' || process.argv.includes('dev');
const root = path.dirname(fileURLToPath(import.meta.url));
const nativeAdsWeb = path.join(root, 'src/lib/native-ads.web.ts');

// Android-only screens. Pages and AppShell import them statically and render them only
// behind IS_MOBILE_BUILD, but Next still ships every imported client component, so website
// visitors downloaded ~55 KB gz of app code (and pdf-lib on three tools) they never ran.
// Website builds resolve them to an empty stub instead.
const WEB_STUBS = [
  '@/components/mobile',
  '@/components/mobile/MobileLayout',
  '@/components/mobile/MobileToolFrame',
  '@/components/mobile/MobileFilesPage',
  '@/app/compress-pdf/mobile-client',
  '@/app/image-compressor/mobile-client',
  '@/app/jpg-to-pdf/mobile-client',
];
const webStub = path.join(root, 'src/components/mobile/web-stub.tsx');

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
        ...Object.fromEntries(WEB_STUBS.map((m) => [m, './src/components/mobile/web-stub.tsx'])),
      },
    },
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@/lib/native-ads': nativeAdsWeb,
        ...Object.fromEntries(WEB_STUBS.map((m) => [`${m}$`, webStub])),
      };
      return config;
    },
  }),
  // Redirects and headers are consolidated in vercel.json
  // X-Robots-Tag removed from here - it was applying "index, follow" to 404 pages too,
  // confusing Google. Vercel.json handles this for valid pages only.
};

export default nextConfig;
