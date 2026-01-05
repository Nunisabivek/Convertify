
import { Metadata } from "next"
import PdfToJpgClient from "./client"

export const metadata: Metadata = {
    title: "PDF to JPG Converter - Convert PDF Pages to Images - Convertify",
    description: "Turn every page of your PDF into a high-quality JPG image. Download as a ZIP file. Free and unlimited.",
    keywords: ["pdf to jpg", "pdf to image", "convert pdf to jpg", "pdf to jpeg", "save pdf as jpg"],
    alternates: {
        canonical: "/pdf-to-jpg",
    },
    openGraph: {
        title: "PDF to JPG Converter - Convert PDF Pages to Images",
        description: "Turn every page of your PDF into a high-quality JPG image.",
        url: "/pdf-to-jpg",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "PDF to JPG - Convertify" }],
    },
}

export default function Page() {
    return <PdfToJpgClient />
}
