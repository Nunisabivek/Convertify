
import { Metadata } from "next"
import PngToPdfClient from "./client"

export const metadata: Metadata = {
    title: "PNG to PDF Converter - Turn Images into PDF - Convertify",
    description: "Combine multiple PNG images into a single PDF document. Good for screenshots and designs. Free and Private.",
    keywords: ["png to pdf", "image to pdf", "convert png to pdf", "screenshot to pdf", "photos to pdf"],
    alternates: {
        canonical: "/png-to-pdf",
    },
    openGraph: {
        title: "PNG to PDF Converter - Turn Images into PDF",
        description: "Combine multiple PNG images into a single PDF document. Free and Private.",
        url: "/png-to-pdf",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "PNG to PDF - Convertify" }],
    },
}

export default function Page() {
    return <PngToPdfClient />
}
