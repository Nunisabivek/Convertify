import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import CsvToJsonClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { toolContentData } from "@/lib/tool-content-data"

const contentData = toolContentData["csv-to-json"]

export const metadata: Metadata = {
    title: "CSV to JSON Converter - Convert CSV Files to JSON Free | Convertify",
    description: "Convert CSV data to JSON format online for free. Smart parsing handles quoted fields, custom delimiters, and large files. No sign-up required, 100% private.",
    keywords: ["csv to json", "convert csv to json", "csv to json converter", "csv to json online", "csv to json free", "csv parser", "spreadsheet to json"],
    alternates: { canonical: "https://convertify.work/csv-to-json" },
    openGraph: {
        title: "CSV to JSON Converter - Free Online | Convertify",
        description: "Convert CSV spreadsheet data to structured JSON format instantly. Free, fast, and private.",
        url: "/csv-to-json",
        images: [{ url: "/images/og-banner.png", width: 1200, height: 630, alt: "CSV to JSON - Convertify" }],
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "CSV to JSON", url: "/csv-to-json" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="CSV to JSON Converter"
                toolSlug="csv-to-json"
                description="Convert CSV spreadsheet data to structured JSON format online for free."
            />

            <section className="w-full py-8 bg-gradient-to-b from-emerald-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        CSV to JSON Converter
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Transform CSV spreadsheet data into structured JSON format instantly. Handles quoted fields, custom delimiters, and large files.
                    </p>
                </div>
                <ToolSwapper />
                <CsvToJsonClient />
            </section>

            <ToolSeoContent
                toolName="CSV to JSON Converter"
                toolSlug="csv-to-json"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <HowToSchema
                toolName="Convert CSV to JSON"
                description="Learn how to convert CSV data to JSON format using Convertify's free online converter."
                steps={[
                    { name: "Input CSV Data", text: "Paste your CSV text or upload a .csv file." },
                    { name: "Parse & Convert", text: "Click Convert to parse CSV and generate JSON output." },
                    { name: "Copy or Download", text: "Copy the JSON to clipboard or download as a .json file." }
                ]}
            />

            <FAQSchema
                toolName="CSV to JSON Conversion"
                faqs={[
                    { question: "How does CSV to JSON conversion work?", answer: "The converter reads your CSV data, uses the first row as JSON keys (headers), and maps each subsequent row to a JSON object. The result is a JSON array of objects." },
                    { question: "Does it handle quoted CSV fields with commas?", answer: "Yes! Our parser correctly handles quoted fields, so commas inside quotes are preserved as part of the value, not treated as delimiters." },
                    { question: "Is there a file size limit?", answer: "No strict limit. Processing happens in your browser, so performance depends on your device. Files with thousands of rows work efficiently." },
                    { question: "Is my data safe?", answer: "Absolutely. All conversion happens locally in your browser. Your CSV data is never uploaded to any server." },
                ]}
            />

            <RelatedTools currentTool="/csv-to-json" />
        </div>
    )
}
