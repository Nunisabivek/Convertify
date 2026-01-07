
import { Metadata } from "next"
import PdfToJpgClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["pdf-to-jpg"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "/pdf-to-jpg",
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
                alt: "PDF to JPG Converter - Convertify",
            },
        ],
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-yellow-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convert every page of your PDF to high-quality JPG images. Download as a ZIP file.
                    </p>
                </div>
                <PdfToJpgClient />
            </section>

            <HowToSchema
                toolName="Convert PDF to JPG"
                description="Learn how to convert PDF pages to JPG images using Convertify's free online PDF to image converter."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="PDF to JPG Conversion"
                faqs={seoData.faqs}
            />

            <RelatedTools currentTool="/pdf-to-jpg" />
        </div>
    )
}
