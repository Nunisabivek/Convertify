
import { Metadata } from "next"
import TextToPdfClient from "./client"

export const metadata: Metadata = {
    title: "Text to PDF - Convert TXT to PDF Online - Convertify",
    description: "Convert plain text files (.txt) into portable PDF documents instantly. Simple and effective.",
    keywords: ["text to pdf", "txt to pdf", "convert text to pdf", "notepad to pdf"],
    alternates: {
        canonical: "/text-to-pdf",
    },
    openGraph: {
        title: "Text to PDF - Convert TXT to PDF Online",
        description: "Convert plain text files (.txt) into portable PDF documents instantly.",
        url: "/text-to-pdf",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "Text to PDF - Convertify" }],
    },
}

export default function Page() {
    return <TextToPdfClient />
}
