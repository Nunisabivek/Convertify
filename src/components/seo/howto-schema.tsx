"use client"

interface HowToStep {
    name: string
    text: string
}

interface HowToSchemaProps {
    toolName: string
    description: string
    steps: HowToStep[]
    totalTime?: string // e.g., "PT2M" for 2 minutes
}

export function HowToSchema({ toolName, description, steps, totalTime = "PT2M" }: HowToSchemaProps) {
    const howToSchema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to ${toolName}`,
        "description": description,
        "totalTime": totalTime,
        "tool": {
            "@type": "HowToTool",
            "name": "Convertify Online Tool"
        },
        "step": steps.map((step, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.name,
            "text": step.text
        }))
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
            />
            <section className="w-full max-w-4xl mx-auto px-4 py-12 bg-gradient-to-b from-slate-50 to-white">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                    How to {toolName} - Step by Step Guide
                </h2>
                <div className="grid gap-6 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <div
                            key={index}
                            className="relative bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all group"
                        >
                            <div className="absolute -top-4 left-6 w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">
                                {index + 1}
                            </div>
                            <h3 className="text-lg font-semibold text-slate-800 mt-4 mb-2">
                                {step.name}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                {step.text}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </>
    )
}
