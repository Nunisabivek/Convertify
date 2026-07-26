import { Metadata } from "next"
import { ComingSoonTool } from "@/components/tools/coming-soon-tool"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { toolSeoData } from "@/lib/seo-data"

const seoData = toolSeoData["protect-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    robots: { index: false, follow: true },
    alternates: {
        canonical: "https://convertify.work/protect-pdf",
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
                    { name: "Protect Pdf", url: "/protect-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="Convertify PDF Password Protector"
                toolSlug="protect-pdf"
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-red-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convertify Protect PDF — secure your documents with password protection. No download needed, completely free.
                    </p>
                </div>
                <ComingSoonTool />
            </section>
            <RelatedTools currentTool="/protect-pdf" />
        </div>
    )
}
