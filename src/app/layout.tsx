import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdBanner } from "@/components/ads/banner";
import { JsonLd } from "@/components/seo/json-ld";

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

export const metadata: Metadata = {
  title: {
    default: "Convertify - Free PDF Tools & File Converter Online",
    template: "%s | Convertify",
  },
  description: "Free online file converter and PDF tools. Convert documents, images, and merged PDFs easily. No software to install, 100% free and secure document converter.",
  applicationName: "Convertify",
  authors: [{ name: "Convertify Team" }],
  keywords: ["file converter", "document converter", "online converter", "convertify", "convertifyy", "convertify free", "free pdf tools", "merge pdf", "compress pdf", "jpg to pdf", "pdf to word", "split pdf", "combine pdf", "convert pdf"],
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
    canonical: './',
  },
  verification: {
    google: "ghwXtP5nTeKojcTtLh5jNBXQOHfhcwBGfwiLLO0_4Yc",
  },
  metadataBase: new URL("https://convertify.work"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
          gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-50`}
      >
        <Header />

        <div className="flex justify-center w-full max-w-[1920px] mx-auto">
          {/* Left Ad Sidebar */}
          <aside className="hidden xl:flex w-[180px] shrink-0 flex-col items-center pt-8 sticky top-0 h-screen">
            <AdBanner variant="skyscraper" />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>

          {/* Right Ad Sidebar */}
          <aside className="hidden xl:flex w-[180px] shrink-0 flex-col items-center pt-8 sticky top-0 h-screen">
            <AdBanner variant="skyscraper" />
          </aside>
        </div>

        <AdBanner />
        <Footer />
        <JsonLd />
      </body>
    </html>
  );
}
