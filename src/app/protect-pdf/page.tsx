import { Metadata } from "next"
import ProtectPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "Protect PDF with Password - Add Password to PDF Free | Convertify",
    description: "Add password protection to your PDF files for free. Secure your documents with encryption. Easy, fast, and safe.",
    keywords: ["protect pdf", "password protect pdf", "secure pdf", "encrypt pdf", "add password to pdf"],
    alternates: {
        canonical: "https://convertify.work/protect-pdf",
    },
}

const howToSteps = [
    { name: "Upload PDF", text: "Drag and drop your PDF file or click to browse." },
    { name: "Set Password", text: "Enter a password (minimum 4 characters) and confirm it." },
    { name: "Download Protected PDF", text: "Click 'Protect PDF' and download your password-protected file." },
]

const faqs = [
    {
        question: "How secure is password protection?",
        answer: "Password protection adds encryption to your PDF, making it unreadable without the correct password. Use a strong password for maximum security."
    },
    {
        question: "Can I remove the password later?",
        answer: "Yes! Use our Unlock PDF tool to remove password protection if you have the original password."
    },
    {
        question: "What if I forget my password?",
        answer: "Unfortunately, there's no way to recover a password-protected PDF if you forget the password. Always keep your password in a safe place."
    },
]

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-red-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        Protect PDF with Password
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Secure your sensitive documents with password protection. Easy to use, completely free.
                    </p>
                </div>
                <ProtectPdfClient />
            </section>

            <HowToSchema
                toolName="Password Protect PDF"
                description="Learn how to add password protection to your PDF documents using Convertify."
                steps={howToSteps}
            />

            <FAQSchema toolName="PDF Password Protection" faqs={faqs} />
            <RelatedTools currentTool="/protect-pdf" />
        </div>
    )
}
