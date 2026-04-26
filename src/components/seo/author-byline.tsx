import Link from "next/link"
import { ShieldCheck, FileText, Calendar } from "lucide-react"

interface AuthorBylineProps {
    /** ISO date the article was published. */
    published: string
    /** ISO date the article was last reviewed for accuracy. Defaults to published. */
    lastReviewed?: string
    /** Approximate read time in minutes. */
    readingTime?: number
}

// E-E-A-T signal block. Renders Person/Organization schema plus a visible
// byline with author, fact-check date, and credentials. Search engines
// (and LLM evaluators) reward clearly-attributed, dated content.
export function AuthorByline({
    published,
    lastReviewed,
    readingTime,
}: AuthorBylineProps) {
    const reviewDate = lastReviewed ?? published

    const personSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Convertify Team",
        "url": "https://convertify.work/about",
        "logo": "https://convertify.work/images/Convertify.png",
        "description":
            "The Convertify team builds privacy-first, browser-based file tools. Every guide is written and reviewed by our editors who use the tools daily on real documents — government forms, design exports, scans, and code.",
        "knowsAbout": [
            "PDF manipulation",
            "PDF compression",
            "Image conversion",
            "Document privacy",
            "Browser-based file processing",
        ],
        "sameAs": ["https://convertify.work"],
    }

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <div className="my-6 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-600">
                    <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>
                            By{" "}
                            <Link href="/about" className="font-semibold text-slate-900 hover:text-indigo-600">
                                Convertify Team
                            </Link>
                        </span>
                    </span>
                    <span className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        <span>
                            Published{" "}
                            <time dateTime={published}>{formatDate(published)}</time>
                        </span>
                    </span>
                    <span className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-indigo-600" />
                        <span>
                            Last reviewed{" "}
                            <time dateTime={reviewDate}>{formatDate(reviewDate)}</time>
                        </span>
                    </span>
                    {readingTime ? (
                        <span className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-slate-400" />
                            <span>{readingTime} min read</span>
                        </span>
                    ) : null}
                </div>
                <p className="mt-3 text-xs text-slate-500 leading-relaxed">
                    Written and fact-checked by the Convertify editorial team. We test every workflow on real documents
                    (government forms, design exports, scanned IDs, source code) before publishing — and re-test on each
                    review date to keep the steps current.
                </p>
            </div>
        </>
    )
}
