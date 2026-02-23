import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import ResizeImageClient from "./client"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"

export const metadata: Metadata = {
    title: "Resize Image - Change Image Dimensions Free Online | Convertify",
    description: "Resize images to any dimension online for free. Change width and height, maintain aspect ratio. Works with JPG, PNG, WebP. No sign-up required.",
    keywords: ["resize image", "change image size", "image resizer", "resize photo", "image dimensions", "scale image", "free image resizer"],
    alternates: { canonical: "https://convertify.work/resize-image" },
    openGraph: {
        title: "Resize Image - Free Online | Convertify",
        description: "Resize images to any dimension. Free, fast, and secure.",
        url: "/resize-image",
    },
}

export default function Page() {
    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "Resize Image", url: "/resize-image" }]} />
            <SoftwareApplicationSchema toolName="Image Resizer" toolSlug="resize-image" description="Resize images to any dimension online for free." />
            
            <section className="w-full py-8 bg-gradient-to-b from-orange-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Resize Image</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Change image dimensions to any size. Maintain aspect ratio or customize freely.</p>
                </div>
                <ToolSwapper />
                <ResizeImageClient />
            </section>

            <HowToSchema
                toolName="Resize Images"
                description="Learn how to resize images using Convertify's free online image resizer."
                steps={[
                    { name: "Upload Image", text: "Select or drag your images to upload" },
                    { name: "Set Dimensions", text: "Enter new width and height or use presets" },
                    { name: "Resize", text: "Click resize - images are processed in your browser" },
                    { name: "Download", text: "Download your resized images instantly" }
                ]}
            />

            <FAQSchema
                toolName="Image Resizing"
                faqs={[
                    { question: "How do I resize an image without losing quality?", answer: "When making images smaller, quality is preserved. For enlarging, our tool uses smooth interpolation to minimize quality loss." },
                    { question: "What is aspect ratio?", answer: "Aspect ratio is the relationship between width and height. Locking it ensures your image doesn't stretch or distort when resized." },
                    { question: "Is this image resizer free?", answer: "Yes, Convertify's image resizer is completely free with no file limits, watermarks, or sign-up required." },
                ]}
            />

            <RelatedTools currentTool="/resize-image" />
        </div>
    )
}
