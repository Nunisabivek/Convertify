import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import HeicToJpgClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "HEIC to JPG Converter - Convert iPhone Photos Free | Convertify",
    description: "Convert HEIC photos from iPhone to JPG format online for free. View Apple HEIC images on any device. No software needed, works in browser.",
    keywords: ["heic to jpg", "heic converter", "iphone photo converter", "heic to jpeg", "apple heic", "convert heic", "free heic converter"],
    alternates: { canonical: "https://convertify.work/heic-to-jpg" },
    openGraph: {
        title: "HEIC to JPG Converter - Free Online | Convertify",
        description: "Convert iPhone HEIC photos to JPG format. Free, fast, and secure.",
        url: "/heic-to-jpg",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "HEIC to JPG", url: "/heic-to-jpg" }]} />
            <SoftwareApplicationSchema toolName="HEIC to JPG Converter" toolSlug="heic-to-jpg" description="Convert iPhone HEIC photos to JPG format online." />
            
            <section className="w-full py-8 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">HEIC to JPG Converter</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Convert iPhone HEIC photos to JPG. View Apple images on any device - Windows, Android, web.</p>
                </div>
                <ToolSwapper />
                <HeicToJpgClient />
            </section>

            <HowToSchema
                toolName="Convert HEIC to JPG"
                description="Learn how to convert iPhone HEIC photos to JPG format using Convertify's free online converter."
                steps={[
                    { name: "Upload HEIC", text: "Select or drag your iPhone HEIC photos to upload" },
                    { name: "Convert", text: "Click convert - photos are processed in your browser" },
                    { name: "Download JPG", text: "Download your converted JPG photos instantly" }
                ]}
            />

            <FAQSchema
                toolName="HEIC to JPG Conversion"
                faqs={[
                    { question: "What is HEIC format?", answer: "HEIC (High Efficiency Image Container) is Apple's default photo format on iPhones. It offers better compression than JPG but isn't compatible with all devices." },
                    { question: "Why convert HEIC to JPG?", answer: "JPG is universally compatible. Convert HEIC to view iPhone photos on Windows, Android, older devices, or to share with others." },
                    { question: "Is this HEIC converter free?", answer: "Yes, Convertify's HEIC to JPG converter is completely free with no file limits, watermarks, or sign-up required." },
                    { question: "Will I lose quality converting HEIC to JPG?", answer: "Minimal quality loss may occur due to re-compression, but our converter maintains high quality output." },
                ]}
            />

            <RelatedTools currentTool="/heic-to-jpg" />
        </div>
    )
}
