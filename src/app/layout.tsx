import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AdBanner } from "@/components/ads/banner";
import { JsonLd } from "@/components/seo/json-ld";

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
    default: "Free Online PDF Tools - Merge, Compress, Convert PDF | Convertify",
    template: "%s | Convertify",
  },
  description: "Free online PDF tools to merge PDF files, compress PDF to smaller size, convert JPG to PDF, and more. No watermarks, no sign up, works on all devices. 100% secure.",
  applicationName: "Convertify",
  authors: [{ name: "Convertify Team" }],
  keywords: ["free pdf tools online", "merge pdf files free", "compress pdf to 100kb", "jpg to pdf converter", "pdf to jpg online", "split pdf pages", "combine pdf files no watermark", "reduce pdf size for email", "convert image to pdf free"],
  icons: {
    icon: '/images/Convertify.png',
    apple: '/images/Convertify.png',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://convertify.work",
    siteName: "Convertify",
    title: "Convertify - Free Online PDF Tools",
    description: "Free online PDF tools - merge PDF files, compress PDF size, convert images to PDF. No watermarks, no sign up required. Works on mobile and desktop.",
    images: [
      {
        url: "/images/og-banner.png",
        width: 1200,
        height: 630,
        alt: "Convertify - Free PDF Tools",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Convertify - Free Online PDF Tools",
    description: "Manage your PDF documents easily with our free online tools.",
    images: ["/images/og-banner.png"],
    creator: "@convertify",
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
