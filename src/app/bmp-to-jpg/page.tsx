import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import BmpToJpgClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "BMP to JPG Converter - Convert BMP to JPEG Free Online | Convertify",
    description: "Convert BMP bitmap images to JPG format with adjustable quality. Free online BMP to JPG converter - no sign-up, no watermarks. Works on all devices.",
    keywords: ["bmp to jpg", "bmp to jpeg", "convert bmp to jpg", "bitmap converter", "bmp converter", "free bmp to jpg"],
    alternates: { canonical: "https://convertify.work/bmp-to-jpg" },
    openGraph: {
        title: "BMP to JPG Converter - Free Online | Convertify",
        description: "Convert BMP bitmap images to JPG format with adjustable quality. Free, fast, and secure.",
        url: "/bmp-to-jpg",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "BMP to JPG", url: "/bmp-to-jpg" }]} />
            <SoftwareApplicationSchema toolName="BMP to JPG Converter" toolSlug="bmp-to-jpg" description="Convert BMP bitmap images to JPG format with adjustable quality for free online." />

            <section className="w-full py-8 bg-gradient-to-b from-amber-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">BMP to JPG Converter</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Convert BMP bitmap images to JPG format with adjustable quality. Dramatically reduce file size.</p>
                </div>
                <ToolSwapper />
                <BmpToJpgClient />
            </section>

            <HowToSchema
                toolName="Convert BMP to JPG"
                description="Learn how to convert BMP bitmap images to JPG format using Convertify's free online converter."
                steps={[
                    { name: "Upload BMP", text: "Select or drag your BMP bitmap images to upload" },
                    { name: "Adjust Quality", text: "Set the JPG output quality using the quality slider" },
                    { name: "Convert", text: "Click convert - images are processed in your browser" },
                    { name: "Download JPG", text: "Download your converted JPG images instantly" }
                ]}
            />

            <FAQSchema
                toolName="BMP to JPG Conversion"
                faqs={[
                    { question: "Why convert BMP to JPG?", answer: "BMP files are uncompressed and very large. Converting to JPG dramatically reduces file size, making images easier to share, upload, and store." },
                    { question: "What quality should I use?", answer: "For most purposes, 85-90% quality provides an excellent balance between file size and image quality. Use higher quality for professional work." },
                    { question: "Is this BMP to JPG converter free?", answer: "Yes, Convertify's BMP to JPG converter is completely free with no file limits, watermarks, or sign-up required." },
                ]}
            />

            <RelatedTools currentTool="/bmp-to-jpg" />
        </div>
    )
}
