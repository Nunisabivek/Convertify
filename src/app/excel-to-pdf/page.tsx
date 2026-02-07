import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"
import { Sheet } from "lucide-react"
import Link from "next/link"

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
            
            {/* Structured Data Schemas */}
            <BreadcrumbSchema 
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "Excel To Pdf", url: "/excel-to-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="Excel to PDF Converter"
                toolSlug="excel-to-pdf"
                description={seoData.description}
            />
            
<section className="w-full py-8 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convert Excel spreadsheets to PDF while preserving formatting, columns, and tables.
                    </p>
                </div>

                <ToolSwapper />

                {/* Placeholder Tool Area */}
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
                        <div className="p-4 bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <Sheet className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Excel to PDF Converter</h2>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            This feature converts Excel files (XLS, XLSX) to PDF format. Upload your spreadsheet to get started.
                        </p>
                        <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 p-4 rounded-lg text-sm max-w-md mx-auto">
                            <strong>Secure Conversion:</strong> Your spreadsheets are converted locally in your browser to PDF. We never store or view your financial data.
                        </div>
                        <div className="mt-8">
                            <Link href="/all-tools" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                ← Browse all PDF tools
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="Excel to PDF Converter"
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
