import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import JsonToCsvClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "JSON to CSV Converter - Convert JSON Free Online | Convertify",
    description: "Convert JSON data to CSV format online for free. Flatten nested objects, export to spreadsheet-ready CSV. No upload, works in your browser.",
    keywords: ["json to csv", "json converter", "convert json to csv", "json to spreadsheet", "json to excel", "api data export"],
    alternates: { canonical: "https://convertify.work/json-to-csv" },
    openGraph: {
        title: "JSON to CSV Converter - Free Online | Convertify",
        description: "Convert JSON data to CSV spreadsheet format. Free and private.",
        url: "/json-to-csv",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "JSON to CSV", url: "/json-to-csv" }]} />
            <SoftwareApplicationSchema toolName="JSON to CSV Converter" toolSlug="json-to-csv" description="Convert JSON data to CSV spreadsheet format online." category="DeveloperApplication" />
            <section className="w-full py-8 bg-gradient-to-b from-blue-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">JSON to CSV Converter</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Convert JSON arrays to CSV format. Flatten nested objects for spreadsheet-ready output.</p>
                </div>
                <ToolSwapper />
                <JsonToCsvClient />
            </section>
            <HowToSchema toolName="Convert JSON to CSV" description="Convert JSON data to CSV using Convertify." steps={[
                { name: "Input JSON", text: "Paste your JSON data or upload a .json file" },
                { name: "Convert", text: "Click convert to transform JSON to CSV format" },
                { name: "Download CSV", text: "Copy or download your CSV output" }
            ]} />
            <FAQSchema toolName="JSON to CSV Conversion" faqs={[
                { question: "What JSON format is supported?", answer: "The converter supports JSON arrays of objects, e.g. [{\"name\":\"John\",\"age\":30}]. Each object becomes a row, and keys become column headers." },
                { question: "How are nested objects handled?", answer: "Nested objects are flattened using dot notation. For example, {\"address\":{\"city\":\"NYC\"}} becomes a column named 'address.city'." },
                { question: "Can I open the CSV in Excel?", answer: "Yes, the output CSV file can be opened directly in Excel, Google Sheets, or any spreadsheet application." },
            ]} />
            <RelatedTools currentTool="/json-to-csv" />
        </div>
    )
}
