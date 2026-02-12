import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import PdfToJpgClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["pdf-to-jpg"]
const contentData = toolContentData["pdf-to-jpg"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/pdf-to-jpg",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/pdf-to-jpg",
        images: [
            {
                url: "/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: "PDF to Images Converter Online - Convertify",
            },
        ],
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
                    { name: "PDF to JPG", url: "/pdf-to-jpg" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="PDF to Images Converter Online"
                toolSlug="pdf-to-jpg"
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-yellow-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-8">
                        Free PDF to images converter online — extract every page of your PDF as high-quality JPG images. Download as a ZIP file with Convertify.
                    </p>

                    {/* Visual Preview / Trust Signal */}
                    <div className="relative w-full max-w-2xl mx-auto h-48 md:h-64 rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white mb-8 group">
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 space-x-4">
                            {/* Visual representation of PDF -> Image */}
                            <div className="flex items-center space-x-4">
                                <div className="w-16 h-20 bg-white border border-slate-300 shadow-sm rounded flex items-center justify-center relative">
                                    <span className="text-xs text-slate-400">PDF</span>
                                    <div className="absolute top-0 right-0 -mr-1 -mt-1 w-3 h-3 bg-red-500 rounded-full"></div>
                                </div>
                                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                <div className="w-16 h-20 bg-yellow-50 border border-yellow-200 shadow-sm rounded flex items-center justify-center relative transform rotate-3 transition-transform group-hover:rotate-6">
                                    <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <span className="absolute bottom-2 text-[10px] text-yellow-600 font-bold">JPG</span>
                                </div>
                            </div>
                        </div>
                        <div className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            High-Quality 300 DPI Extraction
                        </div>
                    </div>
                </div>
                <ToolSwapper />
                <PdfToJpgClient />
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="PDF to Images Converter Online"
                toolSlug="pdf-to-jpg"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <HowToSchema
                toolName="Convert PDF to JPG Images"
                description="Learn how to convert PDF pages to JPG images using Convertify's free online PDF to images converter."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="PDF to Images Conversion"
                faqs={seoData.faqs}
            />

            <RelatedTools currentTool="/pdf-to-jpg" />
        </div>
    )
}
