import { Metadata } from "next"
import UnlockPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "Unlock PDF - Remove PDF Password Protection Free | Convertify",
    description: "Remove password protection from PDF files for free. Unlock your PDFs instantly with the correct password. Fast and secure.",
    keywords: ["unlock pdf", "remove pdf password", "decrypt pdf", "pdf password remover", "unlock pdf online"],
    alternates: {
        canonical: "/unlock-pdf",
    },
}

const howToSteps = [
    { name: "Upload Protected PDF", text: "Drag and drop your password-protected PDF file." },
    { name: "Enter Password", text: "Type in the password that protects the PDF." },
    { name: "Download Unlocked PDF", text: "Click 'Unlock PDF' and download your unprotected file." },
]

const faqs = [
    {
        question: "Do I need the password to unlock a PDF?",
        answer: "Yes, you must know the correct password to unlock a password-protected PDF. We cannot bypass or crack passwords."
    },
    {
        question: "Is it legal to unlock PDFs?",
        answer: "Yes, it's legal to remove password protection from your own PDFs. Only unlock PDFs that you own or have permission to unlock."
    },
    {
        question: "Will the unlocked PDF be editable?",
        answer: "Yes! Once unlocked, your PDF will have no restrictions. You can edit, copy, print, and share it freely."
    },
]

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        Unlock PDF - Remove Password
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Remove password protection from your PDF files. Fast, free, and secure.
                    </p>
                </div>
                <UnlockPdfClient />
            </section>

            <HowToSchema
                toolName="Unlock Password-Protected PDF"
                description="Learn how to remove password protection from PDF documents using Convertify."
                steps={howToSteps}
            />

            <FAQSchema toolName="PDF Unlocking" faqs={faqs} />
            <RelatedTools currentTool="/unlock-pdf" />
        </div>
    )
}
