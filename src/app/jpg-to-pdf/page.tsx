
import { Metadata } from "next"
import JpgToPdfClient from "./client"

export const metadata: Metadata = {
    title: "JPG to PDF Converter - Free Online Image to PDF Tool",
    description: "Convert JPG, PNG, and other images to PDF in seconds. No file size limits, no registration required. Fast and secure.",
    keywords: ["jpg to pdf", "image to pdf", "convert jpg to pdf", "jpeg to pdf", "photos to pdf"],
    alternates: {
        canonical: "/jpg-to-pdf",
    },
    openGraph: {
        title: "Convert Images to PDF for Free - Convertify",
        description: "The best free online tool to combine multiple images into a single PDF document.",
        url: "/jpg-to-pdf",
        images: [
            {
                url: "/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: "JPG to PDF - Convertify",
            },
        ],
    },
}

export default function Page() {
    return <JpgToPdfClient />
}
