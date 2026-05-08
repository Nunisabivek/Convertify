import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { useCases } from "@/lib/use-cases-data"

interface RelatedUseCasesProps {
    /** Tool href like "/merge-pdf" — finds matching use cases. */
    toolHref: string
    /** Optional override for the section heading. */
    title?: string
}

// Renders the use-case pages tied to a tool. Critical for SEO because
// it builds the topical cluster Google rewards: tool page → 5-8 specific
// use-case pages → back to tool page.
export function RelatedUseCases({ toolHref, title }: RelatedUseCasesProps) {
    const matches = useCases.filter((uc) => uc.toolHref === toolHref)

    if (matches.length === 0) return null

    return (
        <section className="w-full max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                {title ?? "Specific guides for common situations"}
            </h2>
            <p className="text-sm text-slate-500 text-center mb-8 max-w-2xl mx-auto">
                Step-by-step walkthroughs for the most common reasons people use this tool.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
                {matches.slice(0, 8).map((uc) => (
                    <Link
                        key={uc.slug}
                        href={`/use-cases/${uc.slug}`}
                        className="group flex items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors"
                    >
                        <span className="text-sm font-medium text-slate-700 group-hover:text-indigo-700 leading-snug">
                            {uc.title}
                        </span>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 flex-shrink-0" />
                    </Link>
                ))}
            </div>
        </section>
    )
}
