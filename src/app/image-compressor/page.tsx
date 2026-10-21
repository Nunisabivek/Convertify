import { Metadata } from "next"
import { ToolSwapper } from "@/components/tools/tool-swapper"
import { InToolPlayStoreCallout } from "@/components/ui/google-play-badge"
import ImageCompressorClient from "./client"
import ImageCompressMobile from "./mobile-client"
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import MobileToolFrame from "@/components/mobile/MobileToolFrame"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedBlogPosts } from "@/components/seo/related-blog-posts"
import { getBlogPostsForTool } from "@/lib/tool-blog-mapping"
import { allIndexableBlogPosts } from "@/lib/blog-data"
import { ToolDeepGuide } from "@/components/seo/tool-deep-guide"
import { toolDocumentTitle } from "@/lib/document-title"

export const metadata: Metadata = {
    title: toolDocumentTitle("image-compressor", "Image Compressor - Compress Images Online Free | Convertify"),
    description: "Compress JPG, PNG, and WebP images online for free. Each image is re-saved as a JPG at the quality you pick. No sign-up, no watermarks.",
    keywords: ["image compressor", "compress images", "reduce image size", "optimize images", "compress jpg", "compress png", "free image compression"],
    alternates: { canonical: "https://convertify.work/image-compressor" },
    openGraph: {
        title: "Image Compressor - Free Online | Convertify",
        description: "Compress images to smaller JPGs in your browser. Free, fast, and private.",
        url: "/image-compressor",
    },
}

export default function Page() {
    if (IS_MOBILE_BUILD) return <MobileToolFrame toolId="image-compressor"><ImageCompressMobile /></MobileToolFrame>

    const relatedBlogSlugs = getBlogPostsForTool('image-compressor')
    const relatedBlogs = allIndexableBlogPosts.filter(post => relatedBlogSlugs.includes(post.slug))

    return (
        <div className="flex flex-col items-center">
            <BreadcrumbSchema items={[{ name: "Home", url: "/" }, { name: "All Tools", url: "/all-tools" }, { name: "Image Compressor", url: "/image-compressor" }]} />
            <SoftwareApplicationSchema toolName="Image Compressor" toolSlug="image-compressor" description="Compress images online without losing quality." />
            
            <section className="w-full py-8 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">Image Compressor</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">Compress JPG, PNG, and WebP images into smaller JPGs. Pick the quality and see how much you saved.</p>
                </div>
                <ToolSwapper />
                <ImageCompressorClient />
            </section>

            <div className="w-full max-w-4xl px-4 mx-auto">
                <InToolPlayStoreCallout />
            </div>

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
                    { question: "How does image compression work?", answer: "Each image is redrawn in your browser and saved as a JPEG at the quality you pick; lower quality means a smaller file. Metadata such as EXIF is dropped in the process." },
                    { question: "Will compression affect image quality?", answer: "JPEG is lossy, so some detail is lost; at 70–85% it is rarely visible in photos. Use the quality slider (30–95%) to balance size and quality. PNG and WebP files come out as JPG, so transparency is not kept." },
                    { question: "Is this image compressor free?", answer: "Yes, Convertify's image compressor is completely free with no limit on the number of images, no watermarks, and no sign-up required." },
                ]}
            />

            {/* Long-form guide */}
            <ToolDeepGuide toolSlug="image-compressor" toolName="Image Compressor" />

            <RelatedBlogPosts
                toolSlug="image-compressor"
                posts={relatedBlogs}
                title="📚 Guides & Tutorials"
            />

            <RelatedTools currentTool="/image-compressor" />
        </div>
    )
}
