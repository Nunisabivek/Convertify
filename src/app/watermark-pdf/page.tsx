import { Metadata } from "next"
import WatermarkPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["watermark-pdf"]
const contentData = toolContentData["watermark-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/watermark-pdf",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-sky-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Protect your documents with custom watermarks. Add text watermarks with full control over appearance.
                    </p>
                </div>
                <WatermarkPdfClient />
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="PDF Watermark Tool"
                toolSlug="watermark-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <HowToSchema
                toolName="Add Watermark to PDF"
                description="Learn how to add custom watermarks to PDF documents using Convertify's free tool."
                steps={seoData.howToSteps}
            />

            <FAQSchema toolName="PDF Watermarking" faqs={seoData.faqs} />
            <RelatedTools currentTool="/watermark-pdf" />
        </div>
    )
}
