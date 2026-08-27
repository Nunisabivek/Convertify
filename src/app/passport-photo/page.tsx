import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import MobileToolFrame from '@/components/mobile/MobileToolFrame'
import PassportPhotoClient from './client'
import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo/breadcrumb-schema'
import { SoftwareApplicationSchema } from '@/components/seo/software-schema'
import { RelatedTools } from '@/components/seo/related-tools'

const title = 'Passport Photo Maker — 630×810 JPEG, White Background'
const description =
    'Crop a photo to 630×810 (ICAO), UPSC 3.5×4.5 cm, bank KYC, signature, or thumb size. White background JPEG sized to the form’s KB limit. No upload.'

export const metadata: Metadata = {
    title,
    description,
    keywords: [
        'passport photo maker',
        '630x810 passport photo',
        'icao photo size',
        'upsc photo 3.5x4.5 cm',
        'bank kyc photo 200x230',
        'signature scan 140x60',
        'white background passport jpeg',
    ],
    robots: { index: true, follow: true },
    alternates: {
        canonical: 'https://convertify.work/passport-photo',
    },
    openGraph: {
        title,
        description,
        url: 'https://convertify.work/passport-photo',
        siteName: 'Convertify',
        type: 'website',
        images: [
            {
                url: 'https://convertify.work/images/og-banner.png',
                width: 1200,
                height: 630,
                alt: title,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ['https://convertify.work/images/og-banner.png'],
    },
}

export default function Page() {
    if (IS_MOBILE_BUILD) {
        return (
            <MobileToolFrame toolId="passport-photo">
                <PassportPhotoClient />
            </MobileToolFrame>
        )
    }

    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: '/' },
                    { name: 'All Tools', url: '/all-tools' },
                    { name: 'Passport photo', url: '/passport-photo' },
                ]}
            />
            <SoftwareApplicationSchema
                toolName="Passport Photo Maker"
                toolSlug="passport-photo"
                description={description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        Passport and KYC photo, sized for the form
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Crop to the pixel size the portal asks for, fill a white background, and
                        land inside the KB cap. The live tool is{' '}
                        <strong>/passport-photo</strong> — there is no /passport URL.
                    </p>
                </div>
                <PassportPhotoClient />
            </section>

            <section className="w-full max-w-3xl mx-auto px-4 py-10 text-slate-700 leading-relaxed space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Presets this page actually ships</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>Passport</strong> — 630×810 JPEG, 10–250 KB, white background
                        (common digital passport / ICAO-style upload).
                    </li>
                    <li>
                        <strong>UPSC photo</strong> — 3.5×4.5 cm at 413×531, 20–300 KB.
                    </li>
                    <li>
                        <strong>Bank photo</strong> — 200×230, 20–50 KB.
                    </li>
                    <li>
                        <strong>Signature</strong> — 140×60, 10–20 KB.
                    </li>
                    <li>
                        <strong>Thumb impression</strong> — 160×200, 10–20 KB.
                    </li>
                </ul>
                <p>
                    The file never leaves your browser. For a form that only cares about file
                    size, not crop, use{' '}
                    <a className="text-indigo-600 hover:underline" href="/fit-to-size">
                        Fit to size
                    </a>
                    .
                </p>
            </section>

            <RelatedTools currentTool="/passport-photo" />
        </div>
    )
}
