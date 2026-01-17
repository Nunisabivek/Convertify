import Link from 'next/link'
import { BlogPost } from '@/lib/blog-data'

interface RelatedBlogPostsProps {
    toolSlug: string
    posts: BlogPost[]
    title?: string
}

export function RelatedBlogPosts({ toolSlug, posts, title = "📚 Learn More" }: RelatedBlogPostsProps) {
    if (posts.length === 0) return null

    return (
        <section className="w-full max-w-4xl mx-auto px-4 py-12">
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    {title}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                    {posts.slice(0, 4).map((post) => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="group p-4 rounded-lg border border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                        >
                            <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 mb-2 line-clamp-2">
                                {post.title}
                            </h3>
                            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
                                {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-xs text-slate-500">
                                <span>{post.readingTime} min read</span>
                                <span className="text-blue-600 group-hover:text-blue-700 font-medium">
                                    Read Guide →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {posts.length > 4 && (
                    <div className="mt-6 text-center">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            View All Guides
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    )
}
