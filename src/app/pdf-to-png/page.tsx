
import { Metadata } from "next"
import PdfToPngClient from "./client"

export const metadata: Metadata = {
    title: "PDF to PNG Converter - High Quality PDF to Image",
    description: "Convert PDF pages to lossless PNG images. Perfect for using PDF content in designs.",
    keywords: ["pdf to png", "pdf to image", "convert pdf to png"],
}

export default function Page() {
    return <PdfToPngClient />
}
