import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import MarkdownToPdfClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "Markdown to PDF Converter - Convert MD Free | Convertify",
    description: "Convert Markdown documents to PDF online for free. Supports headings, lists, code blocks, and tables. No upload, works in your browser.",
    keywords: ["markdown to pdf", "md to pdf", "convert markdown to pdf", "markdown converter", "github markdown to pdf"],
    alternates: { canonical: "https://convertify.work/markdown-to-pdf" },
    openGraph: {
        title: "Markdown to PDF Converter - Free Online | Convertify",
        description: "Convert Markdown to professionally formatted PDF documents.",
        url: "/markdown-to-pdf",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "Markdown to PDF", url: "/markdown-to-pdf" }]} />
            <SoftwareApplicationSchema toolName="Markdown to PDF Converter" toolSlug="markdown-to-pdf" description="Convert Markdown documents to PDF format online." category="DeveloperApplication" />
            <section className="w-full py-8 bg-gradient-to-b from-violet-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Markdown to PDF Converter</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Convert Markdown documents to professional PDF files. Supports GitHub-flavored Markdown.</p>
                </div>
                <ToolSwapper />
                <MarkdownToPdfClient />
            </section>
            <HowToSchema toolName="Convert Markdown to PDF" description="Convert Markdown to PDF using Convertify." steps={[
                { name: "Write or Upload", text: "Type Markdown or upload a .md file" },
                { name: "Preview", text: "See a live preview of the formatted document" },
                { name: "Download PDF", text: "Click download to get your PDF" }
            ]} />
            <FAQSchema toolName="Markdown to PDF Conversion" faqs={[
                { question: "What Markdown syntax is supported?", answer: "Headings, bold, italic, links, ordered/unordered lists, code blocks, blockquotes, and horizontal rules are all supported." },
                { question: "Can I upload .md files?", answer: "Yes, you can upload any .md or .markdown file, or paste Markdown content directly into the editor." },
                { question: "Is formatting preserved in the PDF?", answer: "Yes, headings, lists, code blocks, and other formatting are rendered in the PDF with professional styling." },
            ]} />
            <RelatedTools currentTool="/markdown-to-pdf" />
        </div>
    )
}
