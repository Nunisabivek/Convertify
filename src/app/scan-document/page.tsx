import { Metadata } from "next"
import Page, { metadata as ocrMetadata } from "../ocr-pdf/page"

export const metadata: Metadata = {
    ...ocrMetadata,
    title: "Scan Document Free Online - Camera to PDF, Shadows Removed",
    description: "Scan documents, receipts, IDs, and notes with your phone camera. Edges are found and straightened, shadows removed, and pages saved as an A4 PDF on your device.",
    alternates: {
        canonical: "https://convertify.work/ocr-pdf",
    },
}

export default Page
