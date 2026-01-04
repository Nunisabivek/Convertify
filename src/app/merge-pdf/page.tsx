
import { Metadata } from "next"
import MergePdfClient from "./client"

export const metadata: Metadata = {
    title: "Merge PDF - Combine PDF Files Online for Free",
    description: "Select multiple PDF files and merge them into one document instantly. No watermarks, completely free and secure.",
    keywords: ["merge pdf", "combine pdf", "pdf joiner", "merge pdf files"],
}

export default function Page() {
    return <MergePdfClient />
}
