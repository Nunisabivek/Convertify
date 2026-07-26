import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import TextToPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedBlogPosts } from "@/components/seo/related-blog-posts"
import { getBlogPostsForTool } from "@/lib/tool-blog-mapping"
import { allIndexableBlogPosts } from "@/lib/blog-data"
import { RelatedUseCases } from "@/components/seo/related-use-cases"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { ToolDeepGuide } from "@/components/seo/tool-deep-guide"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["text-to-pdf"]
const contentData = toolContentData["text-to-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/text-to-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/text-to-pdf",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "Text to PDF - Convertify" }],
    },
}

export default function Page() {
    const relatedBlogSlugs = getBlogPostsForTool('text-to-pdf')
    const relatedBlogs = allIndexableBlogPosts.filter(post => relatedBlogSlugs.includes(post.slug))

    return (
        <div className="flex flex-col items-center">
            
            {/* Structured Data Schemas */}
            <BreadcrumbSchema 
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "Text To Pdf", url: "/text-to-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="Text to PDF Converter"
                toolSlug="text-to-pdf"
                description={seoData.description}
            />
            
<section className="w-full py-8 bg-gradient-to-b from-slate-100 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convert plain text files to PDF documents with customizable formatting.
                    </p>
                </div>
                <ToolSwapper />
                <TextToPdfClient />
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="Text to PDF Converter"
                toolSlug="text-to-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <ToolDeepGuide toolSlug="text-to-pdf" toolName="Text to PDF Converter" />

            <HowToSchema
                toolName="Convert Text to PDF"
                description="Learn how to convert TXT files to PDF documents using Convertify's free online text to PDF converter."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="Text to PDF Conversion"
                faqs={seoData.faqs}
            />

            <RelatedUseCases toolHref="/text-to-pdf" />

            <RelatedBlogPosts
                toolSlug="text-to-pdf"
                posts={relatedBlogs}
                title="📚 Guides & Tutorials"
            />

            <RelatedTools currentTool="/text-to-pdf" />
        </div>
    )
}
