import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import ExcelToPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["excel-to-pdf"]
const contentData = toolContentData["excel-to-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/excel-to-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/excel-to-pdf",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "Excel to PDF - Convertify" }],
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">

            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "Excel to PDF", url: "/excel-to-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="Convertify Excel to PDF Converter"
                toolSlug="excel-to-pdf"
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-green-50 to-white">
                <ToolSwapper />
                <ExcelToPdfClient />
            </section>

            <ToolSeoContent
                toolName="Convertify Excel to PDF Converter"
                toolSlug="excel-to-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <HowToSchema
                toolName="Convert Excel to PDF"
                description="Learn how to convert Excel spreadsheets to PDF using Convertify's free online XLS to PDF converter."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="Excel to PDF Conversion"
                faqs={seoData.faqs}
            />

            <RelatedTools currentTool="/excel-to-pdf" />
        </div>
    )
}
