import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import PdfToWordClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["pdf-to-word"]
const contentData = toolContentData["pdf-to-word"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/pdf-to-word",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/pdf-to-word",
        images: [
            {
                url: "/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: "PDF to Word Converter - Convertify",
            },
        ],
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            {/* Main Tool Section */}
            <section className="w-full py-8 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convert your PDF documents to editable Word files (DOCX) for free. Perfect for editing contracts, reports, and documents.
                    </p>
                </div>
                <ToolSwapper />
                <PdfToWordClient />
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="PDF to Word Converter"
                toolSlug="pdf-to-word"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            {/* How To Section with Schema */}
            <HowToSchema
                toolName="Convert PDF to Word Online"
                description="Learn how to convert PDF files to editable Word documents using Convertify's free online converter."
                steps={seoData.howToSteps}
            />

            {/* FAQ Section with Schema */}
            <FAQSchema
                toolName="PDF to Word Conversion"
                faqs={seoData.faqs}
            />

            {/* Related Tools for Internal Linking */}
            <RelatedTools currentTool="/pdf-to-word" />
        </div>
    )
}
