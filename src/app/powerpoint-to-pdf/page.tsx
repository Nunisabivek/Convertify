import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedUseCases } from "@/components/seo/related-use-cases"
import { toolSeoData } from "@/lib/seo-data"
import { Presentation } from "lucide-react"
import Link from "next/link"

const seoData = toolSeoData["powerpoint-to-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    robots: { index: false, follow: true },
    alternates: {
        canonical: "https://convertify.work/powerpoint-to-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "/powerpoint-to-pdf",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "PowerPoint to PDF - Convertify" }],
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
                    { name: "Powerpoint To Pdf", url: "/powerpoint-to-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="PowerPoint to PDF Converter"
                toolSlug="powerpoint-to-pdf"
                description={seoData.description}
            />
            
<section className="w-full py-8 bg-gradient-to-b from-orange-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convert PowerPoint presentations to PDF for easy sharing and printing.
                    </p>
                </div>

                <ToolSwapper />

                {/* Placeholder Tool Area */}
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
                        <div className="p-4 bg-orange-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <Presentation className="w-10 h-10 text-orange-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">PowerPoint to PDF Converter</h2>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            Convert your PPT and PPTX presentations to PDF format for easy sharing.
                        </p>
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-lg text-sm max-w-md mx-auto">
                            <strong>Note:</strong> For best results with PowerPoint files, we recommend using Microsoft PowerPoint or Google Slides&apos; built-in &quot;Export as PDF&quot; feature to preserve animations and transitions as static slides.
                        </div>
                        <div className="mt-8">
                            <Link href="/all-tools" className="text-indigo-600 hover:text-indigo-700 font-medium">
                                ← Browse all PDF tools
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <RelatedUseCases toolHref="/powerpoint-to-pdf" />

            <RelatedTools currentTool="/powerpoint-to-pdf" />
        </div>
    )
}
