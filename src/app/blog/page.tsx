import Link from "next/link"
import { Metadata } from "next"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { AdBanner } from "@/components/ads/banner"
import { blogPosts } from "@/lib/blog-data"
import { ArrowRight, Calendar } from "lucide-react"

export const metadata: Metadata = {
    title: "Convertify Blog - PDF Tips & Tutorials",
    description: "Read our latest guides on how to manage, convert, and edit PDF documents optimally.",
}

export default function BlogIndexPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-5xl space-y-12">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight text-slate-900">PDF Tips & Guides</h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    Tutorials, comparisons, and tips to help you get the most out of your documents.
                </p>
            </div>

            <div className="flex justify-center">
                <AdBanner variant="rectangle" />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                    <Link key={post.slug} href={`/blog/${post.slug}`} className="group h-full">
                        <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 border-slate-200">
                            <CardHeader>
                                <div className="text-sm text-indigo-600 font-medium mb-2 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> {post.date}
                                </div>
                                <CardTitle className="group-hover:text-indigo-600 transition-colors line-clamp-2">
                                    {post.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-3 pt-2">
                                    {post.excerpt}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center text-sm font-bold text-indigo-600">
                                    Read Article <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
