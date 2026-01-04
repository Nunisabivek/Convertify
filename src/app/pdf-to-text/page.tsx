
import { Metadata } from "next"
import PdfToTextClient from "./client"

export const metadata: Metadata = {
    title: "PDF to Text - Extract Text from PDF",
    description: "Extract editable text content from any PDF file. Ideal for copying text from documents.",
    keywords: ["pdf to text", "extract pdf text", "convert pdf to txt"],
}

export default function Page() {
    return <PdfToTextClient />
}
