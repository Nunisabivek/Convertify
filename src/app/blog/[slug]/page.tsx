import Link from "next/link"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { allBlogPosts, indexableBlogSlugs, allIndexableBlogPosts } from "@/lib/blog-data"
import { AdBanner } from "@/components/ads/banner"
import { BlogMarkdown } from "@/components/blog/blog-markdown"
import { Button } from "@/components/ui/button"
import { BlogPostSchema } from "@/components/seo/blog-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { AuthorByline } from "@/components/seo/author-byline"
import { ArrowLeft, Tag } from "lucide-react"

type Props = {
    params: Promise<{ slug: string }>
}

// Indexability is decided by content length in blog-data.ts (single source
// of truth, also consumed by sitemap.ts). Thin posts stay noindex AND out of
// the sitemap so the two signals can never contradict each other.

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const post = allBlogPosts.find((p) => p.slug === slug)
    if (!post) return {}

    const url = `https://convertify.work/blog/${slug}`
    const shouldIndex = indexableBlogSlugs.has(slug)

    return {
        // No " | Convertify Blog" suffix — it costs ~18 of the ~60 characters
        // Google shows and pushes the actual keywords out of the snippet.
        title: post.title,
        description: post.excerpt,
        keywords: post.keywords,
        // Noindex weaker blog posts to improve overall site quality signals
        ...(!shouldIndex && {
            robots: {
                index: false,
                follow: true,
            },
        }),
        alternates: {
            canonical: `https://convertify.work/blog/${slug}`,
        },
        openGraph: {
            type: "article",
            title: post.title,
            description: post.excerpt,
            url: url,
            publishedTime: post.date,
            authors: ["Convertify"],
            tags: post.keywords,
            images: [
                {
                    url: "https://convertify.work/images/og-banner.png",
                    width: 1200,
                    height: 630,
                    alt: post.title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: post.title,
            description: post.excerpt,
            images: ["https://convertify.work/images/og-banner.png"],
        },
    }
}

export async function generateStaticParams() {
    return allBlogPosts.map((post) => ({
        slug: post.slug,
    }))
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params
    const post = allBlogPosts.find((p) => p.slug === slug)

    if (!post) {
        notFound()
    }

    const url = `https://convertify.work/blog/${slug}`

    // Related posts: prefer ones sharing this post's tool, then fill from the
    // rest. Only indexable posts — the old version always showed the same
    // first three entries of blogPosts, thin noindex ones included.
    const candidates = allIndexableBlogPosts.filter(p => p.slug !== slug)
    const relatedPosts = [
        ...candidates.filter(p => p.relatedTool === post.relatedTool),
        ...candidates.filter(p => p.relatedTool !== post.relatedTool),
    ].slice(0, 3)

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Schema Markup */}
            <BlogPostSchema post={post} url={url} />

            <div className="container mx-auto py-12 px-4 max-w-4xl">
                {/* Breadcrumb */}
                <nav className="mb-8 text-sm text-slate-500">
                    <Link href="/" className="hover:text-indigo-600">Home</Link>
                    <span className="mx-2">/</span>
                    <Link href="/blog" className="hover:text-indigo-600">Blog</Link>
                    <span className="mx-2">/</span>
                    <span className="text-slate-700">{post.title.slice(0, 40)}...</span>
                </nav>

                {/* Back Button */}
                <div className="mb-8">
                    <Link href="/blog">
                        <Button variant="ghost" className="pl-0 hover:pl-2 transition-all text-slate-500">
                            <ArrowLeft className="mr-2 w-4 h-4" /> Back to Blog
                        </Button>
                    </Link>
                </div>

                {/* Article Header */}
                <header className="mb-12">
                    <div className="flex flex-wrap gap-3 mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700 capitalize">
                            <Tag className="w-3 h-3 mr-1" />
                            {post.category}
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <p className="text-xl text-slate-600 mb-6 leading-relaxed">
                        {post.excerpt}
                    </p>

                </header>

                <AuthorByline
                    published={post.date}
                    lastReviewed={post.date}
                    readingTime={post.readingTime}
                />

                {/* Article Content — no ad above the fold (Google penalizes
                    "ads above content"). First ad is in-article via the
                    component below, which keeps revenue without hurting CWV. */}
                <article className="prose prose-slate lg:prose-lg max-w-none">
                    <BlogMarkdown content={post.content} />
                </article>

                {/* FAQ Section */}
                {post.faqs && post.faqs.length > 0 && (
                    <section className="mt-12 pt-8 border-t">
                        <h2 className="text-2xl font-bold mb-6 text-slate-900">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {post.faqs.map((faq, index) => (
                                <details
                                    key={index}
                                    className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                                        <h3 className="text-lg font-semibold text-slate-800 pr-4">
                                            {faq.question}
                                        </h3>
                                        <span className="text-indigo-600 group-open:rotate-180 transition-transform shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <polyline points="6 9 12 15 18 9"></polyline>
                                            </svg>
                                        </span>
                                    </summary>
                                    <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </details>
                            ))}
                        </div>
                    </section>
                )}

                {/* CTA to Related Tool */}
                <section className="mt-12 p-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl text-white text-center">
                    <h2 className="text-2xl font-bold mb-4">Ready to Try This Tool?</h2>
                    <p className="text-indigo-100 mb-6 max-w-xl mx-auto">
                        Put what you learned into action. Try Convertify&apos;s free PDF tools now - no sign up required!
                    </p>
                    <Button size="lg" variant="secondary" asChild className="bg-white text-indigo-600 hover:bg-indigo-50">
                        <Link href={post.relatedTool}>
                            Try {post.relatedTool.replace('/', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} Tool &rarr;
                        </Link>
                    </Button>
                </section>

                {/* Middle Ad */}
                <div className="my-8 flex justify-center">
                    <AdBanner variant="rectangle" />
                </div>

                {/* Related Tools */}
                <RelatedTools currentTool={post.relatedTool} limit={4} />

                {/* Related Posts */}
                <section className="mt-12 pt-8 border-t">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900">Related Articles</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {relatedPosts.map((relatedPost) => (
                            <Link
                                key={relatedPost.slug}
                                href={`/blog/${relatedPost.slug}`}
                                className="group p-6 bg-white rounded-xl border border-slate-200 hover:shadow-lg hover:border-indigo-200 transition-all"
                            >
                                <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                                    {relatedPost.category}
                                </span>
                                <h3 className="mt-2 font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {relatedPost.title}
                                </h3>
                                <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                                    {relatedPost.excerpt}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Bottom Ad */}
                <div className="mt-12">
                    <AdBanner variant="rectangle" />
                </div>
            </div>
        </div>
    )
}
