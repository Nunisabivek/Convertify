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
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "support@convertify.work"
  }
};

export const metadata: Metadata = {
  title: {
    default: "Convertify - Secure Online PDF Tools (No Upload Required)",
    template: "%s | Convertify",
  },
  description: "Merge, compress, and convert PDFs 100% securely in your browser. Files never leave your device. No sign-up, no limits, no servers involved.",
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
    title: "Convertify - Secure PDF Tools (Files Stay on Device)",
    description: "100% Private PDF tools. Merge, compress, and convert without uploading files. No servers, no tracking, no limits.",
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
    title: "Convertify - Secure PDF Tools (No Uploads)",
    description: "Merge, compress, and convert PDFs locally in your browser. 100% Private & Free.",
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

        {/* Google Fonts loaded as link tags (non-render-blocking) instead of CSS @import */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />

        {/* Sitemap Link for Search Engines */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* Popunder Ad — web only (suppressed in app build via NEXT_PUBLIC_MOBILE_BUILD) */}
        {process.env.NEXT_PUBLIC_MOBILE_BUILD !== 'true' && (
          <script src="https://tonicgoverness.com/c9/10/84/c91084acdeea2a9474360f743f122509.js"></script>
        )}

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
