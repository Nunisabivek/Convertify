
import { Metadata } from "next"
import SplitPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedBlogPosts } from "@/components/seo/related-blog-posts"
import { toolSeoData } from "@/lib/seo-data"
import { blogPosts } from "@/lib/blog-data"
import { getBlogPostsForTool } from "@/lib/tool-blog-mapping"

const seoData = toolSeoData["split-pdf"]

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
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Extract specific pages from your PDF or split it into multiple files. Select individual pages, enter a range, or split all pages. Fast, free, and secure.
                    </p>
                </div>
                <SplitPdfClient />
            </section>

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
