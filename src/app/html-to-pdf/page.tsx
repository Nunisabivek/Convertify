import { Metadata } from "next"
import HtmlToPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "HTML to PDF Converter - Convert Web Pages to PDF Free | Convertify",
    description: "Convert HTML to PDF online for free. Turn web pages, HTML code into PDF documents instantly. No registration required.",
    keywords: ["html to pdf", "webpage to pdf", "convert html to pdf", "url to pdf", "website to pdf"],
    alternates: {
        canonical: "/html-to-pdf",
    },
}

const howToSteps = [
    { name: "Choose Input Method", text: "Select whether you want to convert from a URL or paste HTML code directly." },
    { name: "Enter Content", text: "Paste your website URL or HTML code into the input field." },
    { name: "Convert", text: "Click 'Convert to PDF' and your document will download automatically." },
]

const faqs = [
    {
        question: "Can I convert complete web pages to PDF?",
        answer: "Yes! You can enter any website URL and we'll convert it to a PDF document. For complex pages, try using the HTML code option for better control."
    },
    {
        question: "Will styles and formatting be preserved?",
        answer: "We do our best to preserve basic formatting and text. For complex CSS and JavaScript-heavy pages, some styling may be simplified."
    },
    {
        question: "Is there a file size limit?",
        answer: "No, there are no limits! Convert as many HTML pages as you need, completely free."
    },
]

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-8 bg-gradient-to-b from-rose-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        HTML to PDF Converter
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Convert web pages and HTML code to PDF documents. Perfect for saving articles, documentation, and web content.
                    </p>
                </div>
                <HtmlToPdfClient />
            </section>

            <HowToSchema
                toolName="Convert HTML to PDF Online"
                description="Learn how to convert HTML code and web pages to PDF using Convertify's free converter."
                steps={howToSteps}
            />

            <FAQSchema toolName="HTML to PDF Conversion" faqs={faqs} />
            <RelatedTools currentTool="/html-to-pdf" />
        </div>
    )
}
