import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import PngToJpgClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "PNG to JPG Converter - Convert PNG to JPEG Free Online | Convertify",
    description: "Convert PNG images to JPG format online for free. Reduce file size while maintaining quality. No sign-up, no watermarks, works on all devices.",
    keywords: ["png to jpg", "png to jpeg", "convert png to jpg", "image converter", "compress png", "free png converter"],
    alternates: { canonical: "https://convertify.work/png-to-jpg" },
    openGraph: {
        title: "PNG to JPG Converter - Free Online | Convertify",
        description: "Convert PNG images to JPG format. Free, fast, and secure.",
        url: "/png-to-jpg",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "PNG to JPG", url: "/png-to-jpg" }]} />
            <SoftwareApplicationSchema toolName="PNG to JPG Converter" toolSlug="png-to-jpg" description="Convert PNG images to JPG format for smaller file sizes." />
            
            <section className="w-full py-8 bg-gradient-to-b from-yellow-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">PNG to JPG Converter</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Convert PNG images to JPG format. Smaller file sizes, perfect for web and sharing.</p>
                </div>
                <ToolSwapper />
                <PngToJpgClient />
            </section>

            <HowToSchema
                toolName="Convert PNG to JPG"
                description="Learn how to convert PNG images to JPG format using Convertify's free online converter."
                steps={[
                    { name: "Upload PNG", text: "Select or drag your PNG images to upload" },
                    { name: "Convert", text: "Click convert - images are processed locally in your browser" },
                    { name: "Download JPG", text: "Download your converted JPG images instantly" }
                ]}
            />

            <FAQSchema
                toolName="PNG to JPG Conversion"
                faqs={[
                    { question: "Why convert PNG to JPG?", answer: "JPG files are smaller than PNG, making them ideal for photos and web images where smaller file size matters more than transparency." },
                    { question: "Will I lose transparency converting PNG to JPG?", answer: "Yes, JPG doesn't support transparency. Transparent areas will be replaced with a white background." },
                    { question: "Is this PNG to JPG converter free?", answer: "Yes, Convertify's PNG to JPG converter is completely free with no file limits, watermarks, or sign-up required." },
                ]}
            />

            <RelatedTools currentTool="/png-to-jpg" />
        </div>
    )
}
