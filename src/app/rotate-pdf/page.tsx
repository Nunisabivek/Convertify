import { Metadata } from "next"
import RotatePdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["rotate-pdf"]
const contentData = toolContentData["rotate-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/rotate-pdf",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-pink-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Rotate your PDF pages to the correct orientation. Quick, easy, and completely free.
                    </p>
                </div>
                <RotatePdfClient />
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="PDF Rotator"
                toolSlug="rotate-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <HowToSchema
                toolName="Rotate PDF Pages Online"
                description="Learn how to rotate PDF pages using Convertify's free online tool."
                steps={seoData.howToSteps}
            />

            <FAQSchema toolName="PDF Rotation" faqs={seoData.faqs} />
            <RelatedTools currentTool="/rotate-pdf" />
        </div>
    )
}
