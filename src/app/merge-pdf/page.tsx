
import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import MergePdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedBlogPosts } from "@/components/seo/related-blog-posts"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"
import { blogPosts } from "@/lib/blog-data"
import { getBlogPostsForTool } from "@/lib/tool-blog-mapping"

const seoData = toolSeoData["merge-pdf"]
const contentData = toolContentData["merge-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/merge-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/merge-pdf",
        images: [
            {
                url: "/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: "Merge PDF Files Online Free - Convertify",
            },
        ],
    },
}

export default function Page() {
    const relatedBlogSlugs = getBlogPostsForTool('merge-pdf')
    const relatedBlogs = blogPosts.filter(post => relatedBlogSlugs.includes(post.slug))

    return (
        <div className="flex flex-col items-center">
            {/* Main Tool Section */}
            <section className="w-full py-8 bg-gradient-to-b from-red-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                        Combine multiple PDF files into one document. No watermarks, no file limits, works on all devices.
                    </p>

                    {/* Visual Preview / Trust Signal */}
                    <div className="relative w-full max-w-2xl mx-auto h-48 md:h-64 rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white mb-8 group">
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 space-x-4">
                            {/* Visual representation of merging */}
                            <div className="relative flex items-center">
                                <div className="w-16 h-20 bg-white border border-slate-300 shadow-sm rounded flex items-center justify-center z-10 transform -rotate-6">
                                    <span className="text-xs text-slate-400">Doc A</span>
                                </div>
                                <div className="w-16 h-20 bg-white border border-slate-300 shadow-sm rounded flex items-center justify-center -ml-8 z-20">
                                    <span className="text-xs text-slate-400">Doc B</span>
                                </div>
                                <div className="w-16 h-20 bg-indigo-50 border border-indigo-200 shadow-sm rounded flex items-center justify-center -ml-8 z-30 transform rotate-6">
                                    <span className="text-xs text-indigo-600 font-bold">Merged</span>
                                    <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            Drag, Drop &amp; Combine PDFs Instantly
                        </div>
                    </div>
                </div>
                <ToolSwapper />
                <MergePdfClient />
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="PDF Merger"
                toolSlug="merge-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            {/* How To Section with Schema */}
            <HowToSchema
                toolName="Merge PDF Files Online"
                description="Learn how to combine multiple PDF files into a single document using Convertify's free online PDF merger tool."
                steps={seoData.howToSteps}
            />

            {/* FAQ Section with Schema */}
            <FAQSchema
                toolName="Merging PDFs"
                faqs={seoData.faqs}
            />

            {/* Related Blog Posts for SEO */}
            <RelatedBlogPosts
                toolSlug="merge-pdf"
                posts={relatedBlogs}
                title="📚 Guides & Tutorials: How to Merge PDFs"
            />

            {/* Related Tools for Internal Linking */}
            <RelatedTools currentTool="/merge-pdf" />
        </div>
    )
}
