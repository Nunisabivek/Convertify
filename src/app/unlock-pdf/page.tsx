import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import UnlockPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["unlock-pdf"]
const contentData = toolContentData["unlock-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/unlock-pdf",
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
                    { name: "Unlock Pdf", url: "/unlock-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="PDF Unlocker"
                toolSlug="unlock-pdf"
                description={seoData.description}
            />
            
<section className="w-full py-8 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Remove password protection from your PDF files. Fast, free, and secure.
                    </p>
                </div>
                <ToolSwapper />
                <UnlockPdfClient />
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="PDF Unlocker"
                toolSlug="unlock-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <HowToSchema
                toolName="Unlock Password-Protected PDF"
                description="Learn how to remove password protection from PDF documents using Convertify."
                steps={seoData.howToSteps}
            />

            <FAQSchema toolName="PDF Unlocking" faqs={seoData.faqs} />
            <RelatedTools currentTool="/unlock-pdf" />
        </div>
    )
}
