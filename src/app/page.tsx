import { Metadata } from 'next';
import Script from 'next/script';
import WebHomePage from '@/components/home/WebHomePage';
import { MobileHomePage } from '@/components/mobile';

// Generate metadata for homepage
export const metadata: Metadata = {
  title: 'Convertify - Free Online PDF Tools | Merge, Compress, Convert',
  description: 'Free online PDF tool suite — merge, compress, convert PDF to Word, images and more. No sign-up, no watermarks, no file limits. Works entirely in your browser.',
  keywords: ['convertify', 'convertifyy', 'convertfy', 'convertifytool', 'free pdf tools', 'online pdf converter', 'merge pdf free', 'compress pdf online', 'pdf to word converter', 'pdf to jpg', 'word to pdf', 'compress pdf 100kb', 'split pdf online', 'pdf editor free'],
  alternates: {
    canonical: 'https://convertify.work',
  },
  openGraph: {
    title: 'Convertify - Free Online PDF & File Converter Tools',
    description: 'Merge, compress, convert PDFs to Word & images — free, no watermarks, no sign-up. Works entirely in your browser with no file uploads to servers.',
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
  description: 'Convertify offers free online PDF tools — merge, convert, compress, split, and edit PDFs. Convert PDF to images, PDF to Word, and 30+ tools. No download required, no hidden fees. Works entirely in your browser.',
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
