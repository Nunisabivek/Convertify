import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import WordToPdfClient from "./client"
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import MobileToolFrame from "@/components/mobile/MobileToolFrame"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedUseCases } from "@/components/seo/related-use-cases"
import { RelatedBlogPosts } from "@/components/seo/related-blog-posts"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { ToolDeepGuide } from "@/components/seo/tool-deep-guide"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"
import { allIndexableBlogPosts } from "@/lib/blog-data"
import { getBlogPostsForTool } from "@/lib/tool-blog-mapping"

const seoData = toolSeoData["word-to-pdf"]
const contentData = toolContentData["word-to-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/word-to-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/word-to-pdf",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "Word to PDF - Convertify" }],
    },
}

export default function Page() {
    if (IS_MOBILE_BUILD) return <MobileToolFrame toolId="word-to-pdf"><WordToPdfClient /></MobileToolFrame>

    const relatedBlogSlugs = getBlogPostsForTool('word-to-pdf')
    const relatedBlogs = allIndexableBlogPosts.filter(post => relatedBlogSlugs.includes(post.slug))

    return (
        <div className="flex flex-col items-center">

            {/* Structured Data Schemas */}
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "Word To Pdf", url: "/word-to-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="Convertify Word to PDF Converter"
                toolSlug="word-to-pdf"
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-indigo-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-6">
                        Convert your .docx Word document's text content to PDF, free, right in your browser. No download needed.
                    </p>

                    {/* Preview/Trust Image */}
                    <div className="relative w-full max-w-2xl mx-auto h-48 md:h-64 rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white mb-8 group">
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                            {/* Placeholder for tool preview - using text for now, but in structure for an image substitute */}
                            <div className="flex items-center space-x-8 text-slate-400">
                                <span className="flex flex-col items-center">
                                    <span className="text-4xl mb-2">📄</span>
                                    <span className="text-sm font-medium">Word Doc</span>
                                </span>
                                <span className="text-2xl">→</span>
                                <span className="flex flex-col items-center">
                                    <span className="text-4xl mb-2 text-red-500">📄</span>
                                    <span className="text-sm font-medium text-slate-700">PDF</span>
                                </span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Text content extracted and laid out on clean PDF pages
                        </div>
                    </div>
                </div>
                <ToolSwapper />
                <WordToPdfClient />
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="Convertify Word to PDF Converter"
                toolSlug="word-to-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <ToolDeepGuide toolSlug="word-to-pdf" toolName="Word to PDF Converter" />

            <HowToSchema
                toolName="Convert Word to PDF"
                description="Learn how to convert Word documents to PDF using Convertify's free online DOC to PDF converter."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="Word to PDF Conversion"
                faqs={seoData.faqs}
            />

            <RelatedUseCases toolHref="/word-to-pdf" />

            <RelatedBlogPosts
                toolSlug="word-to-pdf"
                posts={relatedBlogs}
                title="📚 Guides: Word to PDF"
            />

            <RelatedTools currentTool="/word-to-pdf" />
        </div>
    )
}
