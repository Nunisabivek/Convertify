import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import Base64Client from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"

const toolName = "base64"
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
                    { name: "Base64 Encoder/Decoder", url: "/base64" },
                ]}
            />
            <SoftwareApplicationSchema
                toolName="Base64 Encoder & Decoder"
                toolSlug={toolName}
                description={seoData.description}
                category="DeveloperApplication"
            />

            <section className="w-full py-8 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {seoData.description}
                    </p>
                </div>
                <ToolSwapper />
                <Base64Client />
            </section>

            <ToolSeoContent
                toolName="Base64 Encoder & Decoder"
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
