import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import PngToPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { AnswerBlock } from "@/components/seo/answer-block"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["png-to-pdf"]
const contentData = toolContentData["png-to-pdf"]

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
            
            {/* Structured Data Schemas */}
            <BreadcrumbSchema 
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "Png To Pdf", url: "/png-to-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="PNG to PDF Converter"
                toolSlug="png-to-pdf"
                description={seoData.description}
            />
            
<section className="w-full py-8 bg-gradient-to-b from-emerald-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Drop your PNG images, drag to reorder, get one HD PDF (300 DPI). No watermark, no sign-up, files never leave your browser. Works on Windows, Mac, iPhone &amp; Android.
                    </p>
                </div>
                <AnswerBlock
                    question="How do I combine multiple PNG files into one PDF?"
                    answer="Drop all your PNG images into Convertify’s PNG to PDF combiner, drag the thumbnails to set the page order, then click Convert. You’ll get a single multi-page HD PDF (300 DPI) in seconds — free, no watermark, no sign-up, and your files stay on your device."
                />
                <ToolSwapper />
                <PngToPdfClient />
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="PNG to PDF Converter"
                toolSlug="png-to-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

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
