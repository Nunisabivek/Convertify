import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import Base64Client from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "Base64 Encoder & Decoder - Free Online Tool | Convertify",
    description: "Encode text and files to Base64, or decode Base64 strings back to original format. Free, instant, works in your browser with no uploads.",
    keywords: ["base64 encoder", "base64 decoder", "base64 online", "encode base64", "decode base64", "base64 converter"],
    alternates: { canonical: "https://convertify.work/base64" },
    openGraph: {
        title: "Base64 Encoder & Decoder - Free Online | Convertify",
        description: "Encode and decode Base64 strings and files. Free and private.",
        url: "/base64",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "Base64 Encoder/Decoder", url: "/base64" }]} />
            <SoftwareApplicationSchema toolName="Base64 Encoder/Decoder" toolSlug="base64" description="Encode and decode Base64 strings and files online." category="DeveloperApplication" />
            <section className="w-full py-8 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Base64 Encoder & Decoder</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Encode text or files to Base64, or decode Base64 strings. Everything processed locally.</p>
                </div>
                <ToolSwapper />
                <Base64Client />
            </section>
            <HowToSchema toolName="Encode or Decode Base64" description="Use Convertify's Base64 tool to encode or decode data." steps={[
                { name: "Choose Mode", text: "Select Encode or Decode mode" },
                { name: "Input Data", text: "Paste text, Base64 string, or upload a file" },
                { name: "Get Result", text: "Copy the encoded/decoded output or download it" }
            ]} />
            <FAQSchema toolName="Base64 Encoding" faqs={[
                { question: "What is Base64 encoding?", answer: "Base64 is a binary-to-text encoding scheme that represents binary data as ASCII text. It's commonly used for embedding images in HTML/CSS, email attachments, and API data transfer." },
                { question: "Can I encode files to Base64?", answer: "Yes, you can upload any file (images, documents, etc.) and get its Base64 representation. You can also paste text to encode." },
                { question: "Is the data processed securely?", answer: "Yes, all encoding and decoding happens locally in your browser. No data is sent to any server." },
            ]} />
            <RelatedTools currentTool="/base64" />
        </div>
    )
}
