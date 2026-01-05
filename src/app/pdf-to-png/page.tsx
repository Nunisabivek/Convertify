
import { Metadata } from "next"
import PdfToPngClient from "./client"

export const metadata: Metadata = {
    title: "PDF to PNG Converter - Convert PDF to Image High Quality",
    description: "Convert PDF pages to lossless PNG images. Perfect for using PDF content in designs. Free online conversion.",
    keywords: ["pdf to png", "pdf to image", "convert pdf to png", "pdf to picture", "extract images from pdf"],
    alternates: {
        canonical: "/pdf-to-png",
    },
    openGraph: {
        title: "PDF to PNG Converter - High Quality",
        description: "Convert PDF pages to lossless PNG images instantly.",
        url: "/pdf-to-png",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "PDF to PNG - Convertify" }],
    },
}

export default function Page() {
    return <PdfToPngClient />
}
