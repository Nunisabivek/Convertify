import { Metadata } from "next"
import Link from "next/link"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import ExcelToPdfClient from "./client"
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import MobileToolFrame from "@/components/mobile/MobileToolFrame"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedBlogPosts } from "@/components/seo/related-blog-posts"
import { getBlogPostsForTool } from "@/lib/tool-blog-mapping"
import { allIndexableBlogPosts } from "@/lib/blog-data"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { ToolDeepGuide } from "@/components/seo/tool-deep-guide"
import { AnswerBlock } from "@/components/seo/answer-block"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["excel-to-pdf"]
const contentData = toolContentData["excel-to-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/excel-to-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "https://convertify.work/excel-to-pdf",
        siteName: "Convertify",
        type: "website",
        images: [{ url: "https://convertify.work/images/og-banner.png", width: 1200, height: 630, alt: "Excel to PDF — Convert XLSX Spreadsheets, No Upload" }],
    },
    twitter: {
        card: "summary_large_image",
        title: seoData.title,
        description: seoData.description,
        images: ["https://convertify.work/images/og-banner.png"],
    },
}

export default function Page() {
    if (IS_MOBILE_BUILD) return <MobileToolFrame toolId="excel-to-pdf"><ExcelToPdfClient /></MobileToolFrame>

    const relatedBlogSlugs = getBlogPostsForTool('excel-to-pdf')
    const relatedBlogs = allIndexableBlogPosts.filter(post => relatedBlogSlugs.includes(post.slug))

    return (
        <div className="flex flex-col items-center">

            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "Excel to PDF", url: "/excel-to-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="Excel to PDF Converter"
                toolSlug="excel-to-pdf"
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convert XLS and XLSX to a PDF of cell values in your browser. Charts and styling are not carried over. No Microsoft Excel, no watermark, nothing uploaded. Also:{" "}
                        <Link href="/png-to-pdf" className="text-indigo-600 hover:underline font-medium">PNG to PDF</Link>
                        {" · "}
                        <Link href="/pdf-to-jpg" className="text-indigo-600 hover:underline font-medium">PDF to JPG</Link>.
                    </p>
                </div>
                <AnswerBlock
                    question="How do I convert XLS or Excel to PDF for free?"
                    answer="Drop your XLS or XLSX file, pick the sheet if needed, and convert. Cell values are laid out as a clean table — no Microsoft Excel, no watermark, nothing uploaded. Charts and formatting are not carried over."
                />
                <ToolSwapper />
                <ExcelToPdfClient />
            </section>

            <ToolSeoContent
                toolName="Excel to PDF Converter"
                toolSlug="excel-to-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            {/* Long-form guide */}
            <ToolDeepGuide toolSlug="excel-to-pdf" toolName="Excel to PDF Converter" />

            <HowToSchema
                toolName="Convert Excel to PDF"
                description="Learn how to convert Excel spreadsheets to PDF using Convertify's free online XLS to PDF converter."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="Excel to PDF Conversion"
                faqs={seoData.faqs}
            />

            <RelatedBlogPosts
                toolSlug="excel-to-pdf"
                posts={relatedBlogs}
                title="📚 Guides: Spreadsheets to PDF"
            />

            <RelatedTools currentTool="/excel-to-pdf" />
        </div>
    )
}
