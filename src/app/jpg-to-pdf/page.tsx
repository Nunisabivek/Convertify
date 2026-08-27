
import { Metadata } from "next"
import Link from "next/link"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import JpgToPdfClient from "./client"
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import MobileToolFrame from "@/components/mobile/MobileToolFrame"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedBlogPosts } from "@/components/seo/related-blog-posts"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { ToolDeepGuide } from "@/components/seo/tool-deep-guide"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"
import { allIndexableBlogPosts } from "@/lib/blog-data"
import { getBlogPostsForTool } from "@/lib/tool-blog-mapping"

const seoData = toolSeoData["jpg-to-pdf"]
const contentData = toolContentData["jpg-to-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/jpg-to-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/jpg-to-pdf",
        images: [
            {
                url: "/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: "JPG to PDF — Combine Photos into One PDF, No Upload",
            },
        ],
    },
}

export default function Page() {
    if (IS_MOBILE_BUILD) return <MobileToolFrame toolId="jpg-to-pdf"><JpgToPdfClient /></MobileToolFrame>

    const relatedBlogSlugs = getBlogPostsForTool('jpg-to-pdf')
    const relatedBlogs = allIndexableBlogPosts.filter(post => relatedBlogSlugs.includes(post.slug))

    return (
        <div className="flex flex-col items-center">

            {/* Structured Data Schemas */}
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "Jpg To Pdf", url: "/jpg-to-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="JPG to PDF Converter"
                toolSlug="jpg-to-pdf"
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-purple-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Combine camera photos into one PDF. Drag to set the order. No watermark, nothing uploaded. Combining PNG screenshots? Use{" "}
                        <Link href="/png-to-pdf" className="text-indigo-600 hover:underline font-medium">PNG to PDF</Link> instead.
                    </p>
                </div>
                <ToolSwapper />
                <JpgToPdfClient />
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="JPG to PDF Converter"
                toolSlug="jpg-to-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            {/* Long-form guide */}
            <ToolDeepGuide toolSlug="jpg-to-pdf" toolName="JPG to PDF Converter" />

            <HowToSchema
                toolName="JPG to PDF Converter"
                description="Learn how to convert JPG images to PDF documents using Convertify's free online image to PDF converter."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="JPG to PDF Conversion"
                faqs={seoData.faqs}
            />

            <RelatedBlogPosts
                toolSlug="jpg-to-pdf"
                posts={relatedBlogs}
                title="📚 Guides: JPG to PDF"
            />

            <RelatedTools currentTool="/jpg-to-pdf" />
        </div>
    )
}
