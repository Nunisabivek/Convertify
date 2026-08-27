import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import MobileToolFrame from '@/components/mobile/MobileToolFrame'
import RemoveBackgroundClient from './client'
import type { Metadata } from 'next'
import { BreadcrumbSchema } from '@/components/seo/breadcrumb-schema'
import { SoftwareApplicationSchema } from '@/components/seo/software-schema'
import { RelatedTools } from '@/components/seo/related-tools'
import { RelatedFormTools } from '@/components/seo/related-form-tools'
import { RelatedBlogPosts } from '@/components/seo/related-blog-posts'
import { FAQSchema } from '@/components/seo/faq-schema'
import { HowToSchema } from '@/components/seo/howto-schema'
import { AnswerBlock } from '@/components/seo/answer-block'
import { uniqueToolSeo } from '@/lib/unique-tools-seo'
import { allIndexableBlogPosts } from '@/lib/blog-data'
import { getBlogPostsForTool } from '@/lib/tool-blog-mapping'

const title = 'Remove Photo Background for Passport & ID — Free'
const description =
    'Replace a plain backdrop with white for passport, KYC, and LinkedIn headshots. Light blue optional. Runs in your browser — the photo never leaves your device.'
const seo = uniqueToolSeo['remove-background']

export const metadata: Metadata = {
    title,
    description,
    keywords: [
        'remove background passport photo',
        'white background for kyc photo',
        'linkedin photo white background',
        'id headshot white background',
        'replace photo background',
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

    const relatedBlogSlugs = getBlogPostsForTool('remove-background')
    const relatedBlogs = allIndexableBlogPosts.filter((post) => relatedBlogSlugs.includes(post.slug))

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
                        White background for passport, KYC, and ID headshots
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Built for a photo already taken against a reasonably even wall.
                        Fill white (usual for passport, KYC, LinkedIn) or light blue. The file
                        never leaves this device.
                    </p>
                </div>
                <AnswerBlock
                    question="How do I get a white background on a passport or LinkedIn photo without uploading it?"
                    answer="Use this page on a photo shot against a plain wall. Convertify fills that backdrop with solid white (or light blue) in your browser. Then crop to US 2×2 or 630×810 on Passport photo, or hit a KB band on Fit to size."
                />
                <RemoveBackgroundClient />
            </section>

            <section className="w-full max-w-3xl mx-auto px-4 py-10 text-slate-700 leading-relaxed space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">What it does — and what it does not</h2>
                <p>
                    This tool samples a plain backdrop and fills it with solid white or a light
                    blue. It is meant for KYC, passport, and LinkedIn-style ID headshots, not
                    for cutting hair-accurate subjects out of a crowded street. JPEG output is
                    what those portals expect; PNG transparency would fail a white-background
                    rule and a small KB cap.
                </p>
                <p>
                    After the background is filled, pair it with{' '}
                    <a className="text-indigo-600 hover:underline" href="/passport-photo">
                        Passport photo
                    </a>{' '}
                    to crop to US 2×2 (600×600), India 630×810, or visa 35×45, or{' '}
                    <a className="text-indigo-600 hover:underline" href="/fit-to-size">
                        Fit to size
                    </a>{' '}
                    if the portal only cares about kilobytes.
                </p>
            </section>

            <HowToSchema
                toolName="Replace a Photo Background"
                description="Fill a plain photo backdrop with white or light blue for passport, KYC, and LinkedIn uploads. Runs in your browser."
                steps={[...seo.howToSteps]}
            />
            <FAQSchema toolName="Photo Background Replacer" faqs={[...seo.faqs]} />
            <RelatedBlogPosts
                toolSlug="remove-background"
                posts={relatedBlogs}
                title="Passport photo size guides"
            />
            <RelatedFormTools currentHref="/remove-background" />
            <RelatedTools currentTool="/remove-background" />
        </div>
    )
}
