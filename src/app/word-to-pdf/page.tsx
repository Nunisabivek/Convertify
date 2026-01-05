
import { Metadata } from "next"
import WordToPdfClient from "./client"

export const metadata: Metadata = {
    title: "Word to PDF Converter - DOCX to PDF Online - Convertify",
    description: "Convert Microsoft Word documents (DOCX) to PDF format seamlessly. Preserves formatting and layout.",
    keywords: ["word to pdf", "docx to pdf", "doc to pdf", "convert word to pdf", "ms word to pdf"],
    alternates: {
        canonical: "/word-to-pdf",
    },
    openGraph: {
        title: "Word to PDF Converter - DOCX to PDF Online",
        description: "Convert Microsoft Word documents (DOCX) to PDF format seamlessly.",
        url: "/word-to-pdf",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "Word to PDF - Convertify" }],
    },
}

export default function Page() {
    return <WordToPdfClient />
}
