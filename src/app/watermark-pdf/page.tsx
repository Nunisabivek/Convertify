import { Metadata } from "next"
import WatermarkPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "Add Watermark to PDF - Free PDF Watermark Tool | Convertify",
    description: "Add text or image watermarks to your PDF files for free. Protect your documents with custom watermarks. No registration needed.",
    keywords: ["pdf watermark", "add watermark to pdf", "watermark pdf", "pdf stamp", "protect pdf"],
    alternates: {
        canonical: "/watermark-pdf",
    },
}

const howToSteps = [
    { name: "Upload PDF", text: "Drag and drop your PDF file or click to browse." },
    { name: "Customize Watermark", text: "Enter your watermark text and customize color, size, and opacity." },
    { name: "Download", text: "Click 'Add Watermark' and download your watermarked PDF." },
]

const faqs = [
    {
        question: "Can I add image watermarks?",
        answer: "Text watermarks are currently supported. Image watermark support is coming soon!"
    },
    {
        question: "Will the watermark appear on all pages?",
        answer: "Yes, the watermark is automatically applied to all pages of your PDF document."
    },
    {
        question: "Can I control the watermark transparency?",
        answer: "Yes! You can adjust the opacity from 0% (invisible) to 100% (fully opaque) using the opacity slider."
    },
]

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-sky-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        Add Watermark to PDF
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Protect your documents with custom watermarks. Add text watermarks with full control over appearance.
                    </p>
                </div>
                <WatermarkPdfClient />
            </section>

            <HowToSchema
                toolName="Add Watermark to PDF"
                description="Learn how to add custom watermarks to PDF documents using Convertify's free tool."
                steps={howToSteps}
            />

            <FAQSchema toolName="PDF Watermarking" faqs={faqs} />
            <RelatedTools currentTool="/watermark-pdf" />
        </div>
    )
}
