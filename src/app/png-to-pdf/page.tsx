
import { Metadata } from "next"
import PngToPdfClient from "./client"

export const metadata: Metadata = {
    title: "PNG to PDF Converter - Turn Images into PDF",
    description: "Combine multiple PNG images into a single PDF document. Good for screenshots and designs.",
    keywords: ["png to pdf", "image to pdf", "convert png to pdf"],
}

export default function Page() {
    return <PngToPdfClient />
}
