
import { Metadata } from "next"
import WordToPdfClient from "./client"

export const metadata: Metadata = {
    title: "Word to PDF Converter - DOCX to PDF Online",
    description: "Convert Microsoft Word documents (DOCX) to PDF format seamlessly. Preserves formatting and layout.",
    keywords: ["word to pdf", "docx to pdf", "doc to pdf", "convert word to pdf"],
}

export default function Page() {
    return <WordToPdfClient />
}
