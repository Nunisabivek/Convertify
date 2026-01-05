
import { Metadata } from "next"
import SplitPdfClient from "./client"

export const metadata: Metadata = {
    title: "Split PDF - Extract Pages from PDF Online - Convertify",
    description: "Separate specific pages from a PDF file or split one PDF into multiple files. Fast, free, and secure online tool.",
    keywords: ["split pdf", "extract pdf pages", "separate pdf", "pdf splitter", "cut pdf pages", "remove pdf pages"],
    alternates: {
        canonical: "/split-pdf",
    },
    openGraph: {
        title: "Split PDF - Extract Pages from PDF Online",
        description: "Separate specific pages from a PDF file or split one PDF into multiple files.",
        url: "/split-pdf",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "Split PDF - Convertify" }],
    },
}

export default function Page() {
    return <SplitPdfClient />
}
