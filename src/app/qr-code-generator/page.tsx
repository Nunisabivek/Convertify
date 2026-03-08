import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import QrCodeClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "QR Code Generator - Create QR Codes Free | Convertify",
    description: "Generate QR codes from URLs, text, WiFi credentials, and more. Download as PNG. Free, fast, no sign-up required.",
    keywords: ["qr code generator", "create qr code", "free qr code", "qr code maker", "qr code online", "generate qr code"],
    alternates: { canonical: "https://convertify.work/qr-code-generator" },
    openGraph: {
        title: "QR Code Generator - Free Online | Convertify",
        description: "Create QR codes from any text or URL. Free and instant.",
        url: "/qr-code-generator",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "QR Code Generator", url: "/qr-code-generator" }]} />
            <SoftwareApplicationSchema toolName="QR Code Generator" toolSlug="qr-code-generator" description="Generate QR codes from URLs, text, and data online." category="UtilitiesApplication" />
            <section className="w-full py-8 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">QR Code Generator</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Generate QR codes from URLs, text, WiFi credentials, and more. Download as high-quality PNG.</p>
                </div>
                <ToolSwapper />
                <QrCodeClient />
            </section>
            <HowToSchema toolName="Generate a QR Code" description="Create QR codes using Convertify's free generator." steps={[
                { name: "Enter Content", text: "Type a URL, text, or other data" },
                { name: "Generate", text: "QR code is generated instantly as you type" },
                { name: "Download", text: "Download the QR code as a PNG image" }
            ]} />
            <FAQSchema toolName="QR Code Generation" faqs={[
                { question: "What can I put in a QR code?", answer: "You can encode URLs, plain text, WiFi network credentials, phone numbers, email addresses, or any text data up to about 4,000 characters." },
                { question: "What size should my QR code be?", answer: "For printed materials, use at least 512x512 pixels. For business cards, 256x256 is usually sufficient. For posters or large displays, use 1024x1024." },
                { question: "Are the QR codes free to use commercially?", answer: "Yes, QR codes generated with Convertify are completely free for any purpose — personal, commercial, or educational." },
                { question: "Do the QR codes expire?", answer: "No. QR codes encode data directly — they don't expire or require any service to remain functional." },
            ]} />
            <RelatedTools currentTool="/qr-code-generator" />
        </div>
    )
}
