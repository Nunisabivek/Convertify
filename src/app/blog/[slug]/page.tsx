import Link from "next/link"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { blogPosts } from "@/lib/blog-data"
import { AdBanner } from "@/components/ads/banner"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

type Props = {
    params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = blogPosts.find((p) => p.slug === params.slug)
    if (!post) return {}

    return {
        title: `${post.title} - Convertify Blog`,
        description: post.excerpt,
        keywords: post.keywords,
    }
}

export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.slug,
    }))
}

// In Next.js 15+, params is a Promise but in standard 13/14 it's an object. 
// Assuming 14 based on scaffold, but to be safe for newer versions I'll treat it as standard.
export default function BlogPostPage({ params }: Props) {
    const post = blogPosts.find((p) => p.slug === params.slug)

    if (!post) {
        notFound()
    }

    return (
        <div className="container mx-auto py-12 px-4 max-w-3xl">
            <div className="mb-8">
                <Link href="/blog">
                    <Button variant="ghost" className="pl-0 hover:pl-2 transition-all text-slate-500">
                        <ArrowLeft className="mr-2 w-4 h-4" /> Back to Blog
                    </Button>
                </Link>
            </div>

            <article className="prose prose-slate lg:prose-lg max-w-none">
                <h1>{post.title}</h1>
                <p className="lead text-xl text-slate-500">{post.excerpt}</p>

                <div className="my-8 not-prose flex justify-center bg-slate-50 py-4 border rounded-lg">
                    <AdBanner variant="rectangle" />
                </div>

                {/* Markdown rendering simulation (simple text rendering for now) */}
                <div className="whitespace-pre-line">
                    {post.content.split('\n').map((line, i) => {
                        // Determine layout based on simple detection (headings etc)
                        const trimmed = line.trim()
                        if (trimmed.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold mt-8 mb-4">{trimmed.replace('## ', '')}</h2>
                        if (trimmed.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-6 mb-3">{trimmed.replace('### ', '')}</h3>
                        if (trimmed.startsWith('* ')) return <li key={i} className="list-disc ml-6 mb-2">{trimmed.replace('* ', '')}</li>
                        if (trimmed.match(/^\d\./)) return <li key={i} className="list-decimal ml-6 mb-2">{trimmed.replace(/^\d\./, '')}</li>
                        if (trimmed === '') return <br key={i} />
                        // Link detection basic
                        if (trimmed.includes('](')) {
                            const parts = trimmed.split(/\[(.*?)\]\((.*?)\)/g)
                            return (
                                <p key={i} className="mb-4">
                                    {parts.map((part, idx) => {
                                        if (idx % 3 === 1) { // Text
                                            const url = parts[idx + 1]
                                            return <Link key={idx} href={url} className="text-indigo-600 hover:underline">{part}</Link>
                                        }
                                        if (idx % 3 === 2) return null // URL (handled above)
                                        return part
                                    })}
                                </p>
                            )
                        }
                        return <p key={i} className="mb-4 text-slate-700 leading-relaxed">{trimmed}</p>
                    })}
                </div>
            </article>

            <div className="mt-12 pt-8 border-t">
                <h3 className="text-xl font-bold mb-6">Popular Tools</h3>
                <div className="flex flex-wrap gap-4">
                    <Button variant="outline" asChild><Link href="/merge-pdf">Merge PDF</Link></Button>
                    <Button variant="outline" asChild><Link href="/compress-pdf">Compress PDF</Link></Button>
                    <Button variant="outline" asChild><Link href="/jpg-to-pdf">JPG to PDF</Link></Button>
                </div>
                <div className="mt-8">
                    <AdBanner variant="rectangle" />
                </div>
            </div>
        </div>
    )
}
