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
import { RelatedBlogPosts } from "@/components/seo/related-blog-posts"
import { ToolSeoContent } from "@/components/seo/tool-seo-content"
import { ToolDeepGuide } from "@/components/seo/tool-deep-guide"
import { AnswerBlock } from "@/components/seo/answer-block"
import { KycRelatedTools } from "@/components/seo/kyc-related-tools"
import { PostActionAd } from "@/components/ads/post-action-ad"
import { toolContentData } from "@/lib/tool-content-data"
import { toolSeoData } from "@/lib/seo-data"
import { allIndexableBlogPosts } from "@/lib/blog-data"
import { getBlogPostsForTool } from "@/lib/tool-blog-mapping"
import Link from "next/link"

const seoData = toolSeoData["compress-pdf"]
const contentData = toolContentData["compress-pdf"]

export const metadata: Metadata = {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    robots: { index: true, follow: true },
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
                alt: seoData.h1,
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

            <BreadcrumbSchema
                items={[
                    { name: "Home", url: "/" },
                    { name: "All Tools", url: "/all-tools" },
                    { name: "Compress PDF", url: "/compress-pdf" }
                ]}
            />
            <SoftwareApplicationSchema
                toolName="PDF Compressor"
                toolSlug="compress-pdf"
                description={seoData.description}
            />

            <section className="w-full py-8 bg-gradient-to-b from-green-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
                        {seoData.h1}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Pick <b>50 KB, 100 KB or 200 KB</b> and compress a scan for UPSC, EPFO, Passport Seva or bank KYC.
                        The file stays on this device.
                    </p>
                </div>
                <AnswerBlock
                    question="How do I compress a PDF to 100KB or 200KB for a government form?"
                    answer="Open Compress PDF, upload the file, tap 50 KB, 100 KB or 200 KB, and download. Use this when the form only sets a maximum. If it also sets a minimum (20–50 KB, 50–200 KB), use Fit to size instead."
                />
                <CompressPdfClient />
            </section>

            <PostActionAd />

            <section className="w-full max-w-4xl mx-auto px-4 py-10">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">When 100 KB is a document, not a photo</h2>
                <p className="text-slate-700 leading-relaxed mb-4">
                    India portals mix two different problems. A marksheet, ID proof or address PDF is usually “under 100 KB” or “under 200 KB” — a ceiling. A photograph or signature is often “20–300 KB” or “20–50 KB” — a band. This page is the ceiling tool.{" "}
                    <Link href="/fit-to-size" className="text-indigo-600 font-medium hover:underline">Fit to size</Link>{" "}
                    is the band tool.{" "}
                    <Link href="/passport-photo" className="text-indigo-600 font-medium hover:underline">Passport photo</Link>{" "}
                    is the pixel box (630×810, 413×531, 200×230, 140×60).
                </p>
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-left text-slate-700">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Typical field</th>
                                <th className="px-4 py-3 font-semibold">Usual cap</th>
                                <th className="px-4 py-3 font-semibold">Use</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                            <tr>
                                <td className="px-4 py-3">UPSC / SSC certificate or ID PDF</td>
                                <td className="px-4 py-3">100 KB or 200 KB max</td>
                                <td className="px-4 py-3">This compressor</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">EPFO KYC document</td>
                                <td className="px-4 py-3">Often 100–200 KB max</td>
                                <td className="px-4 py-3">This compressor</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">Passport Seva supporting PDF</td>
                                <td className="px-4 py-3">Small max, varies by doc</td>
                                <td className="px-4 py-3">This compressor</td>
                            </tr>
                            <tr>
                                <td className="px-4 py-3">Photo / signature with min and max KB</td>
                                <td className="px-4 py-3">e.g. 20–50 or 20–300 KB</td>
                                <td className="px-4 py-3"><Link href="/fit-to-size" className="text-indigo-600 hover:underline">Fit to size</Link></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <p className="text-sm text-slate-500 mt-3">
                    Limits move between notifications. If the PDF is still over the cap, drop quality in Advanced, or split a multi-page scan first.
                </p>
            </section>

            <ToolSeoContent
                toolName="PDF Compressor"
                toolSlug="compress-pdf"
                description={contentData.description}
                features={contentData.features}
                useCases={contentData.useCases}
                keywords={contentData.keywords}
            />

            <ToolDeepGuide toolSlug="compress-pdf" toolName="PDF Compressor" />

            <HowToSchema
                toolName="Compress a PDF to 100KB or 200KB"
                description="Reduce a PDF to 50KB, 100KB or 200KB in the browser for India form uploads. No sign-up."
                steps={seoData.howToSteps}
            />

            <FAQSchema
                toolName="compressing a PDF to 50KB, 100KB or 200KB"
                faqs={seoData.faqs}
            />

            <KycRelatedTools currentHref="/compress-pdf" />

            <RelatedBlogPosts
                toolSlug="compress-pdf"
                posts={relatedBlogs}
                title="Guides: hitting 100KB on a form"
            />

            <RelatedTools currentTool="/compress-pdf" />
        </div>
    )
}
