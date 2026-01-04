
import { Metadata } from "next"
import TextToPdfClient from "./client"

export const metadata: Metadata = {
    title: "Text to PDF - Convert TXT to PDF Online",
    description: "Convert plain text files (.txt) into portable PDF documents instantly.",
    keywords: ["text to pdf", "txt to pdf", "convert text to pdf"],
}

export default function Page() {
    return <TextToPdfClient />
}
