
import { Metadata } from "next"
import JpgToPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["jpg-to-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "/jpg-to-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/jpg-to-pdf",
        images: [
            {
                url: "/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: "JPG to PDF Converter - Convertify",
            },
        ],
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-purple-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convert JPG, JPEG, PNG images to PDF instantly. Combine multiple photos into one document.
                    </p>
                </div>
                <JpgToPdfClient />
            </section>

            <HowToSchema
                toolName="Convert JPG to PDF"
                description="Learn how to convert JPG images to PDF documents using Convertify's free online image to PDF converter."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="JPG to PDF Conversion"
                faqs={seoData.faqs}
            />

            <RelatedTools currentTool="/jpg-to-pdf" />
        </div>
    )
}
