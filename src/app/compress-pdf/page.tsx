
import { Metadata } from "next"
import CompressPdfClient from "./client"
import CompressMobileClient from "./mobile-client"
import { IS_MOBILE_BUILD } from "@/lib/is-mobile-build"
import MobileToolFrame from "@/components/mobile/MobileToolFrame"
import { FAQSchema } from "@/components/seo/faq-schema"
import { HowToSchema } from "@/components/seo/howto-schema"
import { BreadcrumbSchema } from "@/components/seo/breadcrumb-schema"
import { SoftwareApplicationSchema } from "@/components/seo/software-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { RelatedFormTools } from "@/components/seo/related-form-tools"
import { RelatedBlogPosts } from "@/components/seo/related-blog-posts"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { ToolDeepGuide } from "@/components/seo/tool-deep-guide"
import { AnswerBlock } from "@/components/seo/answer-block"
import { PostActionAd } from "@/components/ads/post-action-ad"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"
import { allIndexableBlogPosts } from "@/lib/blog-data"
import { getBlogPostsForTool } from "@/lib/tool-blog-mapping"

const seoData = toolSeoData["compress-pdf"]
const contentData = toolContentData["compress-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: {
        canonical: "https://convertify.work/compress-pdf",
    },
    openGraph: {
        title: seoData.title,
        description: seoData.description,
        url: "https://convertify.work/compress-pdf",
        siteName: "Convertify",
        type: "website",
        images: [
            {
                url: "https://convertify.work/images/og-banner.png",
                width: 1200,
                height: 630,
                alt: "Compress PDF for email, 100KB and 200KB forms | Convertify",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: seoData.title,
        description: seoData.description,
        images: ["https://convertify.work/images/og-banner.png"],
    },
}

export default function Page() {
    if (IS_MOBILE_BUILD) return <MobileToolFrame toolId="compress-pdf"><CompressMobileClient /></MobileToolFrame>

    const relatedBlogSlugs = getBlogPostsForTool('compress-pdf')
    const relatedBlogs = allIndexableBlogPosts.filter(post => relatedBlogSlugs.includes(post.slug))

    return (
        <div className="flex flex-col items-center">

            {/* Structured Data Schemas */}
            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "Compress PDF", url: "/compress-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="Convertify PDF Compressor"
                toolSlug="compress-pdf"
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Hit <b>100KB or 200KB</b> for form uploads, or stay under <b>10MB / Gmail’s 25MB</b> for email.
                        Multi-pass compression runs in this browser — the file is never uploaded.
                    </p>
                </div>
                <AnswerBlock
                    question="How do I compress a PDF to 100KB, 200KB, or a size Gmail will accept?"
                    answer="Open this compressor, drop the PDF, and pick 100 KB or 200 KB for government and visa forms, 10 MB for most email desks, or 20 MB if you only need Gmail’s 25 MB headroom. Convertify searches quality until the file is at or under the target. Free, no watermark, and the file stays on your device."
                />
                <CompressPdfClient />
            </section>

            {/* Post-action ad — shown between tool and SEO content */}
            <PostActionAd />

            {/* SEO Content Section */}
            <ToolSeoContent
                toolName="Convertify PDF Compressor"
                toolSlug="compress-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <ToolDeepGuide toolSlug="compress-pdf" toolName="PDF Compressor" />

            <HowToSchema
                toolName="Compress PDF Files with Convertify"
                description="Reduce a PDF to 100KB or 200KB for form uploads, or under 10MB / Gmail’s 25MB for email. Runs in your browser."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="Convertify PDF Compressor"
                faqs={seoData.faqs}
            />

            <RelatedFormTools currentHref="/compress-pdf" />

            <RelatedBlogPosts
                toolSlug="compress-pdf"
                posts={relatedBlogs}
                title="Guides: compress for forms and email"
            />

            <RelatedTools currentTool="/compress-pdf" />
        </div>
    )
}
