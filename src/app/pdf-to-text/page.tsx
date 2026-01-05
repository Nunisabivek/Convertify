
import { Metadata } from "next"
import PdfToTextClient from "./client"

export const metadata: Metadata = {
    title: "PDF to Text - Extract Text from PDF - Convertify",
    description: "Extract editable text content from any PDF file. Ideal for copying text from documents. Free OCR-like tool.",
    keywords: ["pdf to text", "extract pdf text", "convert pdf to txt", "pdf text extractor", "scrape pdf text"],
    alternates: {
        canonical: "/pdf-to-text",
    },
    openGraph: {
        title: "PDF to Text - Extract Text from PDF",
        description: "Extract editable text content from any PDF file.",
        url: "/pdf-to-text",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "PDF to Text - Convertify" }],
    },
}

export default function Page() {
    return <PdfToTextClient />
}
