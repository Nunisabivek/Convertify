import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import MobileToolFrame from '@/components/mobile/MobileToolFrame'
import FitToSizeClient from './client'
import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo/breadcrumb-schema'
import { SoftwareApplicationSchema } from '@/components/seo/software-schema'
import { RelatedTools } from '@/components/seo/related-tools'

const title = 'Fit PDF or Photo to a KB Range — Free, No Upload'
const description =
    'Land a PDF or photo between a min and max file size for UPSC, EPFO, and KYC form uploads. Presets for 10–20KB through 100–200KB. Runs in your browser.'

export const metadata: Metadata = {
    title,
    description,
    keywords: [
        'fit pdf to size',
        'compress pdf to kb range',
        'upsc photo size kb',
        'epfo document 50kb',
        'kyc file size limit',
        'fit image to 200kb',
        'reduce pdf between min and max kb',
    ],
    robots: { index: true, follow: true },
    alternates: {
        canonical: 'https://convertify.work/fit-to-size',
    },
    openGraph: {
        title,
        description,
        url: 'https://convertify.work/fit-to-size',
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
            <MobileToolFrame toolId="fit-to-size">
                <FitToSizeClient />
            </MobileToolFrame>
        )
    }

    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: '/' },
                    { name: 'All Tools', url: '/all-tools' },
                    { name: 'Fit to size', url: '/fit-to-size' },
                ]}
            />
            <SoftwareApplicationSchema
                toolName="Fit to Size"
                toolSlug="fit-to-size"
                description={description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        Fit a PDF or photo to an exact KB range
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Form portals often reject files that are too large <em>or</em> too small.
                        Pick a minimum and maximum in KB; Convertify compresses until the file
                        lands inside that window. Nothing is uploaded.
                    </p>
                </div>
                <FitToSizeClient />
            </section>

            <section className="w-full max-w-3xl mx-auto px-4 py-10 text-slate-700 leading-relaxed space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">What this tool is for</h2>
                <p>
                    Government and bank forms (UPSC, EPFO, passport seva, KYC) publish a size
                    band such as 20–50 KB or 100–200 KB. A normal compressor aims at one target
                    and can overshoot the floor. Fit to size keeps iterating until the output is
                    at least the minimum and at most the maximum.
                </p>
                <p>
                    Presets cover 10–20, 20–50, 20–100, 20–200, 20–300, 50–200, and 100–200 KB.
                    PDFs and photos (JPG, PNG, WebP) both work. Processing stays on your device.
                </p>
            </section>

            <RelatedTools currentTool="/fit-to-size" />
        </div>
    )
}
