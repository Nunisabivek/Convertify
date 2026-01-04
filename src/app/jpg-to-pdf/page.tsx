
import { Metadata } from "next"
import JpgToPdfClient from "./client"

export const metadata: Metadata = {
    title: "JPG to PDF Converter - Free Online Image to PDF Tool",
    description: "Convert JPG, PNG, and other images to PDF in seconds. No file size limits, no registration required. Fast and secure.",
    alternates: {
        canonical: "/jpg-to-pdf",
    },
    openGraph: {
        title: "Convert Images to PDF for Free - Convertify",
        description: "The best free online tool to combine multiple images into a single PDF document.",
        url: "https://convertify.vercel.app/jpg-to-pdf",
        siteName: "Convertify",
        images: [
            {
                url: "/images/og-jpg-pdf.png", // Hypothetical image
                width: 1200,
                height: 630,
            },
        ],
        locale: "en_US",
        type: "website",
    },
}

export default function Page() {
    return <JpgToPdfClient />
}
