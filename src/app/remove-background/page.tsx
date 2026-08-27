import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import MobileToolFrame from '@/components/mobile/MobileToolFrame'
import RemoveBackgroundClient from './client'
import type { Metadata } from 'next'
import Link from 'next/link'
import { FAQSchema } from '@/components/seo/faq-schema'
import { HowToSchema } from '@/components/seo/howto-schema'
import { BreadcrumbSchema } from '@/components/seo/breadcrumb-schema'
import { SoftwareApplicationSchema } from '@/components/seo/software-schema'
import { RelatedTools } from '@/components/seo/related-tools'
import { RelatedBlogPosts } from '@/components/seo/related-blog-posts'
import { ToolSeoContent } from '@/components/seo/tool-seo-content'
import { AnswerBlock } from '@/components/seo/answer-block'
import { KycRelatedTools } from '@/components/seo/kyc-related-tools'
import { PostActionAd } from '@/components/ads/post-action-ad'
import { toolContentData } from '@/lib/tool-content-data'
import { toolSeoData } from '@/lib/seo-data'
import { allIndexableBlogPosts } from '@/lib/blog-data'
import { getBlogPostsForTool } from '@/lib/tool-blog-mapping'

const seoData = toolSeoData['remove-background']
const contentData = toolContentData['remove-background']

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    robots: { index: true, follow: true },
    alternates: {
        canonical: 'https://convertify.work/remove-background',
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: 'https://convertify.work/remove-background',
        siteName: 'Convertify',
        type: 'website',
        images: [
            {
                url: 'https://convertify.work/images/og-banner.png',
                width: 1200,
                height: 630,
                alt: seoData.h1,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: seoData.title,
        description: seoData.description,
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
    const relatedBlogs = allIndexableBlogPosts.filter(post => relatedBlogSlugs.includes(post.slug))

    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema
                items={[
                    { name: 'Home', url: '/' },
                    { name: 'All Tools', url: '/all-tools' },
                    { name: 'Remove background', url: '/remove-background' },
                ]}
            />
            <SoftwareApplicationSchema
                toolName="KYC Background Remover"
                toolSlug="remove-background"
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-cyan-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Replace a plain wall with <b>white</b> (Passport Seva, UPSC, most KYC) or <b>light blue</b>.
                        Then crop to 630×810 or 413×531. The photo never uploads.
                    </p>
                </div>
                <AnswerBlock
                    question="How do I get a white background on a passport or KYC photo?"
                    answer="Upload the photo here, pick White, and download the JPEG. It works when you already stood against a simple backdrop. After that, open the passport photo maker to hit 630×810 (10–250 KB) or UPSC 413×531 (20–300 KB). Busy rooms and other people in frame will not cut cleanly."
                />
                <div className="container mx-auto max-w-2xl px-4 pb-8">
                    <RemoveBackgroundClient />
                </div>
            </section>

            <PostActionAd />

            <section className="w-full max-w-4xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Background is a reject reason of its own</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                    Passport Seva, UPSC and bank KYC all want a plain light backdrop. A correct 630×810 file still fails if the wall is a curtain, a kitchen, or a shadow. This page only swaps a simple backdrop for white or light blue. It is not a product-photo studio and it does not send the selfie to a cloud model.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-slate-700 mb-4">
                    <li>Stand a step away from a plain wall. Window light from the front beats overhead bulbs.</li>
                    <li>One person in the frame. Hats and glasses follow the form, not this tool.</li>
                    <li>Download is JPEG — the format the portal wants, not a transparent PNG.</li>
                    <li>
                        Next step: {' '}
                        <Link href="/passport-photo" className="text-indigo-600 font-medium hover:underline">passport photo maker</Link>
                        {' '}for 630×810, UPSC 413×531, bank 200×230 or signature 140×60.
                    </li>
                    <li>
                        Only a KB band, no crop? {' '}
                        <Link href="/fit-to-size" className="text-indigo-600 font-medium hover:underline">Fit to size</Link>.
                        A supporting PDF? {' '}
                        <Link href="/compress-pdf" className="text-indigo-600 font-medium hover:underline">Compress PDF</Link>.
                    </li>
                </ul>
                <p className="text-sm text-slate-500">
                    If the preview looks chewed around the hair, retake the photo. Fighting a patterned background costs more time than standing against a white wall for ten seconds.
                </p>
            </section>

            <ToolSeoContent
                toolName="KYC Background Remover"
                toolSlug="remove-background"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <HowToSchema
                toolName="Remove the background from a KYC photo"
                description="Replace a plain backdrop with white or light blue for passport and KYC uploads."
                steps={seoData.howToSteps}
            />

            <FAQSchema toolName="passport and KYC photo backgrounds" faqs={seoData.faqs} />

            <KycRelatedTools currentHref="/remove-background" />

            <RelatedBlogPosts
                toolSlug="remove-background"
                posts={relatedBlogs}
                title="Photo size guides"
            />

            <RelatedTools currentTool="/remove-background" />
        </div>
    )
}
