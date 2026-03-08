import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import TiffToPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "TIFF to PDF Converter - Convert TIFF Images Free | Convertify",
    description: "Convert TIFF images to PDF documents online for free. Support for multi-page TIFF files. No upload needed, works in your browser.",
    keywords: ["tiff to pdf", "tif to pdf", "convert tiff to pdf", "tiff converter", "scan to pdf"],
    alternates: { canonical: "https://convertify.work/tiff-to-pdf" },
    openGraph: {
        title: "TIFF to PDF Converter - Free Online | Convertify",
        description: "Convert TIFF images to PDF documents. Free, secure, browser-based.",
        url: "/tiff-to-pdf",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "TIFF to PDF", url: "/tiff-to-pdf" }]} />
            <SoftwareApplicationSchema toolName="TIFF to PDF Converter" toolSlug="tiff-to-pdf" description="Convert TIFF images to PDF documents online." />
            <section className="w-full py-8 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">TIFF to PDF Converter</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Convert TIFF images to PDF documents. Perfect for scanned documents and archival files.</p>
                </div>
                <ToolSwapper />
                <TiffToPdfClient />
            </section>
            <HowToSchema toolName="Convert TIFF to PDF" description="Convert TIFF images to PDF using Convertify." steps={[
                { name: "Upload TIFF", text: "Select or drag your TIFF files to upload" },
                { name: "Convert", text: "Click convert - files are processed in your browser" },
                { name: "Download PDF", text: "Download your converted PDF documents" }
            ]} />
            <FAQSchema toolName="TIFF to PDF Conversion" faqs={[
                { question: "Can I convert multi-page TIFF files?", answer: "The converter processes TIFF images and creates PDF documents from them. Each TIFF image becomes a page in the PDF." },
                { question: "What is TIFF format used for?", answer: "TIFF (Tagged Image File Format) is commonly used for high-quality scanned documents, medical imaging, and professional photography due to its lossless compression." },
                { question: "Is the conversion free?", answer: "Yes, completely free with no watermarks, no sign-up, and no file limits." },
            ]} />
            <RelatedTools currentTool="/tiff-to-pdf" />
        </div>
    )
}
