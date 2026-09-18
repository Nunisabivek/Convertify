import { Metadata } from "next"
import PowerpointToPdfClient from "./client"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { FAQSchema } from "@/components/seo/faq-schema"
import { ToolDeepGuide } from "@/components/seo/tool-deep-guide"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedUseCases } from "@/components/seo/related-use-cases"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["powerpoint-to-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    robots: { index: true, follow: true },
    alternates: {
        canonical: "https://convertify.work/powerpoint-to-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/powerpoint-to-pdf",
        images: [
            {
                url: "/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: seoData.title,
            },
        ],
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
                    { name: "PowerPoint to PDF", url: "/powerpoint-to-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="Convertify PowerPoint to PDF Converter"
                toolSlug="powerpoint-to-pdf"
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-blue-50/50 via-white to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200/60 rounded-full text-xs font-semibold text-[#026EFF] mb-4 shadow-sm">
                        Free Online Tool • Zero Server Upload
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        {seoData.description}
                    </p>
                </div>
                <ToolSwapper />
                <PowerpointToPdfClient />
            </section>

            {seoData.howToSteps && (
                <HowToSchema
                    toolName="PowerPoint to PDF"
                    description="Learn how to convert PPT and PPTX presentation slides to PDF format online with Convertify."
                    steps={seoData.howToSteps}
                />
            )}

            {seoData.faqs && (
                <FAQSchema
                    faqs={seoData.faqs}
                />
            )}

            <ToolDeepGuide toolSlug="powerpoint-to-pdf" />

            <RelatedUseCases toolHref="/powerpoint-to-pdf" />

            <RelatedTools currentTool="/powerpoint-to-pdf" />
        </div>
    )
}
