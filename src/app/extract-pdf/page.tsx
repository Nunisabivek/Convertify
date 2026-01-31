import { Metadata } from "next"
import { redirect } from "next/navigation"

// This page captures "extract pdf" search queries and redirects to Split PDF
// Users searching for "extract pdf pages" will find this, improving SEO coverage

export const metadata: Metadata = {
    title: "Extract PDF Pages Online Free - PDF Page Extractor | Convertify",
    description: "Extract specific pages from PDF documents online free. Pull out individual pages or page ranges from any PDF. No sign-up, no watermarks, no limits!",
    keywords: ["extract pdf", "extract pdf pages", "extract pages from pdf", "pdf page extractor", "pull pages from pdf", "extract specific pages pdf", "get pages from pdf free"],
    alternates: {
        canonical: "https://convertify.work/split-pdf",
    },
    robots: {
        index: true,
        follow: true,
    },
}

export default function ExtractPdfPage() {
    // Redirect to split-pdf which handles page extraction
    redirect("/split-pdf")
}
