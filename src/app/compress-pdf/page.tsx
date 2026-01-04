
import { Metadata } from "next"
import CompressPdfClient from "./client"

export const metadata: Metadata = {
    title: "Compress PDF - Reduce PDF File Size Online",
    description: "Optimize your PDF files for email and web. Reduce file size by up to 90% without losing quality.",
    keywords: ["compress pdf", "shrink pdf", "reduce pdf size", "optimize pdf"],
}

export default function Page() {
    return <CompressPdfClient />
}
