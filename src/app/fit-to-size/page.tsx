import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import MobileToolFrame from '@/components/mobile/MobileToolFrame'
import FitToSizeClient from './client'
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

const seoData = toolSeoData['fit-to-size']
const contentData = toolContentData['fit-to-size']

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    robots: { index: true, follow: true },
    alternates: {
        canonical: 'https://convertify.work/fit-to-size',
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: 'https://convertify.work/fit-to-size',
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
            <MobileToolFrame toolId="fit-to-size">
                <FitToSizeClient />
            </MobileToolFrame>
        )
    }

    const relatedBlogSlugs = getBlogPostsForTool('fit-to-size')
    const relatedBlogs = allIndexableBlogPosts.filter(post => relatedBlogSlugs.includes(post.slug))

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
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Land a photo or PDF between a <b>min and max KB</b> — 20–50, 50–200, 100–200 —
                        so UPSC, EPFO and bank KYC stop rejecting “too small” as well as “too large”.
                    </p>
                </div>
                <AnswerBlock
                    question="How do I compress a photo or PDF to 20–50 KB or 50–200 KB?"
                    answer="Open Fit to size, upload the file, tap the range the form prints (20–50, 50–200, 100–200 KB, or type your own), and download. The file stays in your browser. For a JPEG that also needs exact pixels, use the passport photo maker."
                />
                <div className="container mx-auto max-w-2xl px-4 pb-8">
                    <FitToSizeClient />
                </div>
            </section>

            <PostActionAd />

            <section className="w-full max-w-4xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Why a range, not “make it smaller”</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                    A compressor that only has a maximum will happily give you an 8 KB signature. Several India forms then bounce it: “file too small.” Fit to size keeps quality high enough to stay above the floor, then tightens until it is under the ceiling. That is the difference from{' '}
                    <Link href="/compress-pdf" className="text-indigo-600 font-medium hover:underline">Compress PDF</Link>,
                    which aims at or below a single target.
                </p>
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white mb-4">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left text-slate-700">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Range on the chip row</th>
                                <th className="px-4 py-3 font-semibold">Where it shows up</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            <tr>
                                <td className="px-4 py-3">10–20 KB</td>
                                <td className="px-4 py-3">Signature / thumb impression on many job forms</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">20–50 KB</td>
                                <td className="px-4 py-3">Bank KYC photo; some EPFO photo fields</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">20–300 KB</td>
                                <td className="px-4 py-3">UPSC photograph (also crop to 413×531)</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">50–200 or 100–200 KB</td>
                                <td className="px-4 py-3">EPFO and other document/photo hybrid fields</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-slate-700 leading-relaxed">
                    If the form also names pixels — Passport Seva 630×810, UPSC 3.5×4.5 cm, bank 200×230 — crop with the{' '}
                    <Link href="/passport-photo" className="text-indigo-600 font-medium hover:underline">passport photo maker</Link>
                    {' '}instead. If the reject reason is a cream wall behind your head,{' '}
                    <Link href="/remove-background" className="text-indigo-600 font-medium hover:underline">remove the background</Link>
                    {' '}first. Always match the latest notification; chips here are the usual numbers, not a government spec sheet.
                </p>
            </section>

            <ToolSeoContent
                toolName="Fit to Size"
                toolSlug="fit-to-size"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <HowToSchema
                toolName="Fit a photo or PDF to a KB range"
                description="Make a file land between a minimum and maximum KB for India form uploads."
                steps={seoData.howToSteps}
            />

            <FAQSchema toolName="fitting a file to a KB range" faqs={seoData.faqs} />

            <KycRelatedTools currentHref="/fit-to-size" />

            <RelatedBlogPosts
                toolSlug="fit-to-size"
                posts={relatedBlogs}
                title="Related size guides"
            />

            <RelatedTools currentTool="/fit-to-size" />
        </div>
    )
}
