import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import MobileToolFrame from '@/components/mobile/MobileToolFrame'
import PassportPhotoClient from './client'
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

const seoData = toolSeoData['passport-photo']
const contentData = toolContentData['passport-photo']

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    robots: { index: true, follow: true },
    alternates: {
        canonical: 'https://convertify.work/passport-photo',
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: 'https://convertify.work/passport-photo',
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
            <MobileToolFrame toolId="passport-photo">
                <PassportPhotoClient />
            </MobileToolFrame>
        )
    }

    const relatedBlogSlugs = getBlogPostsForTool('passport-photo')
    const relatedBlogs = allIndexableBlogPosts.filter(post => relatedBlogSlugs.includes(post.slug))

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
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-sky-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Crop a phone photo to the pixels and KB a form prints: Passport Seva <b>630×810</b>,
                        UPSC <b>3.5×4.5 cm / 413×531</b>, bank <b>200×230</b>, signature <b>140×60</b>.
                        White background. JPEG. On your device.
                    </p>
                </div>
                <AnswerBlock
                    question="What size is a Passport Seva photo, and can I also make a UPSC or bank photo?"
                    answer="The Passport preset is 630×810 pixels, 10–250 KB, white JPEG. UPSC is 413×531 (3.5×4.5 cm at 300 DPI), 20–300 KB. Bank photo is 200×230, 20–50 KB. Signature is 140×60, 10–20 KB. Pick the chip, crop, download. This is not an official MEA check."
                />
                <div className="container mx-auto max-w-2xl px-4 pb-8">
                    <PassportPhotoClient />
                </div>
            </section>

            <PostActionAd />

            <section className="w-full max-w-4xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Pixel and KB numbers this page actually hits</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                    Forms reject photos for four separate reasons and usually name only one: too many kilobytes, too few kilobytes, the wrong pixel box, or a background that is not white. This maker does crop + resize + KB in one pass. It does not judge expression, glasses or head covering — and it is not Passport Seva or UPSC.
                </p>
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white mb-4">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left text-slate-700">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Preset</th>
                                <th className="px-4 py-3 font-semibold">Pixels</th>
                                <th className="px-4 py-3 font-semibold">KB</th>
                                <th className="px-4 py-3 font-semibold">Notes</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            <tr>
                                <td className="px-4 py-3 font-medium">Passport</td>
                                <td className="px-4 py-3">630×810</td>
                                <td className="px-4 py-3">10–250 KB</td>
                                <td className="px-4 py-3">White JPEG for Passport Seva digital upload</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium">UPSC photo</td>
                                <td className="px-4 py-3">413×531 (3.5×4.5 cm @ 300 DPI)</td>
                                <td className="px-4 py-3">20–300 KB</td>
                                <td className="px-4 py-3">Confirm the year’s notification. <Link href="/blog/upsc-photo-size-2026" className="text-indigo-600 hover:underline">UPSC photo size 2026 guide</Link></td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium">Bank photo</td>
                                <td className="px-4 py-3">200×230</td>
                                <td className="px-4 py-3">20–50 KB</td>
                                <td className="px-4 py-3">Common SBI / IBPS / KYC box</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium">Signature</td>
                                <td className="px-4 py-3">140×60</td>
                                <td className="px-4 py-3">10–20 KB</td>
                                <td className="px-4 py-3">Wide crop; JPEG, not PNG</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3 font-medium">Thumb</td>
                                <td className="px-4 py-3">160×200</td>
                                <td className="px-4 py-3">10–20 KB</td>
                                <td className="px-4 py-3">Where the form asks for an impression scan</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-slate-700 leading-relaxed mb-3">
                    Output is always JPEG. PNG sources are fine to upload; the download is <code className="text-sm bg-slate-100 px-1 rounded">.jpg</code> because that is what the portals accept. If the file also needs a min–max KB but not a pixel box, use{' '}
                    <Link href="/fit-to-size" className="text-indigo-600 font-medium hover:underline">Fit to size</Link>.
                    A supporting PDF (marksheet, ID) belongs on{' '}
                    <Link href="/compress-pdf" className="text-indigo-600 font-medium hover:underline">Compress PDF</Link>.
                    A cream wall: {' '}
                    <Link href="/remove-background" className="text-indigo-600 font-medium hover:underline">remove background</Link>
                    {' '}then come back here to crop.
                </p>
            </section>

            <ToolSeoContent
                toolName="Passport Photo Maker"
                toolSlug="passport-photo"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <HowToSchema
                toolName="Make a 630×810 or UPSC 413×531 JPEG"
                description="Crop a photo to Passport Seva, UPSC, bank or signature size and land it in the KB band."
                steps={seoData.howToSteps}
            />

            <FAQSchema toolName="passport, UPSC, bank and signature photos" faqs={seoData.faqs} />

            <KycRelatedTools currentHref="/passport-photo" />

            <RelatedBlogPosts
                toolSlug="passport-photo"
                posts={relatedBlogs}
                title="Photo size guides"
            />

            <RelatedTools currentTool="/passport-photo" />
        </div>
    )
}
