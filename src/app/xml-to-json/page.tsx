import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import XmlToJsonClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "XML to JSON Converter - Convert XML Free Online | Convertify",
    description: "Convert XML data to JSON format online for free. Preserves element hierarchy and attributes. No upload, works in your browser.",
    keywords: ["xml to json", "xml converter", "convert xml to json", "xml parser", "xml to json online"],
    alternates: { canonical: "https://convertify.work/xml-to-json" },
    openGraph: {
        title: "XML to JSON Converter - Free Online | Convertify",
        description: "Convert XML data to JSON format. Free, fast, and private.",
        url: "/xml-to-json",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "XML to JSON", url: "/xml-to-json" }]} />
            <SoftwareApplicationSchema toolName="XML to JSON Converter" toolSlug="xml-to-json" description="Convert XML data to JSON format online." category="DeveloperApplication" />
            <section className="w-full py-8 bg-gradient-to-b from-orange-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">XML to JSON Converter</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Convert XML data to JSON format. Preserves element hierarchy, attributes, and text content.</p>
                </div>
                <ToolSwapper />
                <XmlToJsonClient />
            </section>
            <HowToSchema toolName="Convert XML to JSON" description="Convert XML data to JSON using Convertify." steps={[
                { name: "Input XML", text: "Paste your XML data or upload a .xml file" },
                { name: "Convert", text: "Click convert to transform XML to JSON" },
                { name: "Copy or Download", text: "Copy JSON to clipboard or download as .json file" }
            ]} />
            <FAQSchema toolName="XML to JSON Conversion" faqs={[
                { question: "How are XML attributes handled?", answer: "XML attributes are converted using the '@' prefix. For example, <item id='1'> becomes {\"@id\": \"1\"} in JSON." },
                { question: "Is the XML parsed locally?", answer: "Yes, all XML parsing happens in your browser using the built-in DOMParser. No data is sent to any server." },
                { question: "What XML features are supported?", answer: "The converter supports elements, attributes, text content, nested structures, and multiple child elements. CDATA sections are treated as text content." },
            ]} />
            <RelatedTools currentTool="/xml-to-json" />
        </div>
    )
}
