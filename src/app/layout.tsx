import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build";

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = "G-57C0PG4LK6";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Website Schema
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Convertify",
  url: "https://convertify.work",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://convertify.work/all-tools?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

// Organization Schema
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Convertify",
  url: "https://convertify.work",
  logo: {
    "@type": "ImageObject",
    url: "https://convertify.work/images/Convertify.png",
    width: 512,
    height: 512
  },
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@convertify.work"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: IS_MOBILE_BUILD ? "#FFFFFF" : "#ffffff",
};

export const metadata: Metadata = {
  title: {
    default: "Convertify — Free Online PDF Tools (No Upload, No Sign-up)",
    // No " | Convertify" suffix. Google truncates titles around 60 characters
    // and the brand costs 13 of them on a domain nobody searches by name yet,
    // pushing the actual keywords out of the visible SERP snippet. Page titles
    // below carry the brand only where it earns its space.
    template: "%s",
  },
  description: "40+ free PDF tools: merge, compress, convert, edit & sign PDFs in your browser. Files never leave your device — no uploads, no sign-up, no watermarks. Works on Windows, Mac, iPhone & Android.",
  applicationName: "Convertify",
  authors: [{ name: "Convertify Team" }],
  icons: {
    icon: [
      { url: '/icon.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
      { url: '/images/Convertify.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/images/Convertify.png',
    shortcut: '/icon.png',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://convertify.work",
    siteName: "Convertify",
    title: "Convertify — Free Online PDF Tools (No Upload, No Sign-up)",
    description: "40+ free PDF tools: merge, compress, convert, edit & sign PDFs in your browser. Files never leave your device — no uploads, no sign-up, no watermarks.",
    images: [
      {
        url: "https://convertify.work/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Convertify - Free Online PDF & File Converter Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convertify — Free PDF Tools (No Upload Required)",
    description: "Merge, compress, convert & edit PDFs in your browser. 100% private — files never leave your device. Free, no sign-up.",
    images: ["https://convertify.work/images/og-banner.png"],
    creator: "@convertify",
  },
  alternates: {
    canonical: 'https://convertify.work',
  },
  verification: {
    google: "ghwXtP5nTeKojcTtLh5jNBXQOHfhcwBGfwiLLO0_4Yc",
  },
  metadataBase: new URL("https://convertify.work"),
  // Additional SEO metadata
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {!IS_MOBILE_BUILD && (
          <>
        {/* Preconnect to critical domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Fonts loaded as link tags (non-render-blocking) instead of CSS @import */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
          </>
        )}

        {/* Sitemap Link for Search Engines */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* LLMs.txt for AI/LLM discoverability (AEO) */}
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-friendly site description" />

        {/* hreflang signals — site is English-only but we want Google to
            understand it serves all major English markets so US/CA/UK/AU
            queries surface this domain. x-default points to the canonical. */}
        <link rel="alternate" hrefLang="en" href="https://convertify.work" />
        <link rel="alternate" hrefLang="en-US" href="https://convertify.work" />
        <link rel="alternate" hrefLang="en-GB" href="https://convertify.work" />
        <link rel="alternate" hrefLang="en-CA" href="https://convertify.work" />
        <link rel="alternate" hrefLang="en-AU" href="https://convertify.work" />
        <link rel="alternate" hrefLang="x-default" href="https://convertify.work" />

        {/* Structured Data - Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      {!IS_MOBILE_BUILD && (
        <>
      {/* Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            'send_page_view': true,
            'anonymize_ip': true
          });
        `}
      </Script>
      {/* Google AdSense */}
      {process.env.NEXT_PUBLIC_ADSENSE_CLIENT && (
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
          strategy="afterInteractive"
          id="google-adsense"
        />
      )}
        </>
      )}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col ${IS_MOBILE_BUILD ? "mobile-root" : "bg-slate-50"}`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
