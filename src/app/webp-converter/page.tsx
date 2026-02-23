import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import WebpConverterClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "WebP Converter - Convert Images to/from WebP Free | Convertify",
    description: "Convert images to and from WebP format online for free. Compress JPG, PNG to WebP for smaller files. Convert WebP to JPG/PNG for compatibility. No sign-up.",
    keywords: ["webp converter", "convert to webp", "convert from webp", "webp to jpg", "png to webp", "image converter", "free webp converter"],
    alternates: { canonical: "https://convertify.work/webp-converter" },
    openGraph: {
        title: "WebP Converter - Free Online | Convertify",
        description: "Convert images to and from WebP format. Free, fast, and secure.",
        url: "/webp-converter",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "WebP Converter", url: "/webp-converter" }]} />
            <SoftwareApplicationSchema toolName="WebP Converter" toolSlug="webp-converter" description="Convert images to and from WebP format online for free." />
            
            <section className="w-full py-8 bg-gradient-to-b from-teal-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">WebP Converter</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Convert images to WebP for smaller file sizes. Convert WebP to JPG/PNG for compatibility.</p>
                </div>
                <ToolSwapper />
                <WebpConverterClient />
            </section>

            <HowToSchema
                toolName="Convert Images to/from WebP"
                description="Learn how to convert images to and from WebP format using Convertify's free online converter."
                steps={[
                    { name: "Upload Images", text: "Select JPG, PNG, or WebP images to upload" },
                    { name: "Choose Output", text: "Select output format: WebP, JPG, or PNG" },
                    { name: "Convert", text: "Click convert - images are processed in your browser" },
                    { name: "Download", text: "Download your converted images instantly" }
                ]}
            />

            <FAQSchema
                toolName="WebP Conversion"
                faqs={[
                    { question: "What is WebP format?", answer: "WebP is a modern image format developed by Google that provides superior compression. WebP images are 25-35% smaller than JPG/PNG at equivalent quality." },
                    { question: "Why convert to WebP?", answer: "WebP offers smaller file sizes for faster websites. It supports both lossy and lossless compression, plus transparency." },
                    { question: "Why convert from WebP?", answer: "Some older software and devices don't support WebP. Converting to JPG or PNG ensures compatibility everywhere." },
                    { question: "Is this WebP converter free?", answer: "Yes, Convertify's WebP converter is completely free with no file limits, watermarks, or sign-up required." },
                ]}
            />

            <RelatedTools currentTool="/webp-converter" />
        </div>
    )
}
