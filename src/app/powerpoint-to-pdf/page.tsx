import GenericToolPage from "@/components/tools/generic-page"

import { Metadata } from "next"

export const metadata: Metadata = {
    title: "PowerPoint to PDF Converter - PPT to PDF Online - Convertify",
    description: "Convert PowerPoint presentations (PPT, PPTX) to PDF. Preserve your slides and layout perfectly.",
    keywords: ["powerpoint to pdf", "ppt to pdf", "pptx to pdf", "convert powerpoint to pdf", "slides to pdf"],
    alternates: {
        canonical: "/powerpoint-to-pdf",
    },
    openGraph: {
        title: "PowerPoint to PDF Converter - PPT to PDF Online",
        description: "Convert PowerPoint presentations to PDF. Preserve your slides and layout.",
        url: "/powerpoint-to-pdf",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "PowerPoint to PDF - Convertify" }],
    },
}

export default function Page() {
    return <GenericToolPage />
}
