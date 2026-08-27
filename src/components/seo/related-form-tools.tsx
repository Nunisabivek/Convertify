import Link from "next/link"
import { Gauge, UserRound, Eraser, Minimize2 } from "lucide-react"

const CLUSTER = [
    {
        href: "/compress-pdf",
        title: "Compress PDF",
        blurb: "Hit 100KB, 200KB, 10MB, or stay under Gmail’s 25MB attachment cap.",
        icon: Minimize2,
        color: "bg-green-100 text-green-600",
    },
    {
        href: "/fit-to-size",
        title: "Fit to size",
        blurb: "Land a photo or PDF between a min and max KB — including 20–50 and 100–200.",
        icon: Gauge,
        color: "bg-blue-100 text-blue-600",
    },
    {
        href: "/passport-photo",
        title: "Passport photo",
        blurb: "US 2×2 (600×600), India 630×810, visa 35×45, bank photo, and signature.",
        icon: UserRound,
        color: "bg-indigo-100 text-indigo-600",
    },
    {
        href: "/remove-background",
        title: "White background",
        blurb: "Fill a plain wall with white or light blue for passport, KYC, or LinkedIn.",
        icon: Eraser,
        color: "bg-sky-100 text-sky-600",
    },
] as const

interface RelatedFormToolsProps {
    currentHref: string
}

export function RelatedFormTools({ currentHref }: RelatedFormToolsProps) {
    const tools = CLUSTER.filter((tool) => tool.href !== currentHref)

    return (
        <section className="w-full max-w-4xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">
                Same job, next step
            </h2>
            <p className="text-sm text-slate-500 text-center mb-8 max-w-2xl mx-auto">
                These four tools stay on your device. Use them together when a form
                cares about pixels, kilobytes, and a plain background.
            </p>
            <div className="grid sm:grid-cols-3 gap-4">
                {tools.map((tool) => (
                    <Link
                        key={tool.href}
                        href={tool.href}
                        className="group flex flex-col p-5 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all"
                    >
                        <div className={`w-10 h-10 rounded-lg ${tool.color} flex items-center justify-center mb-3`}>
                            <tool.icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-slate-800 group-hover:text-indigo-600">
                            {tool.title}
                        </span>
                        <span className="text-sm text-slate-600 mt-1 leading-relaxed">
                            {tool.blurb}
                        </span>
                    </Link>
                ))}
            </div>
            <p className="text-center mt-6">
                <Link href="/all-tools" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                    All tools →
                </Link>
            </p>
        </section>
    )
}
