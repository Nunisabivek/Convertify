
import { Metadata } from "next"
import CompressPdfClient from "./client"

export const metadata: Metadata = {
    title: "Compress PDF - Reduce PDF File Size Online - Convertify",
    description: "Optimize your PDF files for email and web. Reduce file size by up to 90% without losing quality. Free and secure.",
    keywords: ["compress pdf", "shrink pdf", "reduce pdf size", "optimize pdf", "pdf compressor online", "reduce pdf file size"],
    alternates: {
        canonical: "/compress-pdf",
    },
    openGraph: {
        title: "Compress PDF - Reduce PDF File Size Online",
        description: "Optimize your PDF files for email and web. Reduce file size by up to 90%.",
        url: "/compress-pdf",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "Compress PDF - Convertify" }],
    },
}

export default function Page() {
    return <CompressPdfClient />
}
