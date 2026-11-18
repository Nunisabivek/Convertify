import { toolDeepGuides } from "@/lib/tool-deep-guides"
import { toolLabel } from "@/lib/tool-label"

interface ToolDeepGuideProps {
    toolSlug: string
    toolName?: string
}

// Renders a tool's how-to steps and its troubleshooting / limits. The guide data also holds
// intro, scenarios and a comparison table; those are deliberately not shown (2026-11-18): the same
// marketing blocks on ~60 pages read as mass-produced text to Google's quality systems.
export function ToolDeepGuide({ toolSlug, toolName }: ToolDeepGuideProps) {
    const guide = toolDeepGuides[toolSlug]
    if (!guide) return null

    const resolvedToolName = toolName || toolLabel(toolSlug)
    const { steps, troubleshooting, lastUpdated } = guide
    const updatedHuman = new Date(lastUpdated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    // HowTo schema — describes the steps Google can show as a rich result.
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to use Convertify ${resolvedToolName}`,
        totalTime: "PT2M",
        supply: [{ "@type": "HowToSupply", name: "A modern web browser" }],
        tool: [{ "@type": "HowToTool", name: "Convertify (free, in-browser)" }],
        step: steps.map((s, i) => ({
            "@type": "HowToStep",
            position: i + 1,
            name: s.title,
            text: s.body,
            url: `https://convertify.work/${toolSlug}#step-${i + 1}`,
        })),
    }

    return (
        <section className="w-full bg-slate-50 py-12 px-4 border-t border-slate-100">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-baseline justify-between mb-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                        How to use {resolvedToolName}
                    </h2>
                    <span className="text-xs text-slate-500">Last updated {updatedHuman}</span>
                </div>

                {/* Steps — rendered with section ids that the HowTo schema points to */}
                <ol className="tool-guide-steps space-y-5 mt-6">
                    {steps.map((s, i) => (
                        <li
                            key={i}
                            id={`step-${i + 1}`}
                            className="flex gap-4 bg-white rounded-xl border border-slate-200 p-5"
                        >
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#026EFF] text-white flex items-center justify-center text-sm font-bold">
                                {i + 1}
                            </span>
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-1">{s.title}</h4>
                                <p className="text-slate-600 leading-relaxed">{s.body}</p>
                            </div>
                        </li>
                    ))}
                </ol>

                {/* Troubleshooting / extended FAQ */}
                <h3 className="text-xl font-bold text-slate-900 mt-12 mb-4">
                    Troubleshooting and edge cases
                </h3>
                <div className="space-y-4">
                    {troubleshooting.map((t, i) => (
                        <details
                            key={i}
                            className="bg-white rounded-xl border border-slate-200 px-5 py-4 group"
                        >
                            <summary className="font-semibold text-slate-900 cursor-pointer list-none flex items-center justify-between">
                                {t.question}
                                <span className="text-slate-400 group-open:rotate-180 transition-transform">⌄</span>
                            </summary>
                            <p className="text-slate-600 leading-relaxed mt-3">{t.answer}</p>
                        </details>
                    ))}
                </div>
            </div>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
        </section>
    )
}
