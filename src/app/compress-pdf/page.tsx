
import { Metadata } from "next"
import CompressPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedUseCases } from "@/components/seo/related-use-cases"
import { RelatedBlogPosts } from "@/components/seo/related-blog-posts"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { ToolDeepGuide } from "@/components/seo/tool-deep-guide"
import { AnswerBlock } from "@/components/seo/answer-block"
import { PostActionAd } from "@/components/ads/post-action-ad"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"
import { blogPosts } from "@/lib/blog-data"
import { getBlogPostsForTool } from "@/lib/tool-blog-mapping"

const seoData = toolSeoData["compress-pdf"]
const contentData = toolContentData["compress-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/compress-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "https://convertify.work/compress-pdf",
        siteName: "Convertify",
        type: "website",
        images: [
            {
                url: "https://convertify.work/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: "Compress PDF Free — Reduce to 100KB/200KB Online | Convertify",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: seoData.title,
        description: seoData.description,
        images: ["https://convertify.work/images/og-banner.png"],
    },
}

export default function Page() {
    const relatedBlogSlugs = getBlogPostsForTool('compress-pdf')
    const relatedBlogs = blogPosts.filter(post => relatedBlogSlugs.includes(post.slug))

    return (
        <div className="flex flex-col items-center">

            {/* Structured Data Schemas */}
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "Compress PDF", url: "/compress-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="Convertify PDF Compressor"
                toolSlug="compress-pdf"
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        The Convertify PDF compressor reduces file size by up to <b>90%</b>. Compress large files to under <b>100KB, 200KB or 1MB</b> for email attachments, government forms, and visa applications — free, no download needed.
                    </p>
                </div>
                <AnswerBlock
                    question="How do I compress a PDF to exactly 100KB or 200KB for free?"
                    answer="Open Convertify's PDF Compressor, upload your PDF, select your target size (100KB, 200KB, 500KB, or custom). The tool uses iterative multi-pass compression to hit your exact target — no guessing, no 'try again'. Free, no watermark, no sign-up, and your file never leaves your browser."
                />
                <CompressPdfClient />
            </section>

            {/* Post-action ad — shown between tool and SEO content */}
            <PostActionAd />

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="Convertify PDF Compressor"
                toolSlug="compress-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <ToolDeepGuide toolSlug="compress-pdf" toolName="PDF Compressor" />

            <HowToSchema
                toolName="Compress PDF Files with Convertify"
                description="Learn how to reduce PDF file size for email attachments using Convertify's free online PDF compressor. No download or sign-up required."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="Convertify PDF Compressor"
                faqs={seoData.faqs}
            />

            <RelatedUseCases toolHref="/compress-pdf" />

            <RelatedBlogPosts
                toolSlug="compress-pdf"
                posts={relatedBlogs}
                title="📚 Guides: How to Compress PDFs"
            />

            <RelatedTools currentTool="/compress-pdf" />
        </div>
    )
}
