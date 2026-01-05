
import { Metadata } from "next"
import MergePdfClient from "./client"

export const metadata: Metadata = {
    title: "Merge PDF - Combine PDF Files Online for Free",
    description: "Select multiple PDF files and merge them into one document instantly. No watermarks, completely free and secure.",
    keywords: ["merge pdf", "combine pdf", "pdf joiner", "merge pdf files", "pdf merger online", "combine pdf files free"],
    alternates: {
        canonical: "/merge-pdf",
    },
    openGraph: {
        title: "Merge PDF - Combine PDF Files Online for Free",
        description: "Select multiple PDF files and merge them into one document instantly.",
        url: "/merge-pdf",
        images: [
            {
                url: "/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: "Merge PDF - Convertify",
            },
        ],
    },
}

export default function Page() {
    return <MergePdfClient />
}
