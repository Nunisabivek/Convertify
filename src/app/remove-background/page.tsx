import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import MobileToolFrame from '@/components/mobile/MobileToolFrame'
import RemoveBackgroundClient from './client'
import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo/breadcrumb-schema'
import { SoftwareApplicationSchema } from '@/components/seo/software-schema'
import { RelatedTools } from '@/components/seo/related-tools'

const title = 'Replace Photo Background — White or Light Blue, Free'
const description =
    'Swap a plain photo backdrop for white or light blue for KYC and passport uploads. Runs in your browser — files never leave your device.'

export const metadata: Metadata = {
    title,
    description,
    keywords: [
        'replace photo background',
        'white background for kyc photo',
        'light blue passport background',
        'plain backdrop to white',
        'kyc photo white background',
        'change photo background in browser',
    ],
    robots: { index: true, follow: true },
    alternates: {
        canonical: 'https://convertify.work/remove-background',
    },
    openGraph: {
        title,
        description,
        url: 'https://convertify.work/remove-background',
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
            <MobileToolFrame toolId="remove-background">
                <RemoveBackgroundClient />
            </MobileToolFrame>
        )
    }

    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: '/' },
                    { name: 'All Tools', url: '/all-tools' },
                    { name: 'Background', url: '/remove-background' },
                ]}
            />
            <SoftwareApplicationSchema
                toolName="Photo Background Replacer"
                toolSlug="remove-background"
                description={description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        Replace a plain backdrop with white or light blue
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Built for KYC and passport uploads that reject busy walls. The live URL
                        is <strong>/remove-background</strong> — /background-remove does not exist.
                    </p>
                </div>
                <RemoveBackgroundClient />
            </section>

            <section className="w-full max-w-3xl mx-auto px-4 py-10 text-slate-700 leading-relaxed space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">What it does — and what it does not</h2>
                <p>
                    This tool samples a plain backdrop and fills it with solid white or a light
                    blue. It is meant for a photo already taken against a reasonably even wall,
                    not for cutting hair-accurate subjects out of a crowded street like a
                    dedicated studio editor.
                </p>
                <p>
                    After the background is filled, pair it with{' '}
                    <a className="text-indigo-600 hover:underline" href="/passport-photo">
                        Passport photo
                    </a>{' '}
                    to crop to 630×810, or{' '}
                    <a className="text-indigo-600 hover:underline" href="/fit-to-size">
                        Fit to size
                    </a>{' '}
                    if the portal only cares about kilobytes. Files stay on your device.
                </p>
            </section>

            <RelatedTools currentTool="/remove-background" />
        </div>
    )
}
