import { Metadata } from "next"
import PdfToWordClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "PDF to Word Converter - Free Online PDF to DOCX | Convertify",
    description: "Convert PDF to Word (DOCX) online for free. Edit your PDFs easily by converting them to fully editable Word documents. No registration required.",
    keywords: ["pdf to word", "pdf to docx", "convert pdf to word", "pdf converter", "pdf to word converter free"],
    alternates: {
        canonical: "/pdf-to-word",
    },
    openGraph: {
        title: "PDF to Word Converter - Free Online PDF to DOCX | Convertify",
        description: "Convert PDF to Word (DOCX) online for free. Edit your PDFs easily by converting them to fully editable Word documents.",
        url: "/pdf-to-word",
        images: [
            {
                url: "/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: "PDF to Word Converter - Convertify",
            },
        ],
    },
}

const howToSteps = [
    { name: "Upload Your PDF", text: "Click or drag-and-drop your PDF file into the upload area." },
    { name: "Convert to Word", text: "Click the 'Convert to Word' button to start the conversion process." },
    { name: "Download DOCX", text: "Download your converted Word document and start editing immediately." },
]

const faqs = [
    {
        question: "Is this PDF to Word converter really free?",
        answer: "Yes! Convertify's PDF to Word converter is 100% free with no file size limits or conversion limits."
    },
    {
        question: "Will the formatting be preserved?",
        answer: "We do our best to preserve text, formatting, and structure from your PDF. Complex layouts may require minor adjustments in Word."
    },
    {
        question: "Can I convert scanned PDFs to Word?",
        answer: "For scanned PDFs, you'll need OCR (Optical Character Recognition). Try our OCR PDF tool first, then convert to Word."
    },
    {
        question: "Is my PDF file secure?",
        answer: "Absolutely! All conversions happen directly in your browser. Your files never leave your device, ensuring complete privacy."
    }
]

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            {/* Main Tool Section */}
            <section className="w-full py-8 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        PDF to Word Converter
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convert your PDF documents to editable Word files (DOCX) for free. Perfect for editing contracts, reports, and documents.
                    </p>
                </div>
                <PdfToWordClient />
            </section>

            {/* How To Section with Schema */}
            <HowToSchema
                toolName="Convert PDF to Word Online"
                description="Learn how to convert PDF files to editable Word documents using Convertify's free online converter."
                steps={howToSteps}
            />

            {/* FAQ Section with Schema */}
            <FAQSchema
                toolName="PDF to Word Conversion"
                faqs={faqs}
            />

            {/* Related Tools for Internal Linking */}
            <RelatedTools currentTool="/pdf-to-word" />
        </div>
    )
}
