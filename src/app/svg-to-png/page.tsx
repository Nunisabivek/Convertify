import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import SvgToPngClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "SVG to PNG Converter - Convert SVG to PNG Free Online | Convertify",
    description: "Convert SVG vector images to PNG raster format with custom dimensions. Free online SVG to PNG converter - no sign-up, no watermarks. Works on all devices.",
    keywords: ["svg to png", "convert svg to png", "svg converter", "vector to raster", "svg to image", "free svg converter"],
    alternates: { canonical: "https://convertify.work/svg-to-png" },
    openGraph: {
        title: "SVG to PNG Converter - Free Online | Convertify",
        description: "Convert SVG vector images to PNG raster format with custom dimensions. Free, fast, and secure.",
        url: "/svg-to-png",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "SVG to PNG", url: "/svg-to-png" }]} />
            <SoftwareApplicationSchema toolName="SVG to PNG Converter" toolSlug="svg-to-png" description="Convert SVG vector images to PNG raster format with custom dimensions for free online." />

            <section className="w-full py-8 bg-gradient-to-b from-indigo-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">SVG to PNG Converter</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Convert SVG vector images to PNG raster format with custom output dimensions. 100% free.</p>
                </div>
                <ToolSwapper />
                <SvgToPngClient />
            </section>

            <HowToSchema
                toolName="Convert SVG to PNG"
                description="Learn how to convert SVG vector images to PNG raster format using Convertify's free online converter."
                steps={[
                    { name: "Upload SVG", text: "Select or drag your SVG files to upload" },
                    { name: "Set Dimensions", text: "Optionally set custom output width and height" },
                    { name: "Convert", text: "Click convert - images are processed in your browser" },
                    { name: "Download PNG", text: "Download your converted PNG images instantly" }
                ]}
            />

            <FAQSchema
                toolName="SVG to PNG Conversion"
                faqs={[
                    { question: "Why convert SVG to PNG?", answer: "PNG is a widely supported raster format ideal for sharing, uploading to social media, or using in applications that don't support SVG vector files." },
                    { question: "Can I set custom dimensions for the PNG output?", answer: "Yes, you can specify custom width and height for the output PNG. By default, the converter uses the SVG's natural size or 1024px." },
                    { question: "Is this SVG to PNG converter free?", answer: "Yes, Convertify's SVG to PNG converter is completely free with no file limits, watermarks, or sign-up required." },
                ]}
            />

            <RelatedTools currentTool="/svg-to-png" />
        </div>
    )
}
