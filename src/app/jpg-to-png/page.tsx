import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import { InToolPlayStoreCallout } from "@/components/ui/google-play-badge"
import JpgToPngClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolDeepGuide } from "@/components/seo/tool-deep-guide"

export const metadata: Metadata = {
    title: "JPG to PNG Converter — Convert JPEG to PNG Free Online",
    description: "Convert JPG and JPEG images to lossless PNG files in your browser. Convert a batch and download them as a ZIP. Free, no sign-up, no watermarks.",
    keywords: ["jpg to png", "jpeg to png", "convert jpg to png", "image converter", "transparent png", "free jpg converter"],
    alternates: { canonical: "https://convertify.work/jpg-to-png" },
    openGraph: {
        title: "JPG to PNG Converter - Free Online",
        description: "Convert JPG images to lossless PNG. Free, fast, and private.",
        url: "/jpg-to-png",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "JPG to PNG", url: "/jpg-to-png" }]} />
            <SoftwareApplicationSchema toolName="JPG to PNG Converter" toolSlug="jpg-to-png" description="Convert JPG images to lossless PNG format for free online." />
            
            <section className="w-full py-8 bg-gradient-to-b from-purple-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">JPG to PNG Converter</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Convert JPG and JPEG images to lossless PNG. 100% free, nothing uploaded.</p>
                </div>
                <ToolSwapper />
                <JpgToPngClient />
            </section>

            <div className="w-full max-w-4xl px-4 mx-auto">
                <InToolPlayStoreCallout />
            </div>

            <HowToSchema
                toolName="Convert JPG to PNG"
                description="Learn how to convert JPG images to PNG format using Convertify's free online converter."
                steps={[
                    { name: "Upload JPG", text: "Select or drag your JPG/JPEG images to upload" },
                    { name: "Convert", text: "Click convert - images are processed in your browser" },
                    { name: "Download PNG", text: "Download your converted PNG images instantly" }
                ]}
            />

            <FAQSchema
                toolName="JPG to PNG Conversion"
                faqs={[
                    { question: "Why convert JPG to PNG?", answer: "PNG is lossless, so the image won't lose more quality each time you edit and re-save it. PNG can also hold transparency, though a converted JPG stays fully opaque until you remove the background in an editor." },
                    { question: "Is this JPG to PNG converter free?", answer: "Yes, Convertify's JPG to PNG converter is completely free with no watermarks or sign-up. Each file can be up to 200 MB." },
                    { question: "Will I lose quality converting JPG to PNG?", answer: "No, PNG is lossless. However, since JPG is already compressed, you won't recover lost quality from the original JPG compression." },
                ]}
            />

            {/* Long-form guide */}
            <ToolDeepGuide toolSlug="jpg-to-png" toolName="JPG to PNG Converter" />

            <RelatedTools currentTool="/jpg-to-png" />
        </div>
    )
}
