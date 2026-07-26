import { Metadata } from "next"
import { ComingSoonTool } from "@/components/tools/coming-soon-tool"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["unlock-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    robots: { index: false, follow: true },
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
                toolName="Convertify PDF Unlocker"
                toolSlug="unlock-pdf"
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convertify Unlock PDF — remove restrictions and passwords instantly. No download needed, 100% secure and free.
                    </p>
                </div>
                <ComingSoonTool />
            </section>
            <RelatedTools currentTool="/unlock-pdf" />
        </div>
    )
}
