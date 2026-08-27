import Link from "next/link"
import { Gauge, Minimize2, UserRound, Eraser, ArrowRight } from "lucide-react"

const CLUSTER = [
    {
        href: "/compress-pdf",
        title: "Compress PDF",
        blurb: "Shrink a document to 50 KB, 100 KB or 200 KB for a form that only sets a maximum.",
        icon: Minimize2,
    },
    {
        href: "/fit-to-size",
        title: "Fit to size",
        blurb: "Land a photo or PDF between a min and max KB — 20–50, 50–200, 100–200.",
        icon: Gauge,
    },
    {
        href: "/passport-photo",
        title: "Passport photo",
        blurb: "630×810 (10–250 KB), UPSC 413×531, bank 200×230, signature 140×60.",
        icon: UserRound,
    },
    {
        href: "/remove-background",
        title: "Remove background",
        blurb: "Replace a plain wall with white or light blue before you crop the photo.",
        icon: Eraser,
    },
] as const

interface KycRelatedToolsProps {
    currentHref: string
    title?: string
}

export function KycRelatedTools({
    currentHref,
    title = "Other India form tools",
}: KycRelatedToolsProps) {
    const others = CLUSTER.filter((tool) => tool.href !== currentHref)

    return (
        <section className="w-full max-w-4xl mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">{title}</h2>
            <p className="text-sm text-slate-500 text-center mb-8 max-w-2xl mx-auto">
                These four tools cover the usual rejection reasons: file too large, file too small, wrong pixels, or the wrong background.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
                {others.map((tool) => (
                    <Link
                        key={tool.href}
                        href={tool.href}
                        className="group flex flex-col gap-2 p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                        <tool.icon className="w-6 h-6 text-indigo-600" />
                        <span className="font-semibold text-slate-900 group-hover:text-indigo-600">
                            {tool.title}
                        </span>
                        <span className="text-sm text-slate-600 leading-relaxed">{tool.blurb}</span>
                        <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-indigo-600">
                            Open tool <ArrowRight className="w-4 h-4" />
                        </span>
                    </Link>
                ))}
            </div>
            <p className="text-center mt-6">
                <Link href="/all-tools" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    Browse all tools →
                </Link>
            </p>
        </section>
    )
}
