import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ClientLayout from "@/components/layout/ClientLayout";

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
  sameAs: [
    "https://twitter.com/convertify"
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@convertify.work"
  }
};

export const metadata: Metadata = {
  title: {
    default: "Convertify - Free Online PDF Tools - No Sign-Up, No Limits",
    template: "%s | Convertify",
  },
  description: "Convertify is the ultimate free PDF tool suite. Merge, convert, compress, and edit PDFs securely in your browser. No sign-up, no limits, no uploads required.",
  applicationName: "Convertify",
  authors: [{ name: "Convertify Team" }],
  keywords: [
    "free pdf converter", "secure pdf tools", "client-side pdf merger", "no sign up pdf converter",
    "unlimited pdf tools", "fast pdf converter", "convertify", "ilovepdf alternative",
    "privacy first pdf", "offline pdf tools", "merge pdf secure", "compress pdf no limit",
    "jpg to pdf free", "pdf to word", "split pdf client side", "best pdf converter 2025",
    "pdf editor free online", "pdf compressor 100kb", "merge pdf no watermark",
    "convert pdf to word free", "pdf to jpg converter", "word to pdf converter"
  ],
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
    title: "Convertify - Free PDF Tools & File Converter",
    description: "Free online PDF tools - merge, compress, convert PDFs. No watermarks, no sign up. Works on mobile and desktop.",
    images: [
      {
        url: "https://convertify.work/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Convertify - Free PDF Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convertify - Free PDF Tools & File Converter",
    description: "Free online PDF tools - merge, compress, split, and convert PDFs easily.",
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
        {/* Preconnect to critical domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Preload critical resources */}
        <link rel="preload" href="/images/og-banner.png" as="image" type="image/png" />
        <link rel="preload" href="/images/Convertify.png" as="image" type="image/png" />

        {/* Sitemap Link for Search Engines */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-50`}
      >
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
