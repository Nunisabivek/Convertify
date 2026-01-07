
import { Metadata } from "next"
import CompressPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["compress-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "/compress-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/compress-pdf",
        images: [
            {
                url: "/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: "Compress PDF Online Free - Convertify",
            },
        ],
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Reduce PDF file size by up to 90% without losing quality. Perfect for email attachments.
                    </p>
                </div>
                <CompressPdfClient />
            </section>

            <HowToSchema
                toolName="Compress PDF Files"
                description="Learn how to reduce PDF file size for email attachments using Convertify's free online PDF compressor."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="Compressing PDFs"
                faqs={seoData.faqs}
            />

            <RelatedTools currentTool="/compress-pdf" />
        </div>
    )
}
