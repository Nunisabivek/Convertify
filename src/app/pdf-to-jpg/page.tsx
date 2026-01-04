
import { Metadata } from "next"
import PdfToJpgClient from "./client"

export const metadata: Metadata = {
    title: "PDF to JPG Converter - Convert PDF Pages to Images",
    description: "Turn every page of your PDF into a high-quality JPG image. Download as a ZIP file.",
    keywords: ["pdf to jpg", "pdf to image", "convert pdf to jpg"],
}

export default function Page() {
    return <PdfToJpgClient />
}
