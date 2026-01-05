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
    default: "Convertify - Free Online PDF Tools",
    template: "%s | Convertify",
  },
  description: "Merge, Split, Compress, and Convert PDFs easily. Free, secure, and no installation required.",
  applicationName: "Convertify",
  authors: [{ name: "Convertify Team" }],
  keywords: ["pdf tools", "merge pdf", "split pdf", "compress pdf", "convert pdf", "pdf converter", "free pdf tools"],
  icons: {
    icon: '/images/Convertify.png',
    apple: '/images/Convertify.png',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://convertify.vercel.app",
    siteName: "Convertify",
    title: "Convertify - Free Online PDF Tools",
    description: "The best free online PDF tools to manage your documents. Merge, split, compress, and convert PDFs instantly.",
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
  metadataBase: new URL("https://convertify.vercel.app"),
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
        <main className="flex-1">
          {children}
        </main>
        <AdBanner />
        <Footer />
        <JsonLd />
      </body>
    </html>
  );
}
