
import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import SplitPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedBlogPosts } from "@/components/seo/related-blog-posts"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"
import { blogPosts } from "@/lib/blog-data"
import { getBlogPostsForTool } from "@/lib/tool-blog-mapping"

const seoData = toolSeoData["split-pdf"]
const contentData = toolContentData["split-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/split-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/split-pdf",
        images: [
            {
                url: "/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: "Split PDF Online Free - Convertify",
            },
        ],
    },
}

export default function Page() {
    const relatedBlogSlugs = getBlogPostsForTool('split-pdf')
    const relatedBlogs = blogPosts.filter(post => relatedBlogSlugs.includes(post.slug))

    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                        Extract specific pages from your PDF or split it into multiple files. Select individual pages, enter a range, or split all pages. Fast, free, and secure.
                    </p>

                    {/* Visual Preview / Trust Signal */}
                    <div className="relative w-full max-w-2xl mx-auto h-48 md:h-64 rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white mb-8 group">
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 space-x-2">
                            {/* Visual representation of splitting */}
                            <div className="w-16 h-20 bg-white border border-slate-300 shadow-sm rounded flex items-center justify-center">
                                <span className="text-xs text-slate-400">Pg 1</span>
                            </div>
                            <div className="w-16 h-20 bg-indigo-50 border border-indigo-200 shadow-sm rounded flex items-center justify-center relative -mt-4 transform -rotate-6">
                                <span className="text-xs text-indigo-600 font-bold">Pg 2</span>
                                <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                            </div>
                            <div className="w-16 h-20 bg-white border border-slate-300 shadow-sm rounded flex items-center justify-center">
                                <span className="text-xs text-slate-400">Pg 3</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Select &amp; Extract Exact Pages Instantly
                        </div>
                    </div>
                </div>
                <ToolSwapper />
                <SplitPdfClient />
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="PDF Splitter"
                toolSlug="split-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <HowToSchema
                toolName="Split PDF Files Online"
                description="Learn how to extract pages or split PDF documents into multiple files using Convertify's free online PDF splitter."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="Splitting PDFs"
                faqs={seoData.faqs}
            />

            <RelatedBlogPosts
                toolSlug="split-pdf"
                posts={relatedBlogs}
                title="📚 Guides: How to Split PDFs"
            />

            <RelatedTools currentTool="/split-pdf" />
        </div>
    )
}
