import { Metadata } from "next"
import RotatePdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "Rotate PDF - Free PDF Page Rotation Online | Convertify",
    description: "Rotate PDF pages online for free. Turn your PDF pages 90°, 180°, 270°. Rotate all pages or select specific ones. No watermarks.",
    keywords: ["rotate pdf", "rotate pdf pages", "turn pdf", "flip pdf", "pdf rotation"],
    alternates: {
        canonical: "https://convertify.work/rotate-pdf",
    },
}

const howToSteps = [
    { name: "Upload PDF", text: "Drag and drop your PDF file or click to browse." },
    { name: "Choose Rotation", text: "Select rotation angle (90°, 180°, 270°) and which pages to rotate." },
    { name: "Download", text: "Click 'Rotate PDF' and your rotated file will download automatically." },
]

const faqs = [
    {
        question: "Can I rotate specific pages only?",
        answer: "Yes! You can rotate all pages or specify individual pages (e.g., 1,3,5-7) to rotate."
    },
    {
        question: "What rotation angles are available?",
        answer: "You can rotate by 90°, 180°, 270°, or 360° (full rotation)."
    },
    {
        question: "Will the rotation be permanent?",
        answer: "Yes, the rotation is saved in the PDF. You'll download a new rotated version of your file."
    },
]

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-pink-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        Rotate PDF Pages
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Rotate your PDF pages to the correct orientation. Quick, easy, and completely free.
                    </p>
                </div>
                <RotatePdfClient />
            </section>

            <HowToSchema
                toolName="Rotate PDF Pages Online"
                description="Learn how to rotate PDF pages using Convertify's free online tool."
                steps={howToSteps}
            />

            <FAQSchema toolName="PDF Rotation" faqs={faqs} />
            <RelatedTools currentTool="/rotate-pdf" />
        </div>
    )
}
