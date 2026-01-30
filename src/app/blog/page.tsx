import Link from "next/link"
import { Metadata } from "next"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { AdBanner } from "@/components/ads/banner"
import { blogPosts, blogContentCalendar } from "@/lib/blog-data"
import { ArrowRight, Calendar, Clock, Tag, BookOpen } from "lucide-react"

export const metadata: Metadata = {
    title: "PDF Tips, Tutorials & Guides | Convertify Blog",
    description: "Learn how to merge, compress, convert, and manage PDF files. Free tutorials, step-by-step guides, and tips for working with PDFs.",
    keywords: ["pdf tutorials", "pdf tips", "how to merge pdf", "compress pdf guide", "pdf converter help"],
    alternates: {
        canonical: "https://convertify.work/blog",
    },
    openGraph: {
        title: "PDF Tips, Tutorials & Guides | Convertify Blog",
        description: "Learn how to merge, compress, convert, and manage PDF files with our free tutorials and guides.",
        url: "/blog",
        type: "website",
    },
}

export default function BlogIndexPage() {
    // Sort posts by date (newest first)
    const sortedPosts = [...blogPosts].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    const featuredPost = sortedPosts[0]
    const remainingPosts = sortedPosts.slice(1)

    // Blog index schema
    const blogSchema = {
        "@context": "https://schema.org",
        "@type": "Blog",
        "name": "Convertify Blog",
        "description": "PDF tutorials, tips, and guides",
        "url": "https://convertify.work/blog",
        "publisher": {
            "@type": "Organization",
            "name": "Convertify",
            "logo": {
                "@type": "ImageObject",
                "url": "https://convertify.work/images/Convertify.png"
            }
        },
        "blogPost": sortedPosts.map(post => ({
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "datePublished": post.date,
            "url": `https://convertify.work/blog/${post.slug}`
        }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
            />

            {/* Hero Section */}
            <section className="w-full pt-12 pb-8 bg-gradient-to-b from-indigo-50 to-white text-center px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full text-indigo-700 text-sm font-medium mb-6">
                        <BookOpen className="w-4 h-4" />
                        {blogPosts.length} Articles & Growing
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
                        PDF Tips & Tutorials
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Master PDF tools with our free guides. Learn to merge, compress, convert, and manage your documents like a pro.
                    </p>
                </div>
            </section>

            <div className="container mx-auto py-12 px-4 max-w-6xl space-y-12">
                {/* Featured Post */}
                {featuredPost && (
                    <section>
                        <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wider mb-4">
                            Latest Article
                        </h2>
                        <Link href={`/blog/${featuredPost.slug}`} className="group block">
                            <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white overflow-hidden">
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
                                <div className="relative z-10">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                                        <Tag className="w-3 h-3" />
                                        {featuredPost.category}
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-bold mb-4 group-hover:underline">
                                        {featuredPost.title}
                                    </h3>
                                    <p className="text-indigo-100 mb-6 max-w-2xl">
                                        {featuredPost.excerpt}
                                    </p>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-indigo-200">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            {featuredPost.readingTime} min read
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </section>
                )}

                {/* Ad Section */}
                <div className="flex justify-center">
                    <AdBanner variant="rectangle" />
                </div>

                {/* All Posts Grid */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">All Articles</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {remainingPosts.map((post) => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group h-full">
                                <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1 border-slate-200 bg-white">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-indigo-100 text-indigo-700 capitalize">
                                                {post.category}
                                            </span>
                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {post.readingTime}m
                                            </span>
                                        </div>
                                        <CardTitle className="group-hover:text-indigo-600 transition-colors line-clamp-2 text-lg">
                                            {post.title}
                                        </CardTitle>
                                        <CardDescription className="line-clamp-3 pt-2">
                                            {post.excerpt}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between">
                                            <time className="text-xs text-slate-400 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </time>
                                            <span className="flex items-center text-sm font-bold text-indigo-600">
                                                Read <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Upcoming Topics Preview */}
                <section className="bg-slate-100 rounded-2xl p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Coming Soon</h2>
                        <p className="text-slate-600">We're working on these helpful guides</p>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {blogContentCalendar.slice(0, 6).map((item, index) => (
                            <div key={index} className="p-4 bg-white rounded-xl border border-slate-200">
                                <span className="text-xs font-medium text-slate-400">Coming Day {item.day}</span>
                                <p className="mt-1 font-medium text-slate-700 line-clamp-2">{item.topic}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Bottom CTA */}
                <section className="text-center py-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Ready to Try Our Tools?</h2>
                    <p className="text-slate-600 mb-6 max-w-xl mx-auto">
                        Put your new knowledge to use with our free online PDF tools. No sign-up required!
                    </p>
                    <Link
                        href="/all-tools"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors"
                    >
                        Browse All PDF Tools
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </section>
            </div>
        </div>
    )
}
