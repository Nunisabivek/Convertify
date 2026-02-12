import { Metadata } from 'next';
import Script from 'next/script';
import WebHomePage from '@/components/home/WebHomePage';
import { MobileHomePage } from '@/components/mobile';

// Generate metadata for homepage
export const metadata: Metadata = {
  title: 'Convertify: All-in-One File Converter | Free Online PDF Tools - No Download, No Pricing',
  description: 'Convertify (Convertifyy / Convertfy) is the #1 free online file converter and PDF tool suite. Merge, compress, convert PDF to Word, PDF to images — no sign-up, no pricing, no download required. Use ConvertifyTool from any device.',
  keywords: ['convertify', 'convertifyy', 'convertfy', 'convertify free', 'convertifytool', 'convertify download', 'convertify pricing', 'convertify: all-in-one file converter', 'free pdf tools', 'online pdf converter', 'merge pdf free', 'compress pdf online', 'pdf to images converter online', 'convertify pdf to word', 'convertifyy pdf'],
  alternates: {
    canonical: 'https://convertify.work',
  },
  openGraph: {
    title: 'Convertify (Convertifyy) - All-in-One Free File Converter & PDF Tools (No Download)',
    description: 'Convertify (Convertifyy / Convertfy) is the free online PDF tool suite — merge, compress, convert PDFs to Word & images. No watermarks, no pricing, no sign-up. Official ConvertifyTool for mobile and desktop.',
    url: 'https://convertify.work',
    siteName: 'Convertify',
    images: [
      {
        url: 'https://convertify.work/images/og-banner.png',
        width: 1200,
        height: 630,
        alt: 'Convertify - Free Online PDF Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
};

// SoftwareApplication Schema for homepage
const softwareSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Convertify',
  applicationCategory: 'WebApplication',
  operatingSystem: 'Any',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '15420',
  },
  description: 'Convertify (also known as Convertifyy, Convertfy, or ConvertifyTool) offers free online PDF tools — merge, convert, compress, split, and edit PDFs. PDF to images converter online, PDF to Word, and 30+ tools with no download required. No pricing or hidden fees. Works entirely in your browser.',
  url: 'https://convertify.work',
  image: 'https://convertify.work/images/og-banner.png',
  featureList: [
    'Merge PDF files',
    'Split PDF pages',
    'Compress PDF size',
    'Convert JPG to PDF',
    'Convert PDF to JPG',
    'Convert Word to PDF',
    'Convert PDF to Word',
    'Edit PDF documents',
    'Protect PDF with password',
    'Unlock PDF files',
  ],
  softwareVersion: '1.0',
  author: {
    '@type': 'Organization',
    name: 'Convertify',
    url: 'https://convertify.work',
  },
};

export default function Home() {
  return (
    <>
      <Script
        id="software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <WebHomePage />
    </>
  );
}
