import { Metadata } from "next"
import RedactPdfClient from "./client"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { FAQSchema } from "@/components/seo/faq-schema"
import { ToolDeepGuide } from "@/components/seo/tool-deep-guide"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedUseCases } from "@/components/seo/related-use-cases"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import { toolSeoData } from "@/lib/seo-data"

const toolName = "redact-pdf"
const seoData = toolSeoData[toolName]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    robots: { index: true, follow: true },
    alternates: {
        canonical: `https://convertify.work/${toolName}`,
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: `/${toolName}`,
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
                    { name: "Redact PDF", url: "/redact-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="Convertify PDF Redactor"
                toolSlug="redact-pdf"
                description={seoData.description}
            />
            
            <section className="w-full py-8 bg-gradient-to-b from-blue-50/50 via-white to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 border border-indigo-200/60 rounded-full text-xs font-semibold text-indigo-700 mb-4 shadow-sm">
                        Free Online Tool • No Installation
                    </span>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        {seoData.description}
                    </p>
                </div>
                <ToolSwapper />
                <RedactPdfClient />
            </section>

            {seoData.howToSteps && (
                <HowToSchema
                    toolName="Redact PDF"
                    description="Learn how to permanently redact sensitive data from PDF files online with Convertify."
                    steps={seoData.howToSteps}
                />
            )}

            {seoData.faqs && (
                <FAQSchema
                    toolName="PDF Redaction"
                    faqs={seoData.faqs}
                />
            )}

            <ToolDeepGuide toolSlug="redact-pdf" toolName="Redact PDF Online" />
            <RelatedUseCases toolHref="/redact-pdf" />
            <RelatedTools currentTool={`/${toolName}`} />
        </div>
    )
}
