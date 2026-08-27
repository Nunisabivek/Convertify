import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import MobileToolFrame from '@/components/mobile/MobileToolFrame'
import FitToSizeClient from './client'
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

const title = 'Fit Photo or PDF to 20–50KB or Any Exact Size'
const description =
    'Land a photo or PDF between a min and max size: 20–50 KB, 50–200 KB, 100–200 KB, or 1–2 MB for job, visa, and university uploads. Runs in your browser.'
const seo = uniqueToolSeo['fit-to-size']

export const metadata: Metadata = {
    title,
    description,
    keywords: [
        'fit pdf to size',
        'compress pdf to kb range',
        'fit image to 200kb',
        'compress photo to 50kb',
        '20-50 kb photo',
        '100-200 kb pdf',
        'upsc photo size kb',
        'epfo document 50kb',
        'kyc file size limit',
        'job portal file size',
        'university application pdf size',
        'visa document kb limit',
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

    const relatedBlogSlugs = getBlogPostsForTool('fit-to-size')
    const relatedBlogs = allIndexableBlogPosts.filter((post) => relatedBlogSlugs.includes(post.slug))

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
                        Fit a photo or PDF to an exact KB or MB cap
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Portals reject files that are too large <em>or</em> too small.
                        Set a minimum and a maximum; Convertify compresses until the file
                        lands inside that window. Nothing is uploaded.
                    </p>
                </div>
                <AnswerBlock
                    question="How do I make a photo or PDF land between 20–50 KB or 100–200 KB?"
                    answer="Use Fit to size, not a one-way compressor. Pick 20–50 KB, 50–200 KB, or 100–200 KB — or type any window, including 1–2 MB for job and university uploads. The file stays on your device."
                />
                <FitToSizeClient />
            </section>

            <section className="w-full max-w-3xl mx-auto px-4 py-10 text-slate-700 leading-relaxed space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">When a compressor overshoots the floor</h2>
                <p>
                    Government and bank forms (UPSC, EPFO, passport seva, KYC) often publish a
                    band such as 20–50 KB or 100–200 KB. Job portals, visa sites, and university
                    apps in the US, UK, Canada, and Australia usually name a ceiling instead —
                    500 KB, 1 MB, 2 MB. A tool that only shrinks can leave you under the minimum
                    or still over the maximum. This page keeps both ends.
                </p>
                <p>
                    Photo presets cover 10–20, 20–50, 20–100, 20–200, 20–300, 50–200, and
                    100–200 KB. Larger chips cover 0.5–1 MB, 1–2 MB, and 2–5 MB. PDFs and
                    photos (JPG, PNG, WebP) both work. Photos download as JPEG because that is
                    the format that can actually hit a 20–50 KB band.
                </p>
                <p>
                    Need a hard ceiling only — 100 KB for a form, or under 10 MB for email?
                    Use{' '}
                    <a className="text-indigo-600 hover:underline" href="/compress-pdf">
                        Compress PDF
                    </a>
                    . Need US 2×2 or 630×810 pixels as well as kilobytes? Crop on{' '}
                    <a className="text-indigo-600 hover:underline" href="/passport-photo">
                        Passport photo
                    </a>
                    {' '}first.
                </p>
            </section>

            <HowToSchema
                toolName="Fit a File to an Exact Size Range"
                description="Make a photo or PDF land between a minimum and maximum file size for form uploads, job portals, and visa sites."
                steps={[...seo.howToSteps]}
            />
            <FAQSchema toolName="Fit to Size" faqs={[...seo.faqs]} />
            <RelatedBlogPosts
                toolSlug="fit-to-size"
                posts={relatedBlogs}
                title="Guides for exact size uploads"
            />
            <RelatedFormTools currentHref="/fit-to-size" />
            <RelatedTools currentTool="/fit-to-size" />
        </div>
    )
}
