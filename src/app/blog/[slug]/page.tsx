import Link from "next/link"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { blogPosts, BlogPost } from "@/lib/blog-data"
import { AdBanner } from "@/components/ads/banner"
import { Button } from "@/components/ui/button"
import { BlogPostSchema } from "@/components/seo/blog-schema"
import { RelatedTools } from "@/components/seo/related-tools"
import { ArrowLeft, Clock, Calendar, Tag } from "lucide-react"

type Props = {
    params: Promise<{ slug: string }>
}

// Only these high-quality posts should be indexed
// Others are noindexed to concentrate crawl budget and avoid thin content signals
const indexableBlogSlugs = new Set([
    'how-to-merge-pdf-files-free',
    'compress-pdf-reduce-file-size',
    'convert-jpg-to-pdf-online',
    'how-to-convert-pdf-to-word-without-software',
    'split-pdf-extract-pages-free',
    'convert-word-to-pdf-keep-formatting',
    'best-free-pdf-tools-2025',
    'how-to-electronically-sign-pdf-free',
    'how-to-make-scanned-pdf-searchable-ocr',
    'reduce-pdf-size-without-losing-quality',
    'best-free-pdf-compressor-online',
    'pdf-tools-for-small-business',
    'free-pdf-tools-vs-adobe-acrobat',
    'resume-guide-word-to-pdf',
    'pdf-tips-for-students',
])

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const post = blogPosts.find((p) => p.slug === slug)
    if (!post) return {}

    const url = `https://convertify.work/blog/${slug}`
    const shouldIndex = indexableBlogSlugs.has(slug)

    return {
        title: `${post.title} | Convertify Blog`,
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
    return blogPosts.map((post) => ({
        slug: post.slug,
    }))
}

// Markdown-like rendering
function renderContent(content: string) {
    return content.split('\n').map((line, i) => {
        const trimmed = line.trim()

        // Headers
        if (trimmed.startsWith('## ')) {
            return <h2 key={i} className="text-2xl font-bold mt-10 mb-4 text-slate-900">{trimmed.replace('## ', '')}</h2>
        }
        if (trimmed.startsWith('### ')) {
            return <h3 key={i} className="text-xl font-semibold mt-8 mb-3 text-slate-800">{trimmed.replace('### ', '')}</h3>
        }

        // Lists
        if (trimmed.startsWith('* ')) {
            return <li key={i} className="list-disc ml-6 mb-2 text-slate-700">{trimmed.replace('* ', '')}</li>
        }
        if (trimmed.match(/^\d+\./)) {
            return <li key={i} className="list-decimal ml-6 mb-2 text-slate-700">{trimmed.replace(/^\d+\.\s*/, '')}</li>
        }

        // Empty lines
        if (trimmed === '') return <div key={i} className="h-4" />

        // Checkmarks
        if (trimmed.startsWith('\u2705') || trimmed.startsWith('\u274C')) {
            return <p key={i} className="mb-2 text-slate-700">{trimmed}</p>
        }

        // Tables (simple detection)
        if (trimmed.startsWith('|')) {
            return <p key={i} className="font-mono text-sm bg-slate-50 px-2 py-1 mb-1">{trimmed}</p>
        }

        // Bold text handling
        if (trimmed.includes('**')) {
            const parts = trimmed.split(/\*\*(.*?)\*\*/g)
            return (
                <p key={i} className="mb-4 text-slate-700 leading-relaxed">
                    {parts.map((part, idx) =>
                        idx % 2 === 1 ? <strong key={idx} className="font-semibold text-slate-900">{part}</strong> : part
                    )}
                </p>
            )
        }

        // Links
        if (trimmed.includes('](')) {
            const parts = trimmed.split(/\[(.*?)\]\((.*?)\)/g)
            return (
                <p key={i} className="mb-4 text-slate-700 leading-relaxed">
                    {parts.map((part, idx) => {
                        if (idx % 3 === 1) {
                            const url = parts[idx + 1]
                            return <Link key={idx} href={url} className="text-indigo-600 hover:text-indigo-700 underline font-medium">{part}</Link>
                        }
                        if (idx % 3 === 2) return null
                        return part
                    })}
                </p>
            )
        }

        // Default paragraph
        return <p key={i} className="mb-4 text-slate-700 leading-relaxed">{trimmed}</p>
    })
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params
    const post = blogPosts.find((p) => p.slug === slug)

    if (!post) {
        notFound()
    }

    const url = `https://convertify.work/blog/${slug}`

    // Get 3 related posts (excluding current)
    const relatedPosts = blogPosts
        .filter(p => p.slug !== slug)
        .slice(0, 3)

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

                    <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 border-b pb-6">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={post.date}>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{post.readingTime} min read</span>
                        </div>
                    </div>
                </header>

                {/* Top Ad */}
                <div className="my-8 flex justify-center bg-slate-100 py-4 rounded-xl">
                    <AdBanner variant="rectangle" />
                </div>

                {/* Article Content */}
                <article className="prose prose-slate lg:prose-lg max-w-none">
                    {renderContent(post.content)}
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
