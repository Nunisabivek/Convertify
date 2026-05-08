import { toolDeepGuides } from "@/lib/tool-deep-guides"

interface ToolDeepGuideProps {
    toolSlug: string
    toolName: string
}

// Renders the long-form per-tool guide. Designed to add 1000-1500 words of
// genuinely useful, tool-specific content to each page. This is the primary
// fix for the "Crawled - currently not indexed" issue — the original pages
// were too thin to deserve indexing on a young domain.
export function ToolDeepGuide({ toolSlug, toolName }: ToolDeepGuideProps) {
    const guide = toolDeepGuides[toolSlug]
    if (!guide) return null

    const { intro, steps, scenarios, troubleshooting, comparison, lastUpdated } = guide
    const updatedHuman = new Date(lastUpdated).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    // HowTo schema — describes the steps Google can show as a rich result.
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        name: `How to use Convertify ${toolName}`,
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

    // FAQPage schema for the troubleshooting Q&As — these target long-tail
    // queries that often go directly to feature snippets.
    const troubleshootingFaqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: troubleshooting.map((t) => ({
            "@type": "Question",
            name: t.question,
            acceptedAnswer: { "@type": "Answer", text: t.answer },
        })),
    }

    // SpeakableSpecification — helps voice assistants surface the intro
    // paragraphs when users ask "how do I X". AEO/voice search optimization.
    const speakableSchema = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: [".tool-guide-intro", ".tool-guide-steps"],
        },
    }

    return (
        <section className="w-full bg-slate-50 py-12 px-4 border-t border-slate-100">
            <div className="max-w-4xl mx-auto">
                <div className="flex items-baseline justify-between mb-2">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                        The complete guide to {toolName}
                    </h2>
                    <span className="text-xs text-slate-500">Last updated {updatedHuman}</span>
                </div>

                <div className="tool-guide-intro space-y-4 text-slate-700 leading-relaxed mt-6">
                    {intro.map((p, i) => (
                        <p key={i}>{p}</p>
                    ))}
                </div>

                {/* Comparison table — adds factual, structured content that
                    differentiates from generic "free PDF tool" pages. */}
                <h3 className="text-xl font-bold text-slate-900 mt-12 mb-4">
                    How {toolName} on Convertify compares
                </h3>
                <div className="overflow-x-auto bg-white rounded-xl border border-slate-200">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-slate-100 text-left">
                                <th className="px-4 py-3 font-semibold">Feature</th>
                                <th className="px-4 py-3 font-semibold text-indigo-700">Convertify</th>
                                <th className="px-4 py-3 font-semibold text-slate-500">Typical online tool</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparison.map((row, i) => (
                                <tr key={i} className="border-t border-slate-100">
                                    <td className="px-4 py-3 text-slate-700">{row.feature}</td>
                                    <td className="px-4 py-3 font-medium text-slate-900">{row.convertify}</td>
                                    <td className="px-4 py-3 text-slate-500">{row.typical}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Steps — rendered with section ids that the HowTo schema points to */}
                <h3 className="text-xl font-bold text-slate-900 mt-12 mb-4">
                    Step-by-step: how to use {toolName}
                </h3>
                <ol className="tool-guide-steps space-y-5">
                    {steps.map((s, i) => (
                        <li
                            key={i}
                            id={`step-${i + 1}`}
                            className="flex gap-4 bg-white rounded-xl border border-slate-200 p-5"
                        >
                            <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
                                {i + 1}
                            </span>
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-1">{s.title}</h4>
                                <p className="text-slate-600 leading-relaxed">{s.body}</p>
                            </div>
                        </li>
                    ))}
                </ol>

                {/* Real-world scenarios — adds keyword-rich context that
                    directly addresses long-tail searches. */}
                <h3 className="text-xl font-bold text-slate-900 mt-12 mb-4">
                    Real-world scenarios
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {scenarios.map((sc, i) => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
                            <h4 className="font-semibold text-slate-900 mb-2">{sc.title}</h4>
                            <p className="text-sm text-slate-600 leading-relaxed">{sc.body}</p>
                        </div>
                    ))}
                </div>

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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(troubleshootingFaqSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableSchema) }}
            />
        </section>
    )
}
