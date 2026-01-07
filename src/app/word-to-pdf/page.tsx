
import { Metadata } from "next"
import WordToPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["word-to-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "/word-to-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/word-to-pdf",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "Word to PDF - Convertify" }],
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-indigo-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convert Microsoft Word documents to PDF while preserving formatting.
                    </p>
                </div>
                <WordToPdfClient />
            </section>

            <HowToSchema
                toolName="Convert Word to PDF"
                description="Learn how to convert Word documents to PDF using Convertify's free online DOC to PDF converter."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="Word to PDF Conversion"
                faqs={seoData.faqs}
            />

            <RelatedTools currentTool="/word-to-pdf" />
        </div>
    )
}
