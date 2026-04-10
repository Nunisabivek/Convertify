import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import BmpToJpgClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"

const toolName = "bmp-to-jpg"
const seoData = toolSeoData[toolName]
const contentData = toolContentData[toolName]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: { canonical: `https://convertify.work/${toolName}` },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: `/${toolName}`,
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: seoData.title }],
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "BMP to JPG", url: "/bmp-to-jpg" },
                ]}
            />
            <SoftwareApplicationSchema
                toolName="BMP to JPG Converter"
                toolSlug={toolName}
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-amber-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {seoData.description}
                    </p>
                </div>
                <ToolSwapper />
                <BmpToJpgClient />
            </section>

            <ToolSeoContent
                toolName="BMP to JPG Converter"
                toolSlug={toolName}
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <HowToSchema
                toolName={seoData.title}
                description={seoData.description}
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName={seoData.h1}
                faqs={seoData.faqs}
            />

            <RelatedTools currentTool={`/${toolName}`} />
        </div>
    )
}
