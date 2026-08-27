import { IS_MOBILE_BUILD } from '@/lib/is-mobile-build'
import MobileToolFrame from '@/components/mobile/MobileToolFrame'
import PassportPhotoClient from './client'
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

const title = 'Passport Photo: US 2×2, 630×810 & Visa Sizes'
const description =
    'Make a US 2×2 inch (600×600), India 630×810, visa 35×45, UPSC, bank, or signature JPEG with a white background and the KB cap the form lists. No upload.'
const seo = uniqueToolSeo['passport-photo']

export const metadata: Metadata = {
    title,
    description,
    keywords: [
        'passport photo maker',
        'us passport photo 2x2',
        '600x600 passport photo',
        '630x810 passport photo',
        'icao photo size',
        'upsc photo 3.5x4.5 cm',
        'bank kyc photo 200x230',
        'signature scan 140x60',
        'schengen visa photo 35x45',
        'uk visa photo 600x750',
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

    const relatedBlogSlugs = getBlogPostsForTool('passport-photo')
    const relatedBlogs = allIndexableBlogPosts.filter((post) => relatedBlogSlugs.includes(post.slug))

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
                        Passport photo sized for US 2×2, India 630×810, and visa forms
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Crop to the pixels the portal asks for, fill a white background, and
                        land inside the KB cap. Output is a JPEG on your device — not an official
                        pose check.
                    </p>
                </div>
                <AnswerBlock
                    question="What size is a US 2×2 passport photo versus India 630×810?"
                    answer="US digital passport photos are a 2-inch square, usually 600×600 pixels. India digital uploads are commonly 630×810, 10–250 KB, white background. This page has both presets, plus visa 35×45 (600×750), UPSC 3.5×4.5 cm, bank 200×230, and signature 140×60."
                />
                <PassportPhotoClient />
            </section>

            <section className="w-full max-w-3xl mx-auto px-4 py-10 text-slate-700 leading-relaxed space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Presets this tool actually outputs</h2>
                <ul className="list-disc pl-6 space-y-2">
                    <li>
                        <strong>US 2×2</strong> — 600×600 JPEG, about 50–240 KB, white background.
                        That is the usual digital size for a 2-inch square at 300 DPI (DS-160 / many
                        USCIS photo uploads).
                    </li>
                    <li>
                        <strong>India 630×810</strong> — JPEG, 10–250 KB, white background
                        (Passport Seva / ICAO-style digital upload).
                    </li>
                    <li>
                        <strong>Visa 35×45</strong> — 600×750 JPEG, 50–240 KB. Common digital size
                        for a 35×45 mm Schengen / UK-style visa frame. UK online <em>passport</em> photos
                        want cream or light grey, not pure white — retake against a cream wall if
                        that portal rejects white.
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
                    Wrong pixels almost always mean the crop was the wrong shape, not that the
                    file needed more compression. JPEG is required: PNG files blow past a 20–50 KB
                    or 10–250 KB cap. If the wall behind you is busy, run{' '}
                    <a className="text-indigo-600 hover:underline" href="/remove-background">
                        Remove background
                    </a>
                    {' '}first. If the form only cares about kilobytes, use{' '}
                    <a className="text-indigo-600 hover:underline" href="/fit-to-size">
                        Fit to size
                    </a>
                    .
                </p>
            </section>

            <HowToSchema
                toolName="Make a Passport or Visa Photo"
                description="Crop a photo to US 2×2, India 630×810, or visa 35×45 and download a JPEG that fits the form’s KB cap."
                steps={[...seo.howToSteps]}
            />
            <FAQSchema toolName="Passport Photo Maker" faqs={[...seo.faqs]} />
            <RelatedBlogPosts
                toolSlug="passport-photo"
                posts={relatedBlogs}
                title="Passport photo size guides"
            />
            <RelatedFormTools currentHref="/passport-photo" />
            <RelatedTools currentTool="/passport-photo" />
        </div>
    )
}
