import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import JpgToPngClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "JPG to PNG Converter - Convert JPEG to PNG Free Online | Convertify",
    description: "Convert JPG and JPEG images to PNG format with transparency support. Free online JPG to PNG converter - no sign-up, no watermarks. Works on all devices.",
    keywords: ["jpg to png", "jpeg to png", "convert jpg to png", "image converter", "transparent png", "free jpg converter"],
    alternates: { canonical: "https://convertify.work/jpg-to-png" },
    openGraph: {
        title: "JPG to PNG Converter - Free Online | Convertify",
        description: "Convert JPG images to PNG format with transparency. Free, fast, and secure.",
        url: "/jpg-to-png",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "JPG to PNG", url: "/jpg-to-png" }]} />
            <SoftwareApplicationSchema toolName="JPG to PNG Converter" toolSlug="jpg-to-png" description="Convert JPG images to PNG format with transparency support for free online." />
            
            <section className="w-full py-8 bg-gradient-to-b from-purple-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">JPG to PNG Converter</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Convert JPG and JPEG images to PNG format with transparency support. 100% free.</p>
                </div>
                <ToolSwapper />
                <JpgToPngClient />
            </section>

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
                    { question: "Why convert JPG to PNG?", answer: "PNG supports transparency and lossless compression, making it ideal for logos, graphics, and images requiring transparent backgrounds." },
                    { question: "Is this JPG to PNG converter free?", answer: "Yes, Convertify's JPG to PNG converter is completely free with no file limits, watermarks, or sign-up required." },
                    { question: "Will I lose quality converting JPG to PNG?", answer: "No, PNG is lossless. However, since JPG is already compressed, you won't recover lost quality from the original JPG compression." },
                ]}
            />

            <RelatedTools currentTool="/jpg-to-png" />
        </div>
    )
}
