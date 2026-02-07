import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import PdfToTextClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["pdf-to-text"]
const contentData = toolContentData["pdf-to-text"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/pdf-to-text",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/pdf-to-text",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "PDF to Text - Convertify" }],
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            
            {/* Structured Data Schemas */}
            <BreadcrumbSchema 
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "Pdf To Text", url: "/pdf-to-text" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="PDF to Text Converter"
                toolSlug="pdf-to-text"
                description={seoData.description}
            />
            
<section className="w-full py-8 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Extract all text content from your PDF documents instantly.
                    </p>
                </div>
                <ToolSwapper />
                <PdfToTextClient />
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="PDF to Text Converter"
                toolSlug="pdf-to-text"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <HowToSchema
                toolName="Extract Text from PDF"
                description="Learn how to extract text from PDF documents using Convertify's free online PDF to text converter."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="PDF to Text Extraction"
                faqs={seoData.faqs}
            />

            <RelatedTools currentTool="/pdf-to-text" />
        </div>
    )
}
