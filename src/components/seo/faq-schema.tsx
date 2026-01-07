"use client"

interface FAQItem {
    question: string
    answer: string
}

interface FAQSchemaProps {
    faqs: FAQItem[]
    toolName: string
}

export function FAQSchema({ faqs, toolName }: FAQSchemaProps) {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <section className="w-full max-w-4xl mx-auto px-4 py-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
                    Frequently Asked Questions about {toolName}
                </h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <details
                            key={index}
                            className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                                <h3 className="text-lg font-semibold text-slate-800 pr-4">
                                    {faq.question}
                                </h3>
                                <span className="text-indigo-600 group-open:rotate-180 transition-transform">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </span>
                            </summary>
                            <div className="px-5 pb-5 text-slate-600 leading-relaxed">
                                {faq.answer}
                            </div>
                        </details>
                    ))}
                </div>
            </section>
        </>
    )
}
