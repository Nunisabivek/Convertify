import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import ImageCompressorClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "Image Compressor - Compress Images Online Free | Convertify",
    description: "Compress JPG, PNG, and WebP images online for free. Reduce file size by up to 80% without losing quality. No sign-up, no watermarks.",
    keywords: ["image compressor", "compress images", "reduce image size", "optimize images", "compress jpg", "compress png", "free image compression"],
    alternates: { canonical: "https://convertify.work/image-compressor" },
    openGraph: {
        title: "Image Compressor - Free Online | Convertify",
        description: "Compress images without losing quality. Free, fast, and secure.",
        url: "/image-compressor",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "Image Compressor", url: "/image-compressor" }]} />
            <SoftwareApplicationSchema toolName="Image Compressor" toolSlug="image-compressor" description="Compress images online without losing quality." />
            
            <section className="w-full py-8 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Image Compressor</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Compress JPG, PNG, and WebP images. Reduce file size by up to 80% while maintaining quality.</p>
                </div>
                <ToolSwapper />
                <ImageCompressorClient />
            </section>

            <HowToSchema
                toolName="Compress Images"
                description="Learn how to compress images using Convertify's free online image compressor."
                steps={[
                    { name: "Upload Images", text: "Select or drag your images to upload" },
                    { name: "Choose Quality", text: "Select compression level (higher = better quality, larger file)" },
                    { name: "Compress", text: "Click compress - images are processed in your browser" },
                    { name: "Download", text: "Download your compressed images instantly" }
                ]}
            />

            <FAQSchema
                toolName="Image Compression"
                faqs={[
                    { question: "How does image compression work?", answer: "Our tool uses smart compression algorithms to reduce file size while preserving visual quality. It removes unnecessary metadata and optimizes encoding." },
                    { question: "Will compression affect image quality?", answer: "Minimal quality loss occurs with our smart compression. You can adjust the quality slider to find the perfect balance between size and quality." },
                    { question: "Is this image compressor free?", answer: "Yes, Convertify's image compressor is completely free with no file limits, watermarks, or sign-up required." },
                ]}
            />

            <RelatedTools currentTool="/image-compressor" />
        </div>
    )
}
