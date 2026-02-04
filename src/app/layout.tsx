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
    "jpg to pdf free", "pdf to word", "split pdf client side"
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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
