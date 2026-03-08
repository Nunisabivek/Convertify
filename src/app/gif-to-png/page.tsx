import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import GifToPngClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "GIF to PNG Converter - Convert GIF Images Free | Convertify",
    description: "Convert GIF images to PNG format online for free. Extract high-quality static frames from animated GIFs. No upload, works in your browser.",
    keywords: ["gif to png", "gif converter", "convert gif to png", "gif image converter", "free gif to png"],
    alternates: { canonical: "https://convertify.work/gif-to-png" },
    openGraph: {
        title: "GIF to PNG Converter - Free Online | Convertify",
        description: "Convert GIF images to high-quality PNG format. Free, fast, and private.",
        url: "/gif-to-png",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "GIF to PNG", url: "/gif-to-png" }]} />
            <SoftwareApplicationSchema toolName="GIF to PNG Converter" toolSlug="gif-to-png" description="Convert GIF images to PNG format online for free." />
            <section className="w-full py-8 bg-gradient-to-b from-pink-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">GIF to PNG Converter</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Convert GIF images to high-quality PNG format. Get static frames from animated GIFs.</p>
                </div>
                <ToolSwapper />
                <GifToPngClient />
            </section>
            <HowToSchema toolName="Convert GIF to PNG" description="Convert GIF images to PNG format using Convertify." steps={[
                { name: "Upload GIF", text: "Select or drag your GIF images to upload" },
                { name: "Convert", text: "Click convert - images are processed in your browser" },
                { name: "Download PNG", text: "Download your converted PNG images" }
            ]} />
            <FAQSchema toolName="GIF to PNG Conversion" faqs={[
                { question: "Does this extract frames from animated GIFs?", answer: "Yes, the converter extracts the first frame of an animated GIF and converts it to a high-quality PNG image." },
                { question: "Is PNG better than GIF?", answer: "PNG supports more colors (16 million vs 256), transparency with alpha channel, and better compression for static images. GIF is better only for simple animations." },
                { question: "Is this converter free?", answer: "Yes, completely free with no file limits, no watermarks, and no sign-up required." },
            ]} />
            <RelatedTools currentTool="/gif-to-png" />
        </div>
    )
}
