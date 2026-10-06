import { Metadata } from "next"
import Page, { metadata as ocrMetadata } from "../ocr-pdf/page"

export const metadata: Metadata = {
    ...ocrMetadata,
    title: "Scan Document Free Online - Camera to PDF with Xerox Filters",
    description: "Scan documents, receipts, IDs, and notes with your phone camera. Apply Xerox photocopy filters, clean shadows, and create high-quality PDFs on your device.",
    alternates: {
        canonical: "https://convertify.work/ocr-pdf",
    },
}

export default Page
