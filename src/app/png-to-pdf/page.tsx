import { Metadata } from "next"
import Link from "next/link"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import PngToPdfClient from "./client"
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import MobileToolFrame from "@/components/mobile/MobileToolFrame"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedUseCases } from "@/components/seo/related-use-cases"
import { RelatedBlogPosts } from "@/components/seo/related-blog-posts"
import { getBlogPostsForTool } from "@/lib/tool-blog-mapping"
import { allIndexableBlogPosts } from "@/lib/blog-data"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { ToolDeepGuide } from "@/components/seo/tool-deep-guide"
import { AnswerBlock } from "@/components/seo/answer-block"
import { PostActionAd } from "@/components/ads/post-action-ad"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["png-to-pdf"]
const contentData = toolContentData["png-to-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/png-to-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "https://convertify.work/png-to-pdf",
        siteName: "Convertify",
        type: "website",
        images: [{ url: "https://convertify.work/images/og-banner.png", width: 1200, height: 630, alt: "PNG to PDF Converter — Combine Multiple, No Upload" }],
    },
    twitter: {
        card: "summary_large_image",
        title: seoData.title,
        description: seoData.description,
        images: ["https://convertify.work/images/og-banner.png"],
    },
}

export default function Page() {
    if (IS_MOBILE_BUILD) return <MobileToolFrame toolId="png-to-pdf"><PngToPdfClient /></MobileToolFrame>

    const relatedBlogSlugs = getBlogPostsForTool('png-to-pdf')
    const relatedBlogs = allIndexableBlogPosts.filter(post => relatedBlogSlugs.includes(post.slug))

    return (
        <div className="flex flex-col items-center">
            
            {/* Structured Data Schemas */}
            <BreadcrumbSchema 
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "Png To Pdf", url: "/png-to-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="PNG to PDF Converter"
                toolSlug="png-to-pdf"
                description={seoData.description}
            />
            
<section className="w-full py-8 bg-gradient-to-b from-emerald-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Drop PNG images, drag to reorder, get one PDF. No watermark, nothing uploaded. Works on Windows, Mac, iPhone and Android. For camera photos use{" "}
                        <Link href="/jpg-to-pdf" className="text-indigo-600 hover:underline font-medium">JPG to PDF</Link>
                        ; to extract PDF pages as images use{" "}
                        <Link href="/pdf-to-jpg" className="text-indigo-600 hover:underline font-medium">PDF to JPG</Link>.
                    </p>
                </div>
                <AnswerBlock
                    question="How do I combine multiple PNG files into one PDF?"
                    answer="Drop all your PNG images into the combiner, drag the thumbnails to set the page order, then click Convert. You get a single multi-page PDF in seconds — free, no watermark, no sign-up, and the files stay on your device."
                />
                <ToolSwapper />
                <PngToPdfClient />
            </section>

            {/* Post-action ad — shown between tool and SEO content */}
            <PostActionAd />

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="PNG to PDF Converter"
                toolSlug="png-to-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <ToolDeepGuide toolSlug="png-to-pdf" toolName="PNG to PDF Converter" />

            <HowToSchema
                toolName="Convert PNG to PDF"
                description="Learn how to convert PNG images to PDF documents using Convertify's free online PNG to PDF converter."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="PNG to PDF Conversion"
                faqs={seoData.faqs}
            />

            <RelatedUseCases toolHref="/png-to-pdf" />

            <RelatedBlogPosts
                toolSlug="png-to-pdf"
                posts={relatedBlogs}
                title="📚 Guides: Combining PNG Images into PDF"
            />

            <RelatedTools currentTool="/png-to-pdf" />
        </div>
    )
}
