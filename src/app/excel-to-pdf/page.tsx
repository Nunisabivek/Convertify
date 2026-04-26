import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import ExcelToPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { AnswerBlock } from "@/components/seo/answer-block"
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
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convert XLS, XLSX, and CSV spreadsheets to PDF in seconds. Charts, formulas, cell formatting, and clickable links are preserved. No Microsoft Excel needed, no watermark, no sign-up — and your spreadsheet never leaves your browser.
                    </p>
                </div>
                <AnswerBlock
                    question="How do I convert XLS or Excel to PDF for free?"
                    answer="Open Convertify's Excel to PDF converter, drop your XLS or XLSX file, and click Convert. The PDF downloads in seconds with charts, formulas, cell borders, and links preserved — no Microsoft Excel install, no watermark, no sign-up. Files stay on your device."
                />
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
