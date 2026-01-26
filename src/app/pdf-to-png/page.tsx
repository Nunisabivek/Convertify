import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import PdfToPngClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["pdf-to-png"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "/pdf-to-png",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/pdf-to-png",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "PDF to PNG - Convertify" }],
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-cyan-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convert PDF pages to high-quality PNG images with transparency support.
                    </p>
                </div>
                <ToolSwapper />
                <PdfToPngClient />
            </section>

            <HowToSchema
                toolName="Convert PDF to PNG"
                description="Learn how to convert PDF pages to PNG images using Convertify's free online PDF to PNG converter."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="PDF to PNG Conversion"
                faqs={seoData.faqs}
            />

            <RelatedTools currentTool="/pdf-to-png" />
        </div>
    )
}
