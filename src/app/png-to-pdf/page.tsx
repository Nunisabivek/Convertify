import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import PngToPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["png-to-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/png-to-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/png-to-pdf",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "PNG to PDF - Convertify" }],
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-emerald-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convert PNG images with transparency to PDF. Combine multiple PNG files into one document.
                    </p>
                </div>
                <ToolSwapper />
                <PngToPdfClient />
            </section>

            <HowToSchema
                toolName="Convert PNG to PDF"
                description="Learn how to convert PNG images to PDF documents using Convertify's free online PNG to PDF converter."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="PNG to PDF Conversion"
                faqs={seoData.faqs}
            />

            <RelatedTools currentTool="/png-to-pdf" />
        </div>
    )
}
