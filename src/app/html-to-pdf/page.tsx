import { Metadata } from "next"
import HtmlToPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["html-to-pdf"]
const contentData = toolContentData["html-to-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/html-to-pdf",
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
                    { name: "Html To Pdf", url: "/html-to-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="HTML to PDF Converter"
                toolSlug="html-to-pdf"
                description={seoData.description}
            />
            
<section className="w-full py-8 bg-gradient-to-b from-rose-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convert web pages and HTML code to PDF documents. Perfect for saving articles, documentation, and web content.
                    </p>
                </div>
                <HtmlToPdfClient />
            </section>

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="HTML to PDF Converter"
                toolSlug="html-to-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <HowToSchema
                toolName="Convert HTML to PDF Online"
                description="Learn how to convert HTML code and web pages to PDF using Convertify's free converter."
                steps={seoData.howToSteps}
            />

            <FAQSchema toolName="HTML to PDF Conversion" faqs={seoData.faqs} />
            <RelatedTools currentTool="/html-to-pdf" />
        </div>
    )
}
