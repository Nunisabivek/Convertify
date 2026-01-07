
import { Metadata } from "next"
import MergePdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["merge-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "/merge-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/merge-pdf",
        images: [
            {
                url: "/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: "Merge PDF Files Online Free - Convertify",
            },
        ],
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            {/* Main Tool Section */}
            <section className="w-full py-8 bg-gradient-to-b from-red-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Combine multiple PDF files into one document. No watermarks, no file limits, works on all devices.
                    </p>
                </div>
                <MergePdfClient />
            </section>

            {/* How To Section with Schema */}
            <HowToSchema
                toolName="Merge PDF Files Online"
                description="Learn how to combine multiple PDF files into a single document using Convertify's free online PDF merger tool."
                steps={seoData.howToSteps}
            />

            {/* FAQ Section with Schema */}
            <FAQSchema
                toolName="Merging PDFs"
                faqs={seoData.faqs}
            />

            {/* Related Tools for Internal Linking */}
            <RelatedTools currentTool="/merge-pdf" />
        </div>
    )
}
