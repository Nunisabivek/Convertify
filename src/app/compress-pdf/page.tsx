
import { Metadata } from "next"
import CompressPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedBlogPosts } from "@/components/seo/related-blog-posts"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
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
        url: "/compress-pdf",
        images: [
            {
                url: "/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: "Compress PDF Online Free - Convertify",
            },
        ],
    },
}

export default function Page() {
    const relatedBlogSlugs = getBlogPostsForTool('compress-pdf')
    const relatedBlogs = blogPosts.filter(post => relatedBlogSlugs.includes(post.slug))

    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Reduce PDF file size by up to 90% or compress to a specific size (100KB, 200KB, 500KB, 1MB). Perfect for email attachments.
                    </p>
                </div>
                <CompressPdfClient />
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="PDF Compressor"
                toolSlug="compress-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <HowToSchema
                toolName="Compress PDF Files"
                description="Learn how to reduce PDF file size for email attachments using Convertify's free online PDF compressor."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="Compressing PDFs"
                faqs={seoData.faqs}
            />

            <RelatedBlogPosts
                toolSlug="compress-pdf"
                posts={relatedBlogs}
                title="📚 Guides: How to Compress PDFs"
            />

            <RelatedTools currentTool="/compress-pdf" />
        </div>
    )
}
