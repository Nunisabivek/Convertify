
import { Metadata } from "next"
import SplitPdfClient from "./client"

export const metadata: Metadata = {
    title: "Split PDF - Extract Pages from PDF Online",
    description: "Separate specific pages from a PDF file or split one PDF into multiple files. Fast, free, and secure.",
    keywords: ["split pdf", "extract pdf pages", "separate pdf", "pdf splitter"],
}

export default function Page() {
    return <SplitPdfClient />
}
